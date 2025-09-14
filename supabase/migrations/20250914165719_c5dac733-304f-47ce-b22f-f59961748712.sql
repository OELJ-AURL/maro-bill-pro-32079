-- Function to atomically create organization, user role and onboarding progress
CREATE OR REPLACE FUNCTION public.create_onboarding_records(
  p_role text,
  p_legal_name text DEFAULT 'Nouvelle Organisation'
)
RETURNS TABLE (
  organization_id uuid,
  onboarding_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_org_id uuid;
  v_onboarding_id uuid;
  v_total_steps integer;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Create organization
  INSERT INTO public.organizations (legal_name, organization_type, onboarding_status)
  VALUES (COALESCE(p_legal_name, 'Nouvelle Organisation'), p_role::organization_type, 'in_progress')
  RETURNING id INTO v_org_id;

  -- Link user as primary role
  INSERT INTO public.user_roles (user_id, organization_id, role, is_primary)
  VALUES (v_user_id, v_org_id, p_role::user_role, true);

  v_total_steps := CASE WHEN p_role = 'wholesaler' THEN 7 ELSE 4 END;

  -- Create onboarding progress
  INSERT INTO public.onboarding_progress (user_id, organization_id, user_role, total_steps, current_step, status)
  VALUES (v_user_id, v_org_id, p_role::user_role, v_total_steps, 1, 'in_progress')
  RETURNING id INTO v_onboarding_id;

  organization_id := v_org_id;
  onboarding_id := v_onboarding_id;
  RETURN NEXT;
END;
$$;

-- Ensure authenticated users can execute the function
GRANT EXECUTE ON FUNCTION public.create_onboarding_records(text, text) TO authenticated;

-- Storage policies for onboarding documents
DO $$
BEGIN
  -- INSERT policy (upload)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated can upload onboarding documents'
  ) THEN
    CREATE POLICY "Authenticated can upload onboarding documents"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'onboarding-documents');
  END IF;

  -- SELECT policy (read metadata)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated can read onboarding documents metadata'
  ) THEN
    CREATE POLICY "Authenticated can read onboarding documents metadata"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'onboarding-documents');
  END IF;
END $$;
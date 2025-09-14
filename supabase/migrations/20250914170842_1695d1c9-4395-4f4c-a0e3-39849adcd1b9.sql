-- Fix create_onboarding_records to avoid enum casts and ensure it works regardless of enum availability
CREATE OR REPLACE FUNCTION public.create_onboarding_records(p_role text, p_legal_name text DEFAULT 'Nouvelle Organisation'::text)
RETURNS TABLE(organization_id uuid, onboarding_id uuid)
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
  VALUES (COALESCE(p_legal_name, 'Nouvelle Organisation'), p_role, 'in_progress')
  RETURNING id INTO v_org_id;

  -- Link user as primary role
  INSERT INTO public.user_roles (user_id, organization_id, role, is_primary)
  VALUES (v_user_id, v_org_id, p_role, true);

  v_total_steps := CASE WHEN p_role = 'wholesaler' THEN 7 ELSE 4 END;

  -- Create onboarding progress
  INSERT INTO public.onboarding_progress (user_id, organization_id, user_role, total_steps, current_step, status)
  VALUES (v_user_id, v_org_id, p_role, v_total_steps, 1, 'in_progress')
  RETURNING id INTO v_onboarding_id;

  organization_id := v_org_id;
  onboarding_id := v_onboarding_id;
  RETURN NEXT;
END;
$$;

-- Allow authenticated users to execute the function
GRANT EXECUTE ON FUNCTION public.create_onboarding_records(text, text) TO authenticated;

-- Storage access policies for onboarding-documents bucket
DROP POLICY IF EXISTS "Users can upload onboarding docs" ON storage.objects;
CREATE POLICY "Users can upload onboarding docs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'onboarding-documents'
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.organization_id::text = (storage.foldername(name))[1]
  )
);

DROP POLICY IF EXISTS "Users can read their onboarding docs" ON storage.objects;
CREATE POLICY "Users can read their onboarding docs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'onboarding-documents'
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.organization_id::text = (storage.foldername(name))[1]
  )
);

DROP POLICY IF EXISTS "Users can update their onboarding docs" ON storage.objects;
CREATE POLICY "Users can update their onboarding docs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'onboarding-documents'
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.organization_id::text = (storage.foldername(name))[1]
  )
);

DROP POLICY IF EXISTS "Users can delete their onboarding docs" ON storage.objects;
CREATE POLICY "Users can delete their onboarding docs"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'onboarding-documents'
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.organization_id::text = (storage.foldername(name))[1]
  )
);
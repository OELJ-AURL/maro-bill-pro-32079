-- Fix the create_onboarding_records function to use text instead of enums
CREATE OR REPLACE FUNCTION public.create_onboarding_records(p_role text, p_legal_name text DEFAULT 'Nouvelle Organisation'::text)
 RETURNS TABLE(organization_id uuid, onboarding_id uuid)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_org_id uuid;
  v_onboarding_id uuid;
  v_total_steps integer;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Create organization without enum casts
  INSERT INTO public.organizations (legal_name, organization_type, onboarding_status)
  VALUES (COALESCE(p_legal_name, 'Nouvelle Organisation'), p_role, 'in_progress')
  RETURNING id INTO v_org_id;

  -- Link user as primary role without enum cast
  INSERT INTO public.user_roles (user_id, organization_id, role, is_primary)
  VALUES (v_user_id, v_org_id, p_role, true);

  v_total_steps := CASE WHEN p_role = 'wholesaler' THEN 7 ELSE 4 END;

  -- Create onboarding progress without enum cast
  INSERT INTO public.onboarding_progress (user_id, organization_id, user_role, total_steps, current_step, status)
  VALUES (v_user_id, v_org_id, p_role, v_total_steps, 1, 'in_progress')
  RETURNING id INTO v_onboarding_id;

  organization_id := v_org_id;
  onboarding_id := v_onboarding_id;
  RETURN NEXT;
END;
$function$;

-- Add comprehensive storage policies for onboarding-documents bucket
DO $$
BEGIN
  -- Create policies for the onboarding-documents bucket
  
  -- Allow authenticated users to view files from their own organization folder
  INSERT INTO storage.objects (bucket_id, name, owner, metadata) VALUES ('onboarding-documents', '.keep', null, '{}') ON CONFLICT DO NOTHING;
  
  -- Policy for SELECT (viewing/downloading files)
  CREATE POLICY "Users can view their own organization documents" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'onboarding-documents' 
    AND auth.uid() IS NOT NULL
    AND (
      -- Users can view files they uploaded
      owner::text = auth.uid()::text
      OR
      -- Users can view files from their organization
      (storage.foldername(name))[1] IN (
        SELECT org.id::text 
        FROM organizations org
        JOIN user_roles ur ON ur.organization_id = org.id
        WHERE ur.user_id = auth.uid()
      )
    )
  );
  
  -- Policy for INSERT (uploading files)
  CREATE POLICY "Users can upload to their organization folder" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'onboarding-documents' 
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] IN (
      SELECT org.id::text 
      FROM organizations org
      JOIN user_roles ur ON ur.organization_id = org.id
      WHERE ur.user_id = auth.uid()
    )
  );
  
  -- Policy for UPDATE (updating file metadata)
  CREATE POLICY "Users can update their own organization documents" 
  ON storage.objects 
  FOR UPDATE 
  USING (
    bucket_id = 'onboarding-documents' 
    AND auth.uid() IS NOT NULL
    AND (
      owner::text = auth.uid()::text
      OR
      (storage.foldername(name))[1] IN (
        SELECT org.id::text 
        FROM organizations org
        JOIN user_roles ur ON ur.organization_id = org.id
        WHERE ur.user_id = auth.uid()
      )
    )
  );
  
  -- Policy for DELETE (deleting files)
  CREATE POLICY "Users can delete their own organization documents" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'onboarding-documents' 
    AND auth.uid() IS NOT NULL
    AND (
      owner::text = auth.uid()::text
      OR
      (storage.foldername(name))[1] IN (
        SELECT org.id::text 
        FROM organizations org
        JOIN user_roles ur ON ur.organization_id = org.id
        WHERE ur.user_id = auth.uid()
      )
    )
  );

EXCEPTION
  WHEN duplicate_object THEN
    -- Ignore if policies already exist
    NULL;
END
$$;
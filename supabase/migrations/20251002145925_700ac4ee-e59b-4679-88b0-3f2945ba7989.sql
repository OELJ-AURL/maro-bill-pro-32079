-- Create app_role enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create admin_roles table for role-based access control
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_roles
    WHERE user_id = check_user_id
      AND role = 'admin'
  )
$$;

-- RLS policies for admin_roles
CREATE POLICY "Users can view their own roles"
  ON public.admin_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
  ON public.admin_roles
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- Add verification fields to organizations if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'organizations' 
    AND column_name = 'verified_by') THEN
    ALTER TABLE public.organizations 
      ADD COLUMN verified_by UUID REFERENCES auth.users(id),
      ADD COLUMN verification_notes TEXT,
      ADD COLUMN rejected_reason TEXT;
  END IF;
END $$;

-- Create RLS policy for admins to view all organizations
CREATE POLICY "Admins can view all organizations"
  ON public.organizations
  FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Create RLS policy for admins to update organizations
CREATE POLICY "Admins can update all organizations"
  ON public.organizations
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.admin_roles TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
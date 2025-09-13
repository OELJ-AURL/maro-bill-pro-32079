-- Create user roles enum
CREATE TYPE public.user_role_enum AS ENUM ('wholesaler', 'buyer', 'admin');

-- Create verification status enum
CREATE TYPE public.verification_status AS ENUM ('pending', 'in_progress', 'verified', 'rejected');

-- Create onboarding status enum  
CREATE TYPE public.onboarding_status AS ENUM ('pending', 'in_progress', 'completed', 'suspended');

-- Create organizations table
CREATE TABLE public.organizations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    -- Basic info
    legal_name TEXT NOT NULL,
    trade_name TEXT,
    organization_type public.user_role_enum NOT NULL,
    
    -- Legal identifiers  
    ice TEXT,
    rc_number TEXT,
    if_number TEXT,
    cnss_number TEXT,
    activity_code TEXT,
    
    -- Address and contact
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'Morocco',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone TEXT,
    email TEXT,
    website TEXT,
    
    -- Banking (for wholesalers)
    bank_name TEXT,
    rib TEXT,
    iban TEXT,
    
    -- Status and verification
    verification_status public.verification_status DEFAULT 'pending',
    verification_tier TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    onboarding_status public.onboarding_status DEFAULT 'pending',
    
    -- Compliance flags
    is_ice_verified BOOLEAN DEFAULT false,
    is_rc_verified BOOLEAN DEFAULT false,
    is_cnss_verified BOOLEAN DEFAULT false,
    is_aml_cleared BOOLEAN DEFAULT false,
    is_banking_verified BOOLEAN DEFAULT false,
    
    -- Metadata
    verification_data JSONB,
    compliance_notes TEXT
);

-- Enable RLS on organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Create user_roles table (many-to-many between users and organizations)
CREATE TABLE public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    role public.user_role_enum NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    permissions JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    UNIQUE(user_id, organization_id, role)
);

-- Enable RLS on user_roles  
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create beneficial_owners table (for AML compliance)
CREATE TABLE public.beneficial_owners (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    
    -- Identity information
    full_name TEXT NOT NULL,
    cin_number TEXT,
    passport_number TEXT,
    nationality TEXT,
    date_of_birth DATE,
    
    -- Address
    address TEXT,
    city TEXT,
    country TEXT,
    
    -- Ownership details
    ownership_percentage DECIMAL(5, 2),
    is_pep BOOLEAN DEFAULT false,
    position_title TEXT,
    
    -- AML screening
    aml_status public.verification_status DEFAULT 'pending',
    aml_screened_at TIMESTAMP WITH TIME ZONE,
    aml_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on beneficial_owners
ALTER TABLE public.beneficial_owners ENABLE ROW LEVEL SECURITY;

-- Create document_uploads table  
CREATE TABLE public.document_uploads (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    
    -- Document info
    document_type TEXT NOT NULL, -- 'rc_extract', 'cnss_attestation', 'identity_document', etc.
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    mime_type TEXT,
    
    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE,
    verification_notes TEXT,
    
    -- Metadata
    uploaded_by_user_id UUID NOT NULL,
    metadata JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on document_uploads
ALTER TABLE public.document_uploads ENABLE ROW LEVEL SECURITY;

-- Create consents table (for privacy and e-signature tracking)
CREATE TABLE public.consents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    
    -- Consent details
    consent_type TEXT NOT NULL, -- 'privacy_policy', 'e_signature_terms', 'kyb_attestation', etc.
    consent_text TEXT NOT NULL,
    version TEXT NOT NULL,
    
    -- Legal framework references
    legal_basis TEXT, -- 'Law 09-08', 'Law 53-05', etc.
    
    -- Signature data
    is_signed BOOLEAN DEFAULT false,
    signed_at TIMESTAMP WITH TIME ZONE,
    signature_hash TEXT,
    ip_address INET,
    user_agent TEXT,
    
    -- Audit trail
    audit_data JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on consents
ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;

-- Create onboarding_progress table
CREATE TABLE public.onboarding_progress (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    
    -- Progress tracking
    current_step INTEGER DEFAULT 1,
    total_steps INTEGER NOT NULL,
    completed_steps JSONB DEFAULT '[]',
    step_data JSONB DEFAULT '{}',
    
    -- Status
    status public.onboarding_status DEFAULT 'pending',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    user_role public.user_role_enum NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    UNIQUE(user_id, organization_id)
);

-- Enable RLS on onboarding_progress
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Update profiles table to link to organizations
ALTER TABLE public.profiles 
ADD COLUMN primary_organization_id UUID REFERENCES public.organizations(id);

-- Create RLS policies for organizations
CREATE POLICY "Users can view organizations they belong to" 
ON public.organizations 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_roles.organization_id = organizations.id 
        AND user_roles.user_id = auth.uid()
    )
);

CREATE POLICY "Users can update organizations they belong to" 
ON public.organizations 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_roles.organization_id = organizations.id 
        AND user_roles.user_id = auth.uid()
    )
);

CREATE POLICY "Users can create organizations during onboarding" 
ON public.organizations 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own roles during onboarding" 
ON public.user_roles 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for beneficial_owners
CREATE POLICY "Users can manage beneficial owners of their organization" 
ON public.beneficial_owners 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_roles.organization_id = beneficial_owners.organization_id 
        AND user_roles.user_id = auth.uid()
    )
);

-- Create RLS policies for document_uploads
CREATE POLICY "Users can manage documents of their organization" 
ON public.document_uploads 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_roles.organization_id = document_uploads.organization_id 
        AND user_roles.user_id = auth.uid()
    ) OR uploaded_by_user_id = auth.uid()
);

-- Create RLS policies for consents
CREATE POLICY "Users can view their own consents" 
ON public.consents 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consents" 
ON public.consents 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consents" 
ON public.consents 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for onboarding_progress
CREATE POLICY "Users can manage their own onboarding progress" 
ON public.onboarding_progress 
FOR ALL 
USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_beneficial_owners_updated_at
    BEFORE UPDATE ON public.beneficial_owners  
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_onboarding_progress_updated_at
    BEFORE UPDATE ON public.onboarding_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('onboarding-documents', 'onboarding-documents', false);

-- Create storage policies for onboarding documents
CREATE POLICY "Users can upload onboarding documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
    bucket_id = 'onboarding-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their onboarding documents" 
ON storage.objects 
FOR SELECT 
USING (
    bucket_id = 'onboarding-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their onboarding documents" 
ON storage.objects 
FOR UPDATE 
USING (
    bucket_id = 'onboarding-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);
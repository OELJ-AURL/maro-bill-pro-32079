-- Business Manager Database Schema for Morocco - Version corrigée
-- Conformité ICE/TVA, signatures électroniques, CNDP

-- Create enums first
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'user', 'accountant');
CREATE TYPE public.document_type AS ENUM ('devis', 'facture', 'avoir', 'bon_commande', 'facture_fournisseur');
CREATE TYPE public.payment_status AS ENUM ('pending', 'partial', 'paid', 'overdue', 'cancelled');
CREATE TYPE public.signature_status AS ENUM ('pending', 'signed', 'rejected', 'expired');
CREATE TYPE public.audit_action AS ENUM ('create', 'update', 'delete', 'view', 'export', 'sign');

-- User profiles with roles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  company_name TEXT,
  ice TEXT, -- ICE du vendeur (obligatoire)
  if_number TEXT, -- Identifiant fiscal
  rc TEXT, -- Registre de commerce
  cnss TEXT, -- CNSS
  address TEXT,
  city TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Clients et Fournisseurs avec conformité ICE
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('client', 'fournisseur')),
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  ice TEXT, -- ICE obligatoire pour B2B
  if_number TEXT,
  rc TEXT,
  cnss TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT,
  is_ice_verified BOOLEAN DEFAULT FALSE,
  is_professional BOOLEAN DEFAULT TRUE, -- B2B vs B2C
  payment_terms INTEGER DEFAULT 30, -- Délais de paiement (loi 69-21)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Taux TVA marocains avec dates d'effet
CREATE TABLE public.tax_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rate DECIMAL(5,4) NOT NULL, -- Ex: 0.2000 pour 20%
  effective_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, name, effective_date)
);

-- Catalogue produits/services
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  name_ar TEXT,
  description_fr TEXT,
  description_ar TEXT,
  unit_price DECIMAL(12,2) NOT NULL,
  tax_rate_id UUID REFERENCES public.tax_rates(id),
  category TEXT,
  is_service BOOLEAN DEFAULT FALSE,
  stock_quantity INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, code)
);

-- Numérotation automatique par série/année
CREATE TABLE public.document_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  year INTEGER NOT NULL,
  prefix TEXT NOT NULL,
  next_number INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, document_type, year)
);

-- Documents de vente (devis, factures, avoirs)
CREATE TABLE public.sales_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  document_number TEXT NOT NULL,
  contact_id UUID NOT NULL REFERENCES public.contacts(id),
  issue_date DATE NOT NULL,
  due_date DATE,
  
  -- Montants avec conformité TVA marocaine
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  
  -- Signature électronique (loi 53-05)
  signature_status signature_status DEFAULT 'pending',
  signature_certificate TEXT, -- Certificat qualifié
  signature_timestamp TIMESTAMPTZ,
  signature_hash TEXT, -- Hash du document signé
  
  -- Statut et paiements
  payment_status payment_status DEFAULT 'pending',
  paid_amount DECIMAL(12,2) DEFAULT 0,
  
  -- Références pour conversion devis->facture
  reference_document_id UUID REFERENCES public.sales_documents(id),
  
  -- Notes
  notes TEXT,
  terms_conditions_fr TEXT,
  terms_conditions_ar TEXT,
  
  -- Métadonnées
  is_locked BOOLEAN DEFAULT FALSE, -- Verrouillage après signature/émission
  pdf_path TEXT, -- Chemin vers PDF généré
  structured_data JSONB, -- Payload structuré (UBL-like) pour DGI
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, document_number)
);

-- Lignes de documents avec calculs TVA précis
CREATE TABLE public.document_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.sales_documents(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  
  -- Description bilingue
  description_fr TEXT NOT NULL,
  description_ar TEXT,
  
  -- Quantité et prix
  quantity DECIMAL(12,3) NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  
  -- Calculs TVA (arrondis au centime)
  line_total DECIMAL(12,2) NOT NULL,
  tax_rate DECIMAL(5,4) NOT NULL,
  tax_amount DECIMAL(12,2) NOT NULL,
  line_total_with_tax DECIMAL(12,2) NOT NULL,
  
  line_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Paiements et trésorerie
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.sales_documents(id),
  contact_id UUID NOT NULL REFERENCES public.contacts(id),
  
  amount DECIMAL(12,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT NOT NULL,
  reference TEXT,
  
  notes TEXT,
  receipt_path TEXT, -- Chemin vers reçu généré
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Achats (factures fournisseurs, bons de commande)
CREATE TABLE public.purchase_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('bon_commande', 'facture_fournisseur')),
  document_number TEXT NOT NULL,
  supplier_id UUID NOT NULL REFERENCES public.contacts(id),
  
  issue_date DATE NOT NULL,
  due_date DATE,
  
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  
  payment_status payment_status DEFAULT 'pending',
  paid_amount DECIMAL(12,2) DEFAULT 0,
  
  notes TEXT,
  pdf_path TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, document_number)
);

-- Mouvements de stock
CREATE TABLE public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  document_id UUID, -- Peut être sales ou purchase document
  
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment')),
  quantity DECIMAL(12,3) NOT NULL,
  unit_cost DECIMAL(12,2),
  
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projets
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  contact_id UUID REFERENCES public.contacts(id),
  
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12,2),
  
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tickets de support
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Journal d'audit immuable (CNDP)
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action audit_action NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  
  old_values JSONB,
  new_values JSONB,
  
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Consentements CNDP
CREATE TABLE public.data_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL,
  granted BOOLEAN NOT NULL,
  granted_at TIMESTAMPTZ,
  withdrawn_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_consents ENABLE ROW LEVEL SECURITY;

-- RLS Policies - utilisateurs voient uniquement leurs données
CREATE POLICY "Users can manage their own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage their own contacts" ON public.contacts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own tax rates" ON public.tax_rates
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own products" ON public.products
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sequences" ON public.document_sequences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sales documents" ON public.sales_documents
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view document lines of their documents" ON public.document_lines
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.sales_documents 
    WHERE id = document_lines.document_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their own payments" ON public.payments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own purchase documents" ON public.purchase_documents
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own stock movements" ON public.stock_movements
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own projects" ON public.projects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own tickets" ON public.support_tickets
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own audit logs" ON public.audit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own consents" ON public.data_consents
  FOR ALL USING (auth.uid() = user_id);

-- Triggers pour timestamps automatiques
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_sales_documents_updated_at
  BEFORE UPDATE ON public.sales_documents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_purchase_documents_updated_at
  BEFORE UPDATE ON public.purchase_documents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger pour créer automatiquement un profil utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
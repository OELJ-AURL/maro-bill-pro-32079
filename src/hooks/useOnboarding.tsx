import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'wholesaler' | 'buyer';
export type OnboardingStatus = 'pending' | 'in_progress' | 'completed' | 'suspended';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface OnboardingContextType {
  // State
  currentStep: number;
  totalSteps: number;
  userRole: UserRole | null;
  organizationId: string | null;
  onboardingId: string | null;
  steps: OnboardingStep[];
  stepData: Record<string, any>;
  isLoading: boolean;
  
  // Actions  
  setUserRole: (role: UserRole) => void;
  handleSetUserRole: (role: UserRole) => Promise<void>;
  updateStepData: (stepId: number, data: any) => void;
  completeStep: (stepId: number) => Promise<void>;
  goToStep: (stepId: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  completeOnboarding: () => Promise<void>;
  
  // Validation
  validateICE: (ice: string) => boolean;
  validateRC: (rc: string) => boolean;
  validateIF: (ifNumber: string) => boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const WHOLESALER_STEPS: Omit<OnboardingStep, 'isCompleted' | 'isActive'>[] = [
  { id: 1, title: "Rôle et Compte", description: "Sélection du rôle et conditions générales" },
  { id: 2, title: "Identifiants Légaux", description: "ICE, RC, IF et documents" },
  { id: 3, title: "Profil Commercial", description: "Informations commerciales et contacts" },
  { id: 4, title: "Propriétaires Bénéficiaires", description: "Déclaration AML et screening" },
  { id: 5, title: "Informations Bancaires", description: "RIB et vérification des paiements" },
  { id: 6, title: "Déclarations", description: "E-signature et attestations KYB" },
  { id: 7, title: "Vérification", description: "Contrôles automatiques et validation" }
];

const BUYER_STEPS: Omit<OnboardingStep, 'isCompleted' | 'isActive'>[] = [
  { id: 1, title: "Rôle et Compte", description: "Sélection du rôle et conditions générales" },
  { id: 2, title: "Détails Entreprise", description: "Nom légal, ICE/RC si applicable" },
  { id: 3, title: "Paramètres d'Achat", description: "Préférences de paiement et approbations" },
  { id: 4, title: "Consentement", description: "Acceptation des conditions et e-signature" }
];

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [onboardingId, setOnboardingId] = useState<string | null>(null);
  const [stepData, setStepData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  const steps = userRole === 'wholesaler' ? WHOLESALER_STEPS : BUYER_STEPS;
  const totalSteps = steps.length;

  const stepsWithStatus: OnboardingStep[] = steps.map(step => ({
    ...step,
    isCompleted: currentStep > step.id,
    isActive: currentStep === step.id
  }));

  // Load existing onboarding progress
  useEffect(() => {
    if (!user) return;
    
    const loadOnboardingProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('onboarding_progress')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setOnboardingId(data.id);
          setOrganizationId(data.organization_id);
          setCurrentStep(data.current_step);
          setUserRole(data.user_role as UserRole);
          setStepData((data.step_data as Record<string, any>) || {});
        }
      } catch (error: any) {
        console.error('Error loading onboarding progress:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données d'onboarding",
          variant: "destructive",
        });
      }
    };

    loadOnboardingProgress();
  }, [user, toast]);

  const updateStepData = (stepId: number, data: any) => {
    setStepData(prev => ({
      ...prev,
      [stepId]: { ...prev[stepId], ...data }
    }));
  };

  const saveProgress = async () => {
    if (!user || !onboardingId) return;

    try {
      const { error } = await supabase
        .from('onboarding_progress')
        .update({
          current_step: currentStep,
          step_data: stepData,
          status: 'in_progress'
        })
        .eq('id', onboardingId);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error saving progress:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les données",
        variant: "destructive",
      });
    }
  };

  const createOnboardingRecord = async (role: UserRole) => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Use the atomic function to create all records
      const { data, error } = await supabase.rpc('create_onboarding_records', {
        p_role: role,
        p_legal_name: 'Nouvelle Organisation'
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const { organization_id, onboarding_id } = data[0];
        setOrganizationId(organization_id);
        setOnboardingId(onboarding_id);
        setUserRole(role);
        
        toast({
          title: "Onboarding démarré",
          description: `Configuration ${role === 'wholesaler' ? 'grossiste' : 'acheteur'} initialisée`,
        });
      }
    } catch (error: any) {
      console.error('Error creating onboarding record:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser l'onboarding",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetUserRole = async (role: UserRole) => {
    setUserRole(role);
    await createOnboardingRecord(role);
  };

  const completeStep = async (stepId: number) => {
    await saveProgress();
    if (stepId < totalSteps) {
      setCurrentStep(stepId + 1);
    }
  };

  const completeOnboarding = async () => {
    if (!onboardingId || !organizationId) return;

    try {
      setIsLoading(true);

      // Update onboarding status
      const { error: progressError } = await supabase
        .from('onboarding_progress')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', onboardingId);

      if (progressError) throw progressError;

      // Update organization status
      const { error: orgError } = await supabase
        .from('organizations')
        .update({
          onboarding_status: 'completed'
        })
        .eq('id', organizationId);

      if (orgError) throw orgError;

      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          primary_organization_id: organizationId
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      toast({
        title: "Onboarding terminé",
        description: "Votre compte est maintenant configuré",
      });

      // Redirect to dashboard
      window.location.href = '/';
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Erreur",
        description: "Impossible de finaliser l'onboarding",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goToStep = (stepId: number) => {
    if (stepId >= 1 && stepId <= totalSteps) {
      setCurrentStep(stepId);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validation functions
  const validateICE = (ice: string): boolean => {
    // ICE format: 15 digits
    const iceRegex = /^\d{15}$/;
    return iceRegex.test(ice);
  };

  const validateRC = (rc: string): boolean => {
    // RC format: Numbers with possible letters
    const rcRegex = /^[A-Z0-9]+$/i;
    return rcRegex.test(rc) && rc.length >= 6;
  };

  const validateIF = (ifNumber: string): boolean => {
    // IF format: 8 digits
    const ifRegex = /^\d{8}$/;
    return ifRegex.test(ifNumber);
  };

  const value: OnboardingContextType = {
    currentStep,
    totalSteps,
    userRole,
    organizationId,
    onboardingId,
    steps: stepsWithStatus,
    stepData,
    isLoading,
    setUserRole,
    handleSetUserRole,
    updateStepData,
    completeStep,
    goToStep,
    nextStep,
    previousStep,
    completeOnboarding,
    validateICE,
    validateRC,
    validateIF
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { OnboardingProvider, useOnboarding } from '@/hooks/useOnboarding';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import RoleSelection from '@/components/onboarding/RoleSelection';
import LegalIdentifiers from '@/components/onboarding/wholesaler/LegalIdentifiers';
import BusinessProfile from '@/components/onboarding/wholesaler/BusinessProfile';
import BeneficialOwners from '@/components/onboarding/wholesaler/BeneficialOwners';
import BankingInformation from '@/components/onboarding/wholesaler/BankingInformation';
import Declarations from '@/components/onboarding/wholesaler/Declarations';
import Verification from '@/components/onboarding/wholesaler/Verification';
import CompanyDetails from '@/components/onboarding/buyer/CompanyDetails';
import PurchasingSettings from '@/components/onboarding/buyer/PurchasingSettings';
import BuyerConsent from '@/components/onboarding/buyer/BuyerConsent';

function OnboardingContent() {
  const { user } = useAuth();
  const { currentStep, userRole } = useOnboarding();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const renderStep = () => {
    // Step 1 is always role selection
    if (currentStep === 1 || !userRole) {
      return <RoleSelection />;
    }

    // Wholesaler steps (7 total)
    if (userRole === 'wholesaler') {
      switch (currentStep) {
        case 2:
          return <LegalIdentifiers />;
        case 3:
          return <BusinessProfile />;
        case 4:
          return <BeneficialOwners />;
        case 5:
          return <BankingInformation />;
        case 6:
          return <Declarations />;
        case 7:
          return <Verification />;
        default:
          return <Navigate to="/" replace />;
      }
    }

    // Buyer steps (4 total)
    if (userRole === 'buyer') {
      switch (currentStep) {
        case 2:
          return <CompanyDetails />;
        case 3:
          return <PurchasingSettings />;
        case 4:
          return <BuyerConsent />;
        default:
          return <Navigate to="/" replace />;
      }
    }

    return <Navigate to="/" replace />;
  };

  return (
    <OnboardingLayout>
      {renderStep()}
    </OnboardingLayout>
  );
}

export default function Onboarding() {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  );
}
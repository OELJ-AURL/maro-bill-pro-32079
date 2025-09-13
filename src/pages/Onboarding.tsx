import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { OnboardingProvider, useOnboarding } from '@/hooks/useOnboarding';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import RoleSelection from '@/components/onboarding/RoleSelection';
import LegalIdentifiers from '@/components/onboarding/wholesaler/LegalIdentifiers';
import BusinessProfile from '@/components/onboarding/wholesaler/BusinessProfile';

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
          return <div>Beneficial Owners - TODO</div>;
        case 5:
          return <div>Banking Info - TODO</div>;
        case 6:
          return <div>Declarations & E-signature - TODO</div>;
        case 7:
          return <div>Verification & Decision - TODO</div>;
        default:
          return <Navigate to="/" replace />;
      }
    }

    // Buyer steps (4 total)
    if (userRole === 'buyer') {
      switch (currentStep) {
        case 2:
          return <div>Company Details - TODO</div>;
        case 3:
          return <div>Purchasing Settings - TODO</div>;
        case 4:
          return <div>Consent & E-signature - TODO</div>;
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
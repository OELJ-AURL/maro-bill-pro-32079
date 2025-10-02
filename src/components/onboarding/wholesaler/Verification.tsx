import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useOnboarding } from '@/hooks/useOnboarding';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Building, 
  Users, 
  CreditCard, 
  FileText,
  Shield,
  Loader2
} from 'lucide-react';

interface VerificationStatus {
  ice_verified: boolean;
  rc_verified: boolean;
  cnss_verified: boolean;
  aml_cleared: boolean;
  banking_verified: boolean;
  beneficial_owners_count: number;
  consents_signed: number;
}

export default function Verification() {
  const { organizationId, completeOnboarding } = useOnboarding();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<VerificationStatus>({
    ice_verified: false,
    rc_verified: false,
    cnss_verified: false,
    aml_cleared: false,
    banking_verified: false,
    beneficial_owners_count: 0,
    consents_signed: 0,
  });
  const [verificationProgress, setVerificationProgress] = useState(0);

  useEffect(() => {
    if (organizationId) {
      loadVerificationStatus();
    }
  }, [organizationId]);

  const loadVerificationStatus = async () => {
    try {
      // Get organization verification status
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('is_ice_verified, is_rc_verified, is_cnss_verified, is_aml_cleared, is_banking_verified')
        .eq('id', organizationId)
        .single();

      if (orgError) throw orgError;

      // Get beneficial owners count
      const { count: ownersCount, error: ownersError } = await supabase
        .from('beneficial_owners')
        .select('*', { count: 'exact' })
        .eq('organization_id', organizationId);

      if (ownersError) throw ownersError;

      // Get consents count
      const { count: consentsCount, error: consentsError } = await supabase
        .from('consents')
        .select('*', { count: 'exact' })
        .eq('organization_id', organizationId)
        .eq('is_signed', true);

      if (consentsError) throw consentsError;

      const newStatus = {
        ice_verified: orgData.is_ice_verified || false,
        rc_verified: orgData.is_rc_verified || false,
        cnss_verified: orgData.is_cnss_verified || false,
        aml_cleared: orgData.is_aml_cleared || false,
        banking_verified: orgData.is_banking_verified || false,
        beneficial_owners_count: ownersCount || 0,
        consents_signed: consentsCount || 0,
      };

      setStatus(newStatus);

      // Calculate progress
      const checks = [
        newStatus.ice_verified,
        newStatus.rc_verified,
        newStatus.cnss_verified,
        newStatus.beneficial_owners_count > 0,
        newStatus.banking_verified,
        newStatus.consents_signed >= 4,
        newStatus.aml_cleared,
      ];
      
      const completedChecks = checks.filter(Boolean).length;
      setVerificationProgress((completedChecks / checks.length) * 100);

    } catch (error: any) {
      console.error('Error loading verification status:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger le statut de vérification.',
        variant: 'destructive',
      });
    }
  };

  const handleCompleteOnboarding = async () => {
    if (!organizationId) return;

    try {
      setIsLoading(true);

      // Submit for admin review - don't require all verifications
      const { error: orgError } = await supabase
        .from('organizations')
        .update({
          onboarding_status: 'completed',
          verification_status: 'pending', // Set to pending for admin review
        })
        .eq('id', organizationId);

      if (orgError) throw orgError;

      // Mark onboarding as completed but pending verification
      await supabase
        .from('onboarding_progress')
        .update({ status: 'completed' })
        .eq('organization_id', organizationId);

      toast({
        title: "Demande soumise",
        description: "Votre dossier a été soumis pour vérification. Vous recevrez une notification une fois approuvé.",
      });

      // Wait a moment then complete
      setTimeout(() => {
        completeOnboarding();
      }, 1500);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la soumission.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const VerificationItem = ({ 
    icon: Icon, 
    title, 
    description, 
    status: itemStatus, 
    isCount = false,
    count = 0,
    requiredCount = 1 
  }: {
    icon: any;
    title: string;
    description: string;
    status: boolean;
    isCount?: boolean;
    count?: number;
    requiredCount?: number;
  }) => {
    const isVerified = isCount ? count >= requiredCount : status;
    
    return (
      <div className="flex items-start space-x-4 p-4 border rounded-lg">
        <div className={`p-2 rounded-full ${isVerified ? 'bg-green-100' : 'bg-gray-100'}`}>
          <Icon className={`w-5 h-5 ${isVerified ? 'text-green-600' : 'text-gray-500'}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{title}</h4>
            {isVerified ? (
              <Badge variant="default" className="bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Vérifié
              </Badge>
            ) : (
              <Badge variant="secondary">
                <Clock className="w-3 h-3 mr-1" />
                En attente
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          {isCount && (
            <p className="text-sm text-blue-600 mt-1">
              {count} / {requiredCount} complété{count > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="w-6 h-6" />
            Vérification et Validation
          </CardTitle>
          <CardDescription>
            Dernière étape : vérification de votre dossier avant activation du compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <div className="mb-4">
                <div className="text-2xl font-bold text-primary mb-2">
                  {Math.round(verificationProgress)}%
                </div>
                <Progress value={verificationProgress} className="w-full" />
              </div>
              <p className="text-sm text-muted-foreground">
                Progression des vérifications
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Building className="w-4 h-4" />
                Vérifications d'entreprise
              </h3>

              <VerificationItem
                icon={FileText}
                title="Identifiant Commun d'Entreprise (ICE)"
                description="Vérification auprès du registre des entreprises"
                status={status.ice_verified}
              />

              <VerificationItem
                icon={FileText}
                title="Registre de Commerce (RC)"
                description="Validation du numéro de registre de commerce"
                status={status.rc_verified}
              />

              <VerificationItem
                icon={FileText}
                title="Identifiant Fiscal (IF) / CNSS"
                description="Vérification des obligations fiscales et sociales"
                status={status.cnss_verified}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" />
                Vérifications des personnes
              </h3>

              <VerificationItem
                icon={Users}
                title="Propriétaires Bénéficiaires"
                description="Déclaration des bénéficiaires effectifs"
                status={false}
                isCount={true}
                count={status.beneficial_owners_count}
                requiredCount={1}
              />

              <VerificationItem
                icon={Shield}
                title="Contrôle Anti-Blanchiment (AML)"
                description="Screening des sanctions et listes noires"
                status={status.aml_cleared}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Vérifications financières
              </h3>

              <VerificationItem
                icon={CreditCard}
                title="Informations Bancaires"
                description="Validation du RIB et de l'IBAN"
                status={status.banking_verified}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Déclarations légales
              </h3>

              <VerificationItem
                icon={FileText}
                title="Consentements et Signatures"
                description="Attestations et déclarations signées électroniquement"
                status={false}
                isCount={true}
                count={status.consents_signed}
                requiredCount={4}
              />
            </div>

            {verificationProgress < 100 ? (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Vérifications en cours</h4>
                      <p className="text-sm text-yellow-800 mt-1">
                        Nos équipes procèdent aux vérifications automatiques et manuelles de votre dossier. 
                        Ce processus peut prendre entre 24 à 72 heures ouvrables. Vous recevrez une notification 
                        dès que votre compte sera activé.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900">Dossier complet</h4>
                      <p className="text-sm text-green-800 mt-1">
                        Toutes les vérifications sont complètes. Vous pouvez maintenant finaliser votre onboarding 
                        et accéder à votre espace grossiste.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button variant="outline" disabled>
                Précédent
              </Button>
              <Button 
                onClick={handleCompleteOnboarding}
                disabled={isLoading || verificationProgress < 100}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Finalisation...
                  </>
                ) : (
                  'Finaliser l\'onboarding'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { useState } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Check, FileText, Shield, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BuyerConsent() {
  const { stepData, updateStepData, completeOnboarding, previousStep, organizationId } = useOnboarding();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [consents, setConsents] = useState({
    terms: false,
    privacy: false,
    communications: false,
    eSignature: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConsentChange = (key: keyof typeof consents, checked: boolean) => {
    setConsents(prev => ({ ...prev, [key]: checked }));
  };

  const canProceed = consents.terms && consents.privacy && consents.eSignature;

  const onSubmit = async () => {
    if (!canProceed) return;

    setIsSubmitting(true);
    try {
      // Save consent records
      const consentRecords = [
        {
          consent_type: 'terms_and_conditions',
          consent_text: 'Acceptation des conditions générales d\'utilisation',
          is_signed: consents.terms,
          version: '1.0',
          legal_basis: 'Contract',
          organization_id: organizationId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        },
        {
          consent_type: 'privacy_policy',
          consent_text: 'Acceptation de la politique de confidentialité',
          is_signed: consents.privacy,
          version: '1.0',
          legal_basis: 'Consent',
          organization_id: organizationId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        },
        {
          consent_type: 'e_signature',
          consent_text: 'Acceptation de la signature électronique',
          is_signed: consents.eSignature,
          version: '1.0',
          legal_basis: 'Contract',
          organization_id: organizationId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        },
      ];

      if (consents.communications) {
        consentRecords.push({
          consent_type: 'marketing_communications',
          consent_text: 'Acceptation des communications marketing',
          is_signed: consents.communications,
          version: '1.0',
          legal_basis: 'Consent',
          organization_id: organizationId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        });
      }

      const { error: consentError } = await supabase
        .from('consents')
        .insert(consentRecords);

      if (consentError) throw consentError;

      updateStepData(4, { consents });
      await completeOnboarding();
      
      toast({
        title: "Onboarding terminé!",
        description: "Votre compte acheteur est maintenant configuré",
      });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Erreur",
        description: "Impossible de terminer l'onboarding",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Consentements et Signature</h2>
        <p className="text-muted-foreground">
          Dernière étape : acceptez les conditions et signez électroniquement
        </p>
      </div>

      <div className="space-y-4">
        {/* Terms and Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Conditions Générales d'Utilisation
            </CardTitle>
            <CardDescription>
              Acceptation des termes et conditions d'utilisation de la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                checked={consents.terms}
                onCheckedChange={(checked) => handleConsentChange('terms', !!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  J'accepte les conditions générales d'utilisation *
                </label>
                <p className="text-xs text-muted-foreground">
                  En acceptant, vous confirmez avoir lu et accepté nos conditions d'utilisation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Policy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Politique de Confidentialité
            </CardTitle>
            <CardDescription>
              Acceptation du traitement des données personnelles (RGPD/Loi 09-08)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="privacy" 
                checked={consents.privacy}
                onCheckedChange={(checked) => handleConsentChange('privacy', !!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="privacy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  J'accepte la politique de confidentialité *
                </label>
                <p className="text-xs text-muted-foreground">
                  Consentement pour le traitement de vos données conformément à la loi marocaine 09-08
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* E-Signature */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Signature Électronique
            </CardTitle>
            <CardDescription>
              Acceptation de la signature électronique (Loi 53-05)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="eSignature" 
                checked={consents.eSignature}
                onCheckedChange={(checked) => handleConsentChange('eSignature', !!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="eSignature" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  J'accepte l'utilisation de la signature électronique *
                </label>
                <p className="text-xs text-muted-foreground">
                  Consentement pour signer électroniquement conformément à la loi 53-05
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Optional Marketing Communications */}
        <Card>
          <CardHeader>
            <CardTitle>Communications Marketing</CardTitle>
            <CardDescription>
              Recevoir des informations sur nos produits et services (optionnel)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="communications" 
                checked={consents.communications}
                onCheckedChange={(checked) => handleConsentChange('communications', !!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="communications" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Recevoir des communications marketing
                </label>
                <p className="text-xs text-muted-foreground">
                  Newsletters, offres spéciales et informations produits (vous pouvez vous désabonner à tout moment)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!canProceed && (
        <Alert>
          <AlertDescription>
            Vous devez accepter les conditions obligatoires (*) pour continuer.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={previousStep}>
          Retour
        </Button>
        <Button 
          onClick={onSubmit}
          disabled={!canProceed || isSubmitting}
          className="min-w-32"
        >
          {isSubmitting ? (
            "Finalisation..."
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Terminer l'Onboarding
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
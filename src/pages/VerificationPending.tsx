import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, XCircle, Building2 } from 'lucide-react';

export default function VerificationPending() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    checkVerificationStatus();

    // Poll every 10 seconds to check status
    const interval = setInterval(checkVerificationStatus, 10000);

    return () => clearInterval(interval);
  }, [user]);

  const checkVerificationStatus = async () => {
    try {
      const { data: onboardingData } = await supabase
        .from('onboarding_progress')
        .select('organization_id, user_role')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!onboardingData?.organization_id) return;

      const { data: orgData } = await supabase
        .from('organizations')
        .select('verification_status')
        .eq('id', onboardingData.organization_id)
        .single();

      if (orgData?.verification_status === 'verified') {
        navigate(`/dashboard/${onboardingData.user_role}`);
      } else if (orgData?.verification_status === 'rejected') {
        setStatus('rejected');
      } else {
        setStatus('pending');
      }
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'pending' ? (
              <Clock className="h-16 w-16 text-orange-500 animate-pulse" />
            ) : status === 'verified' ? (
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === 'pending' && "Vérification en cours"}
            {status === 'verified' && "Compte vérifié"}
            {status === 'rejected' && "Vérification refusée"}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {status === 'pending' && (
              <>
                Nos équipes procèdent aux vérifications automatiques et manuelles de votre dossier.
                <br />
                Ce processus peut prendre entre 24 à 72 heures ouvrables.
                <br />
                <strong>Vous recevrez une notification dès que votre compte sera activé.</strong>
              </>
            )}
            {status === 'verified' && "Votre compte a été vérifié avec succès. Redirection..."}
            {status === 'rejected' && "Votre demande a été refusée. Veuillez contacter le support pour plus d'informations."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === 'pending' && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Que se passe-t-il maintenant ?</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>✓ Vérification de vos informations légales (ICE, RC, IF)</li>
                      <li>✓ Contrôle des bénéficiaires effectifs</li>
                      <li>✓ Validation des informations bancaires</li>
                      <li>✓ Screening AML (Anti-blanchiment)</li>
                      <li>✓ Vérification des documents fournis</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    supabase.auth.signOut();
                    navigate('/');
                  }}
                >
                  Se déconnecter
                </Button>
              </div>
            </div>
          )}

          {status === 'rejected' && (
            <div className="flex flex-col gap-2">
              <Button onClick={() => navigate('/support')}>
                Contacter le support
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  supabase.auth.signOut();
                  navigate('/');
                }}
              >
                Se déconnecter
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
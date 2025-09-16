import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Shield, Eye } from 'lucide-react';

const declarationsSchema = z.object({
  kyb_attestation: z.boolean().refine(val => val === true, {
    message: "Vous devez accepter l'attestation KYB"
  }),
  aml_declaration: z.boolean().refine(val => val === true, {
    message: "Vous devez accepter la déclaration AML"
  }),
  data_processing: z.boolean().refine(val => val === true, {
    message: "Vous devez accepter le traitement des données"
  }),
  terms_conditions: z.boolean().refine(val => val === true, {
    message: "Vous devez accepter les conditions générales"
  }),
  signature_notes: z.string().optional(),
});

type DeclarationsForm = z.infer<typeof declarationsSchema>;

export default function Declarations() {
  const { user } = useAuth();
  const { organizationId, completeStep, updateStepData, stepData } = useOnboarding();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<DeclarationsForm>({
    resolver: zodResolver(declarationsSchema),
    defaultValues: {
      kyb_attestation: stepData[6]?.kyb_attestation || false,
      aml_declaration: stepData[6]?.aml_declaration || false,
      data_processing: stepData[6]?.data_processing || false,
      terms_conditions: stepData[6]?.terms_conditions || false,
      signature_notes: stepData[6]?.signature_notes || '',
    },
  });

  const handleSubmit = async (data: DeclarationsForm) => {
    if (!user || !organizationId) {
      toast({
        title: 'Erreur',
        description: 'Informations utilisateur manquantes.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const timestamp = new Date().toISOString();
      
      // Create consent records for each declaration
      const consents = [
        {
          user_id: user.id,
          organization_id: organizationId,
          consent_type: 'kyb_attestation',
          consent_text: 'Attestation KYB - Je certifie que toutes les informations fournies sont exactes et à jour.',
          version: '1.0',
          is_signed: true,
          signed_at: timestamp,
          legal_basis: 'Conformité réglementaire KYB',
          signature_hash: btoa(`kyb_${user.id}_${timestamp}`),
        },
        {
          user_id: user.id,
          organization_id: organizationId,
          consent_type: 'aml_declaration',
          consent_text: 'Déclaration Anti-Blanchiment - Je certifie que les fonds proviennent d\'activités légales.',
          version: '1.0',
          is_signed: true,
          signed_at: timestamp,
          legal_basis: 'Conformité AML/CFT',
          signature_hash: btoa(`aml_${user.id}_${timestamp}`),
        },
        {
          user_id: user.id,
          organization_id: organizationId,
          consent_type: 'data_processing',
          consent_text: 'Traitement des données - J\'accepte le traitement de mes données personnelles.',
          version: '1.0',
          is_signed: true,
          signed_at: timestamp,
          legal_basis: 'GDPR Article 6.1.a',
          signature_hash: btoa(`data_${user.id}_${timestamp}`),
        },
        {
          user_id: user.id,
          organization_id: organizationId,
          consent_type: 'terms_conditions',
          consent_text: 'Conditions générales - J\'accepte les conditions générales d\'utilisation.',
          version: '1.0',
          is_signed: true,
          signed_at: timestamp,
          legal_basis: 'Contrat commercial',
          signature_hash: btoa(`terms_${user.id}_${timestamp}`),
        },
      ];

      const { error } = await supabase
        .from('consents')
        .insert(consents);

      if (error) throw error;

      updateStepData(6, data);
      await completeStep(6);
      
      toast({
        title: 'Déclarations signées',
        description: 'Toutes les déclarations ont été enregistrées avec succès.',
      });
    } catch (error: any) {
      console.error('Error saving declarations:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les déclarations.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Déclarations et E-signature
          </CardTitle>
          <CardDescription>
            Veuillez lire attentivement et accepter les déclarations suivantes pour finaliser votre onboarding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-6">
                <Card className="border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      Attestation KYB (Know Your Business)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 p-4 rounded-md mb-4">
                      <p className="text-sm text-blue-800">
                        Je certifie par la présente que toutes les informations fournies concernant mon entreprise, 
                        y compris les documents d'identité, les informations financières et les propriétaires bénéficiaires, 
                        sont exactes, complètes et à jour. Je m'engage à notifier immédiatement tout changement matériel.
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="kyb_attestation"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm leading-5">
                            J'accepte et certifie l'exactitude des informations fournies
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormMessage />
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      Déclaration Anti-Blanchiment (AML)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-green-50 p-4 rounded-md mb-4">
                      <p className="text-sm text-green-800">
                        Je déclare que les fonds et actifs de mon entreprise proviennent exclusivement d'activités légales. 
                        Je m'engage à coopérer pleinement avec toute enquête de conformité et à fournir des justificatifs 
                        supplémentaires si nécessaire.
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="aml_declaration"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm leading-5">
                            J'accepte et certifie la légalité de l'origine des fonds
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormMessage />
                  </CardContent>
                </Card>

                <Card className="border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-600" />
                      Traitement des Données Personnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-purple-50 p-4 rounded-md mb-4">
                      <p className="text-sm text-purple-800">
                        J'autorise le traitement de mes données personnelles et celles de mon entreprise dans le cadre 
                        de la vérification d'identité, de la conformité réglementaire et de la fourniture des services. 
                        Ces données seront traitées conformément au RGPD et à la loi marocaine sur la protection des données.
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="data_processing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm leading-5">
                            J'accepte le traitement de mes données personnelles
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormMessage />
                  </CardContent>
                </Card>

                <Card className="border-orange-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Conditions Générales d'Utilisation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-orange-50 p-4 rounded-md mb-4">
                      <p className="text-sm text-orange-800">
                        J'accepte les conditions générales d'utilisation de la plateforme, y compris les modalités 
                        de paiement, les frais de service, les politiques de résiliation et les obligations contractuelles.
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="terms_conditions"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm leading-5">
                            J'accepte les conditions générales d'utilisation
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormMessage />
                  </CardContent>
                </Card>
              </div>

              <FormField
                control={form.control}
                name="signature_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes ou commentaires (optionnel)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Ajoutez des notes ou commentaires concernant votre signature..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Signature Électronique</h4>
                <p className="text-sm text-yellow-800">
                  En soumettant ce formulaire, vous apposez votre signature électronique sur tous les documents 
                  et déclarations ci-dessus. Cette signature a la même valeur juridique qu'une signature manuscrite 
                  selon la loi marocaine sur les transactions électroniques.
                </p>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" disabled>
                  Précédent
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  {isLoading ? 'Signature en cours...' : 'Signer et Continuer'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
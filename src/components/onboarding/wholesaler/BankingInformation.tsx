import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useOnboarding } from '@/hooks/useOnboarding';
import { supabase } from '@/integrations/supabase/client';

const bankingSchema = z.object({
  bank_name: z.string().min(2, 'Le nom de la banque est requis'),
  rib: z.string().refine((val) => {
    const cleanRib = val.replace(/\s/g, '');
    return cleanRib.length === 24 && /^\d{24}$/.test(cleanRib);
  }, 'Le RIB doit contenir exactement 24 chiffres'),
  iban: z.string().refine((val) => {
    const cleanIban = val.replace(/\s/g, '').toUpperCase();
    return /^MA\d{2}\d{20}$/.test(cleanIban);
  }, 'L\'IBAN doit commencer par MA suivi de 22 chiffres'),
});

type BankingForm = z.infer<typeof bankingSchema>;

const MOROCCAN_BANKS = [
  'Attijariwafa Bank',
  'Banque Populaire du Maroc',
  'BMCE Bank',
  'BMCI',
  'Crédit Agricole du Maroc',
  'Crédit du Maroc',
  'Société Générale Maroc',
  'CIH Bank',
  'Bank Al-Maghrib',
  'Autre'
];

export default function BankingInformation() {
  const { organizationId, completeStep, updateStepData, stepData } = useOnboarding();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BankingForm>({
    resolver: zodResolver(bankingSchema),
    defaultValues: {
      bank_name: stepData[5]?.bank_name || '',
      rib: stepData[5]?.rib || '',
      iban: stepData[5]?.iban || '',
    },
  });

  const handleSubmit = async (data: BankingForm) => {
    if (!organizationId) {
      toast({
        title: 'Erreur',
        description: 'ID d\'organisation manquant.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          bank_name: data.bank_name,
          rib: data.rib.replace(/\s/g, ''),
          iban: data.iban.replace(/\s/g, '').toUpperCase(),
          is_banking_verified: false // Will be verified later
        })
        .eq('id', organizationId);

      if (error) throw error;

      updateStepData(5, data);
      await completeStep(5);
      
      toast({
        title: 'Étape complétée',
        description: 'Les informations bancaires ont été enregistrées.',
      });
    } catch (error: any) {
      console.error('Error saving banking information:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les informations bancaires.',
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
          <CardTitle>Informations Bancaires</CardTitle>
          <CardDescription>
            Veuillez fournir les informations du compte bancaire principal de votre entreprise pour les paiements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="bank_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la banque *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre banque" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MOROCCAN_BANKS.map((bank) => (
                          <SelectItem key={bank} value={bank}>
                            {bank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rib"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RIB (Relevé d'Identité Bancaire) *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="XXXX XXXX XXXX XXXX XXXX XXXX"
                        maxLength={29} // 24 digits + 5 spaces
                        onChange={(e) => {
                          // Format RIB with spaces every 4 digits
                          const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      24 chiffres - Format automatiquement espacé
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="iban"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IBAN (International Bank Account Number) *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="MA64 XXXX XXXX XXXX XXXX XXXX"
                        maxLength={34}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase();
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Commence par MA suivi de 22 chiffres
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Informations importantes</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Le compte bancaire doit être au nom de votre entreprise</li>
                  <li>• Ces informations seront vérifiées avant l'activation de votre compte</li>
                  <li>• Assurez-vous que le RIB et l'IBAN correspondent au même compte</li>
                </ul>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" disabled>
                  Précédent
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Sauvegarde...' : 'Continuer'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
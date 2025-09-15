import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOnboarding } from '@/hooks/useOnboarding';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const schema = z.object({
  defaultPaymentMethod: z.string().min(1, 'Méthode de paiement requise'),
  creditLimit: z.string().optional(),
  paymentTerms: z.string().min(1, 'Conditions de paiement requises'),
  approvalRequired: z.boolean().default(false),
  budgetLimit: z.string().optional(),
  deliveryAddress: z.string().min(1, 'Adresse de livraison requise'),
  billingAddress: z.string().min(1, 'Adresse de facturation requise'),
  contactPerson: z.string().min(1, 'Personne de contact requise'),
  contactPhone: z.string().min(1, 'Téléphone de contact requis'),
  contactEmail: z.string().email('Email invalide'),
});

type FormValues = z.infer<typeof schema>;

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Virement bancaire' },
  { value: 'check', label: 'Chèque' },
  { value: 'credit_card', label: 'Carte de crédit' },
  { value: 'cash', label: 'Espèces' },
];

const PAYMENT_TERMS = [
  { value: '0', label: 'Paiement à la commande' },
  { value: '15', label: '15 jours' },
  { value: '30', label: '30 jours' },
  { value: '45', label: '45 jours' },
  { value: '60', label: '60 jours' },
];

export default function PurchasingSettings() {
  const { stepData, updateStepData, completeStep, nextStep, previousStep, organizationId } = useOnboarding();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: stepData[3] || {
      defaultPaymentMethod: '',
      creditLimit: '',
      paymentTerms: '',
      approvalRequired: false,
      budgetLimit: '',
      deliveryAddress: '',
      billingAddress: '',
      contactPerson: '',
      contactPhone: '',
      contactEmail: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Update organization with purchasing settings
      if (organizationId) {
        const { error } = await supabase
          .from('organizations')
          .update({
            // Store purchasing settings in verification_data as JSON
            verification_data: {
              purchasing_settings: data
            }
          })
          .eq('id', organizationId);

        if (error) throw error;
      }

      updateStepData(3, data);
      await completeStep(3);
      nextStep();
      
      toast({
        title: "Paramètres d'achat sauvegardés",
        description: "Vos préférences ont été enregistrées avec succès",
      });
    } catch (error: any) {
      console.error('Error saving purchasing settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Paramètres d'Achat</h2>
        <p className="text-muted-foreground">
          Configurez vos préférences de paiement et processus d'approbation
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Payment Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Paiements</CardTitle>
              <CardDescription>Méthodes et conditions de paiement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultPaymentMethod">Méthode de paiement préférée *</Label>
                <Select 
                  value={form.watch('defaultPaymentMethod')} 
                  onValueChange={(value) => form.setValue('defaultPaymentMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une méthode" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.defaultPaymentMethod && (
                  <p className="text-sm text-destructive">{form.formState.errors.defaultPaymentMethod.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Conditions de paiement *</Label>
                <Select 
                  value={form.watch('paymentTerms')} 
                  onValueChange={(value) => form.setValue('paymentTerms', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner des conditions" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_TERMS.map((term) => (
                      <SelectItem key={term.value} value={term.value}>
                        {term.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.paymentTerms && (
                  <p className="text-sm text-destructive">{form.formState.errors.paymentTerms.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditLimit">Limite de crédit (MAD)</Label>
                <Input
                  id="creditLimit"
                  type="number"
                  placeholder="100000"
                  {...form.register('creditLimit')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Approval Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Approbations</CardTitle>
              <CardDescription>Processus d'approbation et limites</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="approvalRequired" 
                  checked={form.watch('approvalRequired')}
                  onCheckedChange={(checked) => form.setValue('approvalRequired', !!checked)}
                />
                <Label htmlFor="approvalRequired">Approbation requise pour les commandes</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetLimit">Limite de budget (MAD)</Label>
                <Input
                  id="budgetLimit"
                  type="number"
                  placeholder="50000"
                  {...form.register('budgetLimit')}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Addresses */}
        <Card>
          <CardHeader>
            <CardTitle>Adresses</CardTitle>
            <CardDescription>Adresses de livraison et facturation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Adresse de livraison *</Label>
                <Input
                  id="deliveryAddress"
                  placeholder="123 Rue Mohammed V, Casablanca"
                  {...form.register('deliveryAddress')}
                  className={form.formState.errors.deliveryAddress ? 'border-destructive' : ''}
                />
                {form.formState.errors.deliveryAddress && (
                  <p className="text-sm text-destructive">{form.formState.errors.deliveryAddress.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingAddress">Adresse de facturation *</Label>
                <Input
                  id="billingAddress"
                  placeholder="123 Rue Mohammed V, Casablanca"
                  {...form.register('billingAddress')}
                  className={form.formState.errors.billingAddress ? 'border-destructive' : ''}
                />
                {form.formState.errors.billingAddress && (
                  <p className="text-sm text-destructive">{form.formState.errors.billingAddress.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
            <CardDescription>Personne responsable des achats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Personne de contact *</Label>
                <Input
                  id="contactPerson"
                  placeholder="Ahmed Benali"
                  {...form.register('contactPerson')}
                  className={form.formState.errors.contactPerson ? 'border-destructive' : ''}
                />
                {form.formState.errors.contactPerson && (
                  <p className="text-sm text-destructive">{form.formState.errors.contactPerson.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Téléphone *</Label>
                <Input
                  id="contactPhone"
                  placeholder="+212 6 12 34 56 78"
                  {...form.register('contactPhone')}
                  className={form.formState.errors.contactPhone ? 'border-destructive' : ''}
                />
                {form.formState.errors.contactPhone && (
                  <p className="text-sm text-destructive">{form.formState.errors.contactPhone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="ahmed@company.ma"
                  {...form.register('contactEmail')}
                  className={form.formState.errors.contactEmail ? 'border-destructive' : ''}
                />
                {form.formState.errors.contactEmail && (
                  <p className="text-sm text-destructive">{form.formState.errors.contactEmail.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={previousStep}>
            Retour
          </Button>
          <Button type="submit">
            Continuer
          </Button>
        </div>
      </form>
    </div>
  );
}
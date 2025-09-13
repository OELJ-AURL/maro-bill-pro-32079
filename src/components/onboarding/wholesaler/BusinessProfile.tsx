import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOnboarding } from '@/hooks/useOnboarding';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Globe, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const businessProfileSchema = z.object({
  legalName: z.string().min(2, 'Nom légal requis'),
  tradeName: z.string().optional(),
  activityCode: z.string().min(4, 'Code activité requis'),
  addressLine1: z.string().min(5, 'Adresse requise'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'Ville requise'),
  postalCode: z.string().optional(),
  phone: z.string().min(10, 'Numéro de téléphone valide requis'),
  email: z.string().email('Email valide requis'),
  website: z.string().url('URL valide requise').optional().or(z.literal('')),
  paymentMethods: z.array(z.string()).min(1, 'Au moins une méthode de paiement requise'),
});

type BusinessProfileForm = z.infer<typeof businessProfileSchema>;

const ACTIVITY_CODES = [
  { value: '4711', label: '4711 - Commerce de détail en magasin non spécialisé' },
  { value: '4719', label: '4719 - Autres commerces de détail en magasin non spécialisé' },
  { value: '4621', label: '4621 - Commerce de gros de céréales, tabac non manufacturé' },
  { value: '4622', label: '4622 - Commerce de gros de fleurs et plantes' },
  { value: '4623', label: '4623 - Commerce de gros d\'animaux vivants' },
  { value: '4631', label: '4631 - Commerce de gros de fruits et légumes' },
  { value: '4632', label: '4632 - Commerce de gros de viandes et de produits à base de viande' },
  { value: '4633', label: '4633 - Commerce de gros de produits laitiers, œufs, huiles' },
];

const PAYMENT_METHODS = [
  { id: 'bank_transfer', label: 'Virement bancaire' },
  { id: 'check', label: 'Chèque' },
  { id: 'cash', label: 'Espèces' },
  { id: 'credit_terms', label: 'Paiement à crédit' },
];

export default function BusinessProfile() {
  const { stepData, updateStepData, completeStep, nextStep, organizationId } = useOnboarding();
  const { toast } = useToast();
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>(
    stepData[3]?.paymentMethods || []
  );

  const form = useForm<BusinessProfileForm>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: stepData[3] || {
      legalName: '',
      tradeName: '',
      activityCode: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      postalCode: '',
      phone: '',
      email: '',
      website: '',
      paymentMethods: [],
    },
  });

  const handlePaymentMethodToggle = (methodId: string) => {
    const updated = selectedPaymentMethods.includes(methodId)
      ? selectedPaymentMethods.filter(id => id !== methodId)
      : [...selectedPaymentMethods, methodId];
    
    setSelectedPaymentMethods(updated);
    form.setValue('paymentMethods', updated);
  };

  const onSubmit = async (data: BusinessProfileForm) => {
    const formData = { ...data, paymentMethods: selectedPaymentMethods };

    // Update organization with business profile data
    if (organizationId) {
      const { error } = await supabase
        .from('organizations')
        .update({
          legal_name: formData.legalName,
          trade_name: formData.tradeName,
          activity_code: formData.activityCode,
          address_line1: formData.addressLine1,
          address_line2: formData.addressLine2,
          city: formData.city,
          postal_code: formData.postalCode,
          phone: formData.phone,
          email: formData.email,
          website: formData.website,
        })
        .eq('id', organizationId);

      if (error) {
        console.error('Error updating organization:', error);
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder les données",
          variant: "destructive",
        });
        return;
      }
    }

    updateStepData(3, formData);
    await completeStep(3);
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Profil Commercial</h2>
        <p className="text-muted-foreground">
          Complétez les informations de votre entreprise et vos préférences commerciales
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Informations de l'Entreprise
            </CardTitle>
            <CardDescription>
              Détails officiels de votre entreprise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="legalName">Nom légal de l'entreprise *</Label>
                <Input
                  id="legalName"
                  placeholder="SARL EXEMPLE TRADING"
                  {...form.register('legalName')}
                  className={form.formState.errors.legalName ? 'border-destructive' : ''}
                />
                {form.formState.errors.legalName && (
                  <p className="text-sm text-destructive">{form.formState.errors.legalName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tradeName">Nom commercial</Label>
                <Input
                  id="tradeName"
                  placeholder="Exemple Trading Co."
                  {...form.register('tradeName')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activityCode">Code d'activité NAM *</Label>
              <Select onValueChange={(value) => form.setValue('activityCode', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre activité principale" />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_CODES.map((code) => (
                    <SelectItem key={code.value} value={code.value}>
                      {code.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.activityCode && (
                <p className="text-sm text-destructive">{form.formState.errors.activityCode.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Adresse et Localisation
            </CardTitle>
            <CardDescription>
              Adresse de votre siège social ou principal établissement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="addressLine1">Adresse ligne 1 *</Label>
              <Input
                id="addressLine1"
                placeholder="123 Avenue Mohammed V"
                {...form.register('addressLine1')}
                className={form.formState.errors.addressLine1 ? 'border-destructive' : ''}
              />
              {form.formState.errors.addressLine1 && (
                <p className="text-sm text-destructive">{form.formState.errors.addressLine1.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="addressLine2">Adresse ligne 2</Label>
              <Input
                id="addressLine2"
                placeholder="Quartier Racine, Immeuble A"
                {...form.register('addressLine2')}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  placeholder="Casablanca"
                  {...form.register('city')}
                  className={form.formState.errors.city ? 'border-destructive' : ''}
                />
                {form.formState.errors.city && (
                  <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Code postal</Label>
                <Input
                  id="postalCode"
                  placeholder="20000"
                  {...form.register('postalCode')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Informations de Contact
            </CardTitle>
            <CardDescription>
              Coordonnées pour les communications d'affaires
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  placeholder="+212 5 22 00 00 00"
                  {...form.register('phone')}
                  className={form.formState.errors.phone ? 'border-destructive' : ''}
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@exemple.ma"
                  {...form.register('email')}
                  className={form.formState.errors.email ? 'border-destructive' : ''}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://www.exemple.ma"
                {...form.register('website')}
                className={form.formState.errors.website ? 'border-destructive' : ''}
              />
              {form.formState.errors.website && (
                <p className="text-sm text-destructive">{form.formState.errors.website.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Méthodes de Paiement Préférées</CardTitle>
            <CardDescription>
              Sélectionnez les méthodes de paiement que vous acceptez pour vos ventes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.id}
                  onClick={() => handlePaymentMethodToggle(method.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPaymentMethods.includes(method.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{method.label}</span>
                    {selectedPaymentMethods.includes(method.id) && (
                      <Badge variant="default">✓</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {selectedPaymentMethods.length === 0 && (
              <p className="text-sm text-destructive mt-2">
                Sélectionnez au moins une méthode de paiement
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Retour
          </Button>
          <Button type="submit" disabled={selectedPaymentMethods.length === 0}>
            Continuer
          </Button>
        </div>
      </form>
    </div>
  );
}
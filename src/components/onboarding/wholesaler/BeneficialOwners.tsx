import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useOnboarding } from '@/hooks/useOnboarding';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2 } from 'lucide-react';

const beneficialOwnerSchema = z.object({
  full_name: z.string().min(2, 'Le nom complet est requis'),
  position_title: z.string().min(2, 'Le titre du poste est requis'),
  ownership_percentage: z.number().min(0.01).max(100, 'Le pourcentage doit être entre 0.01 et 100'),
  date_of_birth: z.string().min(1, 'La date de naissance est requise'),
  nationality: z.string().min(2, 'La nationalité est requise'),
  country: z.string().min(2, 'Le pays est requis'),
  city: z.string().min(2, 'La ville est requise'),
  address: z.string().min(5, 'L\'adresse est requise'),
  cin_number: z.string().optional(),
  passport_number: z.string().optional(),
  is_pep: z.boolean().default(false),
});

type BeneficialOwnerForm = z.infer<typeof beneficialOwnerSchema>;

export default function BeneficialOwners() {
  const { organizationId, completeStep, updateStepData, stepData } = useOnboarding();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [owners, setOwners] = useState<BeneficialOwnerForm[]>(
    stepData[4]?.beneficialOwners || []
  );

  const form = useForm<BeneficialOwnerForm>({
    resolver: zodResolver(beneficialOwnerSchema),
    defaultValues: {
      full_name: '',
      position_title: '',
      ownership_percentage: 0,
      date_of_birth: '',
      nationality: 'Marocaine',
      country: 'Maroc',
      city: '',
      address: '',
      cin_number: '',
      passport_number: '',
      is_pep: false,
    },
  });

  const addOwner = (data: BeneficialOwnerForm) => {
    const newOwners = [...owners, data];
    setOwners(newOwners);
    updateStepData(4, { beneficialOwners: newOwners });
    form.reset();
    toast({
      title: 'Propriétaire bénéficiaire ajouté',
      description: 'Les informations ont été sauvegardées.',
    });
  };

  const removeOwner = (index: number) => {
    const newOwners = owners.filter((_, i) => i !== index);
    setOwners(newOwners);
    updateStepData(4, { beneficialOwners: newOwners });
    toast({
      title: 'Propriétaire supprimé',
      description: 'Le propriétaire bénéficiaire a été retiré.',
    });
  };

  const handleSubmit = async () => {
    if (owners.length === 0) {
      toast({
        title: 'Erreur',
        description: 'Vous devez ajouter au moins un propriétaire bénéficiaire.',
        variant: 'destructive',
      });
      return;
    }

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
      // Delete existing beneficial owners for this organization
      await supabase
        .from('beneficial_owners')
        .delete()
        .eq('organization_id', organizationId);

      // Insert new beneficial owners
      const ownersData = owners.map(owner => ({
        organization_id: organizationId,
        full_name: owner.full_name,
        position_title: owner.position_title,
        ownership_percentage: owner.ownership_percentage,
        date_of_birth: owner.date_of_birth,
        nationality: owner.nationality,
        country: owner.country,
        city: owner.city,
        address: owner.address,
        cin_number: owner.cin_number || null,
        passport_number: owner.passport_number || null,
        is_pep: owner.is_pep,
      }));

      const { error } = await supabase
        .from('beneficial_owners')
        .insert(ownersData);

      if (error) throw error;

      await completeStep(4);
      
      toast({
        title: 'Étape complétée',
        description: 'Les propriétaires bénéficiaires ont été enregistrés.',
      });
    } catch (error: any) {
      console.error('Error saving beneficial owners:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les propriétaires bénéficiaires.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalOwnership = owners.reduce((sum, owner) => sum + owner.ownership_percentage, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Propriétaires Bénéficiaires</CardTitle>
          <CardDescription>
            Veuillez déclarer tous les propriétaires bénéficiaires détenant plus de 25% du capital ou des droits de vote.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(addOwner)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre/Position *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Directeur Général" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ownership_percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pourcentage de participation (%) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0.01" 
                          max="100" 
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de naissance *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationalité *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Marocaine">Marocaine</SelectItem>
                          <SelectItem value="Française">Française</SelectItem>
                          <SelectItem value="Espagnole">Espagnole</SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pays de résidence *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Adresse complète *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cin_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro CIN</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passport_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de passeport</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_pep"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Personne Politiquement Exposée (PPE)
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Cette personne exerce-t-elle ou a-t-elle exercé des fonctions politiques importantes ?
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter ce propriétaire bénéficiaire
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {owners.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Propriétaires bénéficiaires déclarés</CardTitle>
            <CardDescription>
              Total de participation: {totalOwnership.toFixed(2)}%
              {totalOwnership !== 100 && (
                <span className="text-amber-600 ml-2">
                  (Attention: Le total devrait être 100%)
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {owners.map((owner, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{owner.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {owner.position_title} • {owner.ownership_percentage}%
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOwner(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" disabled>
          Précédent
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || owners.length === 0}
        >
          {isLoading ? 'Sauvegarde...' : 'Continuer'}
        </Button>
      </div>
    </div>
  );
}
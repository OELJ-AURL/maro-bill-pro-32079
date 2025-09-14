import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useOnboarding } from '@/hooks/useOnboarding';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const schema = z.object({
  legalName: z.string().min(2, "Nom légal requis"),
  ice: z.string().optional(),
  rcNumber: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function CompanyDetails() {
  const { organizationId, updateStepData, completeStep, nextStep } = useOnboarding();
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      legalName: '',
      ice: '',
      rcNumber: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (organizationId) {
        const { error } = await supabase
          .from('organizations')
          .update({
            legal_name: values.legalName,
            ice: values.ice || null,
            rc_number: values.rcNumber || null,
          })
          .eq('id', organizationId);
        if (error) throw error;
      }
      updateStepData(2, values);
      await completeStep(2);
      nextStep();
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Erreur', description: e.message || 'Impossible de sauvegarder', variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Détails Entreprise</h2>
        <p className="text-muted-foreground">Renseignez les informations de base de votre entreprise.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations légales</CardTitle>
          <CardDescription>Ces informations apparaîtront sur vos documents.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="legalName">Nom légal *</Label>
            <Input id="legalName" {...form.register('legalName')} />
            {form.formState.errors.legalName && (
              <p className="text-sm text-destructive">{form.formState.errors.legalName.message}</p>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ice">ICE (optionnel)</Label>
              <Input id="ice" {...form.register('ice')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rcNumber">RC (optionnel)</Label>
              <Input id="rcNumber" {...form.register('rcNumber')} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">Continuer</Button>
      </div>
    </form>
  );
}

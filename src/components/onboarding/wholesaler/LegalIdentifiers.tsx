import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOnboarding } from '@/hooks/useOnboarding';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const legalIdentifiersSchema = z.object({
  ice: z.string()
    .min(15, 'ICE doit contenir 15 chiffres')
    .max(15, 'ICE doit contenir 15 chiffres')
    .regex(/^\d{15}$/, 'ICE doit contenir uniquement des chiffres'),
  rcNumber: z.string()
    .min(6, 'RC doit contenir au moins 6 caractères')
    .regex(/^[A-Z0-9]+$/i, 'RC doit contenir uniquement des lettres et chiffres'),
  ifNumber: z.string()
    .min(8, 'IF doit contenir 8 chiffres')
    .max(8, 'IF doit contenir 8 chiffres')
    .regex(/^\d{8}$/, 'IF doit contenir uniquement des chiffres'),
  cnssNumber: z.string().optional(),
});

type LegalIdentifiersForm = z.infer<typeof legalIdentifiersSchema>;

export default function LegalIdentifiers() {
  const { stepData, updateStepData, completeStep, nextStep, organizationId, validateICE, validateRC, validateIF } = useOnboarding();
  const { toast } = useToast();
  const [uploadedDocs, setUploadedDocs] = useState<{
    rcExtract: string | null;
    cnssAttestation: string | null;
  }>({ rcExtract: null, cnssAttestation: null });
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<LegalIdentifiersForm>({
    resolver: zodResolver(legalIdentifiersSchema),
    defaultValues: stepData[2] || {
      ice: '',
      rcNumber: '',
      ifNumber: '',
      cnssNumber: '',
    },
  });

  // Watch form values for real-time validation
  const watchedValues = form.watch();

  const validateIdentifiers = async (data: LegalIdentifiersForm) => {
    const validationResults = {
      ice: validateICE(data.ice),
      rc: validateRC(data.rcNumber),
      if: validateIF(data.ifNumber),
    };

    // Simulate API calls for validation (replace with real API calls)
    if (validationResults.ice && validationResults.rc && validationResults.if) {
      toast({
        title: "Validation réussie",
        description: "Tous les identifiants sont valides",
      });
      return true;
    } else {
      toast({
        title: "Erreurs de validation",
        description: "Veuillez corriger les identifiants invalides",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleFileUpload = async (file: File, type: 'rcExtract' | 'cnssAttestation') => {
    if (!organizationId) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${organizationId}/${type}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('onboarding-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save document record in database
      const { error: dbError } = await supabase
        .from('document_uploads')
        .insert({
          organization_id: organizationId,
          document_type: type,
          file_name: file.name,
          file_path: fileName,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by_user_id: (await supabase.auth.getUser()).data.user?.id || '',
        });

      if (dbError) throw dbError;

      setUploadedDocs(prev => ({ ...prev, [type]: fileName }));
      
      toast({
        title: "Document téléchargé",
        description: `${type === 'rcExtract' ? 'Extrait RC' : 'Attestation CNSS'} téléchargé avec succès`,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Erreur de téléchargement",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: LegalIdentifiersForm) => {
    const isValid = await validateIdentifiers(data);
    if (!isValid) return;

    if (!uploadedDocs.rcExtract) {
      toast({
        title: "Document manquant",
        description: "Veuillez télécharger l'extrait RC",
        variant: "destructive",
      });
      return;
    }

    // Update organization with legal identifiers
    if (organizationId) {
      const { error } = await supabase
        .from('organizations')
        .update({
          ice: data.ice,
          rc_number: data.rcNumber,
          if_number: data.ifNumber,
          cnss_number: data.cnssNumber,
          is_ice_verified: true,
          is_rc_verified: true,
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

    updateStepData(2, { ...data, uploadedDocs });
    await completeStep(2);
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Identifiants Légaux</h2>
        <p className="text-muted-foreground">
          Saisissez vos identifiants d'entreprise et téléchargez les documents requis
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ICE Field */}
        <div className="space-y-2">
          <Label htmlFor="ice">ICE - Identifiant Commun de l'Entreprise *</Label>
          <div className="flex gap-2">
            <Input
              id="ice"
              placeholder="123456789012345"
              {...form.register('ice')}
              className={form.formState.errors.ice ? 'border-destructive' : ''}
            />
            {watchedValues.ice && validateICE(watchedValues.ice) && (
              <Badge variant="outline" className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="h-3 w-3" />
                Valide
              </Badge>
            )}
          </div>
          {form.formState.errors.ice && (
            <p className="text-sm text-destructive">{form.formState.errors.ice.message}</p>
          )}
        </div>

        {/* RC Field */}
        <div className="space-y-2">
          <Label htmlFor="rcNumber">RC - Registre de Commerce *</Label>
          <div className="flex gap-2">
            <Input
              id="rcNumber"
              placeholder="123456"
              {...form.register('rcNumber')}
              className={form.formState.errors.rcNumber ? 'border-destructive' : ''}
            />
            {watchedValues.rcNumber && validateRC(watchedValues.rcNumber) && (
              <Badge variant="outline" className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="h-3 w-3" />
                Valide
              </Badge>
            )}
          </div>
          {form.formState.errors.rcNumber && (
            <p className="text-sm text-destructive">{form.formState.errors.rcNumber.message}</p>
          )}
        </div>

        {/* IF Field */}
        <div className="space-y-2">
          <Label htmlFor="ifNumber">IF - Identifiant Fiscal *</Label>
          <div className="flex gap-2">
            <Input
              id="ifNumber"
              placeholder="12345678"
              {...form.register('ifNumber')}
              className={form.formState.errors.ifNumber ? 'border-destructive' : ''}
            />
            {watchedValues.ifNumber && validateIF(watchedValues.ifNumber) && (
              <Badge variant="outline" className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="h-3 w-3" />
                Valide
              </Badge>
            )}
          </div>
          {form.formState.errors.ifNumber && (
            <p className="text-sm text-destructive">{form.formState.errors.ifNumber.message}</p>
          )}
        </div>

        {/* CNSS Field */}
        <div className="space-y-2">
          <Label htmlFor="cnssNumber">CNSS - Caisse Nationale de Sécurité Sociale (optionnel)</Label>
          <Input
            id="cnssNumber"
            placeholder="123456789"
            {...form.register('cnssNumber')}
          />
        </div>

        {/* Document Uploads */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* RC Extract Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Extrait RC *
              </CardTitle>
              <CardDescription>
                Extrait du registre de commerce récent (moins de 3 mois)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadedDocs.rcExtract ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-700">Document téléchargé</span>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground mb-2">
                    Glissez-déposez ou cliquez pour télécharger
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'rcExtract');
                    }}
                    className="hidden"
                    id="rcExtract"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => document.getElementById('rcExtract')?.click()}
                    disabled={isUploading}
                  >
                    Sélectionner un fichier
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CNSS Attestation Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Attestation CNSS
              </CardTitle>
              <CardDescription>
                Attestation d'affiliation CNSS (si applicable)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadedDocs.cnssAttestation ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-700">Document téléchargé</span>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground mb-2">
                    Optionnel - Si vous avez une affiliation CNSS
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'cnssAttestation');
                    }}
                    className="hidden"
                    id="cnssAttestation"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => document.getElementById('cnssAttestation')?.click()}
                    disabled={isUploading}
                  >
                    Sélectionner un fichier
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Vérification automatique :</strong> Vos identifiants seront vérifiés automatiquement 
            auprès des services ICE, OMPIC (RC) et CNSS pour garantir leur authenticité.
          </AlertDescription>
        </Alert>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Retour
          </Button>
          <Button type="submit" disabled={isUploading}>
            {isUploading ? 'Téléchargement...' : 'Continuer'}
          </Button>
        </div>
      </form>
    </div>
  );
}
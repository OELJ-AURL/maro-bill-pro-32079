import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  FileText,
  Users,
  CreditCard,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VerifyOrganization() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<any>(null);
  const [beneficialOwners, setBeneficialOwners] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [notes, setNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [orgResponse, ownersResponse, docsResponse] = await Promise.all([
        supabase.from('organizations').select('*').eq('id', id).single(),
        supabase.from('beneficial_owners').select('*').eq('organization_id', id),
        supabase.from('document_uploads').select('*').eq('organization_id', id)
      ]);

      if (orgResponse.error) throw orgResponse.error;
      
      setOrganization(orgResponse.data);
      setBeneficialOwners(ownersResponse.data || []);
      setDocuments(docsResponse.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('organizations')
        .update({
          verification_status: 'verified',
          onboarding_status: 'completed',
          verified_at: new Date().toISOString(),
          verified_by: user?.id,
          verification_notes: notes,
        })
        .eq('id', id);

      if (error) throw error;

      // Update onboarding progress
      await supabase
        .from('onboarding_progress')
        .update({ status: 'completed' })
        .eq('organization_id', id);

      toast({
        title: "Organisation approuvée",
        description: "L'organisation a été vérifiée avec succès.",
      });

      navigate('/admin/dashboard');
    } catch (error) {
      console.error("Error approving:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'approuver l'organisation.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Raison requise",
        description: "Veuillez fournir une raison de rejet.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('organizations')
        .update({
          verification_status: 'rejected',
          verified_by: user?.id,
          rejected_reason: rejectionReason,
          verification_notes: notes,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Organisation rejetée",
        description: "L'organisation a été rejetée.",
      });

      navigate('/admin/dashboard');
    } catch (error) {
      console.error("Error rejecting:", error);
      toast({
        title: "Erreur",
        description: "Impossible de rejeter l'organisation.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="p-6">
        <p>Organisation non trouvée</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/dashboard')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Vérification d'organisation</h1>
          <p className="text-muted-foreground">{organization.legal_name}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informations légales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Nom légal</p>
              <p className="text-sm text-muted-foreground">{organization.legal_name}</p>
            </div>
            {organization.trade_name && (
              <div>
                <p className="text-sm font-medium">Nom commercial</p>
                <p className="text-sm text-muted-foreground">{organization.trade_name}</p>
              </div>
            )}
            <Separator />
            <div className="space-y-2">
              {organization.ice && <div><span className="font-medium">ICE:</span> {organization.ice}</div>}
              {organization.rc_number && <div><span className="font-medium">RC:</span> {organization.rc_number}</div>}
              {organization.if_number && <div><span className="font-medium">IF:</span> {organization.if_number}</div>}
              {organization.cnss_number && <div><span className="font-medium">CNSS:</span> {organization.cnss_number}</div>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Informations bancaires
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {organization.bank_name && (
              <div>
                <p className="text-sm font-medium">Banque</p>
                <p className="text-sm text-muted-foreground">{organization.bank_name}</p>
              </div>
            )}
            {organization.rib && (
              <div>
                <p className="text-sm font-medium">RIB</p>
                <p className="text-sm text-muted-foreground font-mono">{organization.rib}</p>
              </div>
            )}
            {organization.iban && (
              <div>
                <p className="text-sm font-medium">IBAN</p>
                <p className="text-sm text-muted-foreground font-mono">{organization.iban}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Bénéficiaires effectifs
            </CardTitle>
            <CardDescription>
              {beneficialOwners.length} personne(s) déclarée(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {beneficialOwners.map((owner) => (
                <div key={owner.id} className="p-3 border rounded-lg">
                  <p className="font-medium">{owner.full_name}</p>
                  <p className="text-sm text-muted-foreground">{owner.position_title}</p>
                  {owner.ownership_percentage && (
                    <Badge variant="secondary" className="mt-2">
                      {owner.ownership_percentage}% de propriété
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents
            </CardTitle>
            <CardDescription>
              {documents.length} document(s) téléchargé(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">{doc.document_type}</p>
                    <p className="text-xs text-muted-foreground">{doc.file_name}</p>
                  </div>
                  <Badge variant={doc.is_verified ? "default" : "secondary"}>
                    {doc.is_verified ? "Vérifié" : "En attente"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notes de vérification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Ajoutez des notes sur cette vérification..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />

          {organization.verification_status !== 'verified' && (
            <div className="space-y-4">
              <Separator />
              <div>
                <label className="text-sm font-medium">Raison de rejet (si applicable)</label>
                <Textarea
                  placeholder="Expliquez pourquoi cette organisation est rejetée..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeter
                </Button>
                <Button onClick={handleApprove}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approuver
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
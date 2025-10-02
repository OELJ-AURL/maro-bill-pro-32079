import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle,
  FileCheck,
  AlertCircle,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Organization {
  id: string;
  legal_name: string;
  organization_type: string;
  verification_status: string;
  onboarding_status: string;
  created_at: string;
  ice?: string;
  rc_number?: string;
  email?: string;
  phone?: string;
}

export default function AdminDashboard() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
    loadOrganizations();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase.rpc('is_admin', { check_user_id: user.id });
      
      if (error || !data) {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les permissions administrateur.",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/dashboard");
    }
  };

  const loadOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error("Error loading organizations:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les organisations.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const pendingOrgs = organizations.filter(
    o => o.onboarding_status === 'in_progress' || o.verification_status === 'pending'
  );
  const verifiedOrgs = organizations.filter(o => o.verification_status === 'verified');
  const rejectedOrgs = organizations.filter(o => o.verification_status === 'rejected');

  const stats = [
    {
      title: "En attente de vérification",
      value: pendingOrgs.length,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Organisations vérifiées",
      value: verifiedOrgs.length,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Rejets",
      value: rejectedOrgs.length,
      icon: XCircle,
      color: "text-red-600",
    },
    {
      title: "Total organisations",
      value: organizations.length,
      icon: Building2,
      color: "text-blue-600",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tableau de bord administrateur</h1>
        <p className="text-muted-foreground">Gestion des vérifications et validations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            <Clock className="h-4 w-4 mr-2" />
            En attente ({pendingOrgs.length})
          </TabsTrigger>
          <TabsTrigger value="verified">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Vérifiées ({verifiedOrgs.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            <XCircle className="h-4 w-4 mr-2" />
            Rejetées ({rejectedOrgs.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            <Building2 className="h-4 w-4 mr-2" />
            Toutes ({organizations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <OrganizationsList
            organizations={pendingOrgs}
            onRefresh={loadOrganizations}
          />
        </TabsContent>

        <TabsContent value="verified" className="space-y-4">
          <OrganizationsList
            organizations={verifiedOrgs}
            onRefresh={loadOrganizations}
          />
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <OrganizationsList
            organizations={rejectedOrgs}
            onRefresh={loadOrganizations}
          />
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <OrganizationsList
            organizations={organizations}
            onRefresh={loadOrganizations}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OrganizationsList({ 
  organizations, 
  onRefresh 
}: { 
  organizations: Organization[];
  onRefresh: () => void;
}) {
  const navigate = useNavigate();

  if (organizations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucune organisation trouvée</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {organizations.map((org) => (
        <Card key={org.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {org.legal_name}
                </CardTitle>
                <CardDescription className="mt-2">
                  <div className="space-y-1">
                    {org.ice && <div>ICE: {org.ice}</div>}
                    {org.rc_number && <div>RC: {org.rc_number}</div>}
                    {org.email && <div>Email: {org.email}</div>}
                    {org.phone && <div>Téléphone: {org.phone}</div>}
                  </div>
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2">
                <Badge variant={org.organization_type === 'wholesaler' ? 'default' : 'secondary'}>
                  {org.organization_type === 'wholesaler' ? 'Fournisseur' : 'Acheteur'}
                </Badge>
                <Badge 
                  variant={
                    org.verification_status === 'verified' ? 'default' :
                    org.verification_status === 'rejected' ? 'destructive' :
                    'secondary'
                  }
                >
                  {org.verification_status === 'verified' ? 'Vérifié' :
                   org.verification_status === 'rejected' ? 'Rejeté' :
                   'En attente'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Créé le {new Date(org.created_at).toLocaleDateString('fr-FR')}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/admin/verify/${org.id}`)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Examiner
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileText, 
  Receipt, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  Euro
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Clients actifs",
      value: "124",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Devis en attente",
      value: "8",
      change: "+2",
      icon: FileText,
      color: "text-orange-600",
    },
    {
      title: "Factures émises",
      value: "156",
      change: "+18%",
      icon: Receipt,
      color: "text-green-600",
    },
    {
      title: "CA du mois",
      value: "87,450 MAD",
      change: "+15%",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  const recentInvoices = [
    { number: "FAC-2024-001", client: "Société ABC", amount: "12,500 MAD", status: "Payée", date: "15/01/2024" },
    { number: "FAC-2024-002", client: "Entreprise XYZ", amount: "8,750 MAD", status: "En attente", date: "16/01/2024" },
    { number: "FAC-2024-003", client: "SARL DEF", amount: "15,200 MAD", status: "En retard", date: "14/01/2024" },
  ];

  const complianceStatus = [
    { item: "Déclaration TVA", status: "À jour", dueDate: "20/01/2024", type: "success" },
    { item: "Registre CNDP", status: "À jour", dueDate: "31/12/2024", type: "success" },
    { item: "Sauvegarde e-facturation", status: "Planifiée", dueDate: "2026", type: "warning" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de votre activité et conformité réglementaire
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Factures récentes
            </CardTitle>
            <CardDescription>
              Dernières factures émises
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.map((invoice, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{invoice.number}</p>
                    <p className="text-sm text-muted-foreground">{invoice.client}</p>
                    <p className="text-xs text-muted-foreground">{invoice.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{invoice.amount}</p>
                    <Badge 
                      variant={
                        invoice.status === "Payée" ? "default" : 
                        invoice.status === "En attente" ? "secondary" : 
                        "destructive"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Conformité réglementaire
            </CardTitle>
            <CardDescription>
              Statut des obligations légales marocaines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {item.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : item.type === "warning" ? (
                      <Clock className="h-4 w-4 text-orange-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{item.item}</p>
                      <p className="text-xs text-muted-foreground">Échéance: {item.dueDate}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      item.type === "success" ? "default" : 
                      item.type === "warning" ? "secondary" : 
                      "destructive"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Accès direct aux fonctions les plus utilisées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <button className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left">
              <FileText className="h-6 w-6 mb-2 text-blue-600" />
              <h3 className="font-medium">Nouveau devis</h3>
              <p className="text-sm text-muted-foreground">Créer un devis avec signature électronique</p>
            </button>
            
            <button className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left">
              <Receipt className="h-6 w-6 mb-2 text-green-600" />
              <h3 className="font-medium">Nouvelle facture</h3>
              <p className="text-sm text-muted-foreground">Émettre une facture conforme TVA</p>
            </button>
            
            <button className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left">
              <Users className="h-6 w-6 mb-2 text-purple-600" />
              <h3 className="font-medium">Ajouter un client</h3>
              <p className="text-sm text-muted-foreground">Enregistrer avec vérification ICE</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
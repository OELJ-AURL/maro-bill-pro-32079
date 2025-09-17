import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  FileText,
  Truck,
  DollarSign
} from "lucide-react";

export default function WholesalerDashboard() {
  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord Fournisseur</h1>
          <p className="text-muted-foreground">Centre de commande pour vos ventes, stocks et conformité.</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Produit
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Répondre RFQ
          </Button>
        </div>
      </header>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="rfqs">RFQ & Devis</TabsTrigger>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="inventory">Inventaire</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPIs Widgets */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventes Aujourd'hui</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45 320 MAD</div>
                <p className="text-xs text-muted-foreground">+20.1% par rapport à hier</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">+12% cette semaine</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Panier Moyen</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1 970 MAD</div>
                <p className="text-xs text-muted-foreground">+5.2% ce mois</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux Conversion RFQ</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">+3% ce mois</p>
              </CardContent>
            </Card>
          </section>

          {/* Operations Tiles */}
          <section className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Opérations en Cours</CardTitle>
                <CardDescription>Actions urgentes nécessitant votre attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Commandes en attente de confirmation</span>
                  <Badge variant="destructive">8</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>RFQ en attente de réponse</span>
                  <Badge variant="secondary">12</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Retours/Litiges en cours</span>
                  <Badge variant="outline">3</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Messages non lus</span>
                  <Badge>5</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertes Stock</CardTitle>
                <CardDescription>Produits nécessitant votre attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Stock faible</span>
                  </div>
                  <Badge variant="secondary">7 produits</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Rupture de stock</span>
                  </div>
                  <Badge variant="destructive">2 produits</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Inventaire obsolète</span>
                  </div>
                  <Badge variant="outline">4 produits</Badge>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Account Health */}
          <Card>
            <CardHeader>
              <CardTitle>Santé du Compte</CardTitle>
              <CardDescription>Indicateurs de performance et conformité</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">98%</div>
                  <p className="text-sm text-muted-foreground">Respect SLA</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">2</div>
                  <p className="text-sm text-muted-foreground">Expéditions en retard</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">1</div>
                  <p className="text-sm text-muted-foreground">Litiges escaladés</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">75%</div>
                  <p className="text-sm text-muted-foreground">Limite d'exposition</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Commandes</CardTitle>
              <CardDescription>Pipeline complet du cycle de vie des commandes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Module de gestion des commandes en cours de développement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rfqs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>RFQ et Devis</CardTitle>
              <CardDescription>Gestion des demandes de devis et négociations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Module RFQ et devis en cours de développement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Catalogue Produits</CardTitle>
              <CardDescription>Gestion centralisée des SKU, variantes et attributs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Module catalogue produits en cours de développement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion d'Inventaire</CardTitle>
              <CardDescription>Stock précis par emplacement avec allocation et ajustements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Module gestion d'inventaire en cours de développement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

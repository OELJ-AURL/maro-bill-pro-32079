import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  Filter, 
  Download, 
  Plus,
  Package,
  Truck,
  CheckCircle
} from "lucide-react";

export default function Orders() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Commandes</h1>
          <p className="text-muted-foreground">Pipeline complet du cycle de vie des commandes avec actions en lot</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </header>

      <Tabs defaultValue="pipeline" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline par Statut</TabsTrigger>
          <TabsTrigger value="awaiting">En Attente</TabsTrigger>
          <TabsTrigger value="processing">En Traitement</TabsTrigger>
          <TabsTrigger value="shipped">Expédiées</TabsTrigger>
          <TabsTrigger value="completed">Terminées</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Attente Confirmation</CardTitle>
                <ShoppingCart className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Nécessitent validation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">À Emballer</CardTitle>
                <Package className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">Prêtes pour expédition</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expédiées</CardTitle>
                <Truck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">En transit</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Livrées</CardTitle>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">Ce mois</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités Prévues</CardTitle>
              <CardDescription>Module de gestion des commandes avec fonctionnalités avancées</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Vues et Filtres</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Pipeline par statut avec filtres sauvegardés</li>
                    <li>• Actions en lot pour traitement groupé</li>
                    <li>• Colonnes personnalisables</li>
                    <li>• Filtres par date, acheteur, montant</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Actions et Documents</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Confirmer/rejeter commandes</li>
                    <li>• Édition quantités et expéditions partielles</li>
                    <li>• Génération étiquettes et bordereaux</li>
                    <li>• Suivi livraisons temps réel</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="awaiting">
          <Card>
            <CardHeader>
              <CardTitle>Commandes en Attente de Confirmation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Liste des commandes en attente de confirmation</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing">
          <Card>
            <CardHeader>
              <CardTitle>Commandes en Traitement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Commandes confirmées en cours de préparation</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipped">
          <Card>
            <CardHeader>
              <CardTitle>Commandes Expédiées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Commandes expédiées en cours de livraison</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Commandes Terminées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Commandes livrées et finalisées</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
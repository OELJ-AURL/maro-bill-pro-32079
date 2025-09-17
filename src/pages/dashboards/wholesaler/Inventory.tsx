import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Warehouse, 
  Package, 
  AlertTriangle, 
  TrendingDown,
  MapPin,
  RotateCcw,
  Plus,
  Download
} from "lucide-react";

export default function Inventory() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion d'Inventaire</h1>
          <p className="text-muted-foreground">Stock précis par emplacement avec allocation et ajustements</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ajuster Stock
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Rapport Stock
          </Button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Total Stock</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€487K</div>
            <p className="text-xs text-muted-foreground">+3.2% ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Faible</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Produits sous seuil</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ruptures Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Nécessitent réapprovisionnement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Obsolète</CardTitle>
            <TrendingDown className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€12K</div>
            <p className="text-xs text-muted-foreground">Pas de mouvement 6m+</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d'Ensemble</TabsTrigger>
          <TabsTrigger value="locations">Par Emplacement</TabsTrigger>
          <TabsTrigger value="movements">Mouvements</TabsTrigger>
          <TabsTrigger value="forecasting">Prévisions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Alertes Stock Prioritaires</CardTitle>
                <CardDescription>Produits nécessitant une attention immédiate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <h4 className="font-medium">Bureau Réglable Électrique</h4>
                      <p className="text-sm text-muted-foreground">SKU: BUR-REG-002</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">Stock: 0</Badge>
                    <p className="text-sm text-muted-foreground mt-1">3 commandes en attente</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-orange-50">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <div>
                      <h4 className="font-medium">Chaise Bureau Ergonomique</h4>
                      <p className="text-sm text-muted-foreground">SKU: CHR-ERG-001</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">Stock: 5</Badge>
                    <p className="text-sm text-muted-foreground mt-1">Seuil: 20</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="h-5 w-5 text-gray-500" />
                    <div>
                      <h4 className="font-medium">Ancienne Imprimante</h4>
                      <p className="text-sm text-muted-foreground">SKU: IMP-OLD-001</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">Stock: 45</Badge>
                    <p className="text-sm text-muted-foreground mt-1">Aucun mvt 8 mois</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Emplacement</CardTitle>
                <CardDescription>Vue d'ensemble des stocks par entrepôt</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Entrepôt Principal - Casablanca</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">€324K</div>
                    <div className="text-sm text-muted-foreground">67% du total</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Dépôt Nord - Tanger</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">€98K</div>
                    <div className="text-sm text-muted-foreground">20% du total</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">Showroom - Rabat</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">€65K</div>
                    <div className="text-sm text-muted-foreground">13% du total</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités Prévues</CardTitle>
              <CardDescription>Module inventaire avancé avec suivi en temps réel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Gestion Stock</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Suivi par emplacement et bin</li>
                    <li>• Réservations et allocations</li>
                    <li>• Ajustements avec raisons</li>
                    <li>• Gestion lots/séries/numéros série</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Prévisions et Alertes</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Analyse vélocité et saisonnalité</li>
                    <li>• Suggestions réapprovisionnement</li>
                    <li>• Alertes stock critique</li>
                    <li>• Rapports inventaire cyclique</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Stock par Emplacement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Vue détaillée par entrepôt et emplacement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Mouvements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <RotateCcw className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Journal des entrées et sorties de stock</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting">
          <Card>
            <CardHeader>
              <CardTitle>Prévisions et Planification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Analyses prédictives et suggestions réapprovisionnement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
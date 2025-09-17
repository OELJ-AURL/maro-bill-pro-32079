import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Plus, 
  Upload, 
  Download,
  Search,
  Filter,
  BarChart3,
  AlertTriangle
} from "lucide-react";

export default function Products() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Catalogue Produits</h1>
          <p className="text-muted-foreground">Gestion centralisée des SKU, variantes et attributs</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Produit
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits Actifs</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12% ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SKU Top Vente</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Dans le top 20%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Conversion</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2%</div>
            <p className="text-xs text-muted-foreground">Vues → RFQ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fiches Incomplètes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Nécessitent attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="catalog" className="space-y-6">
        <TabsList>
          <TabsTrigger value="catalog">Catalogue</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="bulk-tools">Outils en Lot</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Liste des Produits</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </Button>
                  <Button size="sm" variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrer
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium">Chaise Bureau Ergonomique Pro</h4>
                      <p className="text-sm text-muted-foreground">SKU: CHR-ERG-001 • Mobilier Bureau</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary">Actif</Badge>
                        <Badge variant="outline">€299.00</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">Stock: 245</div>
                    <div className="text-sm text-muted-foreground">MOQ: 10</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium">Bureau Réglable Électrique</h4>
                      <p className="text-sm text-muted-foreground">SKU: BUR-REG-002 • Mobilier Bureau</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary">Actif</Badge>
                        <Badge variant="outline">€599.00</Badge>
                        <Badge variant="destructive">Stock Faible</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">Stock: 5</div>
                    <div className="text-sm text-muted-foreground">MOQ: 5</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités Prévues</CardTitle>
              <CardDescription>Module catalogue complet avec outils de merchandising</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Gestion Produits</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Éditeur de fiche produit complet</li>
                    <li>• Gestion variantes et attributs</li>
                    <li>• Galerie média avec optimisation</li>
                    <li>• Codes HS et classification douanière</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Outils Avancés</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Import/Export CSV en masse</li>
                    <li>• Score de qualité des fiches</li>
                    <li>• Analyse performance par SKU</li>
                    <li>• Badges et étiquettes personnalisés</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Catégories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Organisation hiérarchique des catégories produits</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk-tools">
          <Card>
            <CardHeader>
              <CardTitle>Outils en Lot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Modifications en masse et import/export</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Catalogue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Analyses de performance et conversion</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
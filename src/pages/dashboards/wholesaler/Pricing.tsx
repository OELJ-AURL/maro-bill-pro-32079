import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp,
  Plus,
  Settings,
  Target,
  Percent
} from "lucide-react";

export default function Pricing() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tarification et Promotions</h1>
          <p className="text-muted-foreground">B2B avec tarifs par niveaux, remises volume et listes privées</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Liste
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Règles Tarifaires
          </Button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listes Actives</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 par groupe client</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marge Moyenne</CardTitle>
            <Percent className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.5%</div>
            <p className="text-xs text-muted-foreground">+2.1% ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promos Actives</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 se terminent bientôt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lift Promotionnel</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15%</div>
            <p className="text-xs text-muted-foreground">Volume vs baseline</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="price-lists" className="space-y-6">
        <TabsList>
          <TabsTrigger value="price-lists">Listes de Prix</TabsTrigger>
          <TabsTrigger value="rules">Règles Tarifaires</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="price-lists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Listes de Prix par Groupe Client</CardTitle>
              <CardDescription>Tarifs différenciés selon les segments et contrats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Standard - Général</h4>
                  <p className="text-sm text-muted-foreground">Liste par défaut pour nouveaux clients</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Actif</Badge>
                    <Badge variant="outline">1,247 produits</Badge>
                    <Badge variant="outline">MAD</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">456 clients</div>
                  <div className="text-sm text-muted-foreground">Marge: 35%</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Premium - Gros Volumes</h4>
                  <p className="text-sm text-muted-foreground">Remises pour commandes >50K MAD</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Actif</Badge>
                    <Badge variant="outline">1,247 produits</Badge>
                    <Badge variant="outline">MAD</Badge>
                    <Badge variant="destructive">-15% avg</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">23 clients</div>
                  <div className="text-sm text-muted-foreground">Marge: 22%</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Contrat Gouvernement 2024</h4>
                  <p className="text-sm text-muted-foreground">Tarifs négociés secteur public</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Actif</Badge>
                    <Badge variant="outline">345 produits</Badge>
                    <Badge variant="outline">MAD</Badge>
                    <Badge>Expire 31/12/24</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">8 clients</div>
                  <div className="text-sm text-muted-foreground">Marge: 18%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités Prévues</CardTitle>
              <CardDescription>Système de tarification B2B complet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Gestion des Prix</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Listes par groupe, contrat, devise</li>
                    <li>• Dates d'effet et expiration</li>
                    <li>• Paliers volumes et MOQ</li>
                    <li>• Prix plancher/plafond</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Contrôles et Gouvernance</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Approbation écarts importants</li>
                    <li>• Historique modifications</li>
                    <li>• Simulation prix client</li>
                    <li>• Règles automatiques</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Règles de Tarification</CardTitle>
              <CardDescription>Règles automatiques pour remises et paliers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Remise Volume Standard</h4>
                    <Badge variant="secondary">Actif</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Remises progressives selon quantité commandée
                  </p>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                        <span>10-49 unités:</span>
                      <span className="font-medium">5% remise</span>
                    </div>
                    <div className="flex justify-between">
                      <span>50-99 unités:</span>
                      <span className="font-medium">10% remise</span>
                    </div>
                    <div className="flex justify-between">
                      <span>100+ unités:</span>
                      <span className="font-medium">15% remise</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">MOQ Mobilier Bureau</h4>
                    <Badge variant="secondary">Actif</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Quantité minimum pour catégorie mobilier
                  </p>
                  <div className="text-sm">
                    <span>Minimum: <strong>5 unités</strong> pour tous les meubles</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions">
          <Card>
            <CardHeader>
              <CardTitle>Promotions Planifiées</CardTitle>
              <CardDescription>Campagnes promotionnelles avec suivi performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-green-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Rentrée Scolaire 2024</h4>
                    <Badge>En cours</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    20% sur mobilier scolaire • Expire le 30/09/2024
                  </p>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Commandes générées:</span>
                      <span className="font-medium">34</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Volume additionnel:</span>
                      <span className="font-medium">+18%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Black Friday B2B</h4>
                    <Badge variant="outline">Planifiée</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    15% sur tout le catalogue • Du 25/11 au 02/12/2024
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <span>Activation prévue dans 45 jours</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Tarifaire</CardTitle>
              <CardDescription>KPIs marges, adoption et cannibalisation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Analyses de performance des stratégies tarifaires</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Building2, 
  CreditCard, 
  MapPin,
  Plus,
  Search,
  MessageSquare,
  Calendar,
  TrendingUp,
  Clock
} from "lucide-react";

export default function Customers() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clients et CRM</h1>
          <p className="text-muted-foreground">Relations clients, listes privées et CRM léger avec segmentation</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Client
          </Button>
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients Actifs</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">487</div>
            <p className="text-xs text-muted-foreground">+23 ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Rétention</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">+3% cette année</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Délai Paiement Moyen</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28j</div>
            <p className="text-xs text-muted-foreground">Objectif: 30j</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fréquence Commandes</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.8x</div>
            <p className="text-xs text-muted-foreground">Par mois en moyenne</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="directory" className="space-y-6">
        <TabsList>
          <TabsTrigger value="directory">Répertoire</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="tasks">Tâches & Notes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clients Principaux</CardTitle>
              <CardDescription>Vue d'ensemble des relations client avec données clés</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium">TechCorp Solutions SARL</h4>
                    <p className="text-sm text-muted-foreground">Contact: Ahmed Benali • ahmed@techcorp.ma</p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Premium</Badge>
                      <Badge variant="outline">Casablanca</Badge>
                      <Badge>Paiement 30j</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">€45,680</div>
                  <div className="text-sm text-muted-foreground">Spend YTD</div>
                  <div className="text-sm text-green-600">Last order: 5j</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium">Université Hassan II</h4>
                    <p className="text-sm text-muted-foreground">Contact: Fatima El Mansouri • f.mansouri@uh2.ma</p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Éducation</Badge>
                      <Badge variant="outline">Casablanca</Badge>
                      <Badge variant="destructive">Paiement 60j</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">€128,450</div>
                  <div className="text-sm text-muted-foreground">Spend YTD</div>
                  <div className="text-sm text-orange-600">Last order: 45j</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium">StartupHub Rabat</h4>
                    <p className="text-sm text-muted-foreground">Contact: Youssef Tazi • y.tazi@startuphub.ma</p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Standard</Badge>
                      <Badge variant="outline">Rabat</Badge>
                      <Badge>Paiement 15j</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">€12,340</div>
                  <div className="text-sm text-muted-foreground">Spend YTD</div>
                  <div className="text-sm text-blue-600">Last order: 12j</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités Prévues</CardTitle>
              <CardDescription>CRM léger adapté aux besoins B2B</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Profils Client</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Adresses multiples (livraison/facturation)</li>
                    <li>• Tags et catégorisation personnalisés</li>
                    <li>• Liste de prix assignée</li>
                    <li>• Termes contractuels et documents</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Actions et Suivi</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Prix privés et exceptions MOQ</li>
                    <li>• Notes et tâches de suivi</li>
                    <li>• Messagerie intégrée</li>
                    <li>• Historique interactions complètes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments">
          <Card>
            <CardHeader>
              <CardTitle>Segmentation Client</CardTitle>
              <CardDescription>Groupes pour ciblage et niveaux de service différenciés</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Grands Comptes</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Clients:</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>CA moyen:</span>
                      <span className="font-medium">€89K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Marge:</span>
                      <span className="font-medium">22%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">PME Standard</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Clients:</span>
                      <span className="font-medium">234</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>CA moyen:</span>
                      <span className="font-medium">€15K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Marge:</span>
                      <span className="font-medium">35%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Secteur Public</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Clients:</span>
                      <span className="font-medium">45</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>CA moyen:</span>
                      <span className="font-medium">€67K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Marge:</span>
                      <span className="font-medium">18%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tâches et Suivi Client</CardTitle>
              <CardDescription>Notes, rappels et actions de suivi</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div class="p-4 border rounded-lg bg-yellow-50">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-medium">Relance TechCorp - Devis #2024-089</h4>
                    <Badge variant="secondary">Urgent</Badge>
                  </div>
                  <p class="text-sm text-muted-foreground mb-2">
                    Relancer Ahmed pour validation devis mobilier bureau - €15,400
                  </p>
                  <div class="flex justify-between text-sm">
                    <span>Échéance: Demain</span>
                    <Button size="sm">Contacter</Button>
                  </div>
                </div>

                <div class="p-4 border rounded-lg">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-medium">Renouvellement contrat Université</h4>
                    <Badge variant="outline">Normal</Badge>
                  </div>
                  <p class="text-sm text-muted-foreground mb-2">
                    Préparer proposition renouvellement contrat cadre 2025
                  </p>
                  <div class="flex justify-between text-sm">
                    <span>Échéance: Dans 15 jours</span>
                    <Button size="sm" variant="outline">Planifier</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Client</CardTitle>
              <CardDescription>Rétention cohorte, fréquence et comportement de paiement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Analyses comportementales et prédictives clients</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
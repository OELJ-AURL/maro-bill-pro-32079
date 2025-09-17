import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  FileText
} from "lucide-react";

export default function RFQs() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">RFQ et Devis</h1>
          <p className="text-muted-foreground">Gestion des demandes de devis et négociations</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Nouveau Devis
          </Button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RFQ Actives</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">En attente de réponse</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">+5% ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Réponse Moyen</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">Objectif: moins de 3h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devis Gagnés</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inbox" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inbox">Boîte de Réception</TabsTrigger>
          <TabsTrigger value="active">RFQ Actives</TabsTrigger>
          <TabsTrigger value="expired">Expirées</TabsTrigger>
          <TabsTrigger value="converted">Converties</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nouvelles Demandes de Devis</CardTitle>
              <CardDescription>RFQ reçues nécessitant une réponse rapide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Équipements Bureau - Lot #2024-001</h4>
                    <p className="text-sm text-muted-foreground">Demande pour 50 chaises ergonomiques + bureaux</p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Urgent</Badge>
                      <Badge variant="outline">€15,000 estimé</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Répondre</Button>
                    <Button size="sm" variant="outline">Détails</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Matériel Informatique - Lot #2024-002</h4>
                    <p className="text-sm text-muted-foreground">30 ordinateurs portables + accessoires</p>
                    <div className="flex gap-2">
                      <Badge variant="outline">€45,000 estimé</Badge>
                      <Badge variant="secondary">3 jours restants</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Répondre</Button>
                    <Button size="sm" variant="outline">Détails</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités Prévues</CardTitle>
              <CardDescription>Module RFQ complet avec outils de négociation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Gestion RFQ</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Inbox avec priorité et échéances</li>
                    <li>• Détails RFQ avec specs et quantités</li>
                    <li>• Éditeur de devis intégré</li>
                    <li>• Historique des négociations</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Conversion et KPIs</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Conversion en commande en 1 clic</li>
                    <li>• Suivi temps de réponse</li>
                    <li>• Analyse taux de gain</li>
                    <li>• Alertes d'expiration</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>RFQ Actives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>RFQ en cours de négociation</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expired">
          <Card>
            <CardHeader>
              <CardTitle>RFQ Expirées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>RFQ qui ont dépassé leur délai</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="converted">
          <Card>
            <CardHeader>
              <CardTitle>RFQ Converties en Commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>RFQ transformées avec succès</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
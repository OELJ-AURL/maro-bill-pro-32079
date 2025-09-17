import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  MessageSquare, 
  Clock, 
  AlertCircle,
  Search,
  Filter,
  Plus,
  Send,
  Paperclip,
  Users
} from "lucide-react";

export default function Messaging() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Messagerie et Inbox</h1>
          <p className="text-muted-foreground">Conversations liées aux RFQ et commandes avec templates et timers</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Message
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Non Lus</CardTitle>
            <Mail className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 urgents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Réponse Moyen</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2h</div>
            <p className="text-xs text-muted-foreground">Objectif: moins de 2h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA Breaches</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversations Actives</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+4 aujourd'hui</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inbox" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inbox">Boîte de Réception</TabsTrigger>
          <TabsTrigger value="threads">Conversations</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="sla">Suivi SLA</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Messages Récents</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="p-3 border rounded-lg bg-blue-50 cursor-pointer hover:bg-blue-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">TechCorp Solutions</span>
                      <Badge variant="destructive" className="text-xs">Urgent</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Question sur délai livraison RFQ #2024-089
                    </p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>RFQ • Il y a 15min</span>
                      <span className="text-red-500">⏰ 1h 45min</span>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">Université Hassan II</span>
                      <Badge variant="secondary" className="text-xs">Normal</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Modification commande CMD-2024-156
                    </p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Commande • Il y a 2h</span>
                      <span className="text-green-500">✓ Lu</span>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">StartupHub Rabat</span>
                      <Badge variant="outline" className="text-xs">Info</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Demande catalogue mise à jour
                    </p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Général • Il y a 1j</span>
                      <span>📎 1 pièce jointe</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>TechCorp Solutions - RFQ #2024-089</CardTitle>
                      <CardDescription>Ahmed Benali • ahmed@techcorp.ma</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="destructive">Urgent</Badge>
                      <Badge variant="outline">RFQ</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Ahmed Benali</span>
                      <span className="text-xs text-muted-foreground">Il y a 15 minutes</span>
                    </div>
                    <p className="text-sm">
                      Bonjour, j'aimerais avoir une mise à jour sur le délai de livraison pour notre demande de devis RFQ #2024-089. 
                      Nous avons une échéance importante fin de mois et devons confirmer rapidement.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs text-primary-foreground">M</span>
                      </div>
                      <span className="text-sm font-medium">Moi</span>
                      <span className="text-xs text-muted-foreground">Il y a 2 heures</span>
                    </div>
                    <p className="text-sm mb-3">
                      Bonjour Ahmed, merci pour votre demande. Nous pouvons confirmer un délai de livraison de 10-12 jours ouvrables 
                      pour l'ensemble des articles demandés. Le devis détaillé sera envoyé dans les prochaines heures.
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">Devis envoyé</Badge>
                    </div>
                  </div>

                  {/* Composer */}
                  <div className="border rounded-lg p-4 bg-background">
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Template</Button>
                        <Button size="sm" variant="outline">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </div>
                      <textarea 
                        className="w-full min-h-[100px] p-3 border rounded-md resize-none" 
                        placeholder="Tapez votre réponse..."
                      />
                      <div className="flex justify-between">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Brouillon</Button>
                          <Button size="sm" variant="outline">Note interne</Button>
                        </div>
                        <Button size="sm">
                          <Send className="h-4 w-4 mr-2" />
                          Envoyer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités Prévues</CardTitle>
              <CardDescription>Système de messagerie intégré avec gestion SLA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Gestion Conversations</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Threads liés aux RFQ et commandes</li>
                    <li>• Templates de réponses personnalisés</li>
                    <li>• Pièces jointes et citations</li>
                    <li>• Notes internes équipe</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Contrôles SLA</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Timers de réponse automatiques</li>
                    <li>• Escalation et assignation</li>
                    <li>• Accusés de réception</li>
                    <li>• Recherche et filtres avancés</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threads">
          <Card>
            <CardHeader>
              <CardTitle>Conversations par Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Vue organisée par RFQ, commandes et demandes générales</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Templates de Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Modèles de réponses pré-configurés pour efficacité</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sla">
          <Card>
            <CardHeader>
              <CardTitle>Suivi des SLA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Monitoring temps de réponse et respect des engagements</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
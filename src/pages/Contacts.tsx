import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2,
  AlertCircle,
  Users,
  Truck
} from "lucide-react";

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState("");

  const clients = [
    {
      id: 1,
      companyName: "Société Moderne SARL",
      contactName: "Ahmed Benali",
      email: "a.benali@moderne.ma",
      phone: "+212 5 22 45 67 89",
      ice: "001234567000123",
      isIceVerified: true,
      city: "Casablanca",
      type: "client"
    },
    {
      id: 2,
      companyName: "Entreprise Atlas SA",
      contactName: "Fatima Alaoui",
      email: "f.alaoui@atlas.ma",
      phone: "+212 5 37 89 12 34",
      ice: "002345678000234",
      isIceVerified: false,
      city: "Rabat",
      type: "client"
    },
  ];

  const suppliers = [
    {
      id: 3,
      companyName: "Fournisseur Tech SARL",
      contactName: "Omar Idrissi",
      email: "o.idrissi@techfour.ma",
      phone: "+212 5 24 56 78 90",
      ice: "003456789000345",
      isIceVerified: true,
      city: "Marrakech",
      type: "fournisseur"
    },
  ];

  const ContactCard = ({ contact }: { contact: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {contact.companyName}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Users className="h-4 w-4" />
              {contact.contactName}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant={contact.isIceVerified ? "default" : "destructive"}>
              {contact.isIceVerified ? (
                <CheckCircle2 className="h-3 w-3 mr-1" />
              ) : (
                <AlertCircle className="h-3 w-3 mr-1" />
              )}
              ICE {contact.isIceVerified ? "Vérifié" : "Non vérifié"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            {contact.email}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            {contact.phone}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {contact.city}
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-1">ICE:</p>
          <p className="font-mono text-sm">{contact.ice}</p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            Modifier
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            {contact.type === "client" ? "Nouvelle facture" : "Nouveau BC"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Clients & Fournisseurs</h1>
          <p className="text-muted-foreground">
            Gestion des contacts avec vérification ICE conforme B2B
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau contact
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email, ICE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{clients.length}</p>
                <p className="text-sm text-muted-foreground">Clients actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{suppliers.length}</p>
                <p className="text-sm text-muted-foreground">Fournisseurs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {[...clients, ...suppliers].filter(c => c.isIceVerified).length}
                </p>
                <p className="text-sm text-muted-foreground">ICE vérifiés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contacts Tabs */}
      <Tabs defaultValue="clients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clients">
            <Users className="h-4 w-4 mr-2" />
            Clients ({clients.length})
          </TabsTrigger>
          <TabsTrigger value="suppliers">
            <Truck className="h-4 w-4 mr-2" />
            Fournisseurs ({suppliers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => (
              <ContactCard key={client.id} contact={client} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((supplier) => (
              <ContactCard key={supplier.id} contact={supplier} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Compliance Notice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-900">Conformité ICE B2B</h3>
              <p className="text-sm text-orange-700 mt-1">
                L'ICE est obligatoire pour toutes les transactions B2B au Maroc. 
                Les contacts sans ICE vérifié peuvent affecter la déductibilité de la TVA.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
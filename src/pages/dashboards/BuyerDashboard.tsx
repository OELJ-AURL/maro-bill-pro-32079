import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BuyerDashboard() {
  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Tableau de bord Acheteur</h1>
        <p className="text-muted-foreground">Suivez vos commandes, fournisseurs et factures.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Commandes récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">—</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Factures à payer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">—</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fournisseurs suivis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">—</div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

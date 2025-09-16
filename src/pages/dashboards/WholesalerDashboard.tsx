import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WholesalerDashboard() {
  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Tableau de bord Fournisseur</h1>
        <p className="text-muted-foreground">Vue d'ensemble de vos ventes, stocks et conformité.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Commandes en attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">—</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Niveau de stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">—</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conformité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">—</div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

import { useOnboarding } from '@/hooks/useOnboarding';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, ShoppingCart, Check, ArrowRight } from 'lucide-react';

export default function RoleSelection() {
  const { handleSetUserRole, isLoading, completeStep } = useOnboarding();

  const handleRoleSelect = async (role: 'wholesaler' | 'buyer') => {
    const ok = await handleSetUserRole(role);
    if (ok) {
      await completeStep(1);
    }
  };
  const roles = [
    {
      id: 'wholesaler' as const,
      title: 'Grossiste / Fournisseur',
      description: 'Vous vendez des produits en gros à d\'autres entreprises',
      icon: Building2,
      features: [
        'Gestion d\'inventaire avancée',
        'E-facturation conforme',
        'Paiements sécurisés',
        'Vérification KYB complète',
        'Badge "Fournisseur Vérifié"'
      ],
      requirements: [
        'ICE (Identifiant Commun de l\'Entreprise)',
        'RC (Registre de Commerce)',
        'IF (Identifiant Fiscal)',
        'Documents légaux (RC, CNSS)',
        'Informations bancaires (RIB)'
      ]
    },
    {
      id: 'buyer' as const,
      title: 'Acheteur / Entreprise',
      description: 'Vous achetez des produits pour votre entreprise',
      icon: ShoppingCart,
      features: [
        'Catalogue de fournisseurs vérifiés',
        'Commandes simplifiées',
        'Paiements sécurisés',
        'E-facturation automatique',
        'Gestion des approbations'
      ],
      requirements: [
        'Informations de l\'entreprise',
        'ICE/RC (si applicable)',
        'Adresses de livraison',
        'Paramètres d\'achat'
      ]
    }
  ];

return (
    <div className="space-y-8">
      <div className="-mx-4 md:-mx-6 px-4 md:px-6 py-8 rounded-xl bg-gradient-to-br from-primary/5 via-background to-accent/10 border">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground">Choisissez votre rôle</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sélectionnez le type de compte qui correspond à votre activité. Cette sélection déterminera les fonctionnalités disponibles et les étapes de vérification requises.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {roles.map((role) => {
          const Icon = role.icon;
          
          return (
            <Card 
              key={role.id}
              className="relative hover:shadow-lg transition-all cursor-pointer group border-muted/60 hover:-translate-y-0.5"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="outline">
                    {role.id === 'wholesaler' ? 'B2B Seller' : 'B2B Buyer'}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{role.title}</CardTitle>
                <CardDescription className="text-base">
                  {role.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-primary">
                    ✓ Fonctionnalités incluses
                  </h4>
                  <ul className="space-y-1">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2 text-orange-700">
                    📋 Documents requis
                  </h4>
                  <ul className="space-y-1">
                    {role.requirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={() => handleRoleSelect(role.id)}
                  disabled={isLoading}
                  className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground"
                  size="lg"
                >
                  {isLoading ? (
                    "Initialisation..."
                  ) : (
                    <>
                      Sélectionner {role.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            <strong>Conformité légale :</strong> Ce processus d'onboarding respecte les réglementations marocaines 
            incluant la Loi 09-08 (protection des données), la Loi 53-05 (e-signature), 
            et les directives de Bank Al-Maghrib pour les services de paiement.
          </div>
        </div>
      </div>
    </div>
  );
}
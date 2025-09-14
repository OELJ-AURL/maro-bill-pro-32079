import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, ShoppingCart, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Content */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Business Manager Pro
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              La plateforme complète pour gérer vos factures, devis et e-commerce B2B au Maroc. 
              Conforme aux normes marocaines et optimisée pour les TPE/PME.
            </p>
          </div>

          {/* Main CTA */}
          <div className="mb-12">
            <Link to="/onboarding">
              <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300">
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-3">
              Configuration en 5 minutes • Essai gratuit • Sans engagement
            </p>
          </div>

          {/* User Types */}
          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
            <div className="bg-card/50 backdrop-blur border rounded-lg p-6 hover:bg-card/80 transition-colors">
              <Building2 className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Grossistes</h3>
              <p className="text-sm text-muted-foreground">
                Catalogue digital, e-commerce B2B, conformité ICE/RC
              </p>
            </div>
            <div className="bg-card/50 backdrop-blur border rounded-lg p-6 hover:bg-card/80 transition-colors">
              <ShoppingCart className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Acheteurs</h3>
              <p className="text-sm text-muted-foreground">
                Commandes simplifiées, suivi en temps réel, facturation
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Conforme ICE & RC</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>E-signature légale</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Support Darija/Français</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
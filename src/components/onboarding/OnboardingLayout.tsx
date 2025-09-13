import { ReactNode } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle } from 'lucide-react';

interface OnboardingLayoutProps {
  children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const { currentStep, totalSteps, steps, userRole } = useOnboarding();
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Configuration de votre compte</h1>
          <p className="text-muted-foreground">
            Onboarding {userRole === 'wholesaler' ? 'Grossiste' : 'Acheteur'}
          </p>
          {userRole && (
            <Badge variant="outline" className="mt-2">
              {userRole === 'wholesaler' ? '🏭 Grossiste' : '🛒 Acheteur'}
            </Badge>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Progression</CardTitle>
                <div className="space-y-2">
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Étape {currentStep} sur {totalSteps}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${
                        step.isActive
                          ? 'bg-primary/10 border border-primary/20'
                          : step.isCompleted
                          ? 'bg-muted/50'
                          : 'hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {step.isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle 
                            className={`h-5 w-5 ${
                              step.isActive ? 'text-primary' : 'text-muted-foreground'
                            }`} 
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm ${
                          step.isActive ? 'text-primary' : 'text-foreground'
                        }`}>
                          {step.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="min-h-[600px]">
              <CardContent className="p-8">
                {children}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
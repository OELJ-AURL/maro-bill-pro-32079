import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { WholesalerSidebar } from "@/components/WholesalerSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

interface WholesalerLayoutProps {
  children: React.ReactNode;
}

export function WholesalerLayout({ children }: WholesalerLayoutProps) {
  const { user, signOut } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Header */}
        <header className="fixed top-0 right-0 left-0 h-14 bg-background border-b border-border z-50 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="lg:hidden" />
            <h1 className="text-xl font-bold text-primary">Fournisseur Hub</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              {user?.email}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </header>

        {/* Sidebar */}
        <WholesalerSidebar />

        {/* Main content */}
        <main className="flex-1 pt-14 p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
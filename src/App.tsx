import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contacts"
        element={
          <ProtectedRoute>
            <Contacts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Catalogue Produits</h1>
              <p className="text-muted-foreground">Module en développement</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/quotes"
        element={
          <ProtectedRoute>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Devis</h1>
              <p className="text-muted-foreground">Module en développement</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoices"
        element={
          <ProtectedRoute>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Factures</h1>
              <p className="text-muted-foreground">Module en développement</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/credit-notes"
        element={
          <ProtectedRoute>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Avoirs</h1>
              <p className="text-muted-foreground">Module en développement</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchases"
        element={
          <ProtectedRoute>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Achats</h1>
              <p className="text-muted-foreground">Module en développement</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Paiements</h1>
              <p className="text-muted-foreground">Module en développement</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Projets</h1>
              <p className="text-muted-foreground">Module en développement</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Rapports</h1>
              <p className="text-muted-foreground">Module en développement</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/support"
        element={
          <ProtectedRoute>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Support</h1>
              <p className="text-muted-foreground">Module en développement</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Paramètres</h1>
              <p className="text-muted-foreground">Module en développement</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
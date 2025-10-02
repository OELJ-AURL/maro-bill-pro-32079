import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import VerificationPending from "./pages/VerificationPending";
import Dashboard from "./pages/Dashboard";
import WholesalerDashboard from "./pages/dashboards/WholesalerDashboard";
import BuyerDashboard from "./pages/dashboards/BuyerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VerifyOrganization from "./pages/admin/VerifyOrganization";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [onboardingStatus, setOnboardingStatus] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    const checkStatus = async () => {
      try {
        // Check admin status
        const { data: adminData } = await supabase.rpc('is_admin', { 
          check_user_id: user.id 
        });
        setIsAdmin(!!adminData);

        // Check onboarding status
        const { data: onboardingData, error } = await supabase
          .from('onboarding_progress')
          .select('status, user_role, organization_id, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        // If onboarding exists, check organization verification status
        if (onboardingData?.organization_id) {
          const { data: orgData } = await supabase
            .from('organizations')
            .select('verification_status, onboarding_status')
            .eq('id', onboardingData.organization_id)
            .single();

          setOnboardingStatus({
            ...onboardingData,
            orgVerificationStatus: orgData?.verification_status,
            orgOnboardingStatus: orgData?.onboarding_status,
          });
        } else {
          setOnboardingStatus(onboardingData);
        }
      } catch (error) {
        console.error('Error checking status:', error);
        setOnboardingStatus(null);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkStatus();
  }, [user]);

  if (loading || checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const currentPath = window.location.pathname;

  // Admin routes
  if (isAdmin && !currentPath.startsWith('/admin')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Redirect to onboarding if not started or in progress
  if (!isAdmin && (!onboardingStatus || onboardingStatus.status === 'in_progress') && currentPath !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // Redirect to verification pending page if completed but not verified
  if (!isAdmin && onboardingStatus?.status === 'completed' && 
      onboardingStatus?.orgVerificationStatus !== 'verified' &&
      currentPath !== '/verification-pending') {
    return <Navigate to="/verification-pending" replace />;
  }

  // Redirect to appropriate dashboard after verification
  if (!isAdmin && onboardingStatus?.status === 'completed' && 
      onboardingStatus?.orgVerificationStatus === 'verified' &&
      (currentPath === '/' || currentPath === '/auth' || currentPath === '/dashboard' || 
       currentPath === '/onboarding' || currentPath === '/verification-pending')) {
    return <Navigate to={`/dashboard/${onboardingStatus.user_role}`} replace />;
  }

  return <Layout>{children}</Layout>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) return;

    const checkAdmin = async () => {
      try {
        const { data } = await supabase.rpc('is_admin', { 
          check_user_id: user.id 
        });
        setIsAdmin(!!data);
      } catch (error) {
        console.error('Error checking admin:', error);
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    };

    checkAdmin();
  }, [user]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/verification-pending" element={<VerificationPending />} />
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/verify/:id"
        element={
          <AdminRoute>
            <VerifyOrganization />
          </AdminRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/wholesaler"
        element={
          <ProtectedRoute>
            <WholesalerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/buyer"
        element={
          <ProtectedRoute>
            <BuyerDashboard />
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
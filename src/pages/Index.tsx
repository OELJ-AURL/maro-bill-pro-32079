import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import HeroSection from '@/components/landing/HeroSection';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user) return;

    const checkUserStatus = async () => {
      try {
        // Check if user is admin
        const { data: isAdminData } = await supabase.rpc('is_admin', { 
          check_user_id: user.id 
        });

        if (isAdminData) {
          navigate('/admin/dashboard');
          return;
        }

        // Check onboarding status
        const { data: onboardingData } = await supabase
          .from('onboarding_progress')
          .select('status, user_role')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!onboardingData || onboardingData.status === 'pending' || onboardingData.status === 'in_progress') {
          navigate('/onboarding');
        } else if (onboardingData.status === 'completed') {
          navigate(`/dashboard/${onboardingData.user_role}`);
        }
      } catch (error) {
        console.error('Error checking user status:', error);
      }
    };

    checkUserStatus();
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection />
    </div>
  );
};

export default Index;

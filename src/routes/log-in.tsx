import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import LogIn from '../components/LogIn'

export const Route = createFileRoute('/log-in')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { supabase } = await import('../lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          navigate({ to: '/builder' });
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    checkAuth();
  }, [navigate]);

  return <LogIn />
}

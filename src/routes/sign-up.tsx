import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import SignUp from '../components/SignUp'

export const Route = createFileRoute('/sign-up')({
  component: SignUpPage,
})

function SignUpPage() {
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

  return <SignUp />
}

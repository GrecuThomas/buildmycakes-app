import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { supabase } from '../lib/supabase';

export const Route = createFileRoute('/account')({
  beforeLoad: async () => {
    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw redirect({
        to: '/log-in',
      });
    }

    return { user };
  },
  component: AccountLayout,
});

function AccountLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getSubscriptionDetails } from '../server/stripe.functions';
import { Pricing } from '../components/Pricing_Standalone';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export const Route = createFileRoute('/pricing-checkout')({
  component: PricingCheckoutPage,
});

function PricingCheckoutPage() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { supabase } = await import('../lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log('Session check:', !!session?.access_token);

        if (session?.access_token) {
          const response = await getSubscriptionDetails({ data: { authToken: session.access_token } });
          console.log('Subscription details:', response);
          
          if (response.subscription) {
            const priceId = response.subscription.stripe_price_id;
            const proSubscriptionPriceId = 'price_1TDLuXF6w6kZyHeYz3sm9um5';
            
            console.log('Price ID:', priceId, 'Expected:', proSubscriptionPriceId);
            
            if (priceId === proSubscriptionPriceId) {
              console.log('Redirecting to /subscription');
              navigate({ to: '/subscription' });
              return;
            }
          }
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkSubscription();
  }, [navigate]);

  if (isChecking) {
    return null;
  }

  return (
    <div>
      <Navigation tab="Pricing" />
      <Pricing />
      <Footer />
    </div>
  );
}

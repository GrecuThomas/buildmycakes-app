import { createFileRoute } from '@tanstack/react-router';
import { Pricing } from '../components/Pricing_Standalone';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export const Route = createFileRoute('/pricing-checkout')({
  component: PricingCheckoutPage,
});

function PricingCheckoutPage() {
  return (
    <div>
      <Navigation tab="Pricing" />
      <Pricing />
      <Footer />
    </div>
  );
}

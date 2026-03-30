import { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  priceId: string;
  description: string;
  features: string[];
  popular?: boolean;
}

// Parse **text** syntax and render as bold
const parseFeatureText = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

// Replace these with your actual Stripe price IDs
const PRICING_TIERS: PricingTier[] = [
  {
    id: 'basic',
    name: 'The Hobbyist',
    price: 0,
    priceId: 'price_1234567890', // Get from Stripe Dashboard
    description: 'Perfect for practicing your designs or planning a one-off family celebration. All the right tools in the right place, at no cost',
    features: [
      '**Full Design Suite**: Access to all tier shapes, sizes, and decoration tools.',
      '**Standard Export**: Save your sketch as a standard-resolution PNG.',
      '**Ad-Supported**: Helps us keep the lights on while you build.',
      '**"Draft" Watermark**: A subtle overlay on your canvas and final exports.',
      '**Ad-Wall on Export**: A short 15-second wait to generate your final file.',
    ],
  },
  {
    id: 'standard',
    name: 'The 24-Hour Sprint',
    price: 2.00,
    priceId: 'price_1TEQpIF6w6kZyHeYzgaYvyTi', // Get from Stripe Dashboard
    description: 'Ideal for the baker with a big client meeting tomorrow. Get everything you need for the price of a cupcake.',
    popular: true,
    features: [
      '**24h All-Access Pass**: Every "Pro" feature unlocked for a full day.',
      '**Zero Advertisements**: No distractions while you\'re in the creative zone.',
      '**No Watermarks**: Clean, professional sketches that look great in a portfolio.',
      '**Professional Exports**: High-resolution PDF or SVG files ready for printing or emailing to clients.',
      '**Instant Downloads**: Skip the export timer and get your files immediately.',
    ],
  },
  {
    id: 'pro',
    name: 'The Master Baker',
    price: 5.00,
    priceId: 'price_1TDLuXF6w6kZyHeYz3sm9um5', // Get from Stripe Dashboard
    description: 'For the busy pro who designs cakes every week. The ultimate value for your business. Get everything you need for the price of a cupcake.',
    features: [
      '**Unlimited Pro Design**: Everything in the 24h Pass, but permanent.',
      '**Priority Support**: Have a feature request? You\'re at the top of our list.',
      '**Save & Edit**: (Future Feature) Save your designs to your account to edit them later.',
      '**Client Branding**: (Future Feature) Add your own bakery logo to the final export instead of ours.',
      '**Cancel Anytime**: No long-term contracts; stay as long as you\'re baking!',
    ],
  },
];

export const Pricing = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);

  // Fetch user and subscription status on mount
  useEffect(() => {
    const fetchUserAndSubscription = async () => {
      try {
        const { supabase } = await import('../lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch subscription details using server function
          const { getSubscriptionDetails } = await import('../server/stripe.functions');
          const response = await getSubscriptionDetails({ data: { authToken: session.access_token } });
          
          console.log('Subscription response:', response);
          console.log('Subscription object:', response.subscription);
          
          if (response.subscription) {
            setCurrentSubscription(response.subscription);
          }
        }
      } catch (error) {
        console.error('Error fetching user/subscription:', error);
      }
    };

    fetchUserAndSubscription();
  }, []);

  const handleSubscribe = async (priceId: string) => {
    try {
      setIsLoading(priceId);

      // Get auth token
      const { supabase } = await import('../lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        alert('Please log in to subscribe.');
        setIsLoading(null);
        return;
      }

      // Call checkout API with auth header
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to start checkout. ${error instanceof Error ? error.message : 'Please try again.'}`);
      setIsLoading(null);
    }
  };

  const handleBuildNow = async () => {
    await router.navigate({ to: '/builder' });
  };

  const handleUpgrade = async (priceId: string) => {
    await handleSubscribe(priceId);
  };

  const handleManageSubscription = async () => {
    await router.navigate({ to: '/subscription' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-slate-600">
          Choose the perfect plan for your cake design journey
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {PRICING_TIERS.map((tier) => {
          const isCurrentPlan = currentSubscription?.stripe_price_id === tier.priceId;
          console.log(`Tier: ${tier.name}, priceId: ${tier.priceId}, currentPrice_id: ${currentSubscription?.stripe_price_id}, isCurrentPlan: ${isCurrentPlan}`);
          
          return (
            <div
              key={tier.id}
              className={`relative rounded-3xl transition-all duration-300 ${
                tier.popular
                  ? 'border-2 border-blue-600 shadow-2xl scale-105 bg-white'
                  : 'border border-slate-200 shadow-lg bg-white hover:shadow-xl'
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && !isCurrentPlan && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Tier Name */}
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{tier.name}</h2>
                <p className="text-slate-600 text-sm mb-6">{tier.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-5xl font-bold text-slate-900">${tier.price}</span>
                  {tier.id !== 'standard' && <span className="text-slate-600 ml-2">/month</span>}
                </div>

                {/* Subscribe Button */}
                <button
                  onClick={() => {
                    if (tier.id === 'basic') {
                      handleBuildNow();
                    } else if (isCurrentPlan && tier.id !== 'basic') {
                      handleManageSubscription();
                    } else if (currentSubscription && tier.id === 'pro') {
                      // User has a subscription (likely $2) and clicking on $5, show Upgrade
                      handleUpgrade(tier.priceId);
                    } else {
                      handleSubscribe(tier.priceId);
                    }
                  }}
                  disabled={isLoading === tier.priceId}
                  className={`w-full py-3 rounded-xl font-bold transition-all mb-8 flex items-center justify-center gap-2 ${
                    isCurrentPlan && tier.id !== 'basic'
                      ? 'bg-slate-100 text-slate-900 cursor-pointer hover:bg-slate-200'
                      : tier.popular
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:translate-y-[-2px]'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading === tier.priceId ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrentPlan && tier.id !== 'basic' ? (
                    'Manage'
                  ) : currentSubscription && !isCurrentPlan && tier.id === 'pro' ? (
                    'Upgrade Now'
                  ) : tier.id === 'basic' ? (
                    'Build Now'
                  ) : (
                    'Subscribe Now'
                  )}
                </button>

                {/* Features List */}
                <div className="space-y-4">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{parseFeatureText(feature)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ or Additional Info */}
      <div className="max-w-2xl mx-auto mt-20">
        <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          Frequently Asked Questions
        </h3>
        <div className="space-y-6">
          <details className="border border-slate-200 rounded-lg p-6 open:bg-blue-50">
            <summary className="font-bold text-slate-900 cursor-pointer">
              Can I change my plan later?
            </summary>
            <p className="mt-4 text-slate-700">
              Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.
            </p>
          </details>

          <details className="border border-slate-200 rounded-lg p-6 open:bg-blue-50">
            <summary className="font-bold text-slate-900 cursor-pointer">
              Is there a free trial?
            </summary>
            <p className="mt-4 text-slate-700">
              Yes, we offer free functionality if you register with a free account. You can use the builder and save up to 2 designs with the free plan. No credit card is required to get started!
            </p>
          </details>

          <details className="border border-slate-200 rounded-lg p-6 open:bg-blue-50">
            <summary className="font-bold text-slate-900 cursor-pointer">
              What payment methods do you accept?
            </summary>
            <p className="mt-4 text-slate-700">
              We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
};

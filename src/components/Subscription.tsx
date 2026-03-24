import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, CreditCard, Calendar, Check, AlertCircle } from "lucide-react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { getSubscriptionDetails } from "../server/stripe.functions";

interface SubscriptionData {
  hasPayment: boolean;
  subscription: any;
  paymentMethods: any[];
}

const Subscription = () => {
  console.log('[Subscription Component] Rendering...');
  const router = useRouter();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        console.log('[Subscription useEffect] Running...');
        setIsLoading(true);
        setError('');
        
        // Get the current session with auth token
        const { supabase } = await import('../lib/supabase');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('[Subscription] Got session:', session?.user?.id, 'Error:', sessionError);
        
        if (!session?.access_token) {
          console.log('[Subscription] No session, redirecting to login');
          await router.navigate({ to: '/log-in' });
          return;
        }
        
        console.log('[Subscription] Fetching subscription details with token...');
        const response = await getSubscriptionDetails({ data: { authToken: session.access_token } });
        console.log('[Subscription] Got response:', response);
        
        setSubscriptionData(response);
      } catch (err: any) {
        console.error('[Subscription] Caught error:', err);
        
        // If it's an auth error, redirect to login
        if (err.message?.includes('Not authenticated') || err.message?.includes('auth')) {
          await router.navigate({ to: '/log-in' });
          return;
        }
        
        setError(err.message || 'Failed to load subscription');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [router]);

  const formatDate = (date: string | Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCardBrandIcon = (brand: string | undefined) => {
    if (!brand) return '💳';
    const brandLower = brand.toLowerCase();
    if (brandLower === 'visa') return '🟦';
    if (brandLower === 'mastercard') return '🟧';
    if (brandLower === 'amex') return '🟩';
    if (brandLower === 'discover') return '🟪';
    return '💳';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navigation tab="Subscription" />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.navigate({ to: '/' })}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Subscription</h1>
          <p className="text-slate-600">Manage your subscription and billing information</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-sm mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-96">
            <div className="text-slate-500">Loading subscription information...</div>
          </div>
        )}

        {/* Content */}
        {!isLoading && subscriptionData && (
          <div className="space-y-6">
            {/* No Subscription State */}
            {!subscriptionData.hasPayment ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="text-slate-400" size={32} />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">No Active Subscription</h2>
                <p className="text-slate-600 mb-6">You don't have an active subscription yet. Upgrade your account to access premium features.</p>
                <button
                  onClick={() => router.navigate({ to: '/pricing-checkout' })}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  View Plans
                </button>
              </div>
            ) : (
              <>
                {/* Subscription Status Card */}
                {subscriptionData.subscription && (
                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Active Subscription</h2>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-green-700 capitalize">
                            {subscriptionData.subscription.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
                      {/* Current Period / Valid Until */}
                      {subscriptionData.subscription.stripe_subscription_id?.startsWith('onetime_') ? (
                        <div>
                          <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Valid Until</h3>
                          <div className="flex items-center gap-2 text-slate-700">
                            <Calendar size={16} className="text-slate-400" />
                            <span className="text-sm font-medium">
                              {formatDate(subscriptionData.subscription.current_period_end)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Current Billing Period</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-slate-700">
                              <Calendar size={16} className="text-slate-400" />
                              <span className="text-sm">
                                {formatDate(subscriptionData.subscription.current_period_start)} to{' '}
                                {formatDate(subscriptionData.subscription.current_period_end)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Next Billing Date - Only show for recurring subscriptions */}
                      {!subscriptionData.subscription.stripe_subscription_id?.startsWith('onetime_') && (
                        <div>
                          <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Next Billing Date</h3>
                          <div className="flex items-center gap-2 text-slate-700">
                            <Calendar size={16} className="text-slate-400" />
                            <span className="text-sm font-medium">
                              {formatDate(subscriptionData.subscription.current_period_end)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Expiration Status */}
                      {subscriptionData.subscription.cancel_at_period_end && (
                        <div className="md:col-span-2 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                          <AlertCircle className="text-amber-600 mt-0.5 flex-shrink-0" size={18} />
                          <div>
                            <p className="font-medium text-amber-900">Subscription Cancellation Scheduled</p>
                            <p className="text-sm text-amber-800">Your subscription will be canceled on {formatDate(subscriptionData.subscription.current_period_end)} and will not be renewed.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Payment Methods */}
                {subscriptionData.paymentMethods.length > 0 && (
                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Payment Methods</h2>
                    <div className="space-y-3">
                      {subscriptionData.paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-lg">
                          <span className="text-2xl">{getCardBrandIcon(method.brand)}</span>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 capitalize">
                              {method.brand} •••• {method.last4}
                            </p>
                            <p className="text-sm text-slate-500">
                              Expires {method.expMonth}/{method.expYear}
                            </p>
                          </div>
                          <Check className="text-green-600" size={20} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Payment Method */}
                {subscriptionData.paymentMethods.length === 0 && subscriptionData.subscription && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 flex items-start gap-3">
                    <AlertCircle className="text-amber-600 mt-0.5 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-medium text-amber-900">No Payment Method</p>
                      <p className="text-sm text-amber-800">Please add a payment method to continue your subscription.</p>
                    </div>
                  </div>
                )}

                {/* Billing Portal Link */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-2">Manage Your Billing</h3>
                  <p className="text-sm text-blue-800 mb-4">Access the Stripe billing portal to update payment methods, change plans, and more.</p>
                  <button
                    onClick={() => {
                      // TODO: Implement billing portal redirect
                      alert('Billing portal coming soon');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Open Billing Portal
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Subscription;

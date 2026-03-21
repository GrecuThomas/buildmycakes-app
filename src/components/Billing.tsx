import { useEffect, useState } from 'react';
import { CreditCard, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Subscription {
  id: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export const Billing = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isManagingBilling, setIsManagingBilling] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadSubscription();
  }, []);

  const getAuthToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  const loadSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/subscription', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load subscription');
      }

      const data = await response.json();
      setSubscription(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load subscription';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      setIsManagingBilling(true);
      setError(null);

      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/portal-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to manage billing';
      setError(errorMessage);
    } finally {
      setIsManagingBilling(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    if (!window.confirm('Are you sure you want to cancel your subscription? You will lose access at the end of your billing period.')) {
      return;
    }

    try {
      setIsCanceling(true);
      setError(null);

      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.stripe_subscription_id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      setSuccess('Subscription canceled. You will have access until the end of your billing period.');
      await loadSubscription();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel subscription';
      setError(errorMessage);
    } finally {
      setIsCanceling(false);
    }
  };

  if (isLoading && !subscription) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Billing & Subscription</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {subscription ? (
          <div className="space-y-6">
            {/* Active Subscription Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Active Subscription</h2>
                    <p className="text-slate-600">You have an active subscription</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full font-medium text-sm ${
                  subscription.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : subscription.status === 'past_due'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </span>
              </div>

              {/* Billing Period */}
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-900">Current Billing Period</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Start Date</p>
                    <p className="font-bold text-slate-900">
                      {new Date(subscription.current_period_start).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">End Date</p>
                    <p className="font-bold text-slate-900">
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cancel Info */}
              {subscription.cancel_at_period_end && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-700 font-medium">
                    Your subscription is scheduled to cancel at the end of your billing period.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleManageBilling}
                  disabled={isManagingBilling}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isManagingBilling ? (
                    <>
                      <Loader2 className="w-5 h-5 inline animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    'Manage Billing'
                  )}
                </button>

                {!subscription.cancel_at_period_end && (
                  <button
                    onClick={handleCancelSubscription}
                    disabled={isCanceling}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isCanceling ? (
                      <>
                        <Loader2 className="w-5 h-5 inline animate-spin mr-2" />
                        Canceling...
                      </>
                    ) : (
                      'Cancel Subscription'
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment Methods</h2>
              <p className="text-slate-600 mb-6">
                Click "Manage Billing" above to update your payment methods and view billing history.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-12 text-center">
            <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Active Subscription</h2>
            <p className="text-slate-600 mb-8">You don't have an active subscription yet.</p>
            <a
              href="/pricing-checkout"
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all"
            >
              View Plans
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

import { createFileRoute } from '@tanstack/react-router';
import { Billing } from '../components/Billing';

export const Route = createFileRoute('/account/billing')({
  head: () => ({
    meta: [
      {
        title: 'Billing & Subscription - BuildMyCakes',
      },
      {
        name: 'description',
        content: 'Manage your subscription and billing information',
      },
    ],
  }),
  component: BillingPage,
  errorComponent: BillingErrorBoundary,
});

function BillingPage() {
  return <Billing />;
}

export function BillingErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Error Loading Billing</h1>
        <p className="text-slate-600 mb-6">{error?.message || 'An error occurred'}</p>
        <a href="/account/billing" className="text-blue-600 hover:text-blue-700 font-medium">
          Try again
        </a>
      </div>
    </div>
  );
}

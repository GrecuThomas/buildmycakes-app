import { createFileRoute } from '@tanstack/react-router';
import Subscription from '../components/Subscription';

export const Route = createFileRoute('/subscription')({
  component: Subscription,
  meta: () => [{
    title: 'Subscription - Build My Cakes',
    description: 'Manage your subscription and billing information'
  }]
});

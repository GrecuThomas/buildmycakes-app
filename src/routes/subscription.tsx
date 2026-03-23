import { createFileRoute } from '@tanstack/react-router';
import Subscription from '../components/Subscription';

console.log('[subscription.tsx] Route file loaded');

export const Route = createFileRoute('/subscription')({
  component: Subscription,
});

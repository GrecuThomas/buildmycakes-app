import { createFileRoute } from '@tanstack/react-router'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

export const Route = createFileRoute('/pricing')({
  component: Pricing,
})

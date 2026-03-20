import { createFileRoute } from '@tanstack/react-router'
import TermsOfService from '../components/TermsOfService'

export const Route = createFileRoute('/terms-of-service')({
  component: TermsOfServicePage,
})

function TermsOfServicePage() {
  return <TermsOfService />
}

import { createFileRoute } from '@tanstack/react-router'
import Support from '../components/Support'

export const Route = createFileRoute('/support')({
  component: SupportPage,
})

function SupportPage() {
  return <Support />
}

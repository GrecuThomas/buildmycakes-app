import { createFileRoute } from '@tanstack/react-router'
import GettingStarted from '../components/GettingStarted'

export const Route = createFileRoute('/getting-started')({
  component: GettingStartedPage,
})

function GettingStartedPage() {
  return <GettingStarted />
}

import { createFileRoute } from '@tanstack/react-router'
import LogIn from '../components/LogIn'

export const Route = createFileRoute('/log-in')({
  component: LoginPage,
})

function LoginPage() {
  return <LogIn />
}

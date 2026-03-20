import { createFileRoute } from '@tanstack/react-router'
import Tutorials from '../components/Tutorials'

export const Route = createFileRoute('/tutorials')({
  component: TutorialsPage,
})

function TutorialsPage() {
  return <Tutorials />
}

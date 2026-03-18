import { createFileRoute } from '@tanstack/react-router'
import CakeTierDesigner from '../components/CakeTierDesigner'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return <CakeTierDesigner />
}

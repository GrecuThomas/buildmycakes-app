import { createFileRoute } from '@tanstack/react-router'
import Roadmap from '../components/Roadmap'

export const Route = createFileRoute('/roadmap')({
  component: RoadmapPage,
})

function RoadmapPage() {
  return <Roadmap />
}
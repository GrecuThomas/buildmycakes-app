// routes/about.tsx
import { createFileRoute } from '@tanstack/react-router'
import CakeTierDesigner from '../components/CakeTierDesigner' // <--- REPLACE THIS

export const Route = createFileRoute('/builder')({
  validateSearch: (search: Record<string, unknown>) => {
    if (typeof search.projectId === 'string') {
      return { projectId: search.projectId }
    }

    return {}
  },
  component: Builder,
})

function Builder() {
  const { projectId } = Route.useSearch()
  return <CakeTierDesigner initialProjectId={projectId} /> // <--- RENDER PLACEHOLDER
}

// routes/about.tsx
import { createFileRoute } from '@tanstack/react-router'
import CakeTierDesigner from '../components/CakeTierDesigner' // <--- REPLACE THIS

export const Route = createFileRoute('/builder')({
  component: Builder,
})

function Builder() {
  return <CakeTierDesigner /> // <--- RENDER PLACEHOLDER
}

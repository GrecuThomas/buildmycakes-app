// routes/about.tsx
import { createFileRoute } from '@tanstack/react-router'
import Pricing_Page from '../components/Pricing_Page' // <--- REPLACE THIS

export const Route = createFileRoute('/about')({
  component: Pricing,
})

function Pricing() {
  return <Pricing_Page /> // <--- RENDER PLACEHOLDER
}

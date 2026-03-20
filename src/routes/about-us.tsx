import { createFileRoute } from '@tanstack/react-router'
import AboutUs from '../components/AboutUs'

export const Route = createFileRoute('/about-us')({
  component: AboutUsPage,
})

function AboutUsPage() {
  return <AboutUs />
}

import { createFileRoute } from '@tanstack/react-router'
import ContactUs from '../components/ContactUs'

export const Route = createFileRoute('/contact-us')({
  component: ContactUsPage,
})

function ContactUsPage() {
  return <ContactUs />
}

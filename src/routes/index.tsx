import { createFileRoute } from '@tanstack/react-router'
import Main_Page from '../components/Main_Page'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return <Main_Page />
}

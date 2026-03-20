import { createFileRoute } from '@tanstack/react-router'
import Blog from '../components/Blog'

export const Route = createFileRoute('/blog')({
  component: BlogPage,
})

function BlogPage() {
  return <Blog />
}

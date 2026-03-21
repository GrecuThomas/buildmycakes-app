import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Link } from '@tanstack/react-router'

import '../styles.css'

const GOOGLE_CLIENT_ID = '403400741162-roc9hheq3aineldf1fe2d4oaqnjvf88q.apps.googleusercontent.com'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Cake Tier Designer',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
        <p className="text-2xl text-slate-700 mb-8">Page Not Found</p>
        <p className="text-slate-600 mb-8">Sorry, the page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          {children}
        </GoogleOAuthProvider>
        <Scripts />
      </body>
    </html>
  )
}

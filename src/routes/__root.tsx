import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { GoogleOAuthProvider } from '@react-oauth/google'

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
})

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

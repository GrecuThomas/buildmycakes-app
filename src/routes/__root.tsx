import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { authStore } from '../lib/authStore'
import { readCache, writeCache, clearCache } from '../lib/subscriptionCache'
import { getSubscriptionDetails } from '../server/stripe.functions'

import '../styles.css'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

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
    links: [
      {
        rel: 'icon',
        href: '/favicon.ico',
        type: 'image/x-icon',
        sizes: 'any',
      },
      {
        rel: 'shortcut icon',
        href: '/favicon.ico',
        type: 'image/x-icon',
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
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1764282207738468" crossOrigin="anonymous"></script>
      </head>
      <body>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <AppInitializer />
          {children}
        </GoogleOAuthProvider>
        <Scripts />
      </body>
    </html>
  )
}

/**
 * Runs once after the first paint (useEffect).
 * The store is already seeded synchronously from localStorage by authStore.ts —
 * this component's only job is:
 *   1. Confirm the session is still valid / refresh an expired token.
 *   2. Background-revalidate the subscription tier if the cache is stale.
 *   3. Keep the store in sync for the lifetime of the tab via onAuthStateChange.
 */
function AppInitializer() {
  useEffect(() => {
    let unsubscribeAuth: (() => void) | undefined
    let sprintExpiryTimer: ReturnType<typeof setTimeout> | undefined

    /**
     * Revalidate subscription from the server and update the store + cache.
     * Called on init (cache miss), auth events, and sprint expiry.
     */
    async function revalidateSubscription(accessToken: string, userId: string) {
      try {
        const response = await getSubscriptionDetails({ data: { authToken: accessToken } })
        const newCache = writeCache(userId, response.subscription)
        authStore.setState(s => ({ ...s, tier: newCache.tier, subscription: response.subscription }))
        scheduleSprintExpiryCheck(response.subscription, accessToken, userId)
      } catch {
        // Keep current tier on network failure
      }
    }

    /**
     * If the user has an active sprint (24-hour) pass, schedule a re-check
     * exactly when it expires so the watermark/ads appear immediately — even
     * if the user keeps the page open past the expiry time.
     */
    function scheduleSprintExpiryCheck(subscription: any, accessToken: string, userId: string) {
      clearTimeout(sprintExpiryTimer)

      if (!subscription?.current_period_end) return

      // Only needed for sprint (the 24-hour one-time pass)
      const SPRINT_PRICE_ID = import.meta.env.VITE_STRIPE_SPRINT_PRICE_ID as string
      if (subscription.stripe_price_id !== SPRINT_PRICE_ID) return

      const expiresAt = new Date(subscription.current_period_end).getTime()
      const msUntilExpiry = expiresAt - Date.now()
      if (msUntilExpiry <= 0) return // already expired — next revalidation will catch it

      sprintExpiryTimer = setTimeout(() => {
        revalidateSubscription(accessToken, userId)
      }, msUntilExpiry + 1000) // +1 s to ensure the period has definitively ended
    }

    const init = async () => {
      const { supabase } = await import('../lib/supabase')

      // getSession() refreshes an expired token if possible and returns the
      // confirmed session. If it returns null the stored user was invalid.
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        // Stored session was invalid or expired beyond refresh — clear it.
        authStore.setState(s => ({ ...s, user: null, tier: 'free', subscription: null, isInitialized: true }))
      } else {
        // Session is confirmed. Background-revalidate subscription only if cache
        // is missing or expired (readCache returns null in that case).
        authStore.setState(s => ({ ...s, user: session.user, isInitialized: true }))
        const cached = readCache(session.user.id)
        if (!cached) {
          await revalidateSubscription(session.access_token, session.user.id)
        } else {
          // Cache hit — still schedule expiry check in case of sprint pass
          scheduleSprintExpiryCheck(
            authStore.state.subscription,
            session.access_token,
            session.user.id,
          )
        }
      }

      // Keep the store in sync for the lifetime of the tab.
      const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          if (event === 'SIGNED_OUT') {
            clearTimeout(sprintExpiryTimer)
            clearCache()
            authStore.setState(s => ({ ...s, user: null, tier: 'free', subscription: null }))
            return
          }

          if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && newSession?.user) {
            authStore.setState(s => ({ ...s, user: newSession.user }))
            const cached = readCache(newSession.user.id)
            if (cached) {
              authStore.setState(s => ({ ...s, tier: cached.tier }))
            }
            await revalidateSubscription(newSession.access_token, newSession.user.id)
          }
        }
      )

      unsubscribeAuth = () => authSub.unsubscribe()
    }

    init()
    return () => {
      clearTimeout(sprintExpiryTimer)
      unsubscribeAuth?.()
    }
  }, [])

  return null
}

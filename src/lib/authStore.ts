import { Store } from '@tanstack/store'
import { readCache, type SubscriptionTier } from './subscriptionCache'

export interface AuthState {
  /** Supabase user object, null when not logged in */
  user: any | null
  /** Resolved subscription tier — safe to read immediately (defaults to 'free') */
  tier: SubscriptionTier
  /** Raw subscription record from the DB, null until first fetch */
  subscription: any | null
  /**
   * True once the initial session + cache check has completed.
   * Pages can use this to know that `tier` is authoritative,
   * not just the safe default.
   */
  isInitialized: boolean
}

/**
 * Synchronously reads the Supabase session from localStorage.
 * Supabase JS v2 always persists the session as sb-{projectRef}-auth-token.
 * Scanning for the key means we don't need to know the project ref at compile time.
 * Returns null on the server (SSR) or if no session exists.
 */
function readSupabaseUserSync(): any | null {
  if (typeof window === 'undefined') return null
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('sb-') && key?.endsWith('-auth-token')) {
        const raw = localStorage.getItem(key)
        if (!raw) continue
        const session = JSON.parse(raw)
        return session?.user ?? null
      }
    }
  } catch {}
  return null
}

function getInitialState(): AuthState {
  const user = readSupabaseUserSync()
  const tier: SubscriptionTier = user?.id ? (readCache(user.id)?.tier ?? 'free') : 'free'
  return { user, tier, subscription: null, isInitialized: false }
}

export const authStore = new Store<AuthState>(getInitialState())

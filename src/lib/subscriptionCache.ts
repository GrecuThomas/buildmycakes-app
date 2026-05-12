export type SubscriptionTier = 'free' | 'sprint' | 'pro'

interface SubscriptionCache {
  userId: string
  tier: SubscriptionTier
  priceId: string | null
  currentPeriodEnd: string | null
  cachedAt: number
  /** Timestamp after which this cache entry must be discarded */
  validUntil: number
}

const CACHE_KEY = 'bmc-subscription-cache'

// Keep these in sync with Stripe price IDs used in Pricing_Standalone.tsx
const SPRINT_PRICE_ID = 'price_1TEQpIF6w6kZyHeYzgaYvyTi'
const PRO_PRICE_ID = 'price_1TDLuXF6w6kZyHeYz3sm9um5'

export function getTierFromPriceId(priceId: string | null): SubscriptionTier {
  if (!priceId) return 'free'
  if (priceId === SPRINT_PRICE_ID) return 'sprint'
  if (priceId === PRO_PRICE_ID) return 'pro'
  return 'free'
}

function getCacheValidUntil(tier: SubscriptionTier, currentPeriodEnd: string | null): number {
  const now = Date.now()
  if (tier === 'sprint' && currentPeriodEnd) {
    // Cache until the 24-hour pass actually expires — no need to re-check before then
    return new Date(currentPeriodEnd).getTime()
  }
  if (tier === 'pro') {
    // Revalidate every 10 minutes for monthly/yearly subs
    return now + 10 * 60 * 1000
  }
  // Logged-in free user: 2-minute TTL so an upgrade reflects quickly
  return now + 2 * 60 * 1000
}

/** Read cached subscription for a specific user. Returns null if missing or expired. */
export function readCache(userId: string): SubscriptionCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null

    const data: SubscriptionCache = JSON.parse(raw)

    // Cache belongs to a different user (e.g. switched accounts)
    if (data.userId !== userId) return null

    // Cache has expired
    if (Date.now() > data.validUntil) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }

    return data
  } catch {
    return null
  }
}

/** Write a new cache entry derived from the subscription object returned by getSubscriptionDetails. */
export function writeCache(userId: string, subscription: any | null): SubscriptionCache {
  const priceId: string | null = subscription?.stripe_price_id ?? null
  const tier = getTierFromPriceId(priceId)
  const currentPeriodEnd: string | null = subscription?.current_period_end ?? null

  const cache: SubscriptionCache = {
    userId,
    tier,
    priceId,
    currentPeriodEnd,
    cachedAt: Date.now(),
    validUntil: getCacheValidUntil(tier, currentPeriodEnd),
  }

  localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  return cache
}

/** Clear the cache (call on sign-out). */
export function clearCache(): void {
  localStorage.removeItem(CACHE_KEY)
}

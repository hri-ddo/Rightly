import { useCallback, useEffect, useState } from 'react'
import { formatApiError } from '../utils/formatError'

export interface AsyncResourceState<T> {
  data: T | null
  loading: boolean
  error: string | null
  retry: () => void
}

/**
 * Generic data-fetching hook with loading, error, and retry state.
 * Cancels stale in-flight updates when dependencies change or the component unmounts.
 */
export function useAsyncResource<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
): AsyncResourceState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const retry = useCallback(() => setTick((n) => n + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetcher()
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(formatApiError(err))
          setData(null)
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps])

  return { data, loading, error, retry }
}
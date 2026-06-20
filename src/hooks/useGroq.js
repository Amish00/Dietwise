import { useState, useCallback } from 'react'

export const useGroq = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const run = useCallback(async (apiFn, ...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiFn(...args)
      return result
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { run, loading, error, clearError: () => setError(null) }
}

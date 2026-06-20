import { useState } from 'react'
import { useDiet } from '../context/DietContext'
import { getDietAdvice, getRecipes, getMealPlan, analyzeFood } from '../api/groq'

export const useAI = () => {
  const { state } = useDiet()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const run = async (fn, ...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fn(...args, state.apiKey)
      return result
    } catch (err) {
      if (err.message === 'NO_KEY') {
        setError('Please add your Groq API key in Settings first.')
      } else {
        setError(err.message || 'AI request failed. Check your API key.')
      }
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    clearError: () => setError(null),
    hasKey: !!state.apiKey,
    fetchAdvice:  (profile, meals, totals, target) => run(getDietAdvice, profile, meals, totals, target),
    fetchRecipes: (ingredients, goal, profile)       => run(getRecipes, ingredients, goal, profile),
    fetchMealPlan:(profile)                          => run(getMealPlan, profile),
    analyzeFood:  (description)                      => run(analyzeFood, description),
  }
}

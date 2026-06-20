import { useMemo } from 'react'
import { useDiet } from '../context/DietContext'
import { sumMacros, todayStr } from '../utils/calculations'

export const useTodayMeals = () => {
  const { state } = useDiet()
  const today = todayStr()

  const todayMeals = useMemo(
    () => state.meals.filter(m => m.date === today),
    [state.meals, today]
  )
  const todayExercises = useMemo(
    () => state.exercises.filter(e => e.date === today),
    [state.exercises, today]
  )
  const totals      = useMemo(() => sumMacros(todayMeals), [todayMeals])
  const totalBurned = useMemo(
    () => todayExercises.reduce((s, e) => s + e.burned, 0),
    [todayExercises]
  )
  const netCalories = totals.cal - totalBurned
  const target      = state.profile?.dailyCalTarget || 2000
  const remaining   = target - totals.cal

  return { todayMeals, todayExercises, totals, totalBurned, netCalories, target, remaining }
}

import { useMemo } from 'react'
import { useDiet } from '../context/DietContext'
import { sumMacros, todayString, calcMacroTargets } from '../utils/calculations'

export const useMeals = () => {
  const { state, dispatch } = useDiet()
  const today = todayString()

  const todayMeals = useMemo(
    () => state.meals.filter(m => m.date === today),
    [state.meals, today]
  )

  const totals = useMemo(() => sumMacros(todayMeals), [todayMeals])

  const target = state.profile?.dailyCalTarget || 2000
  const macroTargets = calcMacroTargets(target, state.profile?.weight || 70)
  const remaining = target - totals.cal
  const burnedToday = state.exercises
    .filter(e => e.date === today)
    .reduce((s, e) => s + e.burned, 0)
  const netCalories = totals.cal - burnedToday

  const addMeal = (name, info, qty, mealType) => {
    dispatch({
      type: 'ADD_MEAL',
      payload: {
        id:       Date.now(),
        name:     qty > 1 ? `${qty}× ${name}` : name,
        mealType,
        calories: Math.round(info.cal  * qty),
        protein:  parseFloat((info.protein * qty).toFixed(1)),
        carbs:    parseFloat((info.carbs   * qty).toFixed(1)),
        fat:      parseFloat((info.fat     * qty).toFixed(1)),
        date:     today,
        time:     new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    })
  }

  const removeMeal   = (id) => dispatch({ type: 'REMOVE_MEAL',   payload: id })
  const clearToday   = ()   => dispatch({ type: 'CLEAR_TODAY_MEALS' })

  return {
    meals: state.meals,
    todayMeals,
    totals,
    target,
    macroTargets,
    remaining,
    burnedToday,
    netCalories,
    addMeal,
    removeMeal,
    clearToday,
  }
}

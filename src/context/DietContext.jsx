import { createContext, useContext, useReducer, useEffect } from 'react'
import { calcBMR, calcTDEE, calcDailyTarget, weeksToGoal } from '../utils/calculations'

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  profile:  null,
  meals:    [],
  exercises: [],
  groqApiKey: '',
  savedPlan: null,
  waterGlasses: 0,
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
const dietReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PROFILE': {
      const p = action.payload
      const bmr    = calcBMR(p.weight, p.height, p.age, p.gender)
      const tdee   = calcTDEE(bmr, p.activity)
      const target = calcDailyTarget(tdee, p.goalType)
      const weeks  = weeksToGoal(p.weight, p.targetWeight)
      return {
        ...state,
        profile: { ...p, bmr: Math.round(bmr), tdee, dailyCalTarget: target, weeksToGoal: weeks },
      }
    }
    case 'ADD_MEAL':
      return { ...state, meals: [...state.meals, action.payload] }
    case 'REMOVE_MEAL':
      return { ...state, meals: state.meals.filter(m => m.id !== action.payload) }
    case 'CLEAR_TODAY_MEALS': {
      const today = new Date().toDateString()
      return { ...state, meals: state.meals.filter(m => m.date !== today) }
    }
    case 'ADD_EXERCISE':
      return { ...state, exercises: [...state.exercises, action.payload] }
    case 'REMOVE_EXERCISE':
      return { ...state, exercises: state.exercises.filter(e => e.id !== action.payload) }
    case 'SET_API_KEY':
      return { ...state, groqApiKey: action.payload }
    case 'SET_SAVED_PLAN':
      return { ...state, savedPlan: action.payload }
    case 'SET_WATER':
      return { ...state, waterGlasses: action.payload }
    case 'HYDRATE':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const DietContext = createContext(null)

export const DietProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dietReducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem('dietwise_state')
      return saved ? { ...init, ...JSON.parse(saved) } : init
    } catch { return init }
  })

  // Persist to localStorage (keep only last 300 meals)
  useEffect(() => {
    const toSave = { ...state, meals: state.meals.slice(-300) }
    localStorage.setItem('dietwise_state', JSON.stringify(toSave))
  }, [state])

  return (
    <DietContext.Provider value={{ state, dispatch }}>
      {children}
    </DietContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useDiet = () => {
  const ctx = useContext(DietContext)
  if (!ctx) throw new Error('useDiet must be used within DietProvider')
  return ctx
}

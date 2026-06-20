// ─── BMR & TDEE ───────────────────────────────────────────────────────────────
export const calcBMR = (weight, height, age, gender) => {
  if (gender === 'male') return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
  return 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age
}

export const ACTIVITY_MULTIPLIERS = {
  sedentary:  { label: 'Sedentary (desk job, no exercise)',  value: 1.2   },
  light:      { label: 'Light (1–3x/week)',                  value: 1.375 },
  moderate:   { label: 'Moderate (3–5x/week)',               value: 1.55  },
  active:     { label: 'Active (6–7x/week)',                 value: 1.725 },
  veryactive: { label: 'Very Active (athlete)',              value: 1.9   },
}

export const calcTDEE = (bmr, activity) =>
  Math.round(bmr * (ACTIVITY_MULTIPLIERS[activity]?.value || 1.375))

export const calcDailyTarget = (tdee, goalType) => {
  if (goalType === 'lose')     return tdee - 500
  if (goalType === 'gain')     return tdee + 300
  return tdee
}

export const calcBMI = (weight, height) =>
  +(weight / ((height / 100) ** 2)).toFixed(1)

export const getBMILabel = (bmi) => {
  if (bmi < 18.5) return { label: 'Underweight', color: '#E8A838' }
  if (bmi < 25)   return { label: 'Normal',       color: '#6DBE47' }
  if (bmi < 30)   return { label: 'Overweight',   color: '#E8A838' }
  return               { label: 'Obese',           color: '#E85538' }
}

export const weeksToGoal = (current, target) =>
  Math.ceil(Math.abs(current - target) / 0.5)

export const calcProteinTarget = (weight) => Math.round(weight * 1.6)
export const calcCarbTarget    = (cal)    => Math.round((cal * 0.4) / 4)
export const calcFatTarget     = (cal)    => Math.round((cal * 0.3) / 9)

// ─── Meal Totals ──────────────────────────────────────────────────────────────
export const sumMacros = (meals) =>
  meals.reduce(
    (acc, m) => ({
      cal:     acc.cal     + (m.calories || 0),
      protein: acc.protein + (m.protein  || 0),
      carbs:   acc.carbs   + (m.carbs    || 0),
      fat:     acc.fat     + (m.fat      || 0),
    }),
    { cal: 0, protein: 0, carbs: 0, fat: 0 }
  )

// ─── Exercise Burn (MET formula) ─────────────────────────────────────────────
export const calcBurn = (calPerMin, minutes, weightKg) =>
  Math.round(calPerMin * minutes * (weightKg / 70))

// ─── Date helpers ─────────────────────────────────────────────────────────────
export const todayStr = () => new Date().toDateString()

export const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })

import { useState } from 'react'
import { CalendarDays, Sparkles, Save, RefreshCw, Clock, CheckCircle } from 'lucide-react'
import { useDiet } from '../context/DietContext'
import { useGroq } from '../hooks/useGroq'
import { getMealPlan } from '../api/groq'
import Card, { CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Alert from '../components/ui/Alert'
import Spinner from '../components/ui/Spinner'

const MEAL_STYLES = {
  breakfast: { bg:'bg-amber-50',  border:'border-amber-100', title:'text-amber-600',  label:'Breakfast', dot:'bg-amber-400' },
  lunch:     { bg:'bg-emerald-50',border:'border-emerald-100',title:'text-emerald-600',label:'Lunch',     dot:'bg-emerald-400' },
  dinner:    { bg:'bg-blue-50',   border:'border-blue-100',   title:'text-blue-600',   label:'Dinner',    dot:'bg-blue-400' },
  snack:     { bg:'bg-purple-50', border:'border-purple-100', title:'text-purple-600', label:'Snack',     dot:'bg-purple-400' },
}

const MealCell = ({ mealKey, meal }) => {
  if (!meal) return null
  const s = MEAL_STYLES[mealKey]
  return (
    <div className={`${s.bg} border ${s.border} rounded-xl p-4 flex flex-col gap-1.5`}>
      <div className="flex items-center gap-1.5 mb-1">
        <div className={`w-2 h-2 rounded-full ${s.dot}`} />
        <p className={`text-xs font-bold uppercase tracking-wide ${s.title}`}>{s.label}</p>
      </div>
      <p className="text-sm font-bold text-gray-800 leading-tight">{meal.name}</p>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{meal.description}</p>
      <div className="flex items-center justify-between mt-1">
        <p className={`text-sm font-black ${s.title}`}>{meal.calories} kcal</p>
        {meal.prepTime && (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={10} />{meal.prepTime}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-400">P:{meal.protein}g · C:{meal.carbs}g · F:{meal.fat}g</p>
    </div>
  )
}

const MealPlans = () => {
  const { state, dispatch } = useDiet()
  const { profile, savedPlan } = state
  const { run, loading, error, clearError } = useGroq()
  const [currentPlan, setCurrentPlan] = useState(null)
  const [justSaved, setJustSaved]     = useState(false)

  const displayPlan = currentPlan || savedPlan

  const generate = async () => {
    if (!profile) return
    const data = await run(getMealPlan, profile)
    if (data?.days) setCurrentPlan(data)
  }

  const save = () => {
    if (!currentPlan) return
    dispatch({ type:'SET_SAVED_PLAN', payload:currentPlan })
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }

  if (!profile) return (
    <div className="text-center py-24">
      <CalendarDays size={48} className="mx-auto text-gray-200 mb-4" />
      <h2 className="text-2xl font-black text-gray-700 mb-3">Profile Required</h2>
      <p className="text-gray-400">Set up your profile first to get a personalized meal plan.</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <CalendarDays size={26} className="text-primary" /> 7-Day Meal Plan
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            AI-personalized for {profile.dailyCalTarget} kcal/day · {profile.goalType} goal
          </p>
        </div>
        <div className="flex gap-2">
          {currentPlan && (
            <Button variant="secondary" onClick={save} size="sm">
              {justSaved
                ? <><CheckCircle size={13} className="text-emerald-500" />Saved!</>
                : <><Save size={13} />Save Plan</>}
            </Button>
          )}
          <Button onClick={generate} disabled={loading} size="sm">
            {loading
              ? <Spinner size="sm" />
              : displayPlan
                ? <><RefreshCw size={13} />Regenerate</>
                : <><Sparkles size={13} />Generate Plan</>}
          </Button>
        </div>
      </div>

      {error && <Alert type="error" onClose={clearError}>{error}</Alert>}

      {savedPlan && !currentPlan && (
        <Alert type="info">
          Showing your saved plan. Click "Regenerate" for a fresh AI-generated plan.
        </Alert>
      )}

      {loading && (
        <Card className="py-24 text-center">
          <Spinner size="lg" text="AI is building your personalized 7-day meal plan..." />
        </Card>
      )}

      {!displayPlan && !loading && (
        <Card className="py-24 text-center">
          <CalendarDays size={48} className="mx-auto text-gray-200 mb-4" />
          <h3 className="text-xl font-black text-gray-700 mb-3">Ready to Generate</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Click the button above and AI will create a full week of healthy meals tailored to your {profile.dailyCalTarget} kcal daily budget and {profile.goalType} goal.
          </p>
          <Button onClick={generate}>
            <Sparkles size={14} />Generate My Plan
          </Button>
        </Card>
      )}

      {displayPlan && !loading && (
        <div className="space-y-5">
          {displayPlan.days?.map((day, di) => {
            const dayTotal  = Object.values(day.meals||{}).reduce((s,m) => s+(m?.calories||0), 0)
            const onTarget  = Math.abs(dayTotal - profile.dailyCalTarget) < 150
            return (
              <Card key={di}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-gray-900">{day.day}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Daily total:</span>
                    <Badge color={onTarget?'green':'amber'}>{dayTotal} kcal</Badge>
                    {onTarget && <Badge color="green">On target</Badge>}
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {['breakfast','lunch','dinner','snack'].map(k => (
                    <MealCell key={k} mealKey={k} meal={day.meals?.[k]} />
                  ))}
                </div>
              </Card>
            )
          })}

          {displayPlan.weeklyTips?.length > 0 && (
            <Card>
              <CardTitle>Weekly AI Tips</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {displayPlan.weeklyTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <CheckCircle size={14} className="text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
export default MealPlans

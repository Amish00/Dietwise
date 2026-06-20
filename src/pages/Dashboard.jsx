import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Flame, Target, TrendingDown, Droplets, Plus, Minus } from 'lucide-react'
import { useDiet } from '../context/DietContext'
import { useTodayMeals } from '../hooks/useTodayMeals'
import { calcProteinTarget, calcCarbTarget, calcFatTarget, getGreeting } from '../utils/calculations'
import { EXERCISES } from '../data/foodDatabase'
import Card, { CardTitle } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import CalorieRing from '../components/charts/CalorieRing'
import MacroBar from '../components/charts/MacroBar'
import WeeklyChart from '../components/charts/WeeklyChart'

const Stat = ({ icon, label, value, sub, color = 'text-primary' }) => (
  <Card className="flex items-center gap-4">
    <div className="text-2xl w-10 text-center">{icon}</div>
    <div>
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </Card>
)

const Dashboard = () => {
  const { state, dispatch } = useDiet()
  const { profile, waterGlasses } = state
  const { todayMeals, totals, totalBurned, netCalories, target, remaining } = useTodayMeals()
  const proteinTarget = profile ? calcProteinTarget(profile.weight) : 120
  const carbTarget    = calcCarbTarget(target)
  const fatTarget     = calcFatTarget(target)
  const burnNeeded    = Math.max(0, totals.cal - target)

  const weekData = useMemo(() => {
    const days  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    const today = new Date()
    return days.map((d, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (today.getDay() - i))
      const calories = state.meals.filter(m => m.date === date.toDateString()).reduce((s, m) => s + m.calories, 0)
      return { day: d, calories }
    })
  }, [state.meals])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            {getGreeting()}{profile?.name ? `, ${profile.name}` : ''} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {!profile && (
          <Link to="/profile"><Button variant="outline" size="sm">Setup Profile →</Button></Link>
        )}
      </div>

      {!profile && (
        <Alert type="warning">👤 Set up your profile to unlock personalized calorie targets and AI features.</Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon="🎯" label="Daily Target"  value={`${target} kcal`}    sub={`TDEE: ${profile?.tdee || '—'}`} />
        <Stat icon="🍽️" label="Eaten Today"   value={`${totals.cal} kcal`} sub={`${todayMeals.length} meals logged`}
          color={totals.cal > target ? 'text-red-500' : 'text-amber-500'} />
        <Stat icon="💪" label="Burned"         value={`${totalBurned} kcal`} sub="from exercise" color="text-emerald-600" />
        <Stat icon="⚖️" label="Net Calories"   value={`${netCalories} kcal`}
          sub={netCalories < target ? 'Under target ✓' : 'Over target'}
          color={netCalories < target ? 'text-emerald-600' : 'text-red-500'} />
      </div>

      {/* Main row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="flex flex-col items-center">
          <CardTitle>Calories Today</CardTitle>
          <CalorieRing eaten={totals.cal} target={target} size={190} />
          <div className="flex gap-2 mt-4 flex-wrap justify-center">
            <Badge color={totals.cal > target ? 'red' : 'purple'}>
              {totals.cal > target ? `${totals.cal - target} kcal over` : `${remaining} kcal remaining`}
            </Badge>
          </div>
        </Card>

        <Card>
          <CardTitle>Macronutrients</CardTitle>
          <MacroBar label="Protein" value={totals.protein} max={proteinTarget} color="#6366f1" />
          <MacroBar label="Carbs"   value={totals.carbs}   max={carbTarget}    color="#f59e0b" />
          <MacroBar label="Fat"     value={totals.fat}      max={fatTarget}     color="#ef4444" />
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100 text-center">
            {[['Protein', Math.round(totals.protein), '#6366f1'], ['Carbs', Math.round(totals.carbs), '#f59e0b'], ['Fat', Math.round(totals.fat), '#ef4444']].map(([l, v, c]) => (
              <div key={l}>
                <p className="text-lg font-black" style={{ color: c }}>{v}g</p>
                <p className="text-xs text-gray-400">{l}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Burn Suggestion</CardTitle>
          {burnNeeded > 0 ? (
            <div>
              <p className="text-sm text-gray-500 mb-3">
                <span className="text-red-500 font-bold">{burnNeeded} kcal over</span> budget. Try:
              </p>
              {EXERCISES.slice(0, 4).map(ex => (
                <div key={ex.name} className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-700">{ex.emoji} {ex.name}</span>
                  <Badge color="purple">{Math.round(burnNeeded / ex.calPerMin)} min</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-4xl mb-3">🎉</p>
              <p className="font-bold text-emerald-600">Within budget!</p>
              <p className="text-xs text-gray-400 mt-1">{remaining} kcal remaining today</p>
            </div>
          )}
        </Card>
      </div>

      {/* Water + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card>
          <CardTitle>💧 Water Intake</CardTitle>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-3xl font-black text-blue-500">{waterGlasses}</p>
              <p className="text-xs text-gray-400">of 8 glasses</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => dispatch({ type: 'SET_WATER', payload: Math.max(0, waterGlasses - 1) })}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <Minus size={14} />
              </button>
              <button onClick={() => dispatch({ type: 'SET_WATER', payload: Math.min(12, waterGlasses + 1) })}
                className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 flex items-center justify-center transition-colors">
                <Plus size={14} />
              </button>
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-all
                ${i < waterGlasses ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-300'}`}>💧</div>
            ))}
          </div>
          {waterGlasses >= 8 && <p className="text-xs text-emerald-600 font-semibold mt-2">✓ Daily goal reached!</p>}
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="mb-0">This Week</CardTitle>
            <div className="flex gap-3 text-xs text-gray-400">
              <span><span className="text-primary">■</span> Under</span>
              <span><span className="text-amber-500">■</span> Near</span>
              <span><span className="text-red-500">■</span> Over</span>
            </div>
          </div>
          <WeeklyChart data={weekData} target={target} />
        </Card>
      </div>

      {profile && (
        <Card>
          <CardTitle>Weight Journey</CardTitle>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-gray-400">Start</p>
              <p className="text-3xl font-black text-gray-800">{profile.weight} kg</p>
            </div>
            <div className="flex-1">
              <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 h-full bg-primary rounded-full" style={{ width: '8%' }} />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                <span>Just started</span>
                <span>~{profile.weeksToGoal} weeks to go</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Target</p>
              <p className="text-3xl font-black text-primary">{profile.targetWeight} kg</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-gray-100 text-center">
            <div><p className="text-xl font-black text-amber-500">{profile.weight - profile.targetWeight} kg</p><p className="text-xs text-gray-400">To Lose</p></div>
            <div><p className="text-xl font-black text-primary">{profile.weeksToGoal} wks</p><p className="text-xs text-gray-400">Estimated</p></div>
            <div><p className="text-xl font-black text-emerald-600">{profile.dailyCalTarget}</p><p className="text-xs text-gray-400">kcal/day</p></div>
          </div>
        </Card>
      )}
    </div>
  )
}
export default Dashboard

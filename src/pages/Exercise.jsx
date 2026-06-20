import { useState } from 'react'
import { Dumbbell, X, Flame, Timer, TrendingUp } from 'lucide-react'
import { useDiet } from '../context/DietContext'
import { useTodayMeals } from '../hooks/useTodayMeals'
import { EXERCISES } from '../data/foodDatabase'
import { calcBurn, todayStr } from '../utils/calculations'
import Card, { CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const TYPE_ICONS = { Cardio: '🏃', Strength: '🏋️', Flex: '🧘' }

const Exercise = () => {
  const { state, dispatch } = useDiet()
  const { profile } = state
  const { totals, totalBurned, target } = useTodayMeals()

  const [selected, setSelected] = useState(EXERCISES[0])
  const [mins, setMins]         = useState(30)

  const weight = profile?.weight || 75
  const today  = todayStr()
  const todayExercises = state.exercises.filter(e => e.date === today)
  const burned = calcBurn(selected.calPerMin, mins, weight)
  const netCal = totals.cal - totalBurned

  const log = () => {
    dispatch({ type:'ADD_EXERCISE', payload:{
      id: Date.now(), name: selected.name, emoji: selected.emoji,
      type: selected.type, mins, burned: calcBurn(selected.calPerMin, mins, weight),
      date: today, time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
    }})
  }

  const recommended = profile?.goalType === 'lose'
    ? [{ ex:EXERCISES[0],mins:45,note:'Daily minimum' },{ ex:EXERCISES[1],mins:30,note:'3×/week' },{ ex:EXERCISES[4],mins:30,note:'2×/week' },{ ex:EXERCISES[5],mins:20,note:'Daily' }]
    : [{ ex:EXERCISES[7],mins:45,note:'3×/week' },{ ex:EXERCISES[2],mins:20,note:'2×/week' },{ ex:EXERCISES[3],mins:40,note:'2×/week' },{ ex:EXERCISES[5],mins:20,note:'Daily' }]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Dumbbell size={26} className="text-primary" /> Exercise Tracker
        </h1>
        <p className="text-gray-400 text-sm mt-1">Log workouts and track your net calorie balance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          [Flame,    'Eaten Today',   `${totals.cal} kcal`,   totals.cal > target ? 'text-red-500'     : 'text-amber-500'],
          [TrendingUp,'Burned Today', `${totalBurned} kcal`,  'text-emerald-600'],
          [Timer,    'Net Calories',  `${netCal} kcal`,        netCal < target ? 'text-emerald-600' : 'text-red-500'],
        ].map(([Icon, label, value, color]) => (
          <Card key={label} className="flex items-center gap-3">
            <Icon size={20} className={`${color} shrink-0`} />
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
              <p className={`text-xl font-black ${color}`}>{value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Log */}
        <Card>
          <CardTitle>Log Exercise</CardTitle>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {EXERCISES.map(ex => (
              <button key={ex.name} onClick={() => setSelected(ex)}
                className={`p-3 rounded-xl border text-left transition-all
                  ${selected.name===ex.name ? 'bg-indigo-50 border-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                <p className="text-xl mb-1">{ex.emoji}</p>
                <p className="text-xs font-bold text-gray-800 leading-tight">{ex.name}</p>
                <p className="text-xs text-gray-400">{ex.calPerMin} kcal/min</p>
                <Badge color={ex.type==='Cardio'?'red':ex.type==='Strength'?'blue':'green'} className="mt-1 text-xs">
                  {ex.type}
                </Badge>
              </button>
            ))}
          </div>

          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Duration</label>
              <span className="text-lg font-black text-gray-800">{mins} min</span>
            </div>
            <input type="range" min={5} max={120} step={5} value={mins}
              onChange={e => setMins(Number(e.target.value))}
              className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5 min</span><span>120 min</span>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl mb-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Estimated burn</p>
              <p className="text-2xl font-black text-primary">{burned} <span className="text-sm font-semibold text-gray-400">kcal</span></p>
            </div>
            <div className="text-right text-xs text-gray-400">
              <p>{selected.name}</p>
              <p>{mins} min × {weight}kg</p>
            </div>
          </div>

          <Button full onClick={log}>
            <Flame size={14} /> Log {selected.name}
          </Button>
        </Card>

        {/* Today's log */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="mb-0">Today's Workouts</CardTitle>
            {totalBurned > 0 && <Badge color="green">−{totalBurned} kcal</Badge>}
          </div>

          {todayExercises.length === 0 ? (
            <div className="text-center py-12">
              <Dumbbell size={36} className="mx-auto text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm">No workouts logged today. Start moving!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {todayExercises.map(log => (
                <div key={log.id} className="flex justify-between items-center py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{log.emoji}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{log.name}</p>
                      <p className="text-xs text-gray-400">{log.mins} min · {log.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-emerald-600">−{log.burned} kcal</span>
                    <button onClick={() => dispatch({ type:'REMOVE_EXERCISE', payload:log.id })}
                      className="text-gray-300 hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
              <div className="pt-3 flex justify-between text-sm font-bold text-gray-800">
                <span>Total Burned</span>
                <span className="text-emerald-600">{totalBurned} kcal</span>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Recommended */}
      <Card>
        <CardTitle>
          Recommended for {profile?.goalType === 'lose' ? 'Weight Loss' : profile?.goalType === 'gain' ? 'Muscle Gain' : 'Your Goal'}
        </CardTitle>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {recommended.map(({ ex, mins:m, note }) => (
            <div key={ex.name} className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
              <p className="text-2xl mb-2">{ex.emoji}</p>
              <p className="text-sm font-bold text-gray-800">{ex.name}</p>
              <p className="text-xs text-primary font-bold">{m} min</p>
              <p className="text-xs text-gray-400">{note}</p>
              <p className="text-xs text-gray-400 mt-1">{calcBurn(ex.calPerMin, m, weight)} kcal burned</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
export default Exercise

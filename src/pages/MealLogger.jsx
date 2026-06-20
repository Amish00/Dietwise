import { useState, useMemo } from 'react'
import { Search, Plus, X, Sparkles, ChevronDown, Trash2 } from 'lucide-react'
import { useDiet } from '../context/DietContext'
import { useTodayMeals } from '../hooks/useTodayMeals'
import { useGroq } from '../hooks/useGroq'
import { getDietAdvice } from '../api/groq'
import { FOOD_DB, FOOD_CATEGORIES, MEAL_TYPES } from '../data/foodDatabase'
import { todayStr, calcProteinTarget, calcCarbTarget, calcFatTarget } from '../utils/calculations'
import Card, { CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import Alert from '../components/ui/Alert'
import Spinner from '../components/ui/Spinner'
import CalorieRing from '../components/charts/CalorieRing'
import MacroBar from '../components/charts/MacroBar'

const MEAL_ICONS = { Breakfast: '🌅', Lunch: '☀️', Dinner: '🌙', Snack: '🍎' }

const MealLogger = () => {
  const { state, dispatch } = useDiet()
  const { profile } = state
  const { todayMeals, totals, target } = useTodayMeals()
  const { run, loading: aiLoading, error: aiError, clearError } = useGroq()

  const [search, setSearch]         = useState('')
  const [qty, setQty]               = useState(1)
  const [mealType, setMealType]     = useState('Lunch')
  const [category, setCategory]     = useState('All')
  const [aiAdvice, setAiAdvice]     = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [custom, setCustom]         = useState({ name:'', cal:'', protein:'', carbs:'', fat:'' })

  const filtered = useMemo(() =>
    Object.entries(FOOD_DB).filter(([name, info]) =>
      name.toLowerCase().includes(search.toLowerCase()) &&
      (category === 'All' || info.category === category)
    ), [search, category])

  const addFood = (name, info) => {
    dispatch({ type: 'ADD_MEAL', payload: {
      id: Date.now(), name: qty > 1 ? `${qty}× ${name}` : name, mealType,
      calories: Math.round(info.cal * qty),
      protein:  Math.round(info.protein * qty * 10) / 10,
      carbs:    Math.round(info.carbs   * qty * 10) / 10,
      fat:      Math.round(info.fat     * qty * 10) / 10,
      date: todayStr(), time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
    }})
    setSearch(''); setQty(1)
  }

  const addCustomFood = () => {
    if (!custom.name || !custom.cal) return
    dispatch({ type: 'ADD_MEAL', payload: {
      id: Date.now(), name: custom.name, mealType,
      calories: Number(custom.cal), protein: Number(custom.protein)||0,
      carbs: Number(custom.carbs)||0, fat: Number(custom.fat)||0,
      date: todayStr(), time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
    }})
    setCustom({ name:'', cal:'', protein:'', carbs:'', fat:'' }); setShowCustom(false)
  }

  const getAdvice = async () => {
    const text = await run(getDietAdvice, profile, todayMeals, totals, target)
    if (text) setAiAdvice(text)
  }

  const grouped = MEAL_TYPES.map(t => ({
    type: t, items: todayMeals.filter(m => m.mealType === t),
    total: todayMeals.filter(m => m.mealType === t).reduce((s,m) => s+m.calories, 0),
  }))

  const proteinTarget = profile ? calcProteinTarget(profile.weight) : 120
  const carbTarget    = calcCarbTarget(target)
  const fatTarget     = calcFatTarget(target)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Meal Logger</h1>
        <p className="text-gray-400 text-sm mt-1">Track every bite. Own your nutrition.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left */}
        <div className="xl:col-span-2 space-y-5">
          <Card>
            <CardTitle>Add Food</CardTitle>
            {/* Meal type */}
            <div className="flex gap-2 flex-wrap mb-4">
              {MEAL_TYPES.map(t => (
                <button key={t} onClick={() => setMealType(t)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border
                    ${mealType===t ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-500 hover:border-primary hover:text-primary'}`}>
                  {t}
                </button>
              ))}
            </div>
            {/* Search row */}
            <div className="flex gap-3 mb-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search food (naan, chicken, egg...)"
                  className="input-base pl-9" />
              </div>
              <input type="number" min={0.5} step={0.5} value={qty} onChange={e => setQty(Number(e.target.value))}
                className="input-base w-20 text-center" title="Quantity" />
            </div>
            {/* Category pills */}
            <div className="flex gap-2 flex-wrap mb-4">
              {['All', ...FOOD_CATEGORIES].map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all
                    ${category===c ? 'bg-indigo-50 text-primary font-bold' : 'text-gray-400 hover:text-gray-700'}`}>
                  {c}
                </button>
              ))}
            </div>
            {/* Results */}
            <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
              {filtered.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-6">No foods found. Add a custom entry below.</p>
              )}
              {filtered.map(([name, info]) => (
                <div key={name} onClick={() => addFood(name, info)}
                  className="flex justify-between items-center px-3 py-2.5 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors group">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors">{name}</p>
                    <p className="text-xs text-gray-400">P:{info.protein}g · C:{info.carbs}g · F:{info.fat}g · {info.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-primary">{Math.round(info.cal * qty)} kcal</p>
                    {qty > 1 && <p className="text-xs text-gray-400">{qty}× {info.cal}</p>}
                  </div>
                </div>
              ))}
            </div>
            {/* Custom food toggle */}
            <button onClick={() => setShowCustom(p => !p)}
              className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-primary transition-colors pt-3 border-t border-gray-100 w-full">
              <Plus size={13} /> Add Custom Food
              <ChevronDown size={13} className={`ml-auto transition-transform ${showCustom ? 'rotate-180' : ''}`} />
            </button>
            {showCustom && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="col-span-2"><Input placeholder="Food name" value={custom.name} onChange={e => setCustom(p=>({...p,name:e.target.value}))} /></div>
                <Input type="number" placeholder="Calories"   value={custom.cal}     onChange={e => setCustom(p=>({...p,cal:    e.target.value}))} />
                <Input type="number" placeholder="Protein (g)" value={custom.protein} onChange={e => setCustom(p=>({...p,protein:e.target.value}))} />
                <Input type="number" placeholder="Carbs (g)"   value={custom.carbs}   onChange={e => setCustom(p=>({...p,carbs:  e.target.value}))} />
                <Input type="number" placeholder="Fat (g)"     value={custom.fat}     onChange={e => setCustom(p=>({...p,fat:    e.target.value}))} />
                <div className="col-span-2"><Button onClick={addCustomFood} full>Add Custom Food</Button></div>
              </div>
            )}
          </Card>

          {/* Meal groups */}
          {grouped.map(({ type, items, total }) => items.length > 0 && (
            <Card key={type}>
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{type}</p>
                <Badge color="purple">{total} kcal</Badge>
              </div>
              <div className="divide-y divide-gray-50">
                {items.map(meal => (
                  <div key={meal.id} className="flex justify-between items-center py-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{meal.name}</p>
                      <p className="text-xs text-gray-400">P:{meal.protein}g · C:{meal.carbs}g · F:{meal.fat}g · {meal.time}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-black text-amber-500">{meal.calories} kcal</p>
                      <button onClick={() => dispatch({ type:'REMOVE_MEAL', payload:meal.id })}
                        className="text-gray-300 hover:text-red-400 transition-colors"><X size={15} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          {todayMeals.length === 0 && (
            <Card className="text-center py-12">
              <Search size={32} className="mx-auto text-gray-200 mb-3" />
              <p className="font-bold text-gray-700">No meals logged yet</p>
              <p className="text-gray-400 text-sm mt-1">Search and add your first meal above</p>
            </Card>
          )}
        </div>

        {/* Right */}
        <div className="space-y-5">
          <Card>
            <CardTitle>Today's Summary</CardTitle>
            <CalorieRing eaten={totals.cal} target={target} size={180} />
            <div className="mt-5 space-y-1">
              <MacroBar label="Protein" value={totals.protein} max={proteinTarget} color="#6366f1" />
              <MacroBar label="Carbs"   value={totals.carbs}   max={carbTarget}    color="#f59e0b" />
              <MacroBar label="Fat"     value={totals.fat}      max={fatTarget}     color="#ef4444" />
            </div>
            {todayMeals.length > 0 && (
              <button onClick={() => dispatch({ type:'CLEAR_TODAY_MEALS' })}
                className="mt-4 flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 font-semibold transition-colors w-full justify-center">
                <Trash2 size={13} /> Clear today's meals
              </button>
            )}
          </Card>

          <Card>
            <CardTitle>AI Diet Coach</CardTitle>
            <p className="text-xs text-gray-400 mb-4">Get personalized advice based on what you've eaten today.</p>
            {aiError && <Alert type="error" onClose={clearError} className="mb-3">{aiError}</Alert>}
            <Button full onClick={getAdvice} disabled={aiLoading}>
              {aiLoading ? <Spinner size="sm" /> : <><Sparkles size={14} />Get AI Advice</>}
            </Button>
            {aiAdvice && (
              <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                {aiAdvice.split('\n').filter(Boolean).map((line, i) => (
                  <p key={i} className="text-xs text-gray-700 leading-relaxed mb-1.5">{line}</p>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
export default MealLogger

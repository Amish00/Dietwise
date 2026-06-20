import { useState, useEffect } from 'react'
import { User, Save, CheckCircle, TrendingDown, Activity, Scale } from 'lucide-react'
import { useDiet } from '../context/DietContext'
import { calcBMR, calcTDEE, calcDailyTarget, calcBMI, getBMILabel, weeksToGoal, ACTIVITY_MULTIPLIERS } from '../utils/calculations'
import Card, { CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Badge from '../components/ui/Badge'

const GOAL_OPTIONS = [
  { value:'lose',     label:'Lose Weight',     desc:'500 kcal deficit/day' },
  { value:'maintain', label:'Maintain Weight', desc:'Eat at TDEE'          },
  { value:'gain',     label:'Gain Muscle',     desc:'300 kcal surplus/day' },
]

const Profile = () => {
  const { state, dispatch } = useDiet()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name:'', age:28, gender:'male', weight:90,
    height:175, targetWeight:75, activity:'light', goalType:'lose',
  })

  useEffect(() => { if (state.profile) setForm(state.profile) }, [state.profile])

  const set = k => e => {
    const v = e.target.value
    setForm(p => ({ ...p, [k]: isNaN(v)||v==='' ? v : Number(v) }))
  }

  const BMI     = form.weight && form.height ? calcBMI(form.weight, form.height) : null
  const bmiInfo = BMI ? getBMILabel(BMI) : null
  const bmr     = form.weight && form.height && form.age ? Math.round(calcBMR(form.weight, form.height, form.age, form.gender)) : 0
  const tdee    = bmr ? calcTDEE(bmr, form.activity) : 0
  const target  = tdee ? calcDailyTarget(tdee, form.goalType) : 0
  const weeks   = form.weight && form.targetWeight ? weeksToGoal(form.weight, form.targetWeight) : 0

  const save = () => {
    dispatch({ type:'SET_PROFILE', payload:form })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const activityOptions = Object.entries(ACTIVITY_MULTIPLIERS).map(([k,v]) => ({ value:k, label:v.label }))
  const bmiColor = BMI < 18.5 ? 'text-amber-500' : BMI < 25 ? 'text-emerald-600' : BMI < 30 ? 'text-amber-500' : 'text-red-500'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <User size={26} className="text-primary" /> Your Profile
        </h1>
        <p className="text-gray-400 text-sm mt-1">Set your details for personalized calorie targets and AI advice.</p>
      </div>

      <Card>
        <CardTitle>Personal Details</CardTitle>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input label="Full Name" placeholder="Your name" value={form.name} onChange={set('name')} />
          </div>
          <Input label="Age (years)"          type="number" value={form.age}          onChange={set('age')} />
          <Select label="Gender" value={form.gender} onChange={set('gender')}
            options={[{value:'male',label:'Male'},{value:'female',label:'Female'}]} />
          <Input label="Current Weight (kg)"  type="number" value={form.weight}       onChange={set('weight')} />
          <Input label="Height (cm)"          type="number" value={form.height}       onChange={set('height')} />
          <div className="col-span-2">
            <Input label="Target Weight (kg)" type="number" value={form.targetWeight} onChange={set('targetWeight')} />
          </div>
          <div className="col-span-2">
            <Select label="Activity Level" value={form.activity} onChange={set('activity')} options={activityOptions} />
          </div>
          <div className="col-span-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Goal</p>
            <div className="grid grid-cols-3 gap-3">
              {GOAL_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setForm(p=>({...p,goalType:opt.value}))}
                  className={`py-3 px-4 rounded-xl border text-left transition-all
                    ${form.goalType===opt.value ? 'bg-indigo-50 border-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                  <p className={`text-sm font-bold ${form.goalType===opt.value?'text-primary':'text-gray-700'}`}>{opt.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Live Stats Preview */}
      {BMI && (
        <Card>
          <CardTitle>Your Stats Preview</CardTitle>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className={`text-3xl font-black ${bmiColor}`}>{BMI}</p>
              <p className="text-xs text-gray-400 mt-1">BMI</p>
              <Badge color={BMI<18.5?'amber':BMI<25?'green':BMI<30?'amber':'red'} className="mt-2">
                {bmiInfo?.label}
              </Badge>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-3xl font-black text-primary">{target}</p>
              <p className="text-xs text-gray-400 mt-1">Daily kcal target</p>
              <p className="text-xs text-gray-400">TDEE: {tdee}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-3xl font-black text-amber-500">{weeks}</p>
              <p className="text-xs text-gray-400 mt-1">Weeks to goal</p>
              <p className="text-xs text-gray-400">0.5 kg/week pace</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-3xl font-black text-emerald-600">{bmr}</p>
              <p className="text-xs text-gray-400 mt-1">BMR (kcal)</p>
              <p className="text-xs text-gray-400">base metabolism</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-sm">
            <span className="font-bold text-primary">Plan: </span>
            <span className="text-gray-600">
              {form.goalType==='lose'
                ? `Lose ${Math.abs(form.weight-form.targetWeight)} kg in ~${weeks} weeks by eating ${target} kcal/day (${tdee-target} kcal deficit).`
                : form.goalType==='gain'
                  ? `Build muscle eating ${target} kcal/day (${target-tdee} kcal surplus). Prioritize protein.`
                  : `Maintain weight eating ${target} kcal/day. Balance intake with activity.`}
            </span>
          </div>
        </Card>
      )}

      <Button full size="lg" onClick={save}>
        {saved
          ? <><CheckCircle size={16} />Profile Saved!</>
          : <><Save size={16} />Save Profile</>}
      </Button>
    </div>
  )
}
export default Profile

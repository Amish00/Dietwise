import { useState } from 'react'
import { ChefHat, Plus, Sparkles, ArrowLeft, Clock, Users, Youtube, Star, Leaf, Zap, Heart } from 'lucide-react'
import { useGroq } from '../hooks/useGroq'
import { getRecipes, getYoutubeLink } from '../api/groq'
import { useDiet } from '../context/DietContext'
import Card, { CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Alert from '../components/ui/Alert'
import Spinner from '../components/ui/Spinner'

const QUICK_INGREDIENTS = [
  'chicken breast','eggs','spinach','tomatoes','onions','garlic',
  'lentils','yogurt','cucumber','oats','brown rice','broccoli',
  'sweet potato','chickpeas','avocado','salmon','tuna','mushrooms',
]

const GOAL_OPTIONS = [
  { value:'weight loss',  label:'Weight Loss',  icon:'🔥' },
  { value:'muscle gain',  label:'Muscle Gain',  icon:'💪' },
  { value:'maintenance',  label:'Maintenance',  icon:'⚖️' },
  { value:'low carb',     label:'Low Carb',     icon:'🥑' },
  { value:'high protein', label:'High Protein', icon:'🥩' },
  { value:'vegetarian',   label:'Vegetarian',   icon:'🥦' },
]

const DIFF_COLOR = { Easy:'green', Medium:'amber', Hard:'red' }

const RecipeImage = ({ src, alt, className }) => {
  const [failed, setFailed] = useState(false)
  if (failed || !src) {
    return (
      <div className={`${className} bg-gradient-to-br from-indigo-100 via-purple-50 to-amber-50 flex items-center justify-center`}>
        <ChefHat size={48} className="text-indigo-300" />
      </div>
    )
  }
  return (
    <img src={src} alt={alt} className={className}
      onError={() => setFailed(true)} />
  )
}

// ─── Nutrition Badge Row ──────────────────────────────────────────────────────
const NutriBadge = ({ label, value, unit, color }) => (
  <div className="text-center">
    <p className="text-lg font-black" style={{ color }}>{value}<span className="text-xs font-semibold text-gray-400">{unit}</span></p>
    <p className="text-xs text-gray-400">{label}</p>
  </div>
)

// ─── Recipe Card (list view) ──────────────────────────────────────────────────
const RecipeCard = ({ recipe, onClick }) => (
  <Card hover onClick={onClick} className="overflow-hidden !p-0">
    {/* Image */}
    <div className="relative h-48 bg-gray-100 overflow-hidden">
      <RecipeImage src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
        <h3 className="text-white font-black text-lg leading-tight drop-shadow">{recipe.name}</h3>
        <Badge color={DIFF_COLOR[recipe.difficulty]||'gray'}>{recipe.difficulty}</Badge>
      </div>
      {recipe.healthScore && (
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-lg px-2 py-1 flex items-center gap-1">
          <Star size={11} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-gray-800">{recipe.healthScore}/10</span>
        </div>
      )}
    </div>

    {/* Body */}
    <div className="p-4">
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{recipe.description}</p>

      {/* Macros row */}
      <div className="flex justify-between py-3 border-y border-gray-100 mb-3">
        <NutriBadge label="Calories" value={recipe.calories} unit=" kcal" color="#6366f1" />
        <NutriBadge label="Protein"  value={recipe.protein}  unit="g"     color="#10b981" />
        <NutriBadge label="Carbs"    value={recipe.carbs}    unit="g"     color="#f59e0b" />
        <NutriBadge label="Fat"      value={recipe.fat}       unit="g"     color="#ef4444" />
        {recipe.fiber && <NutriBadge label="Fiber" value={recipe.fiber} unit="g" color="#8b5cf6" />}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
        <span className="flex items-center gap-1"><Clock size={12} /> {recipe.totalTime || recipe.prepTime}</span>
        <span className="flex items-center gap-1"><Users size={12} /> {recipe.servings} serving{recipe.servings>1?'s':''}</span>
        {recipe.dietGoal && <span className="flex items-center gap-1"><Leaf size={12} /> {recipe.dietGoal}</span>}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {recipe.tags?.map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-indigo-50 text-primary text-xs font-semibold rounded-full">{tag}</span>
        ))}
      </div>

      {/* Diet tip */}
      {recipe.nutritionTips?.[0] && (
        <div className="flex items-start gap-2 p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg">
          <Leaf size={13} className="text-emerald-500 mt-0.5 shrink-0" />
          <p className="text-xs text-emerald-700">{recipe.nutritionTips[0]}</p>
        </div>
      )}
    </div>
  </Card>
)

// ─── Full Recipe Detail ───────────────────────────────────────────────────────
const RecipeDetail = ({ recipe, onBack }) => (
  <div className="space-y-6">
    <button onClick={onBack}
      className="flex items-center gap-2 text-gray-400 hover:text-gray-700 text-sm font-semibold transition-colors">
      <ArrowLeft size={15} /> Back to recipes
    </button>

    {/* Hero */}
    <div className="relative h-72 bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
      <RecipeImage src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-5 left-5 right-5">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black text-white drop-shadow mb-2">{recipe.name}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge color={DIFF_COLOR[recipe.difficulty]||'gray'}>{recipe.difficulty}</Badge>
              {recipe.dietGoal && <Badge color="green">{recipe.dietGoal}</Badge>}
              {recipe.healthScore && (
                <span className="flex items-center gap-1 bg-white/20 backdrop-blur text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  <Star size={10} className="fill-amber-300 text-amber-300" /> {recipe.healthScore}/10
                </span>
              )}
            </div>
          </div>
          <a href={recipe.youtubeUrl} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors shadow">
            <Youtube size={14} /> Watch Video
          </a>
        </div>
      </div>
    </div>

    {/* Story */}
    {recipe.story && (
      <Card className="bg-amber-50 border-amber-100">
        <p className="text-sm text-amber-800 italic leading-relaxed">📖 {recipe.story}</p>
      </Card>
    )}

    {/* Nutrition Grid */}
    <Card>
      <CardTitle>Nutrition Per Serving</CardTitle>
      <div className="grid grid-cols-5 gap-3">
        {[
          ['Calories', recipe.calories, 'kcal', '#6366f1'],
          ['Protein',  recipe.protein,  'g',    '#10b981'],
          ['Carbs',    recipe.carbs,    'g',    '#f59e0b'],
          ['Fat',      recipe.fat,       'g',    '#ef4444'],
          ['Fiber',    recipe.fiber,    'g',    '#8b5cf6'],
        ].map(([l, v, u, c]) => v != null && (
          <div key={l} className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xl font-black" style={{ color: c }}>{v}<span className="text-xs">{u}</span></p>
            <p className="text-xs text-gray-400 mt-0.5">{l}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
        <span className="flex items-center gap-1"><Clock size={12} /> Prep: {recipe.prepTime}</span>
        <span className="flex items-center gap-1"><Zap size={12} /> Cook: {recipe.cookTime}</span>
        <span className="flex items-center gap-1"><Clock size={12} /> Total: {recipe.totalTime}</span>
        <span className="flex items-center gap-1"><Users size={12} /> Serves: {recipe.servings}</span>
      </div>
    </Card>

    {/* Ingredients + Steps */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Card>
        <CardTitle>Ingredients</CardTitle>
        <ul className="space-y-2.5">
          {recipe.ingredients?.map((ing, i) => (
            <li key={i} className="flex items-start gap-3 pb-2.5 border-b border-gray-50 last:border-0">
              <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-emerald-600 text-xs font-black">✓</span>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-800">{ing.amount} </span>
                <span className="text-sm text-gray-700">{ing.item}</span>
                {ing.note && <p className="text-xs text-gray-400 mt-0.5 italic">{ing.note}</p>}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardTitle>Instructions</CardTitle>
        <ol className="space-y-4">
          {recipe.instructions?.map((step, i) => (
            <li key={i} className="flex gap-3">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                {step.step || i+1}
              </div>
              <div className="flex-1">
                {step.title && <p className="text-sm font-bold text-gray-800 mb-0.5">{step.title}</p>}
                <p className="text-sm text-gray-600 leading-relaxed">{step.detail}</p>
                {step.tip && (
                  <div className="mt-1.5 flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5">
                    <Zap size={11} className="shrink-0 mt-0.5" /> {step.tip}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </div>

    {/* Tips, Variations, Pairings */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {recipe.nutritionTips?.length > 0 && (
        <Card>
          <CardTitle>Nutrition Tips</CardTitle>
          <ul className="space-y-2">
            {recipe.nutritionTips.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <Heart size={13} className="text-emerald-500 shrink-0 mt-0.5" />{t}
              </li>
            ))}
          </ul>
        </Card>
      )}
      {recipe.variations?.length > 0 && (
        <Card>
          <CardTitle>Variations</CardTitle>
          <ul className="space-y-2">
            {recipe.variations.map((v, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <Sparkles size={13} className="text-indigo-400 shrink-0 mt-0.5" />{v}
              </li>
            ))}
          </ul>
        </Card>
      )}
      {recipe.pairWith?.length > 0 && (
        <Card>
          <CardTitle>Pairs Well With</CardTitle>
          <ul className="space-y-2">
            {recipe.pairWith.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <Plus size={13} className="text-amber-400 shrink-0 mt-0.5" />{p}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>

    {/* YouTube CTA */}
    <Card className="bg-red-50 border-red-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
          <Youtube size={20} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-gray-800 text-sm">Watch how to make {recipe.name}</p>
          <p className="text-xs text-gray-500">Find video tutorials on YouTube</p>
        </div>
      </div>
      <a href={recipe.youtubeUrl} target="_blank" rel="noreferrer">
        <Button variant="danger" size="sm">
          <Youtube size={13} /> Watch Now
        </Button>
      </a>
    </Card>
  </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────
const RecipeFinder = () => {
  const { state } = useDiet()
  const { run, loading, error, clearError } = useGroq()
  const [ingredients, setIngredients] = useState('')
  const [goal, setGoal]               = useState('weight loss')
  const [recipes, setRecipes]         = useState([])
  const [active, setActive]           = useState(null)

  const addIngredient = (ing) =>
    setIngredients(p => p ? `${p}, ${ing}` : ing)

  const find = async () => {
    const data = await run(getRecipes, ingredients, goal, state.profile)
    if (data?.recipes) { setRecipes(data.recipes); setActive(null) }
  }

  if (active) return <RecipeDetail recipe={active} onBack={() => setActive(null)} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <ChefHat size={26} className="text-primary" /> AI Recipe Finder
        </h1>
        <p className="text-gray-400 text-sm mt-1">Tell me what's in your kitchen — I'll create healthy recipes for your goal.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Input panel */}
        <div className="space-y-5">
          <Card>
            <CardTitle>Your Ingredients</CardTitle>
            <textarea value={ingredients} onChange={e => setIngredients(e.target.value)}
              placeholder="e.g. chicken breast, spinach, garlic, olive oil..."
              className="input-base resize-none min-h-28 font-sans" />

            <div className="mt-3 mb-4">
              <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">Quick add:</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_INGREDIENTS.map(ing => (
                  <button key={ing} onClick={() => addIngredient(ing)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border border-gray-200 text-gray-500 hover:border-primary hover:text-primary hover:bg-indigo-50 transition-all">
                    <Plus size={10} />{ing}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">Diet Goal</p>
              <div className="grid grid-cols-2 gap-2">
                {GOAL_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => setGoal(opt.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left
                      ${goal===opt.value ? 'bg-indigo-50 border-primary text-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <Alert type="error" onClose={clearError} className="mb-3">{error}</Alert>}
            <Button full onClick={find} disabled={loading || !ingredients.trim()}>
              {loading ? <Spinner size="sm" /> : <><Sparkles size={14} />Find Recipes</>}
            </Button>
          </Card>

          <Card>
            <CardTitle>Diet Tips</CardTitle>
            {['Drink water 30 min before meals',
              'Eat protein first at every meal',
              'Fill half your plate with vegetables',
              'Chew slowly — 20 min to feel full',
              'Prep meals ahead to avoid bad choices',
              'Sleep 7–8 hrs to control hunger hormones',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2 py-2 border-b border-gray-50 last:border-0">
                <Leaf size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-500">{tip}</p>
              </div>
            ))}
          </Card>
        </div>

        {/* Results */}
        <div className="xl:col-span-2 space-y-5">
          {loading && (
            <Card className="py-20 text-center">
              <Spinner size="lg" text="AI is crafting healthy recipes from your ingredients..." />
            </Card>
          )}
          {!loading && recipes.length === 0 && (
            <Card className="py-20 text-center">
              <ChefHat size={40} className="mx-auto text-gray-200 mb-4" />
              <h3 className="font-black text-xl text-gray-700 mb-2">Ready to Cook?</h3>
              <p className="text-gray-400 text-sm">Add your ingredients and click "Find Recipes"</p>
            </Card>
          )}
          {recipes.map((r, i) => (
            <RecipeCard key={i} recipe={r} onClick={() => setActive(r)} />
          ))}
        </div>
      </div>
    </div>
  )
}
export default RecipeFinder

// ─── Groq API Client ─────────────────────────────────────────────────────────
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || ''
const MODEL        = 'llama-3.3-70b-versatile'

// ─── Image helpers ───────────────────────────────────────────────────────────
const hashQuery = (str) => {
  let h = 0
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

export const getPlaceholderImage = (query, w = 400, h = 280) =>
  `https://picsum.photos/seed/food-${hashQuery(query || 'recipe')}/${w}/${h}`

export const resolveFoodImage = async (query, w = 400, h = 280) => {
  const q = (query || 'healthy food').trim()
  const fallback = getPlaceholderImage(q, w, h)

  if (!UNSPLASH_KEY || UNSPLASH_KEY === 'your_unsplash_access_key_here') return fallback

  try {
    const base = import.meta.env.DEV ? '/api/unsplash' : 'https://api.unsplash.com'
    const url = `${base}/search/photos?query=${encodeURIComponent(q + ' food')}&per_page=1&orientation=landscape&client_id=${UNSPLASH_KEY}`
    const res = await fetch(url)
    if (!res.ok) return fallback
    const data = await res.json()
    return data.results?.[0]?.urls?.small || fallback
  } catch {
    return fallback
  }
}

// Legacy export kept for any external callers
export const getFoodImage = getPlaceholderImage

// ─── YouTube search link ──────────────────────────────────────────────────────
export const getYoutubeLink = (recipeName) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(recipeName + ' recipe healthy cooking')}`

// ─── Core fetch ──────────────────────────────────────────────────────────────
const groqFetch = async (systemPrompt, userMessage, opts = {}) => {
  const { json = false, maxTokens = 2048, temperature = 0.6 } = opts

  const body = {
    model: MODEL,
    max_tokens: maxTokens,
    temperature,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userMessage  },
    ],
  }
  if (json) body.response_format = { type: 'json_object' }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `HTTP ${response.status}`)
  }
  const data = await response.json()
  const choice = data.choices?.[0]
  if (choice?.finish_reason === 'length') {
    throw new Error('AI response was cut off — please try again.')
  }
  return choice?.message?.content || ''
}

// ─── Safe JSON parser — strips fences, repairs common LLM issues ─────────────
const repairJSON = (text) =>
  text
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/,\s*([}\]])/g, '$1')
    .replace(/[\x00-\x1F\x7F]/g, (c) => (c === '\n' || c === '\r' || c === '\t' ? c : ''))

const safeParseJSON = (raw) => {
  let text = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
  const start = text.indexOf('{')
  const end   = text.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON object found in AI response. Please try again.')
  text = repairJSON(text.slice(start, end + 1))
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('AI returned invalid JSON. Please try again.')
  }
}

const fetchAndParseJSON = async (system, user, opts) => {
  const tryOnce = async () => safeParseJSON(await groqFetch(system, user, opts))
  try {
    return await tryOnce()
  } catch (err) {
    if (err.message.includes('cut off') || err.message.includes('invalid JSON') || err.message.includes('No JSON')) {
      return await tryOnce()
    }
    throw err
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI FEATURE CALLS
// ═══════════════════════════════════════════════════════════════════════════════

export const getDietAdvice = async (profile, todayMeals, totals, target) => {
  const system = `You are an expert diet coach and nutritionist. Give concise, actionable advice.
Use bullet points starting with •. Be specific with food names and numbers. Keep it encouraging.`

  const user = `User: ${profile?.weight}kg → target ${profile?.targetWeight}kg (goal: ${profile?.goalType}).
Today: ${totals.cal} kcal eaten / ${target} kcal target. Remaining: ${target - totals.cal} kcal.
Macros: Protein ${Math.round(totals.protein)}g, Carbs ${Math.round(totals.carbs)}g, Fat ${Math.round(totals.fat)}g.
Meals: ${todayMeals.map(m => m.name).join(', ') || 'nothing yet'}.
Give 4-5 specific bullet points: what to eat next, what to avoid, one exercise tip.`

  return groqFetch(system, user)
}

export const getRecipes = async (ingredients, goal, profile) => {
  const system = `You are a professional nutritionist chef. You MUST respond with ONLY a valid JSON object.
No explanation, no markdown, no text before or after the JSON.
Keep all text fields concise to stay within token limits.
Required format exactly:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "One sentence, max 20 words",
      "story": "One sentence origin story, max 15 words",
      "calories": 420,
      "protein": 35,
      "carbs": 28,
      "fat": 18,
      "fiber": 6,
      "prepTime": "10 mins",
      "cookTime": "20 mins",
      "totalTime": "30 mins",
      "difficulty": "Easy",
      "servings": 2,
      "dietGoal": "Weight Loss",
      "healthScore": 9,
      "ingredients": [
        { "item": "chicken breast", "amount": "200g", "note": "boneless" }
      ],
      "instructions": [
        { "step": 1, "title": "Prep", "detail": "Max 20 words per step", "tip": "Short tip" }
      ],
      "nutritionTips": ["Max 2 tips, 15 words each"],
      "variations": ["Max 2 variations, 15 words each"],
      "tags": ["High Protein", "Low Carb", "Quick"],
      "pairWith": ["Side dish", "Drink"],
      "imageSearch": "grilled chicken spinach salad"
    }
  ]
}
Rules: exactly 3 recipes. Max 5 instruction steps per recipe. Max 8 ingredients per recipe.
Use only double quotes. Escape any quotes inside strings. No trailing commas.`

  const user = `Create exactly 3 healthy recipes for someone on a ${goal} diet.
Current weight: ${profile?.weight || 90}kg, Target: ${profile?.targetWeight || 75}kg.
Available ingredients: ${ingredients}.
You may add basic pantry staples (salt, pepper, olive oil, garlic, spices).
Make each recipe different and nutritionally optimized for the diet goal.
IMPORTANT: Return ONLY the JSON object, nothing else.`

  const data = await fetchAndParseJSON(system, user, { json: true, maxTokens: 4096, temperature: 0.2 })
  data.recipes = await Promise.all(data.recipes.map(async (r) => ({
    ...r,
    imageUrl:   await resolveFoodImage(r.imageSearch || r.name),
    youtubeUrl: getYoutubeLink(r.name),
  })))
  return data
}

export const getMealPlan = async (profile) => {
  const system = `You are a professional nutritionist. You MUST respond with ONLY a valid JSON object.
No explanation, no markdown fences, no text outside the JSON.
Keep descriptions short (max 12 words). weeklyTips: exactly 3 tips, max 15 words each.
Required format:
{
  "days": [
    {
      "day": "Monday",
      "totalCalories": 1800,
      "meals": {
        "breakfast": { "name": "Oatmeal with Berries", "calories": 380, "protein": 12, "carbs": 65, "fat": 8, "description": "Warm oats with berries", "prepTime": "5 mins" },
        "lunch":     { "name": "...", "calories": 520, "protein": 35, "carbs": 42, "fat": 16, "description": "...", "prepTime": "15 mins" },
        "dinner":    { "name": "...", "calories": 580, "protein": 40, "carbs": 38, "fat": 20, "description": "...", "prepTime": "25 mins" },
        "snack":     { "name": "...", "calories": 180, "protein": 8,  "carbs": 22, "fat": 5,  "description": "...", "prepTime": "2 mins" }
      }
    }
  ],
  "weeklyTips": ["Tip 1", "Tip 2", "Tip 3"]
}
Rules: exactly 7 days (Monday through Sunday). Use only double quotes. No trailing commas.`

  const user = `Create a 7-day meal plan for:
Weight: ${profile.weight}kg → Target: ${profile.targetWeight}kg
Daily calories: ${profile.dailyCalTarget} kcal, Goal: ${profile.goalType}
Activity: ${profile.activity}, Gender: ${profile.gender}, Age: ${profile.age}
Each day must have breakfast + lunch + dinner + snack.
Each day total calories should be close to ${profile.dailyCalTarget}.
Make meals varied, realistic, and healthy. Include exactly 3 weeklyTips.
IMPORTANT: Return ONLY the JSON object. No markdown. No text outside JSON.`

  return fetchAndParseJSON(system, user, { json: true, maxTokens: 8192, temperature: 0.2 })
}

export const analyzeFood = async (foodDescription) => {
  const system = `You are a nutritionist. Respond ONLY with a valid JSON object, no markdown.
Format: {"name":"string","calories":0,"protein":0,"carbs":0,"fat":0,"fiber":0,"healthScore":0,"verdict":"string","tips":["string"]}`

  const user = `Estimate nutrition for: ${foodDescription}`
  return fetchAndParseJSON(system, user, { json: true, maxTokens: 1024, temperature: 0.2 })
}

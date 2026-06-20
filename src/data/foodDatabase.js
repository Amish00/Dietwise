// ─── Food Database ────────────────────────────────────────────────────────────
export const FOOD_DB = {
  // === Breads & Grains ===
  'Naan (1 piece)':            { cal: 262, protein: 9,  carbs: 45, fat: 5,   unit: 'piece',   category: 'Grains' },
  'Roti / Chapati':            { cal: 120, protein: 3,  carbs: 22, fat: 3,   unit: 'piece',   category: 'Grains' },
  'White Rice (1 cup)':        { cal: 206, protein: 4,  carbs: 45, fat: 0.4, unit: 'cup',     category: 'Grains' },
  'Brown Rice (1 cup)':        { cal: 216, protein: 5,  carbs: 45, fat: 1.8, unit: 'cup',     category: 'Grains' },
  'Bread Slice (white)':       { cal: 79,  protein: 3,  carbs: 15, fat: 1,   unit: 'slice',   category: 'Grains' },
  'Bread Slice (brown)':       { cal: 69,  protein: 3.5,carbs: 12, fat: 1,   unit: 'slice',   category: 'Grains' },
  'Pasta (1 cup cooked)':      { cal: 220, protein: 8,  carbs: 43, fat: 1,   unit: 'cup',     category: 'Grains' },
  'Oats (1 cup cooked)':       { cal: 166, protein: 6,  carbs: 32, fat: 4,   unit: 'cup',     category: 'Grains' },
  'Paratha (1 piece)':         { cal: 300, protein: 5,  carbs: 38, fat: 14,  unit: 'piece',   category: 'Grains' },

  // === Proteins ===
  'Chicken Curry (1 serving)': { cal: 280, protein: 25, carbs: 8,  fat: 15,  unit: 'serving', category: 'Proteins' },
  'Grilled Chicken (100g)':    { cal: 165, protein: 31, carbs: 0,  fat: 3.6, unit: '100g',    category: 'Proteins' },
  'Chicken Breast (100g)':     { cal: 120, protein: 26, carbs: 0,  fat: 1.5, unit: '100g',    category: 'Proteins' },
  'Boiled Egg':                { cal: 78,  protein: 6,  carbs: 0.6,fat: 5,   unit: 'egg',     category: 'Proteins' },
  'Fried Egg':                 { cal: 90,  protein: 6,  carbs: 0.4,fat: 7,   unit: 'egg',     category: 'Proteins' },
  'Lentil Dal (1 bowl)':       { cal: 180, protein: 12, carbs: 30, fat: 2,   unit: 'bowl',    category: 'Proteins' },
  'Fish Curry (1 serving)':    { cal: 200, protein: 22, carbs: 5,  fat: 10,  unit: 'serving', category: 'Proteins' },
  'Grilled Fish (100g)':       { cal: 130, protein: 26, carbs: 0,  fat: 2.5, unit: '100g',    category: 'Proteins' },
  'Beef Keema (1 serving)':    { cal: 320, protein: 28, carbs: 6,  fat: 20,  unit: 'serving', category: 'Proteins' },
  'Tuna Can (100g)':           { cal: 116, protein: 26, carbs: 0,  fat: 1,   unit: '100g',    category: 'Proteins' },
  'Greek Yogurt (1 cup)':      { cal: 100, protein: 17, carbs: 6,  fat: 0.7, unit: 'cup',     category: 'Proteins' },
  'Cottage Cheese (100g)':     { cal: 98,  protein: 11, carbs: 3.4,fat: 4.3, unit: '100g',    category: 'Proteins' },

  // === Vegetables ===
  'Mixed Salad (large)':       { cal: 50,  protein: 3,  carbs: 8,  fat: 0.5, unit: 'bowl',    category: 'Vegetables' },
  'Spinach (1 cup)':           { cal: 23,  protein: 3,  carbs: 3.6,fat: 0.4, unit: 'cup',     category: 'Vegetables' },
  'Broccoli (1 cup)':          { cal: 55,  protein: 4,  carbs: 11, fat: 0.6, unit: 'cup',     category: 'Vegetables' },
  'Cucumber':                  { cal: 16,  protein: 0.7,carbs: 3.6,fat: 0.1, unit: 'piece',   category: 'Vegetables' },
  'Tomato':                    { cal: 22,  protein: 1,  carbs: 4.8,fat: 0.2, unit: 'piece',   category: 'Vegetables' },
  'Carrot':                    { cal: 41,  protein: 0.9,carbs: 10, fat: 0.2, unit: 'piece',   category: 'Vegetables' },
  'Onion (medium)':            { cal: 44,  protein: 1.2,carbs: 10, fat: 0.1, unit: 'piece',   category: 'Vegetables' },
  'Bell Pepper':               { cal: 31,  protein: 1,  carbs: 7,  fat: 0.3, unit: 'piece',   category: 'Vegetables' },
  'Sweet Potato (medium)':     { cal: 103, protein: 2.3,carbs: 24, fat: 0.1, unit: 'piece',   category: 'Vegetables' },
  'Avocado (half)':            { cal: 120, protein: 1.5,carbs: 6,  fat: 11,  unit: 'half',    category: 'Vegetables' },

  // === Fruits ===
  'Apple':                     { cal: 95,  protein: 0.5,carbs: 25, fat: 0.3, unit: 'piece',   category: 'Fruits' },
  'Banana':                    { cal: 105, protein: 1.3,carbs: 27, fat: 0.4, unit: 'piece',   category: 'Fruits' },
  'Orange':                    { cal: 62,  protein: 1.2,carbs: 15, fat: 0.2, unit: 'piece',   category: 'Fruits' },
  'Mango (1 cup)':             { cal: 99,  protein: 1.4,carbs: 25, fat: 0.6, unit: 'cup',     category: 'Fruits' },
  'Watermelon (1 cup)':        { cal: 46,  protein: 0.9,carbs: 11, fat: 0.2, unit: 'cup',     category: 'Fruits' },
  'Strawberries (1 cup)':      { cal: 49,  protein: 1,  carbs: 12, fat: 0.5, unit: 'cup',     category: 'Fruits' },

  // === Dairy ===
  'Milk (1 cup)':              { cal: 149, protein: 8,  carbs: 12, fat: 8,   unit: 'cup',     category: 'Dairy' },
  'Skim Milk (1 cup)':         { cal: 83,  protein: 8,  carbs: 12, fat: 0.2, unit: 'cup',     category: 'Dairy' },
  'Cheddar Cheese (30g)':      { cal: 120, protein: 7,  carbs: 0.4,fat: 10,  unit: '30g',     category: 'Dairy' },
  'Lassi (1 glass)':           { cal: 180, protein: 8,  carbs: 24, fat: 6,   unit: 'glass',   category: 'Dairy' },
  'Plain Yogurt (1 cup)':      { cal: 149, protein: 8,  carbs: 11, fat: 8,   unit: 'cup',     category: 'Dairy' },

  // === Drinks ===
  'Tea with Milk':             { cal: 60,  protein: 2,  carbs: 8,  fat: 2,   unit: 'cup',     category: 'Drinks' },
  'Black Coffee':              { cal: 5,   protein: 0.3,carbs: 0.5,fat: 0,   unit: 'cup',     category: 'Drinks' },
  'Orange Juice (1 glass)':    { cal: 112, protein: 1.7,carbs: 26, fat: 0.5, unit: 'glass',   category: 'Drinks' },
  'Protein Shake':             { cal: 150, protein: 25, carbs: 8,  fat: 3,   unit: 'scoop',   category: 'Drinks' },
  'Coconut Water':             { cal: 46,  protein: 1.7,carbs: 9,  fat: 0.5, unit: 'cup',     category: 'Drinks' },
  'Water':                     { cal: 0,   protein: 0,  carbs: 0,  fat: 0,   unit: 'glass',   category: 'Drinks' },

  // === Snacks ===
  'Samosa (1 piece)':          { cal: 262, protein: 4,  carbs: 30, fat: 14,  unit: 'piece',   category: 'Snacks' },
  'Pakora (3 pieces)':         { cal: 180, protein: 5,  carbs: 20, fat: 9,   unit: 'serving', category: 'Snacks' },
  'Mixed Nuts (30g)':          { cal: 185, protein: 5,  carbs: 7,  fat: 16,  unit: '30g',     category: 'Snacks' },
  'Almonds (30g)':             { cal: 164, protein: 6,  carbs: 6,  fat: 14,  unit: '30g',     category: 'Snacks' },
  'Chips (1 pack)':            { cal: 152, protein: 2,  carbs: 15, fat: 10,  unit: 'pack',    category: 'Snacks' },
  'Dark Chocolate (30g)':      { cal: 170, protein: 2,  carbs: 13, fat: 12,  unit: '30g',     category: 'Snacks' },
  'Hummus (2 tbsp)':           { cal: 70,  protein: 2,  carbs: 6,  fat: 5,   unit: '2 tbsp',  category: 'Snacks' },
  'Dates (3 pieces)':          { cal: 80,  protein: 0.5,carbs: 22, fat: 0.1, unit: 'pieces',  category: 'Snacks' },
}

export const FOOD_CATEGORIES = [...new Set(Object.values(FOOD_DB).map(f => f.category))]

export const EXERCISES = [
  { name: 'Walking',        calPerMin: 4.5, emoji: '🚶', type: 'Cardio',   met: 3.5 },
  { name: 'Brisk Walking',  calPerMin: 6.0, emoji: '🚶‍♂️', type: 'Cardio',   met: 5.0 },
  { name: 'Running',        calPerMin: 11,  emoji: '🏃', type: 'Cardio',   met: 9.8 },
  { name: 'Cycling',        calPerMin: 8.0, emoji: '🚴', type: 'Cardio',   met: 7.5 },
  { name: 'Swimming',       calPerMin: 9.0, emoji: '🏊', type: 'Cardio',   met: 8.0 },
  { name: 'Yoga',           calPerMin: 3.5, emoji: '🧘', type: 'Flex',     met: 3.0 },
  { name: 'Jump Rope',      calPerMin: 12,  emoji: '⚡', type: 'Cardio',   met: 11  },
  { name: 'Weight Training',calPerMin: 5.0, emoji: '🏋️', type: 'Strength', met: 4.5 },
  { name: 'HIIT',           calPerMin: 13,  emoji: '🔥', type: 'Cardio',   met: 12  },
  { name: 'Dancing',        calPerMin: 6.0, emoji: '💃', type: 'Cardio',   met: 5.5 },
  { name: 'Hiking',         calPerMin: 7.0, emoji: '🥾', type: 'Cardio',   met: 6.0 },
  { name: 'Pilates',        calPerMin: 4.0, emoji: '🤸', type: 'Flex',     met: 3.8 },
]

export const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

import { recipes as extraRecipes } from '../../data/nutritionData';

export const foodDatabase = [
  // XXL Nutrition Products
  { id: 'xxl1', name: 'Whey Delicious Vanille (30g)', brand: 'XXL Nutrition', kcal: 118, protein: 24, carbs: 3, fats: 1 },
  { id: 'xxl2', name: 'Whey Isolate Aardbei (30g)', brand: 'XXL Nutrition', kcal: 112, protein: 27, carbs: 0.8, fats: 0.3 },
  { id: 'xxl3', name: 'Perfect Oats (50g)', brand: 'XXL Nutrition', kcal: 185, protein: 6, carbs: 30, fats: 4 },
  { id: 'xxl4', name: 'Clear Whey Isolate (25g)', brand: 'XXL Nutrition', kcal: 86, protein: 21, carbs: 0.5, fats: 0 },
  { id: 'xxl5', name: "N'Joy Protein Bar - Choco Caramel (55g)", brand: 'XXL Nutrition', kcal: 206, protein: 20, carbs: 16, fats: 8.3 },
  { id: 'xxl6', name: "N'Joy Protein Bar - Cookies & Cream (55g)", brand: 'XXL Nutrition', kcal: 204, protein: 20, carbs: 16, fats: 8.1 },
  { id: 'xxl7', name: 'Delicious Protein Bar (60g)', brand: 'XXL Nutrition', kcal: 220, protein: 20, carbs: 18, fats: 7 },
  { id: 'xxl8', name: 'High Protein Macaroni (50g)', brand: 'XXL Nutrition', kcal: 173, protein: 30, carbs: 7, fats: 1.5 },
  { id: 'xxl9', name: 'Dry Roasted Peanuts (30g)', brand: 'XXL Nutrition', kcal: 181, protein: 8.4, carbs: 3.6, fats: 14.7 },
  { id: 'xxl10', name: '100% Pindakaas Naturel (15g)', brand: 'XXL Nutrition', kcal: 94, protein: 4.4, carbs: 1.8, fats: 7.4 },
  { id: 'xxl11', name: 'Protein Pancake Mix (50g)', brand: 'XXL Nutrition', kcal: 183, protein: 25, carbs: 15, fats: 2.5 },
  { id: 'xxl12', name: 'Night Protein (Micellar Casein) (30g)', brand: 'XXL Nutrition', kcal: 108, protein: 24, carbs: 1.2, fats: 0.5 },
  { id: 'xxl13', name: 'BCAA Powder (10g)', brand: 'XXL Nutrition', kcal: 36, protein: 9, carbs: 0, fats: 0 },
  { id: 'xxl14', name: 'EAA Powder (10g)', brand: 'XXL Nutrition', kcal: 35, protein: 8.5, carbs: 0, fats: 0 },
  { id: 'xxl15', name: 'Creatine Monohydrate (5g)', brand: 'XXL Nutrition', kcal: 0, protein: 0, carbs: 0, fats: 0 },
  { id: 'xxl16', name: 'Pre Workout Blast (10g)', brand: 'XXL Nutrition', kcal: 15, protein: 0, carbs: 3, fats: 0 },
  { id: 'xxl17', name: 'Weight Gainer (100g)', brand: 'XXL Nutrition', kcal: 388, protein: 30, carbs: 60, fats: 2.5 },
  { id: 'xxl18', name: 'Complex Carb Gainer (100g)', brand: 'XXL Nutrition', kcal: 395, protein: 39, carbs: 48, fats: 4.5 },
  { id: 'xxl19', name: 'Rice Powder (50g)', brand: 'XXL Nutrition', kcal: 185, protein: 4, carbs: 40, fats: 0.5 },
  { id: 'xxl20', name: 'Oatmeal (Havermout) (50g)', brand: 'XXL Nutrition', kcal: 185, protein: 6.5, carbs: 30, fats: 3.5 },
  { id: 'xxl21', name: 'Protein Pudding (40g)', brand: 'XXL Nutrition', kcal: 145, protein: 28, carbs: 5, fats: 1.5 },
  { id: 'xxl22', name: 'Light Saus - Sweet Chili (15ml)', brand: 'XXL Nutrition', kcal: 4, protein: 0, carbs: 0.8, fats: 0 },
  { id: 'xxl23', name: 'Light Saus - BBQ (15ml)', brand: 'XXL Nutrition', kcal: 5, protein: 0, carbs: 1, fats: 0 },
  { id: 'xxl24', name: 'Cooking Spray (1 spray)', brand: 'XXL Nutrition', kcal: 4, protein: 0, carbs: 0, fats: 0.4 },
  { id: 'xxl25', name: 'Protein Chips (30g)', brand: 'XXL Nutrition', kcal: 120, protein: 12, carbs: 10, fats: 3 },
  { id: 'xxl26', name: 'Vegan Protein (30g)', brand: 'XXL Nutrition', kcal: 115, protein: 23, carbs: 2, fats: 1.5 },
  { id: 'xxl27', name: 'Beef Protein (30g)', brand: 'XXL Nutrition', kcal: 114, protein: 27, carbs: 0.5, fats: 0.5 },
  { id: 'xxl28', name: 'Maltodextrin (50g)', brand: 'XXL Nutrition', kcal: 190, protein: 0, carbs: 47.5, fats: 0 },
  { id: 'xxl29', name: 'Dextrose (50g)', brand: 'XXL Nutrition', kcal: 182, protein: 0, carbs: 45.5, fats: 0 },
  { id: 'xxl30', name: 'Waxy Maize (50g)', brand: 'XXL Nutrition', kcal: 185, protein: 0, carbs: 46, fats: 0 },
  { id: 'xxl31', name: 'Liquid Egg Whites (100ml)', brand: 'XXL Nutrition', kcal: 48, protein: 11, carbs: 1, fats: 0 },
  { id: 'xxl32', name: 'Protein Water (500ml)', brand: 'XXL Nutrition', kcal: 80, protein: 20, carbs: 0, fats: 0 },
  { id: 'xxl33', name: 'Fat Killer (1 capsule)', brand: 'XXL Nutrition', kcal: 0, protein: 0, carbs: 0, fats: 0 },
  { id: 'xxl34', name: 'Omega 3 (1 softgel)', brand: 'XXL Nutrition', kcal: 10, protein: 0, carbs: 0, fats: 1 },
  { id: 'xxl35', name: 'Multivit (1 tablet)', brand: 'XXL Nutrition', kcal: 0, protein: 0, carbs: 0, fats: 0 },
  
  // Supermarket Basics
  { id: 'fd1', name: 'Zaanse Hoeve Magere Franse Kwark (500g)', brand: 'Albert Heijn', kcal: 250, protein: 42.5, carbs: 20, fats: 0 },
  { id: 'fd2', name: 'AH 100% Pindakaas (15g)', brand: 'Albert Heijn', kcal: 95, protein: 4, carbs: 2, fats: 8 },
  { id: 'fd3', name: 'Jumbo Havermout (40g)', brand: 'Jumbo', kcal: 150, protein: 5, carbs: 24, fats: 3 },
  { id: 'fd5', name: 'Campina Magere Melk (250ml)', brand: 'Campina', kcal: 82, protein: 8.5, carbs: 11.5, fats: 0 },
  { id: 'fd6', name: 'Chiquita Banaan (120g)', brand: 'Chiquita', kcal: 105, protein: 1, carbs: 27, fats: 0 },
  { id: 'fd7', name: 'AH Volkoren Brood (1 snee, 35g)', brand: 'Albert Heijn', kcal: 82, protein: 4, carbs: 13, fats: 1 },
  { id: 'fd8', name: 'Calvé Pindakaas (15g)', brand: 'Calvé', kcal: 98, protein: 3, carbs: 2, fats: 8 },
  { id: 'fd10', name: 'Jumbo Kipfilet (100g)', brand: 'Jumbo', kcal: 110, protein: 23, carbs: 0, fats: 2 },
  { id: 'fd11', name: 'AH Zalmfilet (100g)', brand: 'Albert Heijn', kcal: 208, protein: 20, carbs: 0, fats: 14 },
  { id: 'fd12', name: 'Avocado (100g)', brand: 'Vers', kcal: 160, protein: 2, carbs: 9, fats: 15 },
  { id: 'fd13', name: 'Appel (Elstar, 135g)', brand: 'Vers', kcal: 72, protein: 0.4, carbs: 19, fats: 0 },
  { id: 'fd14', name: 'Optimel Magere Yoghurt Aardbei (150ml)', brand: 'Optimel', kcal: 48, protein: 5, carbs: 6, fats: 0 },
  { id: 'fd16', name: 'AH Biologische Eieren (1 stuk, 50g)', brand: 'Albert Heijn', kcal: 64, protein: 6, carbs: 0, fats: 4 },
  { id: 'fd17', name: 'Iglo Spinazie a la Creme (200g)', brand: 'Iglo', kcal: 110, protein: 6, carbs: 6, fats: 6 },
  { id: 'fd18', name: 'Lassie Toverrijst (75g ongekookt)', brand: 'Lassie', kcal: 260, protein: 5, carbs: 58, fats: 0.5 },
  { id: 'fd19', name: 'Grand Italia Volkoren Penne (75g ongekookt)', brand: 'Grand Italia', kcal: 265, protein: 10, carbs: 50, fats: 1.5 },
  { id: 'fd20', name: 'Unox Magere Rookworst (100g)', brand: 'Unox', kcal: 210, protein: 13, carbs: 2, fats: 16 }
];

const nutritionRecipesBase = [
  {
    id: 'nr1',
    title: 'Havermoutpap met banaan en pindakaas',
    imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=800',
    prepTimeMin: 10,
    difficulty: 'Makkelijk',
    mealTypes: ['Ontbijt', 'Snack'],
    macrosPerServing: { kcal: 480, protein: 20, carbs: 60, fats: 18 },
    ingredients: [
      { name: 'Havermout', amount: 60, unit: 'g', category: 'Pantry' },
      { name: 'Halfvolle melk', amount: 250, unit: 'ml', category: 'Zuivel' },
      { name: 'Banaan', amount: 1, unit: 'stuk', category: 'Groente & Fruit' },
      { name: '100% Pindakaas', amount: 15, unit: 'g', category: 'Pantry' }
    ]
  },
  {
    id: 'nr2',
    title: 'Volkoren wraps met gegrilde kip en avocado',
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800',
    prepTimeMin: 15,
    difficulty: 'Makkelijk',
    mealTypes: ['Lunch', 'Diner'],
    macrosPerServing: { kcal: 650, protein: 45, carbs: 55, fats: 25 },
    ingredients: [
      { name: 'Volkoren wraps', amount: 2, unit: 'stuks', category: 'Pantry' },
      { name: 'Kipfilet', amount: 150, unit: 'g', category: 'Vlees & Vis' },
      { name: 'Avocado', amount: 0.5, unit: 'stuk', category: 'Groente & Fruit' },
      { name: 'IJsbergsla', amount: 50, unit: 'g', category: 'Groente & Fruit' },
      { name: 'Olijfolie', amount: 1, unit: 'el', category: 'Pantry' }
    ]
  },
  {
    id: 'nr3',
    title: 'Zalmfilet met quinoa en gestoomde broccoli',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800',
    prepTimeMin: 25,
    difficulty: 'Gemiddeld',
    mealTypes: ['Diner'],
    macrosPerServing: { kcal: 850, protein: 45, carbs: 75, fats: 35 },
    ingredients: [
      { name: 'Zalmfilet', amount: 150, unit: 'g', category: 'Vlees & Vis' },
      { name: 'Ongekookte quinoa', amount: 75, unit: 'g', category: 'Pantry' },
      { name: 'Broccoli', amount: 200, unit: 'g', category: 'Groente & Fruit' },
      { name: 'Olijfolie', amount: 1, unit: 'el', category: 'Pantry' }
    ]
  },
  {
    id: 'nr4',
    title: 'Magere kwark met ongezouten gemengde noten',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800',
    prepTimeMin: 2,
    difficulty: 'Makkelijk',
    mealTypes: ['Snack', 'Ontbijt'],
    macrosPerServing: { kcal: 350, protein: 35, carbs: 10, fats: 18 },
    ingredients: [
      { name: 'Magere kwark', amount: 300, unit: 'g', category: 'Zuivel' },
      { name: 'Gemengde noten ongezouten', amount: 30, unit: 'g', category: 'Pantry' }
    ]
  },
  {
    id: 'nr5',
    title: 'Eiwitrijke pannenkoeken met bosvruchten',
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=800',
    prepTimeMin: 15,
    difficulty: 'Gemiddeld',
    mealTypes: ['Ontbijt', 'Snack'],
    macrosPerServing: { kcal: 420, protein: 35, carbs: 45, fats: 10 },
    ingredients: [
      { name: 'Havermeel', amount: 50, unit: 'g', category: 'Pantry' },
      { name: 'Ei', amount: 1, unit: 'stuk', category: 'Zuivel' },
      { name: 'Whey proteïne vanille', amount: 30, unit: 'g', category: 'Supplementen' },
      { name: 'Amandelmelk', amount: 100, unit: 'ml', category: 'Zuivel' },
      { name: 'Diepvries bosvruchten', amount: 50, unit: 'g', category: 'Groente & Fruit' }
    ]
  },
  {
    id: 'nr6',
    title: 'Volkoren pasta met rundergehakt en tomatensaus',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=800',
    prepTimeMin: 20,
    difficulty: 'Gemiddeld',
    mealTypes: ['Diner', 'Lunch'],
    macrosPerServing: { kcal: 800, protein: 50, carbs: 85, fats: 25 },
    ingredients: [
      { name: 'Volkoren pasta', amount: 100, unit: 'g', category: 'Pantry' },
      { name: 'Mager rundergehakt', amount: 150, unit: 'g', category: 'Vlees & Vis' },
      { name: 'Passata di pomodoro', amount: 200, unit: 'g', category: 'Pantry' },
      { name: 'Ui', amount: 1, unit: 'stuk', category: 'Groente & Fruit' },
      { name: 'Knoflook', amount: 1, unit: 'teentje', category: 'Groente & Fruit' }
    ]
  },
  {
    id: 'nr7',
    title: 'Rijstwafels met hüttenkäse en kipfilet',
    imageUrl: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=800',
    prepTimeMin: 5,
    difficulty: 'Makkelijk',
    mealTypes: ['Snack', 'Lunch'],
    macrosPerServing: { kcal: 250, protein: 25, carbs: 25, fats: 5 },
    ingredients: [
      { name: 'Meergranen rijstwafels', amount: 3, unit: 'stuks', category: 'Pantry' },
      { name: 'Hüttenkäse', amount: 100, unit: 'g', category: 'Zuivel' },
      { name: 'Kipfilet (vleeswaren)', amount: 50, unit: 'g', category: 'Vlees & Vis' }
    ]
  },
  {
    id: 'nr8',
    title: 'Biefstuk met geroosterde zoete aardappel',
    imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800',
    prepTimeMin: 30,
    difficulty: 'Gemiddeld',
    mealTypes: ['Diner'],
    macrosPerServing: { kcal: 750, protein: 55, carbs: 65, fats: 25 },
    ingredients: [
      { name: 'Kogelbiefstuk', amount: 200, unit: 'g', category: 'Vlees & Vis' },
      { name: 'Zoete aardappel', amount: 250, unit: 'g', category: 'Groente & Fruit' },
      { name: 'Sperziebonen', amount: 150, unit: 'g', category: 'Groente & Fruit' },
      { name: 'Olijfolie', amount: 1, unit: 'el', category: 'Pantry' }
    ]
  },
  {
    id: 'nr9',
    title: 'Groene smoothie met spinazie, banaan en whey',
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=800',
    prepTimeMin: 5,
    difficulty: 'Makkelijk',
    mealTypes: ['Ontbijt', 'Snack'],
    macrosPerServing: { kcal: 300, protein: 30, carbs: 35, fats: 5 },
    ingredients: [
      { name: 'Verse spinazie', amount: 50, unit: 'g', category: 'Groente & Fruit' },
      { name: 'Banaan', amount: 1, unit: 'stuk', category: 'Groente & Fruit' },
      { name: 'Whey proteïne', amount: 30, unit: 'g', category: 'Supplementen' },
      { name: 'Water', amount: 200, unit: 'ml', category: 'Pantry' }
    ]
  },
  {
    id: 'nr10',
    title: 'Salade met tonijn, ei en olijven',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800',
    prepTimeMin: 10,
    difficulty: 'Makkelijk',
    mealTypes: ['Lunch', 'Diner'],
    macrosPerServing: { kcal: 550, protein: 40, carbs: 15, fats: 35 },
    ingredients: [
      { name: 'Tonijn op water', amount: 1, unit: 'blikje', category: 'Vlees & Vis' },
      { name: 'Gekookte eieren', amount: 2, unit: 'stuks', category: 'Zuivel' },
      { name: 'Gemengde sla', amount: 100, unit: 'g', category: 'Groente & Fruit' },
      { name: 'Zwarte olijven', amount: 30, unit: 'g', category: 'Pantry' },
      { name: 'Olijfolie', amount: 1, unit: 'el', category: 'Pantry' }
    ]
  }
];

const mappedExtraRecipes = extraRecipes
  .filter(r => !nutritionRecipesBase.some(base => base.id === r.id))
  .map(r => ({
  id: r.id,
  title: r.name,
  imageUrl: r.image,
  prepTimeMin: r.prep_time,
  difficulty: 'Makkelijk',
  mealTypes: [r.category],
  macrosPerServing: { kcal: r.calories, protein: r.protein, carbs: r.carbs, fats: r.fats },
  ingredients: [
    { name: 'Zie website voor ingrediënten', amount: 1, unit: 'portie', category: 'Overig' }
  ],
  instructions: r.instructions
}));

export const nutritionRecipes = [
  ...nutritionRecipesBase,
  ...mappedExtraRecipes
];

export const defaultWeekPlan = [
  {
    day: 'Maandag',
    meals: [
      { id: 'm1', type: 'Ontbijt', time: '08:00', recipeId: 'nr1', isConsumed: true },
      { id: 'm2', type: 'Lunch', time: '12:30', recipeId: 'nr2', isConsumed: false },
      { id: 'm3', type: 'Diner', time: '18:30', recipeId: 'nr3', isConsumed: false },
      { id: 'm4', type: 'Snack', time: '21:00', recipeId: 'nr4', isConsumed: false }
    ]
  },
  {
    day: 'Dinsdag',
    meals: [
      { id: 't1', type: 'Ontbijt', time: '08:00', recipeId: 'nr5', isConsumed: false },
      { id: 't2', type: 'Lunch', time: '12:30', recipeId: 'nr10', isConsumed: false },
      { id: 't3', type: 'Diner', time: '18:30', recipeId: 'nr6', isConsumed: false },
      { id: 't4', type: 'Snack', time: '21:00', recipeId: 'nr7', isConsumed: false }
    ]
  },
  {
    day: 'Woensdag',
    meals: [
      { id: 'w1', type: 'Ontbijt', time: '08:00', recipeId: 'nr1', isConsumed: false },
      { id: 'w2', type: 'Lunch', time: '12:30', recipeId: 'nr2', isConsumed: false },
      { id: 'w3', type: 'Diner', time: '18:30', recipeId: 'nr8', isConsumed: false },
      { id: 'w4', type: 'Snack', time: '21:00', recipeId: 'nr9', isConsumed: false }
    ]
  },
  {
    day: 'Donderdag',
    meals: [
      { id: 'th1', type: 'Ontbijt', time: '08:00', recipeId: 'nr5', isConsumed: false },
      { id: 'th2', type: 'Lunch', time: '12:30', recipeId: 'nr10', isConsumed: false },
      { id: 'th3', type: 'Diner', time: '18:30', recipeId: 'nr3', isConsumed: false },
      { id: 'th4', type: 'Snack', time: '21:00', recipeId: 'nr4', isConsumed: false }
    ]
  },
  {
    day: 'Vrijdag',
    meals: [
      { id: 'f1', type: 'Ontbijt', time: '08:00', recipeId: 'nr1', isConsumed: false },
      { id: 'f2', type: 'Lunch', time: '12:30', recipeId: 'nr2', isConsumed: false },
      { id: 'f3', type: 'Diner', time: '18:30', recipeId: 'nr6', isConsumed: false },
      { id: 'f4', type: 'Snack', time: '21:00', recipeId: 'nr7', isConsumed: false }
    ]
  },
  {
    day: 'Zaterdag',
    meals: [
      { id: 's1', type: 'Ontbijt', time: '08:00', recipeId: 'nr5', isConsumed: false },
      { id: 's2', type: 'Lunch', time: '12:30', recipeId: 'nr10', isConsumed: false },
      { id: 's3', type: 'Diner', time: '18:30', recipeId: 'nr8', isConsumed: false },
      { id: 's4', type: 'Snack', time: '21:00', recipeId: 'nr9', isConsumed: false }
    ]
  },
  {
    day: 'Zondag',
    meals: [
      { id: 'su1', type: 'Ontbijt', time: '08:00', recipeId: 'nr1', isConsumed: false },
      { id: 'su2', type: 'Lunch', time: '12:30', recipeId: 'nr2', isConsumed: false },
      { id: 'su3', type: 'Diner', time: '18:30', recipeId: 'nr3', isConsumed: false },
      { id: 'su4', type: 'Snack', time: '21:00', recipeId: 'nr4', isConsumed: false }
    ]
  }
];
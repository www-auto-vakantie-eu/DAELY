export type NutritionItemType = 'food' | 'drink' | 'supplement';

export type NutritionMealType =
  | 'ontbijt'
  | 'lunch'
  | 'diner'
  | 'snack'
  | 'pre-workout'
  | 'post-workout'
  | 'supplement';

export type NutritionSourceType = 'manual' | 'barcode';

export interface NutritionMacros {
  kcal: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface NutritionLogEntry {
  id: string;
  createdAt: string;
  loggedAt: string;
  dayKey: string;
  source: NutritionSourceType;
  itemType: NutritionItemType;
  mealType: NutritionMealType;
  name: string;
  brand?: string;
  amount?: number;
  amountUnit?: string;
  macros: NutritionMacros;
  notes?: string;
  isSynced: boolean;
}

export interface CreateNutritionLogInput {
  source?: NutritionSourceType;
  itemType: NutritionItemType;
  mealType: NutritionMealType;
  name: string;
  brand?: string;
  amount?: number;
  amountUnit?: string;
  macros: NutritionMacros;
  notes?: string;
  loggedAt?: string;
}

export interface NutritionDailyTotals extends NutritionMacros {
  dayKey: string;
  itemCount: number;
}

export type UpdateNutritionLogInput = Partial<
  Omit<CreateNutritionLogInput, 'itemType' | 'mealType' | 'name' | 'macros'>
> & {
  itemType?: NutritionItemType;
  mealType?: NutritionMealType;
  name?: string;
  macros?: Partial<NutritionMacros>;
};

import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { nutritionRecipes, foodDatabase } from '../data/nutritionData';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const useNutrition = () => {
  const {
    user,
    nutritionPlan,
    setNutritionPlan,
    nutritionSelectedDay,
    customFoodForm,
    setCustomFoodForm,
    setShowAddCustomFood,
    setFoodSearchQuery,
    setFoodSearchResults,
    setShowSwapMeal,
    showSwapMeal
  } = useAppContext();

  const savePlanToFirebase = async (newPlan: any) => {
    setNutritionPlan(newPlan);
    if (user) {
      try {
        await setDoc(doc(db, `users/${user.uid}/nutrition/weeklyPlan`), { plan: newPlan }, { merge: true });
      } catch (error) {
        console.error("Error saving nutrition plan:", error);
      }
    }
  };

  const handleAddCustomFood = () => {
    if (!customFoodForm.name) return;
    
    const newPlan = nutritionPlan.map(dayPlan => {
      if (dayPlan.day === nutritionSelectedDay) {
        const newMeal = {
          id: `custom-${Date.now()}`,
          type: 'Extra',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recipeId: '',
          isConsumed: true,
          customDetails: { ...customFoodForm }
        };
        return { ...dayPlan, meals: [...dayPlan.meals, newMeal] };
      }
      return dayPlan;
    });
    
    savePlanToFirebase(newPlan);
    
    setShowAddCustomFood(false);
    setCustomFoodForm({ name: '', kcal: 0, protein: 0, carbs: 0, fats: 0 });
    setFoodSearchQuery('');
    setFoodSearchResults([]);
  };

  const handleFoodSearch = async (query: string) => {
    setFoodSearchQuery(query);
    if (query.length < 2) {
      setFoodSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const localResults = foodDatabase.filter(food => 
      food.name.toLowerCase().includes(lowerQuery) || 
      food.brand.toLowerCase().includes(lowerQuery)
    );
    
    setFoodSearchResults(localResults);

    try {
        const targetUrl = `https://nl.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=15`;
        
        try {
          const response = await fetch(targetUrl, {
            headers: { 'User-Agent': 'DaelyPerformanceApp - Web - Version 1.0' }
          });
          const data = await response.json();
          
          if (data.products && data.products.length > 0) {
            const apiResults = data.products
              .filter((p: any) => p.product_name && p.nutriments && p.nutriments['energy-kcal_100g'])
              .map((p: any) => ({
                id: p.code,
                name: p.product_name,
                brand: p.brands || 'Onbekend',
                kcal: Math.round(p.nutriments['energy-kcal_100g']),
                protein: Math.round(p.nutriments.proteins_100g || 0),
                carbs: Math.round(p.nutriments.carbohydrates_100g || 0),
                fats: Math.round(p.nutriments.fat_100g || 0),
                servingSize: p.serving_quantity ? `${p.serving_quantity}g` : '100g',
                category: 'API Resultaat'
              }));
              
            setFoodSearchResults(prev => {
              const combined = [...prev, ...apiResults];
              const unique = Array.from(new Map(combined.map(item => [item.name.toLowerCase(), item])).values());
              return unique.slice(0, 20);
            });
          }
        } catch (apiError) {
          console.warn("Direct API call failed, trying proxy...", apiError);
          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
          const proxyResponse = await fetch(proxyUrl);
          if (!proxyResponse.ok) throw new Error('Proxy failed');
          const proxyData = await proxyResponse.json();
          const data = JSON.parse(proxyData.contents);
          
          if (data.products && data.products.length > 0) {
            const apiResults = data.products
              .filter((p: any) => p.product_name && p.nutriments && p.nutriments['energy-kcal_100g'])
              .map((p: any) => ({
                id: p.code,
                name: p.product_name,
                brand: p.brands || 'Onbekend',
                kcal: Math.round(p.nutriments['energy-kcal_100g']),
                protein: Math.round(p.nutriments.proteins_100g || 0),
                carbs: Math.round(p.nutriments.carbohydrates_100g || 0),
                fats: Math.round(p.nutriments.fat_100g || 0),
                servingSize: p.serving_quantity ? `${p.serving_quantity}g` : '100g',
                category: 'API Resultaat'
              }));
              
            setFoodSearchResults(prev => {
              const combined = [...prev, ...apiResults];
              const unique = Array.from(new Map(combined.map(item => [item.name.toLowerCase(), item])).values());
              return unique.slice(0, 20);
            });
          }
        }
    } catch (error) {
        console.error("Error fetching food data:", error);
    }
  };

  const handleSelectFood = (food: typeof foodDatabase[0]) => {
    setCustomFoodForm({
      name: food.name,
      kcal: food.kcal,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats
    });
  };

  const handleSwapMeal = (recipe: any) => {
    if (!showSwapMeal) return;
    
    const newPlan = nutritionPlan.map(dayPlan => {
      if (dayPlan.day === nutritionSelectedDay) {
        return {
          ...dayPlan,
          meals: dayPlan.meals.map(meal => 
            meal.id === showSwapMeal.mealId 
              ? { ...meal, recipeId: recipe.id, customDetails: undefined }
              : meal
          )
        };
      }
      return dayPlan;
    });
    savePlanToFirebase(newPlan);
    setShowSwapMeal(null);
  };

  const handleToggleMealConsumed = (day: string, mealId: string) => {
    const newPlan = nutritionPlan.map(dayPlan => {
      if (dayPlan.day === day) {
        return {
          ...dayPlan,
          meals: dayPlan.meals.map(meal => 
            meal.id === mealId ? { ...meal, isConsumed: !meal.isConsumed } : meal
          )
        };
      }
      return dayPlan;
    });
    savePlanToFirebase(newPlan);
  };

  const handleDeleteMeal = (day: string, mealId: string) => {
    const newPlan = nutritionPlan.map(dayPlan => {
      if (dayPlan.day === day) {
        return {
          ...dayPlan,
          meals: dayPlan.meals.filter(meal => meal.id !== mealId)
        };
      }
      return dayPlan;
    });
    savePlanToFirebase(newPlan);
  };

  const calculateDayMacros = (dayPlan: any) => {
    let total = { kcal: 0, protein: 0, carbs: 0, fats: 0 };
    let consumed = { kcal: 0, protein: 0, carbs: 0, fats: 0 };

    dayPlan?.meals.forEach((meal: any) => {
      let mealMacros = { kcal: 0, protein: 0, carbs: 0, fats: 0 };
      
      if (meal.customDetails) {
        mealMacros = meal.customDetails;
      } else {
        const recipe = nutritionRecipes.find(r => r.id === meal.recipeId);
        if (recipe) {
          mealMacros = recipe.macrosPerServing;
        }
      }

      total.kcal += mealMacros.kcal;
      total.protein += mealMacros.protein;
      total.carbs += mealMacros.carbs;
      total.fats += mealMacros.fats;

      if (meal.isConsumed) {
        consumed.kcal += mealMacros.kcal;
        consumed.protein += mealMacros.protein;
        consumed.carbs += mealMacros.carbs;
        consumed.fats += mealMacros.fats;
      }
    });

    return { total, consumed };
  };

  const generateGroceryList = () => {
    const list: Record<string, { amount: number, unit: string, category: string }> = {};
    
    nutritionPlan.forEach(day => {
      day.meals.forEach(meal => {
        if (!meal.customDetails) {
          const recipe = nutritionRecipes.find(r => r.id === meal.recipeId);
          recipe?.ingredients.forEach(ing => {
            const key = ing.name.toLowerCase();
            if (list[key]) {
              list[key].amount += ing.amount;
            } else {
              list[key] = { amount: ing.amount, unit: ing.unit, category: ing.category || 'Algemeen' };
            }
          });
        }
      });
    });

    const groupedList: Record<string, any[]> = {};
    Object.entries(list).forEach(([item, details]) => {
      if (!groupedList[details.category]) {
        groupedList[details.category] = [];
      }
      groupedList[details.category].push({ item, ...details });
    });

    return groupedList;
  };

  const dynamicMacroData = useMemo(() => {
    const dayMap: Record<string, string> = {
      'Maandag': 'Ma', 'Dinsdag': 'Di', 'Woensdag': 'Wo',
      'Donderdag': 'Do', 'Vrijdag': 'Vr', 'Zaterdag': 'Za', 'Zondag': 'Zo'
    };

    return nutritionPlan.map(dayPlan => {
      const macros = calculateDayMacros(dayPlan);
      return {
        name: dayMap[dayPlan.day] || dayPlan.day.substring(0, 2),
        kcal: macros.consumed.kcal,
        protein: macros.consumed.protein,
        carbs: macros.consumed.carbs,
        fat: macros.consumed.fats
      };
    });
  }, [nutritionPlan]);

  return {
    handleAddCustomFood,
    handleFoodSearch,
    handleSelectFood,
    handleSwapMeal,
    handleToggleMealConsumed,
    handleDeleteMeal,
    calculateDayMacros,
    generateGroceryList,
    dynamicMacroData
  };
};

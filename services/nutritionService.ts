import { DailyLog, LoggedFoodItem, Meals } from "../types";

export const createEmptyLog = (): DailyLog => {
    return {
        date: new Date().toISOString().split('T')[0],
        meals: {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: [],
        },
        workoutCompleted: false,
    };
};

export const getTodayLog = (logs: DailyLog[]): DailyLog => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLog = logs.find(log => log.date === todayStr);
    return todayLog || createEmptyLog();
};

export const getTotalMacros = (meals: Meals): { calories: number; protein: number; carbs: number; fat: number; fiber: number } => {
    const allFoods: LoggedFoodItem[] = Object.values(meals).flat();
    
    return allFoods.reduce((totals, food) => {
        // Calculate the multiplier based on the logged amount vs. the base serving size
        const multiplier = food.loggedAmount / food.servingSize;

        return {
            calories: totals.calories + (food.calories * multiplier),
            protein: totals.protein + (food.protein * multiplier),
            carbs: totals.carbs + (food.carbs * multiplier),
            fat: totals.fat + (food.fat * multiplier),
            fiber: totals.fiber + (food.fiber * multiplier),
        };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
};

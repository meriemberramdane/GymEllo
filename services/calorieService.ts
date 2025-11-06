import { UserProfile, NutrientGoals } from '../types';

export const calculateNutrientGoals = (profile: UserProfile): NutrientGoals => {
    const { weight, height, age, gender, workoutFrequency, fitnessGoal } = profile;

    // 1. Calculate Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation, a widely accepted formula.
    // This is the number of calories your body needs to function at rest.
    let bmr: number;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else { // 'female' or 'other' - using the female formula as a baseline for 'other'.
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // 2. Determine Total Daily Energy Expenditure (TDEE) by multiplying BMR by an activity multiplier.
    // This estimates the total calories burned in a day, including exercise.
    let activityMultiplier: number;
    if (workoutFrequency <= 3) {
        activityMultiplier = 1.375; // light activity (workouts 1-3 days/week)
    } else if (workoutFrequency <= 5) {
        activityMultiplier = 1.55; // moderate activity (workouts 4-5 days/week)
    } else {
        activityMultiplier = 1.725; // very active (workouts 6-7 days/week)
    }
    
    const tdee = bmr * activityMultiplier;

    // 3. Adjust daily calorie goal based on the user's primary fitness goal.
    let calorieGoal: number;
    switch (fitnessGoal) {
        case 'lose_fat':
            calorieGoal = tdee - 400; // Creates a sustainable caloric deficit for fat loss.
            break;
        case 'build_muscle':
            calorieGoal = tdee + 300; // Creates a modest caloric surplus to fuel muscle growth.
            break;
        case 'recomposition':
        default:
            calorieGoal = tdee; // Aims for maintenance calories to build muscle and lose fat simultaneously.
            break;
    }
    
    // 4. Calculate macronutrient goals based on a common split (e.g., 40% Carbs, 30% Protein, 30% Fat).
    // Protein is set high to support muscle repair and growth.
    const proteinGoal = (calorieGoal * 0.30) / 4; // 4 calories per gram of protein
    const carbsGoal = (calorieGoal * 0.40) / 4;   // 4 calories per gram of carbs
    const fatGoal = (calorieGoal * 0.30) / 9;     // 9 calories per gram of fat
    
    // 5. Calculate fiber goal based on the general recommendation of 14g per 1000 calories.
    const fiberGoal = Math.round((calorieGoal / 1000) * 14);

    return {
        calories: Math.round(calorieGoal),
        protein: Math.round(proteinGoal),
        carbs: Math.round(carbsGoal),
        fat: Math.round(fatGoal),
        fiber: fiberGoal
    };
};
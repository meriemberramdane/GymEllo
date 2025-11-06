export type View = 'home' | 'dashboard' | 'planner' | 'nutrition' | 'profile';

export type Gender = 'male' | 'female' | 'other';
export type FitnessGoal = 'build_muscle' | 'lose_fat' | 'recomposition';

export interface UserProfile {
  username: string;
  name: string;
  age: number;
  gender: Gender;
  height: number; // in cm
  weight: number; // in kg
  workoutFrequency: number; // days per week
  workoutDays: string[]; // e.g., ['Monday', 'Wednesday', 'Friday']
  fitnessGoal: FitnessGoal;
  profilePicture?: string; // Base64 encoded image
}

export interface User {
  email: string;
  profile: UserProfile;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: number; // in seconds
  muscleGroup: string;
  category: 'weight_training' | 'cardio' | 'stretching' | 'hiit';
  equipment?: string;
  description?: string;
}

export interface WorkoutSession {
  day: string; // e.g., 'Monday'
  title: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  [key: string]: WorkoutSession;
}

export interface WeightLog {
  date: string; // ISO string
  weight: number; // in kg
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  servingSize: number; // e.g., 100
  servingUnit: string; // e.g., 'g'
}

export interface LoggedFoodItem extends FoodItem {
    id: string; 
    loggedAmount: number;
    loggedUnit: string;
}

export type Meal = LoggedFoodItem[];

export interface Meals {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal;
}

export type MealType = keyof Meals;

export interface DailyLog {
  date: string; // YYY-MM-DD
  meals: Meals;
  workoutCompleted: boolean;
}

export interface NutrientGoals {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
}

export interface CustomMeal {
    id: string;
    name: string;
    ingredients: LoggedFoodItem[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
}

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
}
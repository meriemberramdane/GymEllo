import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, UserProfile, WorkoutPlan, WeightLog, DailyLog, LoggedFoodItem, MealType, CustomMeal, Todo } from '../types';
import { generateWorkoutPlan } from '../services/workoutService';
import { createEmptyLog } from '../services/nutritionService';

interface UserContextType {
  user: User | null;
  workoutPlan: WorkoutPlan | null;
  dailyLogs: DailyLog[];
  weightLog: WeightLog[];
  customMeals: CustomMeal[];
  todoList: Todo[];
  register: (email: string, profile: UserProfile) => { success: boolean; message?: string };
  logout: () => void;
  addWeightLog: (weight: number) => void;
  addFoodToLog: (mealType: MealType, food: LoggedFoodItem) => void;
  removeFoodFromLog: (mealType: MealType, foodId: string) => void;
  toggleWorkoutCompleted: (day: string) => void;
  updateUserProfile: (newProfile: UserProfile) => void;
  updateWorkoutPlan: (newPlan: WorkoutPlan) => void;
  addCustomMeal: (meal: CustomMeal) => void;
  removeCustomMeal: (mealId: string) => void;
  addTodo: (text: string) => void;
  removeTodo: (id: string) => void;
  toggleTodoCompleted: (id: string) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(() => JSON.parse(localStorage.getItem('workoutPlan') || 'null'));
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(() => JSON.parse(localStorage.getItem('dailyLogs') || '[]'));
  const [weightLog, setWeightLog] = useState<WeightLog[]>(() => JSON.parse(localStorage.getItem('weightLog') || '[]'));
  const [customMeals, setCustomMeals] = useState<CustomMeal[]>(() => JSON.parse(localStorage.getItem('customMeals') || '[]'));
  const [todoList, setTodoList] = useState<Todo[]>(() => JSON.parse(localStorage.getItem('todoList') || '[]'));

  useEffect(() => { localStorage.setItem('user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('workoutPlan', JSON.stringify(workoutPlan)); }, [workoutPlan]);
  useEffect(() => { localStorage.setItem('dailyLogs', JSON.stringify(dailyLogs)); }, [dailyLogs]);
  useEffect(() => { localStorage.setItem('weightLog', JSON.stringify(weightLog)); }, [weightLog]);
  useEffect(() => { localStorage.setItem('customMeals', JSON.stringify(customMeals)); }, [customMeals]);
  useEffect(() => { localStorage.setItem('todoList', JSON.stringify(todoList)); }, [todoList]);


  const register = (email: string, profile: UserProfile): { success: boolean; message?: string } => {
    const allUsers: User[] = JSON.parse(localStorage.getItem('gymello_users') || '[]');
    
    const usernameExists = allUsers.some(u => u.profile.username.toLowerCase() === profile.username.toLowerCase());
    if (usernameExists) {
        return { success: false, message: 'This username is already taken.' };
    }
    
    const emailExists = allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
        return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = { email, profile };
    const updatedUsers = [...allUsers, newUser];
    localStorage.setItem('gymello_users', JSON.stringify(updatedUsers));

    setUser(newUser);
    const newPlan = generateWorkoutPlan(profile);
    setWorkoutPlan(newPlan);
    setDailyLogs([]);
    setWeightLog([{ date: new Date().toISOString(), weight: profile.weight }]);
    setCustomMeals([]);
    setTodoList([]);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setWorkoutPlan(null);
    setDailyLogs([]);
    setWeightLog([]);
    setCustomMeals([]);
    setTodoList([]);
    localStorage.removeItem('user');
    // We keep other data like workout plan in case the user wants to log back in
    // to a different account, but we should clear the active user.
    // For a full logout, localStorage.clear() would be used.
  };
  
  const addWeightLog = (weight: number) => {
      const newLog: WeightLog = { date: new Date().toISOString(), weight };
      setWeightLog(prev => [...prev, newLog]);
  };
  
  const addFoodToLog = (mealType: MealType, food: LoggedFoodItem) => {
    const today = new Date().toISOString().split('T')[0];
    const todayLog = dailyLogs.find(log => log.date === today) || createEmptyLog();
    const updatedMeals = { ...todayLog.meals, [mealType]: [...todayLog.meals[mealType], food] };
    const updatedLog = { ...todayLog, meals: updatedMeals };
    setDailyLogs(prev => [...prev.filter(log => log.date !== today), updatedLog].sort((a, b) => a.date.localeCompare(b.date)));
  };

  const removeFoodFromLog = (mealType: MealType, foodId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const todayLog = dailyLogs.find(log => log.date === today);
    if (!todayLog) return;
    const updatedMeal = todayLog.meals[mealType].filter(food => food.id !== foodId);
    const updatedMeals = { ...todayLog.meals, [mealType]: updatedMeal };
    const updatedLog = { ...todayLog, meals: updatedMeals };
    setDailyLogs(prev => [...prev.filter(log => log.date !== today), updatedLog].sort((a, b) => a.date.localeCompare(b.date)));
  };
  
  const toggleWorkoutCompleted = (day: string) => {
      const today = new Date().toISOString().split('T')[0];
      const todayLog = dailyLogs.find(log => log.date === today) || createEmptyLog();
      const updatedLog = { ...todayLog, workoutCompleted: true };
      setDailyLogs(prev => [...prev.filter(log => log.date !== today), updatedLog].sort((a, b) => a.date.localeCompare(b.date)));
  };

  const updateUserProfile = (newProfile: UserProfile) => {
    if (user) {
      const oldProfile = user.profile;
      const updatedUser = { ...user, profile: newProfile };
      setUser(updatedUser);
      if (JSON.stringify(oldProfile.workoutDays) !== JSON.stringify(newProfile.workoutDays) || oldProfile.workoutFrequency !== newProfile.workoutFrequency) {
        const newPlan = generateWorkoutPlan(newProfile);
        setWorkoutPlan(newPlan);
      }
    }
  };
  
  const updateWorkoutPlan = (newPlan: WorkoutPlan) => {
    setWorkoutPlan(newPlan);
  };
  
  const addCustomMeal = (meal: CustomMeal) => {
    setCustomMeals(prev => [...prev, meal]);
  };
  
  const removeCustomMeal = (mealId: string) => {
    setCustomMeals(prev => prev.filter(meal => meal.id !== mealId));
  };

  const addTodo = (text: string) => {
    const newTodo: Todo = { id: Date.now().toString(), text, completed: false };
    setTodoList(prev => [...prev, newTodo]);
  };

  const removeTodo = (id: string) => {
    setTodoList(prev => prev.filter(todo => todo.id !== id));
  };
  
  const toggleTodoCompleted = (id: string) => {
    setTodoList(prev => prev.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  return (
    <UserContext.Provider value={{
      user, workoutPlan, dailyLogs, weightLog, customMeals, todoList,
      register, logout, addWeightLog, addFoodToLog, removeFoodFromLog, 
      toggleWorkoutCompleted, updateUserProfile, updateWorkoutPlan,
      addCustomMeal, removeCustomMeal, addTodo, removeTodo, toggleTodoCompleted
    }}>
      {children}
    </UserContext.Provider>
  );
};
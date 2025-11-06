import React, { useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { calculateNutrientGoals } from '../../services/calorieService';
import { getTodayLog, getTotalMacros } from '../../services/nutritionService';
import AddFoodModal from './AddFoodModal';
import { MealType, LoggedFoodItem, CustomMeal } from '../../types';
import { TrashIcon, BookOpenIcon } from '../icons/Icons';
import CreateMealModal from './CreateMealModal';

const Nutrition: React.FC = () => {
    const userContext = useContext(UserContext);
    const [isAddFoodModalOpen, setAddFoodModalOpen] = useState(false);
    const [isCreateMealModalOpen, setCreateMealModalOpen] = useState(false);
    const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');

    if (!userContext || !userContext.user) {
        return <div>Loading...</div>;
    }

    const { user, dailyLogs, removeFoodFromLog, customMeals, addFoodToLog, removeCustomMeal } = userContext;

    const nutrientGoals = calculateNutrientGoals(user.profile);
    const todayLog = getTodayLog(dailyLogs);
    const totals = getTotalMacros(todayLog.meals);

    const openAddFoodModal = (mealType: MealType) => {
        setSelectedMealType(mealType);
        setAddFoodModalOpen(true);
    };
    
    const handleLogCustomMeal = (meal: CustomMeal, mealType: MealType) => {
        // Here you could add a modal to ask for portion size (e.g., 0.5x, 1.5x)
        // For simplicity, we'll log the whole meal (1x)
        meal.ingredients.forEach(ingredient => {
            const foodToLog: LoggedFoodItem = {
                ...ingredient,
                id: `${ingredient.id}-${Date.now()}-${Math.random()}` // Ensure unique id for each log instance
            };
            addFoodToLog(mealType, foodToLog);
        });
    }

    const MacroProgress = ({ name, value, goal, color, unit }: { name: string, value: number, goal: number, color: string, unit: string }) => (
      <div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <span className="font-semibold text-gray-300">{name}</span>
          </div>
          <span className="text-white font-medium">{value.toFixed(0)} / {goal.toFixed(0)} {unit}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-1.5">
          <div className={`${color} h-2 rounded-full`} style={{ width: `${Math.min(100, (value / goal) * 100)}%` }}></div>
        </div>
      </div>
    );
    
    const MealCard = ({ title, mealType, foods }: { title: string, mealType: MealType, foods: LoggedFoodItem[] }) => (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-heading text-white">{title}</h3>
                <Button size="sm" variant="secondary" onClick={() => openAddFoodModal(mealType)}>Add Food</Button>
            </div>
            <ul className="space-y-3">
                {foods.length > 0 ? foods.map((food) => (
                    <li key={food.id} className="text-gray-300 flex justify-between items-center group">
                        <div>
                            <p>{food.name}</p>
                            <p className="text-xs text-gray-500">{food.loggedAmount}{food.loggedUnit}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                           <span>{food.calories.toFixed(0)} kcal</span>
                           <button onClick={() => removeFoodFromLog(mealType, food.id)} className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                               <TrashIcon className="w-4 h-4" />
                           </button>
                        </div>
                    </li>
                )) : <p className="text-gray-500 text-sm">No food logged yet.</p>}
            </ul>
        </Card>
    );

    const MyMealsView = () => (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-heading text-white">My Meals</h2>
                <Button size="sm" onClick={() => setCreateMealModalOpen(true)}>Create Meal</Button>
            </div>
            {customMeals.length > 0 ? (
                <div className="space-y-3">
                    {customMeals.map(meal => (
                        <div key={meal.id} className="bg-gray-800/50 p-4 rounded-lg group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-white">{meal.name}</h3>
                                    <p className="text-sm text-gray-400">{meal.totalCalories.toFixed(0)} kcal &bull; {meal.totalProtein.toFixed(0)}g Protein</p>
                                    <div className="mt-2 text-xs text-gray-500">
                                        {meal.ingredients.map(ing => ing.name).slice(0, 3).join(', ')}{meal.ingredients.length > 3 ? '...' : ''}
                                    </div>
                                </div>
                                <button onClick={() => removeCustomMeal(meal.id)} className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="mt-3">
                                <p className="text-sm text-gray-300 mb-1">Log to:</p>
                                <div className="flex space-x-2">
                                    {(['breakfast', 'lunch', 'dinner', 'snacks'] as MealType[]).map(mt => (
                                        <Button key={mt} onClick={() => handleLogCustomMeal(meal, mt)} size="sm" variant="secondary" className="capitalize">{mt}</Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">You haven't created any meals yet. Create one to quickly log it later!</p>
            )}
        </Card>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8">
                Fuel Your <span className="text-red-500">Performance</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                    <Card>
                        <h2 className="text-2xl font-heading text-white mb-4">Today's Goals</h2>
                        <div className="space-y-4">
                          <MacroProgress name="Calories" value={totals.calories} goal={nutrientGoals.calories} color="bg-red-500" unit="kcal" />
                          <MacroProgress name="Protein" value={totals.protein} goal={nutrientGoals.protein} color="bg-green-500" unit="g" />
                          <MacroProgress name="Carbs" value={totals.carbs} goal={nutrientGoals.carbs} color="bg-orange-500" unit="g" />
                          <MacroProgress name="Fat" value={totals.fat} goal={nutrientGoals.fat} color="bg-blue-500" unit="g" />
                          <MacroProgress name="Fiber" value={totals.fiber} goal={nutrientGoals.fiber} color="bg-purple-500" unit="g" />
                        </div>
                    </Card>
                    <MyMealsView />
                </div>
                <div className="lg:col-span-2 space-y-8">
                    <MealCard title="Breakfast" mealType="breakfast" foods={todayLog.meals.breakfast} />
                    <MealCard title="Lunch" mealType="lunch" foods={todayLog.meals.lunch} />
                    <MealCard title="Dinner" mealType="dinner" foods={todayLog.meals.dinner} />
                    <MealCard title="Snacks" mealType="snacks" foods={todayLog.meals.snacks} />
                </div>
            </div>
            {isAddFoodModalOpen && <AddFoodModal mealType={selectedMealType} onClose={() => setAddFoodModalOpen(false)} />}
            {isCreateMealModalOpen && <CreateMealModal onClose={() => setCreateMealModalOpen(false)} />}
        </div>
    );
};

export default Nutrition;
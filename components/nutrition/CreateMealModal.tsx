import React, { useState, useContext } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { UserContext } from '../../contexts/UserContext';
import { getFoodNutritionInfo } from '../../services/geminiService';
import { FoodItem, LoggedFoodItem, CustomMeal } from '../../types';
import { LoaderIcon, PlusIcon, TrashIcon } from '../icons/Icons';

interface CreateMealModalProps {
  onClose: () => void;
}

const CreateMealModal: React.FC<CreateMealModalProps> = ({ onClose }) => {
  const userContext = useContext(UserContext);
  const [mealName, setMealName] = useState('');
  const [ingredients, setIngredients] = useState<LoggedFoodItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchTerm) return;
    setIsLoading(true);
    setError('');
    try {
      const foodInfo = await getFoodNutritionInfo(`${searchTerm} in grams`);
      if (foodInfo && foodInfo.calories > 0) {
        const newIngredient: LoggedFoodItem = {
          ...foodInfo,
          id: Date.now().toString(),
          loggedAmount: foodInfo.servingSize,
          loggedUnit: foodInfo.servingUnit,
        };
        setIngredients(prev => [...prev, newIngredient]);
        setSearchTerm('');
      } else {
        setError(`Could not find "${searchTerm}".`);
      }
    } catch (e) {
      setError('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateIngredientAmount = (id: string, amount: number) => {
    setIngredients(prev => prev.map(ing => ing.id === id ? {...ing, loggedAmount: amount} : ing));
  };
  
  const removeIngredient = (id: string) => {
    setIngredients(prev => prev.filter(ing => ing.id !== id));
  }
  
  const handleSaveMeal = () => {
    if (!mealName || ingredients.length === 0 || !userContext) return;
    
    const totals = ingredients.reduce((acc, ing) => {
      const multiplier = ing.loggedAmount / ing.servingSize;
      acc.calories += ing.calories * multiplier;
      acc.protein += ing.protein * multiplier;
      acc.carbs += ing.carbs * multiplier;
      acc.fat += ing.fat * multiplier;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    const newMeal: CustomMeal = {
      id: Date.now().toString(),
      name: mealName,
      ingredients: ingredients,
      totalCalories: totals.calories,
      totalProtein: totals.protein,
      totalCarbs: totals.carbs,
      totalFat: totals.fat,
    }
    userContext.addCustomMeal(newMeal);
    onClose();
  }

  return (
    <Modal onClose={onClose} title="Create Custom Meal">
      <div className="space-y-4 max-h-[70vh] flex flex-col">
        <Input label="Meal Name" value={mealName} onChange={e => setMealName(e.target.value)} placeholder="e.g., Protein Power Bowl" />
        
        <div className="flex-grow overflow-y-auto space-y-3 pr-2">
            {ingredients.map(ing => (
                <div key={ing.id} className="bg-gray-800/50 p-3 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-white">{ing.name}</p>
                        <p className="text-xs text-gray-400">
                           {(ing.calories * (ing.loggedAmount/ing.servingSize)).toFixed(0)} kcal
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                         <Input label="" type="number" value={ing.loggedAmount} onChange={e => updateIngredientAmount(ing.id, parseFloat(e.target.value))} className="!w-20 !py-1" />
                         <span className="text-gray-400">{ing.servingUnit}</span>
                         <button onClick={() => removeIngredient(ing.id)} className="text-gray-500 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
                    </div>
                </div>
            ))}
        </div>
        
        <div>
            <div className="flex space-x-2 items-end">
                <Input label="Add Ingredient" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search for a food..."/>
                <Button onClick={handleSearch} disabled={isLoading} className="!px-3">{isLoading ? <LoaderIcon className="animate-spin"/> : <PlusIcon/>}</Button>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <Button onClick={handleSaveMeal} disabled={!mealName || ingredients.length === 0} className="w-full mt-4">
          Save Meal
        </Button>
      </div>
    </Modal>
  );
};

export default CreateMealModal;
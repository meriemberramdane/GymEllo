import React, { useState, useContext, useEffect } from 'react';
import Modal from '../ui/Modal';
import { UserContext } from '../../contexts/UserContext';
import { MealType, FoodItem, LoggedFoodItem } from '../../types';
import { getFoodNutritionInfo } from '../../services/geminiService';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { LoaderIcon } from '../icons/Icons';

interface AddFoodModalProps {
  mealType: MealType;
  onClose: () => void;
}

const AddFoodModal: React.FC<AddFoodModalProps> = ({ mealType, onClose }) => {
  const userContext = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [baseFood, setBaseFood] = useState<FoodItem | null>(null);
  const [loggedAmount, setLoggedAmount] = useState(100);
  const [calculatedMacros, setCalculatedMacros] = useState<Omit<FoodItem, 'name' | 'servingSize' | 'servingUnit'> | null>(null);

  if (!userContext) return null;
  const { addFoodToLog } = userContext;

  useEffect(() => {
    if (baseFood) {
      const multiplier = loggedAmount / baseFood.servingSize;
      setCalculatedMacros({
        calories: baseFood.calories * multiplier,
        protein: baseFood.protein * multiplier,
        carbs: baseFood.carbs * multiplier,
        fat: baseFood.fat * multiplier,
        fiber: baseFood.fiber * multiplier,
      });
      setLoggedAmount(baseFood.servingSize)
    } else {
        setCalculatedMacros(null);
    }
  }, [baseFood]);
  
  useEffect(() => {
    if(baseFood && loggedAmount > 0) {
        const multiplier = loggedAmount / baseFood.servingSize;
        setCalculatedMacros({
            calories: baseFood.calories * multiplier,
            protein: baseFood.protein * multiplier,
            carbs: baseFood.carbs * multiplier,
            fat: baseFood.fat * multiplier,
            fiber: baseFood.fiber * multiplier,
        });
    }
  }, [loggedAmount, baseFood])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;
    
    setIsLoading(true);
    setError('');
    setBaseFood(null);
    
    try {
      const foodInfo = await getFoodNutritionInfo(searchTerm);
      if (foodInfo && foodInfo.calories > 0) {
        setBaseFood(foodInfo);
      } else {
        setError(`Could not find nutritional information for "${searchTerm}".`);
      }
    } catch (err) {
      setError("An error occurred while searching. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFood = () => {
    if (baseFood && calculatedMacros) {
      const loggedFood: LoggedFoodItem = {
        ...baseFood,
        id: new Date().toISOString() + Math.random(),
        calories: calculatedMacros.calories,
        protein: calculatedMacros.protein,
        carbs: calculatedMacros.carbs,
        fat: calculatedMacros.fat,
        fiber: calculatedMacros.fiber,
        loggedAmount: loggedAmount,
        loggedUnit: baseFood.servingUnit,
      };
      addFoodToLog(mealType, loggedFood);
      onClose();
    }
  };
  
  return (
    <Modal onClose={onClose} title={`Add Food to ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`}>
      <div className="space-y-4">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <Input 
            label=""
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="e.g., 1 cup of brown rice"
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading} className="self-end">
            {isLoading ? <LoaderIcon className="animate-spin"/> : 'Search'}
          </Button>
        </form>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        {baseFood && calculatedMacros && (
            <div className="space-y-4 animate-fade-in">
                <h4 className="font-bold text-lg text-white">{baseFood.name}</h4>
                <div className="flex items-center space-x-2">
                    <Input
                        label="Amount"
                        type="number"
                        value={loggedAmount}
                        onChange={(e) => setLoggedAmount(parseFloat(e.target.value) || 0)}
                        className="w-24"
                    />
                    <span className="pt-8 text-gray-300">{baseFood.servingUnit}</span>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg text-sm text-gray-300 grid grid-cols-2 gap-2">
                    <p><strong>Calories:</strong> {calculatedMacros.calories.toFixed(0)} kcal</p>
                    <p><strong>Protein:</strong> {calculatedMacros.protein.toFixed(1)} g</p>
                    <p><strong>Carbs:</strong> {calculatedMacros.carbs.toFixed(1)} g</p>
                    <p><strong>Fat:</strong> {calculatedMacros.fat.toFixed(1)} g</p>
                </div>
                
                <Button onClick={handleAddFood} className="w-full">
                  Add Food
                </Button>
            </div>
        )}

      </div>
    </Modal>
  );
};

export default AddFoodModal;

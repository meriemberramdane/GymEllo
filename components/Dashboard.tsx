import React, { useContext, useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { CheckCircleIcon, CheckIcon, PlusIcon, TrashIcon } from './icons/Icons';
import { UserContext } from '../contexts/UserContext';
import { getTodayLog, getTotalMacros } from '../services/nutritionService';
import { calculateNutrientGoals } from '../services/calorieService';
import { WorkoutSession } from '../types';
import Input from './ui/Input';

interface DashboardProps {
  onStartWorkout: (session: WorkoutSession) => void;
  onNavigate: (view: 'nutrition') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartWorkout, onNavigate }) => {
  const userContext = useContext(UserContext);
  const [newTodo, setNewTodo] = useState('');

  if (!userContext || !userContext.user || !userContext.workoutPlan) {
    return <div>Loading...</div>;
  }

  const { user, workoutPlan, dailyLogs, todoList, addTodo, removeTodo, toggleTodoCompleted } = userContext;
  
  const nutrientGoals = calculateNutrientGoals(user.profile);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  // FIX: Cast Object.values to WorkoutSession[] to fix type inference issue.
  const todaysWorkout: WorkoutSession | undefined = (Object.values(workoutPlan) as WorkoutSession[]).find(session => session.day === today);

  const todayLog = getTodayLog(dailyLogs);
  const { calories, protein, carbs, fat, fiber } = getTotalMacros(todayLog.meals);
  
  const handleAddTodo = () => {
    if (newTodo.trim()) {
      addTodo(newTodo);
      setNewTodo('');
    }
  };
  
  const MacroProgress = ({ name, value, goal, color, unit }: {name: string, value: number, goal: number, color: string, unit: string}) => (
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8">
        Welcome Back, <span className="text-red-500">{user.profile.name}</span>
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-2xl font-heading text-white mb-4">Today's Workout: {today}</h2>
            {todaysWorkout ? (
              <div className="bg-gray-800/50 p-6 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm uppercase">{todaysWorkout.exercises.length} EXERCISES</p>
                  <h3 className="text-xl font-bold text-white">{todaysWorkout.title}</h3>
                  <p className="text-gray-300">Est. 60 Mins &bull; {todaysWorkout.exercises[0].muscleGroup}</p>
                </div>
                <Button onClick={() => onStartWorkout(todaysWorkout)} disabled={todayLog.workoutCompleted}>
                  {todayLog.workoutCompleted ? 'Completed' : 'Start Workout'}
                </Button>
              </div>
            ) : (
              <div className="bg-gray-800/50 p-6 rounded-lg text-center">
                <h3 className="text-xl font-bold text-white">Rest Day!</h3>
                <p className="text-gray-300">Enjoy your recovery. Consistency is key.</p>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <h2 className="text-2xl font-heading text-white mb-4">Nutrition Summary</h2>
            <div className="space-y-4">
              <MacroProgress name="Calories" value={calories} goal={nutrientGoals.calories} color="bg-red-500" unit="kcal"/>
              <MacroProgress name="Protein" value={protein} goal={nutrientGoals.protein} color="bg-green-500" unit="g"/>
              <MacroProgress name="Carbs" value={carbs} goal={nutrientGoals.carbs} color="bg-orange-500" unit="g"/>
              <MacroProgress name="Fat" value={fat} goal={nutrientGoals.fat} color="bg-blue-500" unit="g"/>
              <MacroProgress name="Fiber" value={fiber} goal={nutrientGoals.fiber} color="bg-purple-500" unit="g"/>
              
              <Button onClick={() => onNavigate('nutrition')} variant="secondary" className="w-full mt-4">Log a Meal</Button>
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-heading text-white mb-4">Daily To-Do</h2>
            <ul className="space-y-3">
                <li className={`flex items-center space-x-3 group ${todayLog.workoutCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>
                    {todayLog.workoutCompleted ? <CheckCircleIcon className="text-green-500" /> : <div className="w-6 h-6 rounded-full border-2 border-gray-500 flex-shrink-0"></div>}
                    <span>Complete Today's Workout</span>
                </li>
                 {todoList.map(todo => (
                   <li key={todo.id} className="flex items-center space-x-3 group text-white">
                      <button onClick={() => toggleTodoCompleted(todo.id)} className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-500 hover:border-green-500'}`}>
                        {todo.completed && <CheckIcon className="text-white w-4 h-4"/>}
                      </button>
                      <span className={todo.completed ? 'line-through text-gray-500' : ''}>{todo.text}</span>
                      <button onClick={() => removeTodo(todo.id)} className="ml-auto text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                         <TrashIcon className="w-4 h-4" />
                      </button>
                   </li>
                 ))}
            </ul>
             <div className="mt-4 flex space-x-2">
                <Input label="" placeholder="Add a task..." value={newTodo} onChange={(e) => setNewTodo(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()} className="flex-grow !py-2" />
                <Button onClick={handleAddTodo} size="sm" className="!px-3"><PlusIcon/></Button>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
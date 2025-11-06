import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext';
import Card from '../ui/Card';
import { DumbbellIcon, TrashIcon, PlusIcon, EditIcon } from '../icons/Icons';
import { WorkoutSession, Exercise, WorkoutPlan } from '../../types';
import ExerciseDetailModal from './ExerciseDetailModal';
import AddExerciseModal from './AddExerciseModal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { regenerateSessionForDay, SESSION_DEFINITIONS } from '../../services/workoutService';

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Planner: React.FC = () => {
  const userContext = useContext(UserContext);
  const [activeDay, setActiveDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddExerciseModalOpen, setAddExerciseModalOpen] = useState(false);
  const [editedPlan, setEditedPlan] = useState<WorkoutPlan | null>(userContext?.workoutPlan || null);
  
  useEffect(() => {
    if (userContext?.workoutPlan) {
        setEditedPlan(userContext.workoutPlan);
    }
  }, [userContext?.workoutPlan]);

  if (!userContext || !userContext.workoutPlan || !userContext.user || !editedPlan) {
    return <div>Loading plan...</div>;
  }
  const { workoutPlan, updateWorkoutPlan, user } = userContext;

  const userWorkoutDays = user.profile.workoutDays;
  // FIX: Cast Object.values to WorkoutSession[] to fix type inference issue.
  const activeSession: WorkoutSession | undefined = (Object.values(editedPlan) as WorkoutSession[]).find(s => s.day === activeDay);

  const handleEditToggle = () => {
    if (isEditing) {
        updateWorkoutPlan(editedPlan);
    }
    setIsEditing(!isEditing);
  }
  
  const handleCancelEdit = () => {
    setEditedPlan(workoutPlan);
    setIsEditing(false);
  }

  const handleDeleteExercise = (exerciseName: string) => {
    if (!activeSession) return;
    const updatedExercises = activeSession.exercises.filter(ex => ex.name !== exerciseName);
    const updatedSession = { ...activeSession, exercises: updatedExercises };
    const sessionKey = Object.keys(editedPlan).find(key => editedPlan[key].day === activeDay)!;
    setEditedPlan({ ...editedPlan, [sessionKey]: updatedSession });
  };
  
  const handleAddExercise = (exercise: Exercise) => {
    if (!activeSession) return;
    const updatedExercises = [...activeSession.exercises, exercise];
    const updatedSession = { ...activeSession, exercises: updatedExercises };
    const sessionKey = Object.keys(editedPlan).find(key => editedPlan[key].day === activeDay)!;
    setEditedPlan({ ...editedPlan, [sessionKey]: updatedSession });
    setAddExerciseModalOpen(false);
  };

  const handleExerciseDetailChange = (exerciseIndex: number, field: 'sets' | 'reps', value: string | number) => {
    if (!activeSession) return;
    const updatedExercises = [...activeSession.exercises];
    updatedExercises[exerciseIndex] = { ...updatedExercises[exerciseIndex], [field]: value };
    const updatedSession = { ...activeSession, exercises: updatedExercises };
    const sessionKey = Object.keys(editedPlan).find(key => editedPlan[key].day === activeDay)!;
    setEditedPlan({ ...editedPlan, [sessionKey]: updatedSession });
  }

  const handleSessionTypeChange = (newTitle: string) => {
    if (!activeSession) return;
    const newSession = regenerateSessionForDay(newTitle, activeDay, user.profile);
    const sessionKey = Object.keys(editedPlan).find(key => editedPlan[key].day === activeDay);
    if (sessionKey) {
        setEditedPlan(prev => ({
            ...prev!,
            [sessionKey]: newSession,
        }));
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8">
        Your Weekly <span className="text-red-500">Game Plan</span>
      </h1>
      <div className="grid grid-cols-7 gap-2 md:gap-4 mb-8">
        {WEEK_DAYS.map(day => {
            const isWorkoutDay = userWorkoutDays.includes(day);
            return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`p-3 md:p-4 rounded-lg text-center font-bold font-heading transition-colors ${
                    activeDay === day 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <p className="text-sm uppercase">{day.substring(0,3)}</p>
                </button>
            )
          }
        )}
      </div>

      <Card>
        <div className="flex justify-between items-center mb-6">
            {activeSession && isEditing ? (
                 <Select
                    label=""
                    value={activeSession.title}
                    onChange={(e) => handleSessionTypeChange(e.target.value)}
                    className="!p-0 !text-2xl !font-heading !bg-transparent !border-0 focus:!ring-0 !text-white"
                 >
                    {Object.keys(SESSION_DEFINITIONS).map(title => (
                        <option key={title} value={title} className="bg-gray-800 text-white font-sans text-base">{title}</option>
                    ))}
                    <option value="Rest Day" className="bg-gray-800 text-white font-sans text-base">Rest Day</option>
                 </Select>
            ) : (
                <h2 className="text-2xl font-heading text-white">
                    {activeDay}'s Session: {activeSession?.title || "Rest Day"}
                </h2>
            )}
            {activeSession && (
                <div className="flex space-x-2">
                    {isEditing && <Button size="sm" variant="secondary" onClick={handleCancelEdit}>Cancel</Button>}
                    <Button size="sm" variant={isEditing ? 'primary' : 'secondary'} onClick={handleEditToggle}>
                        <EditIcon className="w-4 h-4 mr-2"/> {isEditing ? 'Save Plan' : 'Edit Plan'}
                    </Button>
                </div>
            )}
        </div>
        {activeSession ? (
          <div className="space-y-4">
            {activeSession.exercises.map((ex, index) => (
              <div 
                key={`${ex.name}-${index}`}
                className="w-full bg-gray-800/50 p-4 rounded-lg flex items-center justify-between text-left group"
              >
                <button onClick={() => !isEditing && setSelectedExercise(ex)} className="flex items-center space-x-4 flex-grow" disabled={isEditing}>
                  <div className="bg-red-500/20 p-3 rounded-full">
                    <DumbbellIcon className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{ex.name}</h4>
                    {isEditing ? (
                        <div className="flex items-center space-x-2 text-gray-400 text-sm mt-1">
                            <Input label="" type="number" value={ex.sets} onChange={(e) => handleExerciseDetailChange(index, 'sets', parseInt(e.target.value))} className="!w-16 !py-1" />
                            <span>sets &times;</span>
                             <Input label="" value={ex.reps} onChange={(e) => handleExerciseDetailChange(index, 'reps', e.target.value)} className="!w-24 !py-1" />
                             <span>reps</span>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">
                          {ex.sets} sets &times; {ex.reps} reps &bull; {ex.rest}s rest
                        </p>
                    )}
                  </div>
                </button>
                {isEditing && (
                    <button onClick={() => handleDeleteExercise(ex.name)} className="text-gray-500 hover:text-red-500 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <TrashIcon />
                    </button>
                )}
              </div>
            ))}
            {isEditing && (
                <Button onClick={() => setAddExerciseModalOpen(true)} variant="ghost" className="w-full mt-4">
                    <PlusIcon className="mr-2"/> Add Exercise
                </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold text-white">Time to Recover</h3>
            <p className="text-gray-400 mt-2">Rest is crucial for muscle growth and performance. Use this day to stretch, hydrate, and fuel up.</p>
          </div>
        )}
      </Card>

      {selectedExercise && ( <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} /> )}
      {isAddExerciseModalOpen && ( <AddExerciseModal onAddExercise={handleAddExercise} onClose={() => setAddExerciseModalOpen(false)} /> )}
    </div>
  );
};

export default Planner;
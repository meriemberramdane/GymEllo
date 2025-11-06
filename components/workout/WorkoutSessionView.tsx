import React, { useState } from 'react';
import { WorkoutSession, Exercise } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { DumbbellIcon, CheckIcon } from '../icons/Icons';
import ExerciseDetailModal from '../planner/ExerciseDetailModal';

interface WorkoutSessionViewProps {
  session: WorkoutSession;
  onFinish: () => void;
}

const WorkoutSessionView: React.FC<WorkoutSessionViewProps> = ({ session, onFinish }) => {
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const toggleExercise = (exerciseName: string) => {
    setCompletedExercises(prev =>
      prev.includes(exerciseName)
        ? prev.filter(name => name !== exerciseName)
        : [...prev, exerciseName]
    );
  };

  const openExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  const closeExercise = () => {
    setSelectedExercise(null);
  };

  const allExercisesCompleted = completedExercises.length === session.exercises.length;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card>
        <div className="text-center mb-8">
          <p className="text-red-500 font-semibold">{session.day}</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">
            {session.title}
          </h1>
          <p className="text-gray-400 mt-2">
            {completedExercises.length} / {session.exercises.length} Exercises Completed
          </p>
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          {session.exercises.map((ex, index) => {
            const isCompleted = completedExercises.includes(ex.name);
            return (
              <div
                key={index}
                className={`bg-gray-800/50 p-4 rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                  isCompleted ? 'opacity-50' : ''
                }`}
                onClick={() => openExercise(ex)}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`bg-red-500/20 p-3 rounded-full ${
                      isCompleted ? 'bg-green-500/20' : ''
                    }`}
                  >
                    <DumbbellIcon
                      className={isCompleted ? 'text-green-500' : 'text-red-500'}
                    />
                  </div>
                  <div>
                    <h4
                      className={`font-bold text-white text-lg ${
                        isCompleted ? 'line-through' : ''
                      }`}
                    >
                      {ex.name}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {ex.sets} sets × {ex.reps} reps • {ex.rest}s rest
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExercise(ex.name);
                  }}
                  className={`w-10 h-10 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    isCompleted
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-600 hover:border-green-500'
                  }`}
                >
                  {isCompleted && <CheckIcon className="text-white" />}
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button
            onClick={onFinish}
            size="lg"
            disabled={!allExercisesCompleted}
            className={!allExercisesCompleted ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Finish Workout
          </Button>
        </div>
      </Card>

      {selectedExercise && (
        <ExerciseDetailModal exercise={selectedExercise} onClose={closeExercise} />
      )}
    </div>
  );
};

export default WorkoutSessionView;
import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { Exercise } from '../../types';
import { EXERCISE_DB } from '../../services/exerciseService';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface AddExerciseModalProps {
  onClose: () => void;
  onAddExercise: (exercise: Exercise) => void;
}

const AddExerciseModal: React.FC<AddExerciseModalProps> = ({ onClose, onAddExercise }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const muscleGroups = ['All', ...Array.from(new Set(EXERCISE_DB.map(ex => ex.muscleGroup)))];

  const filteredExercises = EXERCISE_DB.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || ex.muscleGroup === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Modal onClose={onClose} title="Add Exercise to Your Workout">
      <div className="space-y-4 max-h-[70vh] flex flex-col">
        <Input label="" placeholder="Search exercises..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <div className="flex flex-wrap gap-2">
            {muscleGroups.map(group => (
                <button 
                    key={group}
                    onClick={() => setFilter(group)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${filter === group ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                    {group}
                </button>
            ))}
        </div>

        <div className="flex-grow overflow-y-auto space-y-2 pr-2">
            {filteredExercises.map(ex => (
                <div key={ex.name} className="bg-gray-800/50 p-3 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-white">{ex.name}</p>
                        <p className="text-xs text-gray-400">{ex.muscleGroup}</p>
                    </div>
                    <Button size="sm" onClick={() => onAddExercise(ex)}>Add</Button>
                </div>
            ))}
        </div>
      </div>
    </Modal>
  );
};

export default AddExerciseModal;
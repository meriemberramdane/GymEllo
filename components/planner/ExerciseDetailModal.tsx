import React, { useState, useEffect } from 'react';
import { Exercise } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { getExerciseDetails } from '../../services/geminiService';
import { LoaderIcon } from '../icons/Icons';

interface ExerciseDetailModalProps {
  exercise: Exercise;
  onClose: () => void;
}

const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({ exercise, onClose }) => {
  const [detailsHtml, setDetailsHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      const details = await getExerciseDetails(exercise.name);
      setDetailsHtml(details);
      setIsLoading(false);
    };

    fetchDetails();
  }, [exercise.name]);


  return (
    <Modal onClose={onClose} title={exercise.name}>
      <div className="min-h-[300px] space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <LoaderIcon className="w-12 h-12 animate-spin text-red-500" />
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: detailsHtml || '' }} />
        )}

        <Button onClick={onClose} variant="secondary" className="w-full !mt-6">
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default ExerciseDetailModal;

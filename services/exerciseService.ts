import { Exercise } from '../types';

export const EXERCISE_DB: Exercise[] = [
  // Weight Training - Chest
  { name: 'Bench Press', sets: 4, reps: '8-12', rest: 60, muscleGroup: 'Chest', category: 'weight_training', equipment: 'Barbell' },
  { name: 'Incline Dumbbell Press', sets: 3, reps: '10-15', rest: 60, muscleGroup: 'Chest', category: 'weight_training', equipment: 'Dumbbells' },
  { name: 'Cable Crossover', sets: 3, reps: '12-15', rest: 45, muscleGroup: 'Chest', category: 'weight_training', equipment: 'Cable Machine' },
  { name: 'Push-Ups', sets: 3, reps: 'To Failure', rest: 60, muscleGroup: 'Chest', category: 'weight_training', equipment: 'Bodyweight' },
  { name: 'Dumbbell Flyes', sets: 3, reps: '12-15', rest: 45, muscleGroup: 'Chest', category: 'weight_training', equipment: 'Dumbbells' },

  // Weight Training - Back
  { name: 'Pull-Ups', sets: 4, reps: 'To Failure', rest: 75, muscleGroup: 'Back', category: 'weight_training', equipment: 'Pull-up Bar' },
  { name: 'Bent Over Rows', sets: 4, reps: '8-12', rest: 60, muscleGroup: 'Back', category: 'weight_training', equipment: 'Barbell' },
  { name: 'Lat Pulldowns', sets: 3, reps: '10-15', rest: 60, muscleGroup: 'Back', category: 'weight_training', equipment: 'Cable Machine' },
  { name: 'T-Bar Rows', sets: 3, reps: '8-12', rest: 60, muscleGroup: 'Back', category: 'weight_training', equipment: 'T-Bar Row Machine' },
  { name: 'Seated Cable Rows', sets: 3, reps: '10-15', rest: 45, muscleGroup: 'Back', category: 'weight_training', equipment: 'Cable Machine' },

  // Weight Training - Legs
  { name: 'Squats', sets: 4, reps: '8-12', rest: 90, muscleGroup: 'Legs', category: 'weight_training', equipment: 'Barbell' },
  { name: 'Leg Press', sets: 4, reps: '10-15', rest: 75, muscleGroup: 'Legs', category: 'weight_training', equipment: 'Leg Press Machine' },
  { name: 'Romanian Deadlifts', sets: 3, reps: '10-12', rest: 60, muscleGroup: 'Legs', category: 'weight_training', equipment: 'Barbell/Dumbbells' },
  { name: 'Leg Curls', sets: 3, reps: '12-15', rest: 45, muscleGroup: 'Legs', category: 'weight_training', equipment: 'Leg Curl Machine' },
  { name: 'Leg Extensions', sets: 3, reps: '15-20', rest: 45, muscleGroup: 'Legs', category: 'weight_training', equipment: 'Leg Extension Machine' },
  { name: 'Lunges', sets: 3, reps: '10-12 per leg', rest: 60, muscleGroup: 'Legs', category: 'weight_training', equipment: 'Dumbbells/Bodyweight' },
  { name: 'Hip Thrusts', sets: 4, reps: '8-12', rest: 60, muscleGroup: 'Legs', category: 'weight_training', equipment: 'Barbell' },
  { name: 'Glute Bridges', sets: 3, reps: '15-20', rest: 45, muscleGroup: 'Legs', category: 'weight_training', equipment: 'Bodyweight/Dumbbell' },
  { name: 'Cable Kickbacks', sets: 3, reps: '12-15 per leg', rest: 45, muscleGroup: 'Legs', category: 'weight_training', equipment: 'Cable Machine' },
  { name: 'Bulgarian Split Squats', sets: 3, reps: '10-12 per leg', rest: 60, muscleGroup: 'Legs', category: 'weight_training', equipment: 'Dumbbells' },
  { name: 'Step-Ups', sets: 3, reps: '10-15 per leg', rest: 60, muscleGroup: 'Legs', category: 'weight_training', equipment: 'Dumbbells/Box' },

  // Weight Training - Shoulders
  { name: 'Overhead Press', sets: 4, reps: '8-12', rest: 75, muscleGroup: 'Shoulders', category: 'weight_training', equipment: 'Barbell/Dumbbells' },
  { name: 'Lateral Raises', sets: 4, reps: '12-15', rest: 45, muscleGroup: 'Shoulders', category: 'weight_training', equipment: 'Dumbbells' },
  { name: 'Face Pulls', sets: 3, reps: '15-20', rest: 45, muscleGroup: 'Shoulders', category: 'weight_training', equipment: 'Cable Machine' },
  { name: 'Arnold Press', sets: 3, reps: '10-12', rest: 60, muscleGroup: 'Shoulders', category: 'weight_training', equipment: 'Dumbbells' },

  // Weight Training - Arms
  { name: 'Bicep Curls', sets: 3, reps: '10-15', rest: 45, muscleGroup: 'Arms', category: 'weight_training', equipment: 'Dumbbells/Barbell' },
  { name: 'Tricep Pushdowns', sets: 3, reps: '10-15', rest: 45, muscleGroup: 'Arms', category: 'weight_training', equipment: 'Cable Machine' },
  { name: 'Hammer Curls', sets: 3, reps: '10-12', rest: 45, muscleGroup: 'Arms', category: 'weight_training', equipment: 'Dumbbells' },
  { name: 'Skull Crushers', sets: 3, reps: '10-12', rest: 60, muscleGroup: 'Arms', category: 'weight_training', equipment: 'EZ Bar/Dumbbells' },

  // Full Body
  { name: 'Deadlifts', sets: 4, reps: '5-8', rest: 120, muscleGroup: 'Full Body', category: 'weight_training', equipment: 'Barbell' },
  { name: 'Kettlebell Swings', sets: 4, reps: '15-20', rest: 60, muscleGroup: 'Full Body', category: 'hiit', equipment: 'Kettlebell' },
  { name: 'Goblet Squats', sets: 3, reps: '10-15', rest: 60, muscleGroup: 'Full Body', category: 'weight_training', equipment: 'Dumbbell/Kettlebell' },
  { name: 'Dumbbell Rows', sets: 3, reps: '10-12 per arm', rest: 60, muscleGroup: 'Full Body', category: 'weight_training', equipment: 'Dumbbells' },
  { name: 'Plank', sets: 3, reps: '60s hold', rest: 45, muscleGroup: 'Full Body', category: 'stretching', equipment: 'Bodyweight' },
  
  // Cardio
  { name: 'Treadmill Run', sets: 1, reps: '20-30 min', rest: 0, muscleGroup: 'Cardio', category: 'cardio', equipment: 'Treadmill' },
  { name: 'Cycling', sets: 1, reps: '30 min', rest: 0, muscleGroup: 'Cardio', category: 'cardio', equipment: 'Stationary Bike' },
  { name: 'Jump Rope', sets: 5, reps: '3 min on, 1 min off', rest: 60, muscleGroup: 'Cardio', category: 'hiit', equipment: 'Jump Rope' },

  // Stretching
  { name: 'Hamstring Stretch', sets: 2, reps: '30s hold per leg', rest: 15, muscleGroup: 'Stretching', category: 'stretching', equipment: 'Bodyweight' },
  { name: 'Quad Stretch', sets: 2, reps: '30s hold per leg', rest: 15, muscleGroup: 'Stretching', category: 'stretching', equipment: 'Bodyweight' },
  { name: 'Chest Stretch', sets: 2, reps: '30s hold', rest: 15, muscleGroup: 'Stretching', category: 'stretching', equipment: 'Bodyweight' },

  // HIIT
  { name: 'Burpees', sets: 4, reps: '10-15', rest: 60, muscleGroup: 'HIIT', category: 'hiit', equipment: 'Bodyweight' },
  { name: 'High Knees', sets: 4, reps: '45s on, 15s off', rest: 15, muscleGroup: 'HIIT', category: 'hiit', equipment: 'Bodyweight' },
];
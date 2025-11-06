import { UserProfile, WorkoutPlan, Exercise, WorkoutSession } from '../types';
import { EXERCISE_DB } from './exerciseService';

export const SESSION_DEFINITIONS: { [key: string]: string[] } = {
    'Upper Body A': ['Chest', 'Shoulders'],
    'Upper Body B': ['Back', 'Arms'],
    'Upper Body - Push': ['Chest', 'Shoulders'],
    'Upper Body - Pull': ['Back', 'Arms'],
    'Lower Body': ['Legs'],
    'Full Body Conditioning': ['Full Body'],
    'Chest & Triceps': ['Chest', 'Arms'],
    'Back & Biceps': ['Back', 'Arms'],
    'Legs': ['Legs'],
    'Shoulders': ['Shoulders'],
    'Full Body': ['Full Body'],
    'Push Day': ['Chest', 'Shoulders'],
    'Pull Day': ['Back', 'Arms'],
    'Leg Day': ['Legs'],
    'Push Day 2': ['Chest', 'Shoulders'],
    'Pull Day 2': ['Back', 'Arms'],
    'Leg Day 2': ['Legs'],
    'Active Recovery': ['Stretching'],
};

const getExercisesForCategory = (category: Exercise['category'], count: number): Exercise[] => {
    const filtered = EXERCISE_DB.filter(ex => ex.category === category);
    return filtered.sort(() => 0.5 - Math.random()).slice(0, count);
}

const getExercisesForMuscleGroup = (muscleGroup: Exercise['muscleGroup'], count: number): Exercise[] => {
    const filtered = EXERCISE_DB.filter(ex => ex.muscleGroup === muscleGroup);
    return filtered.sort(() => 0.5 - Math.random()).slice(0, count);
}


export const createSession = (title: string, muscleGroups: Exercise['muscleGroup'][], day: string): WorkoutSession => {
    const exercises: Exercise[] = [];
    if (muscleGroups.includes('Chest')) exercises.push(...getExercisesForMuscleGroup('Chest', 2));
    if (muscleGroups.includes('Back')) exercises.push(...getExercisesForMuscleGroup('Back', 2));
    if (muscleGroups.includes('Legs')) exercises.push(...getExercisesForMuscleGroup('Legs', 3));
    if (muscleGroups.includes('Shoulders')) exercises.push(...getExercisesForMuscleGroup('Shoulders', 2));
    if (muscleGroups.includes('Arms')) exercises.push(...getExercisesForMuscleGroup('Arms', 2));
    if (muscleGroups.includes('Full Body')) exercises.push(...getExercisesForMuscleGroup('Full Body', 4));
    if (muscleGroups.includes('Stretching')) exercises.push(...getExercisesForCategory('stretching', 4));

    // Ensure variety by shuffling the final exercise list
    exercises.sort(() => 0.5 - Math.random());
    
    return { day, title, exercises };
};

const adjustSessionForGoal = (session: WorkoutSession, profile: UserProfile): WorkoutSession => {
    session.exercises.forEach(ex => {
        if (profile.fitnessGoal === 'lose_fat') {
            ex.reps = '12-15';
            ex.rest = Math.max(30, ex.rest - 15);
        } else if (profile.fitnessGoal === 'build_muscle') {
            ex.reps = '8-12';
            ex.rest = Math.min(90, ex.rest + 15);
        }
    });
    return session;
};

export const regenerateSessionForDay = (title: string, day: string, profile: UserProfile): WorkoutSession => {
    if (title === 'Rest Day') {
        return { day, title: 'Rest Day', exercises: [] };
    }
    const muscleGroups = SESSION_DEFINITIONS[title];
    if (!muscleGroups) {
        return { day, title: 'Rest Day', exercises: [] };
    }
    const newSession = createSession(title, muscleGroups, day);
    return adjustSessionForGoal(newSession, profile);
};


export const generateWorkoutPlan = (profile: UserProfile): WorkoutPlan => {
  const { workoutDays } = profile;
  const plan: WorkoutPlan = {};
  let workoutSessions: WorkoutSession[] = [];

  switch (workoutDays.length) {
    case 3:
      workoutSessions = [
        createSession('Upper Body A', ['Chest', 'Shoulders'], workoutDays[0]),
        createSession('Lower Body', ['Legs'], workoutDays[1]),
        createSession('Upper Body B', ['Back', 'Arms'], workoutDays[2]),
      ];
      break;
    case 4:
      workoutSessions = [
        createSession('Upper Body - Push', ['Chest', 'Shoulders'], workoutDays[0]),
        createSession('Lower Body', ['Legs'], workoutDays[1]),
        createSession('Upper Body - Pull', ['Back', 'Arms'], workoutDays[2]),
        createSession('Full Body Conditioning', ['Full Body'], workoutDays[3]),
      ];
      break;
    case 5:
      workoutSessions = [
        createSession('Chest & Triceps', ['Chest', 'Arms'], workoutDays[0]),
        createSession('Back & Biceps', ['Back', 'Arms'], workoutDays[1]),
        createSession('Legs', ['Legs'], workoutDays[2]),
        createSession('Shoulders', ['Shoulders'], workoutDays[3]),
        createSession('Full Body', ['Full Body'], workoutDays[4]),
      ];
      break;
    default: // Fallback for 6, 7 days
      workoutSessions = [
        createSession('Push Day', ['Chest', 'Shoulders'], workoutDays[0]),
        createSession('Pull Day', ['Back', 'Arms'], workoutDays[1]),
        createSession('Leg Day', ['Legs'], workoutDays[2]),
        createSession('Push Day 2', ['Chest', 'Shoulders'], workoutDays[3]),
        createSession('Pull Day 2', ['Back', 'Arms'], workoutDays[4]),
        ...(workoutDays.length > 5 ? [createSession('Leg Day 2', ['Legs'], workoutDays[5])] : []),
        ...(workoutDays.length > 6 ? [createSession('Active Recovery', ['Stretching'], workoutDays[6])] : []),
      ];
  }

  workoutSessions.forEach((session, index) => {
    plan[`day${index + 1}`] = adjustSessionForGoal(session, profile);
  });

  return plan;
};
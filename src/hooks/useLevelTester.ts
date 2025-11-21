// hooks/useLevelTester.ts
import { useLevelSystem } from './useLevelSystem';

export const useLevelTester = () => {
  const levelSystem = useLevelSystem();
  
  const testLevelUp = () => {
    // Adiciona XP suficiente para subir 1 nível (agora mais difícil)
    const xpNeeded = levelSystem.userLevelProgress.xpToNextLevel;
    levelSystem.addUserXp(xpNeeded + 1000); // Adiciona extra pois é mais difícil
  };
  
  const testMuscleLevelUp = (muscle: keyof typeof levelSystem.muscleStats) => {
    const muscleData = levelSystem.muscleStats[muscle];
    const xpNeeded = muscleData.xpToNextLevel;
    levelSystem.addMuscleXp(muscle, xpNeeded + 500); // Mais XP necessário
  };
  
  const testChestTricepsWorkout = () => {
    // Simula um treino focado em peito e tríceps
    const workoutXp = {
      chest: levelSystem.calculateExerciseXp('chest', 'hypertrophy', 8, 80, 10, 3),
      triceps: levelSystem.calculateExerciseXp('triceps', 'hypertrophy', 7, 30, 12, 3)
    };
    
    levelSystem.addWorkoutXp(workoutXp);
  };
  
  const testBackBicepsWorkout = () => {
    // Simula um treino focado em costas e bíceps
    const workoutXp = {
      back: levelSystem.calculateExerciseXp('back', 'strength', 9, 100, 8, 4),
      biceps: levelSystem.calculateExerciseXp('biceps', 'hypertrophy', 7, 25, 12, 3)
    };
    
    levelSystem.addWorkoutXp(workoutXp);
  };
  
  const testLegWorkout = () => {
    // Simula um treino de pernas
    const workoutXp = {
      legs: levelSystem.calculateExerciseXp('legs', 'strength', 9, 120, 6, 4),
      core: levelSystem.calculateExerciseXp('core', 'endurance', 6, 0, 15, 3)
    };
    
    levelSystem.addWorkoutXp(workoutXp);
  };
  
  const testShouldersWorkout = () => {
    // Simula um treino de ombros
    const workoutXp = {
      shoulders: levelSystem.calculateExerciseXp('shoulders', 'hypertrophy', 8, 40, 10, 4)
    };
    
    levelSystem.addWorkoutXp(workoutXp);
  };
  
  const testFullBodyWorkout = () => {
    // Simula um treino completo (mais raro)
    const workoutXp = {
      chest: levelSystem.calculateExerciseXp('chest', 'hypertrophy', 7, 70, 10, 3),
      back: levelSystem.calculateExerciseXp('back', 'strength', 8, 90, 8, 3),
      shoulders: levelSystem.calculateExerciseXp('shoulders', 'hypertrophy', 6, 35, 12, 3),
      biceps: levelSystem.calculateExerciseXp('biceps', 'hypertrophy', 6, 20, 12, 3),
      triceps: levelSystem.calculateExerciseXp('triceps', 'hypertrophy', 6, 25, 12, 3),
      legs: levelSystem.calculateExerciseXp('legs', 'strength', 8, 100, 8, 3),
      core: levelSystem.calculateExerciseXp('core', 'endurance', 5, 0, 15, 3)
    };
    
    levelSystem.addWorkoutXp(workoutXp);
  };

  return {
    ...levelSystem,
    testLevelUp,
    testMuscleLevelUp,
    testChestTricepsWorkout,
    testBackBicepsWorkout,
    testLegWorkout,
    testShouldersWorkout,
    testFullBodyWorkout
  };
};
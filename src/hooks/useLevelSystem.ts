// hooks/useLevelSystem.ts
import { useState, useCallback, useMemo } from 'react';

export interface LevelConfig {
  baseXP: number;
  multiplier: number;
  maxLevel?: number;
  difficultyCurve?: 'linear' | 'exponential' | 'quadratic';
}

export interface MuscleLevel {
  level: number;
  xp: number;
  nextLevelXp: number;
  xpToNextLevel: number;
}

export interface MuscleStats {
  chest: MuscleLevel;
  back: MuscleLevel;
  shoulders: MuscleLevel;
  biceps: MuscleLevel;
  triceps: MuscleLevel;
  legs: MuscleLevel;
  core: MuscleLevel;
}

export interface LevelProgress {
  currentLevel: number;
  currentXp: number;
  nextLevelXp: number;
  xpToNextLevel: number;
  progressPercentage: number;
}

const DEFAULT_LEVEL_CONFIG: LevelConfig = {
  baseXP: 500, // Reduzido para ser mais difícil
  multiplier: 1.8, // Aumentado para curva mais íngreme
  maxLevel: 50,
  difficultyCurve: 'exponential'
};

const INITIAL_MUSCLE_STATS: MuscleStats = {
  chest: { level: 1, xp: 0, nextLevelXp: 500, xpToNextLevel: 500 },
  back: { level: 1, xp: 0, nextLevelXp: 500, xpToNextLevel: 500 },
  shoulders: { level: 1, xp: 0, nextLevelXp: 500, xpToNextLevel: 500 },
  biceps: { level: 1, xp: 0, nextLevelXp: 500, xpToNextLevel: 500 },
  triceps: { level: 1, xp: 0, nextLevelXp: 500, xpToNextLevel: 500 },
  legs: { level: 1, xp: 0, nextLevelXp: 500, xpToNextLevel: 500 },
  core: { level: 1, xp: 0, nextLevelXp: 500, xpToNextLevel: 500 }
};

export const useLevelSystem = (initialConfig?: Partial<LevelConfig>) => {
  const config = { ...DEFAULT_LEVEL_CONFIG, ...initialConfig };
  
  const [userLevel, setUserLevel] = useState(1);
  const [userXp, setUserXp] = useState(0);
  const [muscleStats, setMuscleStats] = useState<MuscleStats>(INITIAL_MUSCLE_STATS);

  // Calcula o XP necessário para um nível específico com curva de dificuldade
  const calculateXpForLevel = useCallback((level: number): number => {
    if (level <= 1) return 0;
    
    const base = config.baseXP;
    const multiplier = config.multiplier;
    
    switch (config.difficultyCurve) {
      case 'exponential':
        // Curva exponencial - muito mais difícil em níveis altos
        return Math.floor(base * Math.pow(multiplier, level - 1));
      
      case 'quadratic':
        // Curva quadrática - crescimento acelerado
        return Math.floor(base * Math.pow(level, 2));
      
      case 'linear':
      default:
        // Curva linear com multiplicador
        return Math.floor(base * multiplier * (level - 1));
    }
  }, [config.baseXP, config.multiplier, config.difficultyCurve]);

  // Calcula o próximo nível XP para músculos (pode ser diferente do usuário)
  const calculateNextLevelXp = useCallback((currentLevel: number): number => {
    return calculateXpForLevel(currentLevel + 1);
  }, [calculateXpForLevel]);

  // Adiciona XP geral do usuário (agora mais difícil)
  const addUserXp = useCallback((xp: number) => {
    setUserXp(prevXp => {
      const newXp = prevXp + xp;
      const nextLevelXp = calculateNextLevelXp(userLevel);
      
      // Verifica se subiu de nível (agora mais raro)
      if (newXp >= nextLevelXp && userLevel < (config.maxLevel || 50)) {
        const newLevel = userLevel + 1; // Sobe apenas 1 nível por vez
        setUserLevel(newLevel);
        
        // Retorna o XP restante após subir de nível
        const xpAfterLevelUp = newXp - calculateXpForLevel(newLevel);
        return Math.max(0, xpAfterLevelUp);
      }
      
      return newXp;
    });
  }, [userLevel, calculateNextLevelXp, calculateXpForLevel, config.maxLevel]);

  // Adiciona XP para um músculo específico com curva de dificuldade
  const addMuscleXp = useCallback((muscle: keyof MuscleStats, xp: number) => {
    setMuscleStats(prevStats => {
      const muscleData = prevStats[muscle];
      const currentLevel = muscleData.level;
      const newXp = muscleData.xp + xp;
      const nextLevelXp = calculateNextLevelXp(currentLevel);
      
      // Verifica se o músculo subiu de nível
      if (newXp >= nextLevelXp) {
        const newLevel = currentLevel + 1;
        const newNextLevelXp = calculateNextLevelXp(newLevel);
        
        return {
          ...prevStats,
          [muscle]: {
            level: newLevel,
            xp: newXp,
            nextLevelXp: newNextLevelXp,
            xpToNextLevel: newNextLevelXp - newXp
          }
        };
      }
      
      // Apenas atualiza o XP
      return {
        ...prevStats,
        [muscle]: {
          ...muscleData,
          xp: newXp,
          xpToNextLevel: nextLevelXp - newXp
        }
      };
    });
    
    // Também adiciona XP geral (reduzido para focar nos músculos)
    addUserXp(Math.floor(xp * 0.3)); // Apenas 30% do XP vai para o nível geral
  }, [calculateNextLevelXp, addUserXp]);

  // Adiciona XP para músculos específicos de um treino
  const addWorkoutXp = useCallback((muscleXp: Partial<Record<keyof MuscleStats, number>>) => {
    // Primeiro adiciona XP para cada músculo individualmente
    Object.entries(muscleXp).forEach(([muscle, xp]) => {
      if (xp && xp > 0) {
        addMuscleXp(muscle as keyof MuscleStats, xp);
      }
    });
  }, [addMuscleXp]);

  const calculateExerciseXp = useCallback((
    _muscle: keyof MuscleStats,
    exerciseType: 'strength' | 'hypertrophy' | 'endurance',
    intensity: number,
    weight: number,
    reps: number,
    sets: number
  ): number => {
    let baseXp = 0;
    
    switch (exerciseType) {
      case 'strength':
        baseXp = (weight * 0.1) + (reps * 2) + (sets * 5);
        break;
      case 'hypertrophy':
        baseXp = (weight * 0.05) + (reps * 3) + (sets * 8);
        break;
      case 'endurance':
        baseXp = (reps * 4) + (sets * 10) + (weight * 0.02);
        break;
    }
    
    // Multiplicador de intensidade
    const intensityMultiplier = 1 + (intensity * 0.1);
    
    // XP final
    const finalXp = Math.floor(baseXp * intensityMultiplier);
    
    // Limite máximo por exercício
    return Math.min(finalXp, 200);
  }, []);

  // Calcula o progresso atual do nível do usuário
  const userLevelProgress = useMemo((): LevelProgress => {
    const currentLevelXp = calculateXpForLevel(userLevel);
    const nextLevelXp = calculateNextLevelXp(userLevel);
    const xpInCurrentLevel = userXp - currentLevelXp;
    const xpToNextLevel = nextLevelXp - userXp;
    const progressPercentage = (xpInCurrentLevel / (nextLevelXp - currentLevelXp)) * 100;

    return {
      currentLevel: userLevel,
      currentXp: userXp,
      nextLevelXp,
      xpToNextLevel,
      progressPercentage: Math.min(100, Math.max(0, progressPercentage))
    };
  }, [userLevel, userXp, calculateXpForLevel, calculateNextLevelXp]);

  // Reseta todo o sistema de níveis
  const resetLevels = useCallback(() => {
    setUserLevel(1);
    setUserXp(0);
    setMuscleStats(INITIAL_MUSCLE_STATS);
  }, []);

  // Obtém estatísticas de progresso dos músculos
  const muscleProgress = useMemo(() => {
    const muscles = Object.keys(muscleStats) as (keyof MuscleStats)[];
    return muscles.map(muscle => ({
      muscle,
      ...muscleStats[muscle],
      progressPercentage: (muscleStats[muscle].xp / muscleStats[muscle].nextLevelXp) * 100
    }));
  }, [muscleStats]);

  return {
    // Estado
    userLevel,
    userXp,
    muscleStats,
    muscleProgress,
    
    // Progresso
    userLevelProgress,
    
    // Ações
    addUserXp,
    addMuscleXp,
    addWorkoutXp,
    calculateExerciseXp,
    resetLevels,
    
    // Utilitários
    calculateXpForLevel,
    calculateNextLevelXp
  };
};
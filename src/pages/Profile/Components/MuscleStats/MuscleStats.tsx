// components/MuscleStats/MuscleStats.tsx
import { FaFire, FaChartLine, FaDumbbell } from 'react-icons/fa';
import styles from './MuscleStats.module.scss';

interface MuscleData {
  level: number;
  xp: number;
  nextLevelXp: number;
}

interface MuscleStats {
  chest: MuscleData;
  back: MuscleData;
  shoulders: MuscleData;
  biceps: MuscleData;
  triceps: MuscleData;
  legs: MuscleData;
  core: MuscleData;
}

interface MuscleStatsProps {
  muscleStats: MuscleStats;
}

const MuscleStats = ({ muscleStats }: MuscleStatsProps) => {
  const muscles = [
    { key: 'chest', name: 'Peitoral', icon: '🦅', color: '#dc143c' },
    { key: 'back', name: 'Costas', icon: '🦂', color: '#1e90ff' },
    { key: 'shoulders', name: 'Ombros', icon: '⚡', color: '#ffd700' },
    { key: 'biceps', name: 'Bíceps', icon: '💪', color: '#9370db' },
    { key: 'triceps', name: 'Tríceps', icon: '🎯', color: '#00bfff' },
    { key: 'legs', name: 'Pernas', icon: '🦵', color: '#32cd32' },
    { key: 'core', name: 'Core', icon: '🛡️', color: '#ff4500' }
  ];

  const getMuscleProgress = (muscle: MuscleData) => {
    return (muscle.xp / muscle.nextLevelXp) * 100;
  };

  const getRankTitle = (level: number) => {
    if (level >= 20) return 'LENDÁRIO';
    if (level >= 15) return 'ÉPICO';
    if (level >= 10) return 'RARO';
    if (level >= 5) return 'AVANÇADO';
    return 'INICIANTE';
  };

  return (
    <div className={styles.muscleStats}>
      <div className={styles.header}>
        <FaDumbbell />
        <h3>STATUS MUSCULAR</h3>
        <FaChartLine />
      </div>
      
      <div className={styles.statsGrid}>
        {muscles.map((muscle) => {
          const data = muscleStats[muscle.key as keyof MuscleStats];
          const progress = getMuscleProgress(data);
          const rank = getRankTitle(data.level);
          
          return (
            <div key={muscle.key} className={styles.muscleCard}>
              <div className={styles.muscleHeader}>
                <span 
                  className={styles.muscleIcon}
                  style={{ color: muscle.color }}
                >
                  {muscle.icon}
                </span>
                <div className={styles.muscleInfo}>
                  <span className={styles.muscleName}>{muscle.name}</span>
                  <span className={styles.muscleRank} style={{ color: muscle.color }}>
                    {rank}
                  </span>
                </div>
                <div className={styles.levelBadge}>
                  Nv. {data.level}
                </div>
              </div>
              
              <div className={styles.progressSection}>
                <div className={styles.xpInfo}>
                  <span>{data.xp} / {data.nextLevelXp} XP</span>
                  <FaFire className={styles.xpIcon} />
                </div>
                
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: muscle.color
                    }}
                  ></div>
                </div>
                
                <div className={styles.progressLabel}>
                  {progress.toFixed(1)}% para o próximo nível
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MuscleStats;
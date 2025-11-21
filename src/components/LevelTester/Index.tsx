// components/LevelTester/LevelTester.tsx
import { useLevelTester } from '../../hooks/useLevelTester';
import styles from './LevelTester.module.scss';

export const LevelTester = () => {
  const {
    userLevel,
    userXp,
    muscleStats,
    userLevelProgress,
    muscleProgress,
    testLevelUp,
    testMuscleLevelUp,
    testChestTricepsWorkout,
    testBackBicepsWorkout,
    testLegWorkout,
    testShouldersWorkout,
    testFullBodyWorkout,
    resetLevels,
    calculateNextLevelXp
  } = useLevelTester();

  return (
    <div className={styles.levelTester}>
      <h3>🧪 Testador de Níveis (Sistema Difícil)</h3>
      
      <div className={styles.userInfo}>
        <h4>👤 Usuário</h4>
        <p><strong>Nível:</strong> {userLevel}</p>
        <p><strong>XP:</strong> {userXp}</p>
        <p><strong>Próximo nível:</strong> {userLevelProgress.nextLevelXp} XP</p>
        <p><strong>Progresso:</strong> {userLevelProgress.progressPercentage.toFixed(1)}%</p>
        <p><strong>Faltam:</strong> {userLevelProgress.xpToNextLevel} XP</p>
      </div>

      <div className={styles.workoutActions}>
        <h4>🏋️ Treinos Específicos</h4>
        <div className={styles.workoutButtons}>
          <button onClick={testChestTricepsWorkout}>Peito + Tríceps</button>
          <button onClick={testBackBicepsWorkout}>Costas + Bíceps</button>
          <button onClick={testLegWorkout}>Pernas + Core</button>
          <button onClick={testShouldersWorkout}>Ombros</button>
          <button onClick={testFullBodyWorkout}>Corpo Inteiro</button>
        </div>
      </div>

      <div className={styles.actions}>
        <h4>⚡ Ações Rápidas</h4>
        <button onClick={testLevelUp}>Subir 1 Nível User</button>
        <button onClick={resetLevels}>Resetar Tudo</button>
      </div>

      <div className={styles.muscles}>
        <h4>💪 Progresso dos Músculos</h4>
        {muscleProgress.map(({ muscle, level, xp, nextLevelXp, progressPercentage }) => (
          <div key={muscle} className={styles.muscle}>
            <div className={styles.muscleInfo}>
              <span className={styles.muscleName}>
                {muscle}: Nv {level} ({Math.floor(progressPercentage)}%)
              </span>
              <span className={styles.muscleXp}>
                {xp}/{nextLevelXp} XP
              </span>
            </div>
            <div className={styles.muscleProgressBar}>
              <div 
                className={styles.muscleProgressFill}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <button onClick={() => testMuscleLevelUp(muscle as any)}>
              + Nível
            </button>
          </div>
        ))}
      </div>

      <div className={styles.difficultyInfo}>
        <h4>📊 Informações de Dificuldade</h4>
        <p><strong>Curva:</strong> Exponencial</p>
        <p><strong>Multiplicador:</strong> 1.8x por nível</p>
        <p><strong>XP Base:</strong> 500</p>
        <p><strong>Nível Máximo:</strong> 50</p>
      </div>
    </div>
  );
};
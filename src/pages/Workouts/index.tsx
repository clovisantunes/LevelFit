// pages/Workouts/index.tsx
import { useState } from 'react';
import styles from './Workouts.module.scss';

const Workouts = () => {
  const [activeTab, setActiveTab] = useState<'my-workouts' | 'discover' | 'progress'>('my-workouts');

  return (
    <div className={styles.workouts}>
      <header className={styles.header}>
        <h1>Treinos</h1>
      </header>

      <nav className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'my-workouts' ? styles.active : ''}`}
          onClick={() => setActiveTab('my-workouts')}
        >
          Meus Treinos
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'discover' ? styles.active : ''}`}
          onClick={() => setActiveTab('discover')}
        >
          Descobrir
        </button>
      </nav>

      <div className={styles.content}>
        {activeTab === 'my-workouts' && (
          <div className={styles.tabContent}>
            <div className={styles.emptyState}>
              <h3>📝 Seus Treinos</h3>
              <p>Você ainda não criou nenhum treino personalizado.</p>
              <button className={styles.createButton}>
                + Criar Primeiro Treino
              </button>
            </div>
          </div>
        )}

        {activeTab === 'discover' && (
          <div className={styles.tabContent}>
            <div className={styles.emptyState}>
              <h3>🔍 Descobrir Treinos</h3>
              <p>Explore treinos pré-definidos para diferentes objetivos.</p>
              <div className={styles.workoutCategories}>
                <div className={styles.categoryCard}>
                  <h4>💪 Força</h4>
                  <p>Treinos focados em ganho de força</p>
                </div>
                <div className={styles.categoryCard}>
                  <h4>🏃 Hipertrofia</h4>
                  <p>Treinos para crescimento muscular</p>
                </div>
                <div className={styles.categoryCard}>
                  <h4>🔥 Resistência</h4>
                  <p>Treinos para condicionamento</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workouts;
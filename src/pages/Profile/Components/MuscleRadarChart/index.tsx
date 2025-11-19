// components/MuscleRadarChart/MuscleRadarChart.tsx
import { useRef, useEffect } from 'react';
import styles from './MuscleRadarChart.module.scss';

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

interface MuscleRadarChartProps {
  muscleStats: MuscleStats;
}

const MuscleRadarChart = ({ muscleStats }: MuscleRadarChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const muscles = [
    { key: 'chest', name: 'Peitoral', angle: 0, color: '#dc143c' },
    { key: 'shoulders', name: 'Ombros', angle: 51.43, color: '#ffd700' },
    { key: 'biceps', name: 'Bíceps', angle: 102.86, color: '#9370db' },
    { key: 'triceps', name: 'Tríceps', angle: 154.29, color: '#00bfff' },
    { key: 'back', name: 'Costas', angle: 205.71, color: '#1e90ff' },
    { key: 'core', name: 'Core', angle: 257.14, color: '#ff4500' },
    { key: 'legs', name: 'Pernas', angle: 308.57, color: '#32cd32' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurações do canvas
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    // Limpar canvas
    ctx.clearRect(0, 0, width, height);

    // Desenhar grade radial
    ctx.strokeStyle = 'rgba(30, 144, 255, 0.2)';
    ctx.lineWidth = 1;
    
    // Anéis de nível
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * (i / 5), 0, 2 * Math.PI);
      ctx.stroke();
      
      // Texto do nível
      ctx.fillStyle = 'rgba(30, 144, 255, 0.5)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Nv. ${i}`, centerX, centerY - radius * (i / 5) - 5);
    }

    // Linhas dos eixos
    muscles.forEach(muscle => {
      const angle = (muscle.angle * Math.PI) / 180;
      const endX = centerX + radius * Math.cos(angle);
      const endY = centerY + radius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = 'rgba(30, 144, 255, 0.3)';
      ctx.stroke();

      // Nomes dos músculos
      const textX = centerX + (radius + 20) * Math.cos(angle);
      const textY = centerY + (radius + 20) * Math.sin(angle);
      
      ctx.fillStyle = muscle.color;
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(muscle.name, textX, textY);
    });

    // Desenhar área do radar
    ctx.beginPath();
    muscles.forEach((muscle, index) => {
      const data = muscleStats[muscle.key as keyof MuscleStats];
      const normalizedValue = Math.min(data.level / 5, 1); // Normalizar para 0-1
      const pointRadius = radius * normalizedValue;
      const angle = (muscle.angle * Math.PI) / 180;
      const x = centerX + pointRadius * Math.cos(angle);
      const y = centerY + pointRadius * Math.sin(angle);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();

    // Preencher área
    ctx.fillStyle = 'rgba(30, 144, 255, 0.3)';
    ctx.fill();
    
    // Borda da área
    ctx.strokeStyle = '#1e90ff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pontos nos vértices
    muscles.forEach(muscle => {
      const data = muscleStats[muscle.key as keyof MuscleStats];
      const normalizedValue = Math.min(data.level / 5, 1);
      const pointRadius = radius * normalizedValue;
      const angle = (muscle.angle * Math.PI) / 180;
      const x = centerX + pointRadius * Math.cos(angle);
      const y = centerY + pointRadius * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = muscle.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

  }, [muscleStats]);

  return (
    <div className={styles.radarChart}>
      <div className={styles.header}>
        <h3>MAPA DE DESENVOLVIMENTO MUSCULAR</h3>
        <span className={styles.subtitle}>Seu perfil de força único</span>
      </div>
      
      <div className={styles.chartContainer}>
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400}
          className={styles.chart}
        />
      </div>
      
      <div className={styles.legend}>
        {muscles.map(muscle => {
          const data = muscleStats[muscle.key as keyof MuscleStats];
          return (
            <div key={muscle.key} className={styles.legendItem}>
              <span 
                className={styles.legendColor}
                style={{ backgroundColor: muscle.color }}
              ></span>
              <span className={styles.legendName}>{muscle.name}</span>
              <span className={styles.legendLevel}>Nv. {data.level}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MuscleRadarChart;
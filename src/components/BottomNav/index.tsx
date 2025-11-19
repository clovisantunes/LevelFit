import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaDumbbell, 
  FaUser,
  FaFire,
  FaChartLine
} from 'react-icons/fa';
import styles from './BottomNav.module.scss';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const navItems = [
    {
      id: '/dashboard',
      icon: FaHome,
      label: 'Início',
      color: '#8a2be2' // Roxo
    },
    {
      id: '/workouts',
      icon: FaDumbbell,
      label: 'Treinos',
      color: '#00ff00' // Verde
    },
    {
      id: '/progress',
      icon: FaChartLine,
      label: 'Progresso',
      color: '#ffd700' // Dourado
    },
    {
      id: '/challenges',
      icon: FaFire,
      label: 'Missões',
      color: '#ff0000' // Vermelho
    },
    {
      id: '/profile',
      icon: FaUser,
      label: 'Perfil',
      color: '#4285F4' // Azul
    }
  ];

  const handleNavigation = (path: string) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.navContainer}>
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              onClick={() => handleNavigation(item.id)}
            >
              <div className={styles.iconContainer}>
                <IconComponent 
                  className={styles.icon}
                  style={{ 
                    color: isActive ? item.color : '#b0b0b0'
                  }}
                />
                {isActive && (
                  <div 
                    className={styles.activeIndicator}
                    style={{ backgroundColor: item.color }}
                  />
                )}
              </div>
              <span 
                className={styles.label}
                style={{ 
                  color: isActive ? item.color : '#b0b0b0'
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
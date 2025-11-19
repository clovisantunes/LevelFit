import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useAuth } from '../../hooks/useAuth';
import styles from './dashboard.module.scss';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.userInfo}>
            <h1>Olá, {user?.displayName?.split(' ')[0] || 'Aventureiro'}!</h1>
            <p>Nível 1 - Iniciante</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Sair
          </button>
        </div>
      </header>
      
      
    </div>
  );
};

export default Dashboard;
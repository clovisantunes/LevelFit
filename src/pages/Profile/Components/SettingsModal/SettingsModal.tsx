import { useState } from 'react';
import { signOut, deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/config';
import { useAuth } from '../../../../hooks/useAuth';
import { 
  FaTimes, 
  FaSignOutAlt, 
  FaTrash, 
  FaExclamationTriangle,
  FaShieldAlt
} from 'react-icons/fa';
import styles from './SettingsModal.module.scss';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'danger'>('general');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // O redirecionamento será feito automaticamente pelo ProtectedRoute
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      alert('Erro ao sair. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // 1. Deletar dados do Firestore
      await deleteDoc(doc(db, 'users', user.uid));
      
      // 2. Deletar usuário do Authentication
      await deleteUser(user);
      
      alert('Conta excluída com sucesso. Esperamos vê-lo novamente!');
      
    } catch (error: any) {
      console.error('Erro ao excluir conta:', error);
      
      if (error.code === 'auth/requires-recent-login') {
        alert('Por segurança, faça login novamente antes de excluir sua conta.');
        await signOut(auth);
      } else {
        alert('Erro ao excluir conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Configurações</h2>
          <button onClick={onClose} className={styles.closeButton} disabled={loading}>
            <FaTimes />
          </button>
        </div>

        {/* Tabs de Navegação */}
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'general' ? styles.active : ''}`}
            onClick={() => setActiveTab('general')}
            disabled={loading}
          >
            <FaShieldAlt /> Geral
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'danger' ? styles.active : ''}`}
            onClick={() => setActiveTab('danger')}
            disabled={loading}
          >
            <FaExclamationTriangle /> Perigo
          </button>
        </div>

        <div className={styles.modalContent}>
          {/* ABA GERAL */}
          {activeTab === 'general' && (
            <div className={styles.tabContent}>
              <div className={styles.userInfo}>
                <h3>Informações da Conta</h3>
                <div className={styles.infoItem}>
                  <span>Email:</span>
                  <strong>{user?.email}</strong>
                </div>
                <div className={styles.infoItem}>
                  <span>Nome:</span>
                  <strong>{user?.displayName || 'Não definido'}</strong>
                </div>
              </div>

              <div className={styles.actionSection}>
                <h3>Ações</h3>
                <button 
                  onClick={handleLogout}
                  className={styles.logoutButton}
                  disabled={loading}
                >
                  <FaSignOutAlt />
                  {loading ? 'Saindo...' : 'Sair da Conta'}
                </button>
                
                <div className={styles.helpText}>
                  <p>💡 Ao sair, você precisará fazer login novamente para acessar seus dados.</p>
                </div>
              </div>
            </div>
          )}

          {/* ABA PERIGO */}
          {activeTab === 'danger' && (
            <div className={styles.tabContent}>
              <div className={styles.warningSection}>
                <div className={styles.warningIcon}>
                  <FaExclamationTriangle />
                </div>
                <h3>Zona de Perigo</h3>
                <p className={styles.warningText}>
                  Estas ações são irreversíveis. Tenha certeza do que está fazendo.
                </p>
              </div>

              {!showDeleteConfirm ? (
                <div className={styles.dangerActions}>
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className={styles.deleteButton}
                    disabled={loading}
                  >
                    <FaTrash />
                    Excluir Minha Conta
                  </button>
                  
                  <div className={styles.warningDetails}>
                    <h4>⚠️ O que será perdido:</h4>
                    <ul>
                      <li>Seu perfil completo</li>
                      <li>Todo o histórico de treinos</li>
                      <li>Seu progresso e conquistas</li>
                      <li>Dados pessoais e configurações</li>
                    </ul>
                    <p><strong>Esta ação não pode ser desfeita!</strong></p>
                  </div>
                </div>
              ) : (
                <div className={styles.confirmDelete}>
                  <h3>Confirmar Exclusão</h3>
                  <p className={styles.confirmText}>
                    Tem certeza que deseja excluir sua conta permanentemente? 
                    Todos os seus dados serão perdidos.
                  </p>
                  
                  <div className={styles.confirmActions}>
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className={styles.cancelConfirmButton}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleDeleteAccount}
                      className={styles.confirmDeleteButton}
                      disabled={loading}
                    >
                      {loading ? 'Excluindo...' : 'Sim, Excluir Conta'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
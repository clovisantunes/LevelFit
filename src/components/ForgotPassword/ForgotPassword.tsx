import { useState } from 'react';
import styles from './ForgotPassword.module.scss';

interface ForgotPasswordProps {
  isActive: boolean;
  onToggleForm: (form: 'login') => void;
}

const ForgotPassword = ({ isActive, onToggleForm }: ForgotPasswordProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Password recovery attempt:', { email });
      setIsEmailSent(true);
    } catch (error) {
      console.error('Password recovery error:', error);
      alert('Erro ao enviar email de recuperação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetForm = () => {
    setEmail('');
    setIsEmailSent(false);
    onToggleForm('login');
  };

  if (isEmailSent) {
    return (
      <div className={`${styles.forgotPasswordForm} ${isActive ? styles.active : ''}`}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h3 className={styles.successTitle}>Email Enviado!</h3>
          <p className={styles.successText}>
            Enviamos um link de recuperação para <strong>{email}</strong>
          </p>
          <p className={styles.successInstructions}>
            Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
          </p>
          <button 
            onClick={handleResetForm}
            className={styles.backButton}
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`${styles.forgotPasswordForm} ${isActive ? styles.active : ''}`}
    >
      <div className={styles.formDescription}>
        <p>Digite seu email abaixo e enviaremos um link para redefinir sua senha.</p>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="forgot-email" className={styles.inputLabel}>
          E-mail
        </label>
        <input
          id="forgot-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          className={styles.inputField}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={isLoading}
        className={`${styles.recoverButton} ${isLoading ? styles.loading : ''}`}
      >
        {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
      </button>

      <div className={styles.formLinks}>
        <button 
          type="button" 
          onClick={() => onToggleForm('login')}
          className={styles.linkButton}
        >
          Voltar ao Login
        </button>
      </div>
    </form>
  );
};

export default ForgotPassword;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // ← Importe estas funções
import { auth, db } from '../../firebase/config'; // ← Importe o db
import styles from './RegisterForm.module.scss';

interface RegisterFormProps {
  isActive: boolean;
  onToggleForm: (form: 'register' | 'forgotPassword' | 'login') => void;
}

const RegisterForm = ({ isActive, onToggleForm }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    if (formData.password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (!formData.name.trim()) {
      alert('Por favor, informe seu nome.');
      return;
    }

    setIsLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: formData.email,
        displayName: formData.name,
        hasCompletedOnboarding: false, 
        authProvider: 'email',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('✅ Usuário criado com sucesso e salvo no Firestore');
      
      navigate('/onboarding');
      
    } catch (error: any) {
      console.error('❌ Erro no registro:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        alert('📧 Este email já está em uso. Tente fazer login.');
        onToggleForm('login');
      } else if (error.code === 'auth/invalid-email') {
        alert('❌ Email inválido. Verifique o formato.');
      } else if (error.code === 'auth/weak-password') {
        alert('🔒 Senha muito fraca. Use pelo menos 6 caracteres.');
      } else if (error.code === 'auth/network-request-failed') {
        alert('🌐 Erro de conexão. Verifique sua internet.');
      } else {
        alert('😵 Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`${styles.registerForm} ${isActive ? styles.active : ''}`}
    >
      <div className={styles.inputGroup}>
        <label htmlFor="register-name" className={styles.inputLabel}>
          Nome completo
        </label>
        <input
          id="register-name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Seu nome completo"
          required
          className={styles.inputField}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="register-email" className={styles.inputLabel}>
          E-mail
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="seu@email.com"
          required
          className={styles.inputField}
        />
      </div>
      
      <div className={styles.inputGroup}>
        <label htmlFor="register-password" className={styles.inputLabel}>
          Senha
        </label>
        <input
          id="register-password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mínimo 6 caracteres"
          required
          minLength={6}
          className={styles.inputField}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="register-confirm-password" className={styles.inputLabel}>
          Confirmar senha
        </label>
        <input
          id="register-confirm-password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Digite a senha novamente"
          required
          className={styles.inputField}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={isLoading}
        className={`${styles.registerButton} ${isLoading ? styles.loading : ''}`}
      >
        {isLoading ? 'Criando conta...' : 'Começar Jornada'}
      </button>

      <div className={styles.formLinks}>
        <button 
          type="button" 
          onClick={() => onToggleForm('login')}
          className={styles.linkButton}
        >
          Já tem uma conta? Faça login
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
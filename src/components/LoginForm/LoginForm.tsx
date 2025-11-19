import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // ← Importe estas funções
import { auth, db, googleProvider } from '../../firebase/config'; // ← Importe o db
import GoogleLoginButton from '../GoogleLoginButton';
import styles from './LoginForm.module.scss';

interface LoginFormProps {
  isActive: boolean;
  onToggleForm: (form: 'register' | 'forgotPassword' | 'login') => void;
}

const LoginForm = ({ isActive, onToggleForm }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // ✅ VERIFICAR NO FIRESTORE SE COMPLETOU ONBOARDING
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists() || !userDoc.data()?.hasCompletedOnboarding) {
        console.log('🚀 USUÁRIO PRECISA FAZER ONBOARDING');
        navigate('/onboarding');
      } else {
        console.log('🎯 USUÁRIO JÁ TEM ONBOARDING COMPLETO');
        navigate('/dashboard');
      }
      
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      // Tratamento de erros (mantenha o que você já tem)
      if (error.code === 'auth/invalid-email') {
        alert('❌ Email inválido. Verifique o formato.');
      } else if (error.code === 'auth/user-not-found') {
        alert('👤 Usuário não encontrado. Verifique o email ou crie uma conta.');
      } else if (error.code === 'auth/wrong-password') {
        alert('🔒 Senha incorreta. Tente novamente.');
      } else if (error.code === 'auth/network-request-failed') {
        alert('🌐 Erro de conexão. Verifique sua internet.');
      } else if (error.code === 'auth/too-many-requests') {
        alert('🚫 Muitas tentativas. Tente novamente mais tarde.');
      } else {
        alert('😵 Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log('🎯 INICIANDO LOGIN GOOGLE');
    setIsGoogleLoading(true);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      console.log('✅ LOGIN GOOGLE BEM-SUCEDIDO');
      
      // ✅ VERIFICAR SE É A PRIMEIRA VEZ DO USUÁRIO GOOGLE
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        console.log('👤 PRIMEIRO LOGIN GOOGLE - CRIANDO DOCUMENTO');
        
        // 🆕 CRIAR DOCUMENTO PARA USUÁRIO GOOGLE
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName,
          hasCompletedOnboarding: false, // ← Precisa fazer onboarding
          authProvider: 'google',
          photoURL: user.photoURL,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log('🚀 REDIRECIONANDO PARA ONBOARDING');
        navigate('/onboarding');
      } else {
        // ✅ USUÁRIO JÁ EXISTE NO FIRESTORE
        const userData = userDoc.data();
        
        if (!userData.hasCompletedOnboarding) {
          console.log('🚀 USUÁRIO EXISTENTE SEM ONBOARDING');
          navigate('/onboarding');
        } else {
          console.log('🎯 USUÁRIO COM ONBOARDING COMPLETO');
          navigate('/dashboard');
        }
      }
      
    } catch (error: any) {
      console.error('❌ Erro no login Google:', error);
      
      // Tratamento de erros específicos para Google
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('ℹ️ Popup fechado pelo usuário');
      } else if (error.code === 'auth/popup-blocked') {
        alert('🚫 Popup bloqueado. Permita popups para este site.');
      } else if (error.code === 'auth/network-request-failed') {
        alert('🌐 Erro de conexão. Verifique sua internet.');
      } else {
        alert('😵 Erro ao fazer login com Google. Tente novamente.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <>
      <form 
        onSubmit={handleSubmit} 
        className={`${styles.loginForm} ${isActive ? styles.active : ''}`}
      >
        <div className={styles.inputGroup}>
          <label htmlFor="login-email" className={styles.inputLabel}>
            E-mail
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className={styles.inputField}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="login-password" className={styles.inputLabel}>
            Senha
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            required
            className={styles.inputField}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className={`${styles.loginButton} ${isLoading ? styles.loading : ''}`}
        >
          {isLoading ? 'Entrando...' : 'Entrar na Aventura'}
        </button>

        <div className={styles.separator}>
          <span className={styles.separatorText}>ou</span>
        </div>

        <GoogleLoginButton 
          onClick={handleGoogleLogin}
          isLoading={isGoogleLoading}
        />

        <div className={styles.formLinks}>
          <button 
            type="button" 
            onClick={() => onToggleForm('register')}
            className={styles.linkButton}
          >
            Criar uma conta
          </button>
          <span className={styles.linkSeparator}>•</span>
          <button 
            type="button" 
            onClick={() => onToggleForm('forgotPassword')}
            className={styles.linkButton}
          >
            Esqueceu a senha?
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
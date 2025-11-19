import { useState } from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import styles from './login.module.scss';
import ForgotPassword from '../../components/ForgotPassword/ForgotPassword';


type FormType = 'login' | 'register' | 'forgotPassword';

const Login = () => {
  const [currentForm, setCurrentForm] = useState<FormType>('login');

  const toggleForm = (form: FormType) => {
    setCurrentForm(form);
  };

  const getSubtitle = () => {
    switch (currentForm) {
      case 'login':
        return 'Entre na sua aventura';
      case 'register':
        return 'Comece sua jornada';
      case 'forgotPassword':
        return 'Recupere seu acesso';
      default:
        return 'Entre na sua aventura';
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1 className={styles.loginTitle}>LevelFit</h1>
          <p className={styles.loginSubtitle}>{getSubtitle()}</p>
        </div>
        
        <div className={styles.formContainer}>
          <div className={styles.formWrapper}>
            <div className={styles.formContent}>
              <LoginForm 
                isActive={currentForm === 'login'} 
                onToggleForm={toggleForm}
              />
              <RegisterForm 
                isActive={currentForm === 'register'} 
                onToggleForm={toggleForm}
              />
              <ForgotPassword 
                isActive={currentForm === 'forgotPassword'} 
                onToggleForm={toggleForm}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
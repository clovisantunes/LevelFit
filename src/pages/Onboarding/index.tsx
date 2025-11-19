import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore'; 
import { db } from '../../firebase/config';
import { useAuth } from '../../hooks/useAuth';
import { 
  FaDragon, 
  FaUser, 
  FaFire,
  FaRunning,
  FaCrown,
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa';
import { 
  GiMuscleUp, 
  GiStonePile, 
  GiBodyBalance,
  GiStrong,
  GiLightningSpanner
} from 'react-icons/gi';
import styles from './onboarding.module.scss';

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    weight: '',
    height: '',
    focus: ''
  });

  const fitnessPaths = [
    {
      id: 'bodybuilding',
      name: 'Bodybuilding',
      description: 'Desenvolver massa muscular e definição',
      color: '#1e90ff',
      icon: GiMuscleUp
    },
    {
      id: 'powerlifting',
      name: 'Powerlifting', 
      description: 'Foco em força máxima nos levantamentos básicos',
      color: '#dc143c',
      icon: GiStonePile
    },
    {
      id: 'crossfit',
      name: 'CrossFit',
      description: 'Treinamento funcional de alta intensidade',
      color: '#ff4500',
      icon: FaFire
    },
    {
      id: 'calisthenics',
      name: 'Calistenia',
      description: 'Exercícios usando o peso do próprio corpo',
      color: '#9370db',
      icon: GiBodyBalance
    },
    {
      id: 'strongman',
      name: 'Strongman',
      description: 'Treino com objetos pesados e movimentos incomuns',
      color: '#daa520',
      icon: GiStrong
    },
    {
      id: 'powerbuilding',
      name: 'Powerbuilding',
      description: 'Combinação de powerlifting e bodybuilding',
      color: '#8a2be2',
      icon: GiLightningSpanner
    },
    {
      id: 'endurance',
      name: 'Endurance',
      description: 'Foco em resistência cardiovascular',
      color: '#00bfff',
      icon: FaRunning
    }
  ];

  const steps = [
    {
      title: "Bem-vindo ao LevelFit",
      subtitle: "Sua jornada fitness começa agora",
      component: (
        <div className={styles.welcomeStep}>
          <div className={styles.wizardAnimation}>
            <div className={styles.wizard}>
              <FaDragon />
            </div>
            <div className={styles.sparkles}>
              <span>💪</span>
              <span>🔥</span>
              <span>⚡</span>
            </div>
          </div>
          <p className={styles.welcomeText}>
            Prepare-se para transformar seu corpo e mente.<br/>
            Cada treino é um passo em direção à sua melhor versão.<br/>
            Vamos construir sua lenda, uma repetição de cada vez.
          </p>
        </div>
      )
    },
    {
      title: "Seus Dados Pessoais",
      subtitle: "Vamos conhecer melhor o jogador",
      component: (
        <div className={styles.nameStep}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <FaUser /> Nome
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              placeholder="Seu nome"
              className={styles.inputField}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <FaUser /> Sobrenome
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              placeholder="Sobrenome"
              className={styles.inputField}
            />
          </div>
        </div>
      )
    },
    {
      title: "Sua Idade",
      subtitle: "Para personalizar seu treino",
      component: (
        <div className={styles.ageStep}>
          <div className={styles.inputGroup}>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              placeholder="Sua idade"
              min="12"
              max="100"
              className={styles.inputField}
            />
          </div>
          <div className={styles.ageExamples}>
            <span>👦 Adolescente (12-18 anos)</span>
            <span>👨‍💼 Adulto Jovem (19-35 anos)</span>
            <span>👴 Adulto (36+ anos)</span>
          </div>
        </div>
      )
    },
    {
      title: "Seu Peso",
      subtitle: "Peso corporal atual",
      component: (
        <div className={styles.weightStep}>
          <div className={styles.inputGroup}>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
              placeholder="Peso em kg"
              min="30"
              max="200"
              className={styles.inputField}
            />
          </div>
          <div className={styles.weightVisual}>
            <div className={styles.barbell}>
              <div className={styles.plate}></div>
              <div className={styles.bar}></div>
              <div className={styles.plate}></div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Sua Altura",
      subtitle: "Altura em centímetros",
      component: (
        <div className={styles.heightStep}>
          <div className={styles.inputGroup}>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({...formData, height: e.target.value})}
              placeholder="Altura em cm"
              min="100"
              max="250"
              className={styles.inputField}
            />
          </div>
          <div className={styles.heightVisual}>
            <div className={styles.character}>
              <div className={styles.head}></div>
              <div className={styles.body}></div>
              <div className={styles.legs}></div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Escolha Seu Foco",
      subtitle: "Selecione seu estilo de treino preferido",
      component: (
        <div className={styles.focusStep}>
          <div className={styles.focusGrid}>
            {fitnessPaths.map((path) => {
              const IconComponent = path.icon;
              return (
                <button
                  key={path.id}
                  className={`${styles.focusCard} ${
                    formData.focus === path.id ? styles.selected : ''
                  }`}
                  onClick={() => setFormData({...formData, focus: path.id})}
                  style={{
                    borderColor: formData.focus === path.id ? path.color : 'transparent',
                    boxShadow: formData.focus === path.id ? `0 0 20px ${path.color}40` : 'none'
                  }}
                >
                  <div className={styles.focusIcon} style={{ color: path.color }}>
                    <IconComponent />
                  </div>
                  <div className={styles.focusInfo}>
                    <h4>{path.name}</h4>
                    <p>{path.description}</p>
                  </div>
                  {formData.focus === path.id && (
                    <div 
                      className={styles.selectionGlow}
                      style={{ backgroundColor: path.color }}
                    ></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )
    },
    {
      title: "Perfil Criado!",
      subtitle: "Seu progresso começa agora",
      component: (
        <div className={styles.finalStep}>
          <div className={styles.characterSummary}>
            <div className={styles.characterAvatar}>
              <div className={styles.avatar}></div>
              <div className={styles.levelBadge}>
                <FaCrown /> Nv. 1
              </div>
            </div>
            <div className={styles.characterInfo}>
              <h3>{formData.firstName} "{formData.lastName}"</h3>
              <p>📊 Seu Perfil:</p>
              <p>🎂 {formData.age} anos • ⚖️ {formData.weight}kg • 📏 {formData.height}cm</p>
              <p className={styles.focusDisplay}>
                FOCO: {fitnessPaths.find(p => p.id === formData.focus)?.name}
              </p>
            </div>
          </div>
          <div className={styles.epicText}>
            <p>🎯 Perfil criado com sucesso!</p>
            <p>📈 Acompanhe seu progresso e evolua constantemente</p>
            <p>🏆 O sucesso depende da sua consistência</p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        await updateProfile(user!, {
          displayName: `${formData.firstName} ${formData.lastName}`
        });
        
        await updateDoc(doc(db, 'users', user!.uid), {
          hasCompletedOnboarding: true,
          firstName: formData.firstName,
          lastName: formData.lastName,
          fullName: `${formData.firstName} ${formData.lastName}`,
          age: parseInt(formData.age),
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          focus: formData.focus,
          fitnessPath: fitnessPaths.find(p => p.id === formData.focus)?.name,
          classTitle: fitnessPaths.find(p => p.id === formData.focus)?.name,
          level: 1,
          xp: 0,
          updatedAt: new Date(),
          onboardingCompletedAt: new Date(),
          systemActivated: true,
            muscleStats: {
    chest: { level: 1, xp: 0, nextLevelXp: 100 },
    back: { level: 1, xp: 0, nextLevelXp: 100 },
    shoulders: { level: 1, xp: 0, nextLevelXp: 100 },
    biceps: { level: 1, xp: 0, nextLevelXp: 100 },
    triceps: { level: 1, xp: 0, nextLevelXp: 100 },
    legs: { level: 1, xp: 0, nextLevelXp: 100 },
    core: { level: 1, xp: 0, nextLevelXp: 100 }
  },
        });
        
        console.log('✅ Dados do onboarding salvos no Firestore:', formData);
        navigate('/dashboard');
        
      } catch (error) {
        console.error('❌ Erro ao salvar perfil:', error);
        alert('Erro ao salvar dados. Tente novamente.');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName.trim() && formData.lastName.trim();
      case 2:
        return formData.age && parseInt(formData.age) >= 12;
      case 3:
        return formData.weight && parseInt(formData.weight) >= 30;
      case 4:
        return formData.height && parseInt(formData.height) >= 100;
      case 5:
        return formData.focus;
      default:
        return true;
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className={styles.onboarding}>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{currentStepData.title}</h1>
          <p className={styles.subtitle}>{currentStepData.subtitle}</p>
        </header>

        <main className={styles.content}>
          {currentStepData.component}
        </main>

        <footer className={styles.footer}>
          {currentStep > 0 && (
            <button onClick={handleBack} className={styles.backButton}>
              <FaArrowLeft /> Voltar
            </button>
          )}
          
          <button 
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`${styles.nextButton} ${
              !isStepValid() ? styles.disabled : ''
            }`}
          >
            {currentStep === steps.length - 1 ? (
              <>🚀 Começar Jornada</>
            ) : (
              <>Continuar <FaArrowRight /></>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Onboarding;
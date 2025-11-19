import { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import {  db } from '../../../../firebase/config';
import { useAuth } from '../../../../hooks/useAuth';
import { 
  FaTimes, 
  FaSave, 
  FaUser, 
  FaWeightHanging, 
  FaRulerVertical,
  FaBirthdayCake,
  FaDumbbell
} from 'react-icons/fa';
import styles from './EditProfileModal.module.scss';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: any;
  onUpdate: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  age: string;
  weight: string;
  height: string;
  focus: string;
}

const fitnessPaths = [
  { id: 'bodybuilding', name: 'Bodybuilding' },
  { id: 'powerlifting', name: 'Powerlifting' },
  { id: 'crossfit', name: 'CrossFit' },
  { id: 'calisthenics', name: 'Calistenia' },
  { id: 'strongman', name: 'Strongman' },
  { id: 'powerbuilding', name: 'Powerbuilding' },
  { id: 'endurance', name: 'Endurance' }
];

const EditProfileModal = ({ isOpen, onClose, userData, onUpdate }: EditProfileModalProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    age: '',
    weight: '',
    height: '',
    focus: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Preencher form com dados atuais
  useEffect(() => {
    if (userData && isOpen) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        age: userData.age?.toString() || '',
        weight: userData.weight?.toString() || '',
        height: userData.height?.toString() || '',
        focus: userData.focus || 'bodybuilding'
      });
      setErrors({});
    }
  }, [userData, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nome é obrigatório';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Sobrenome é obrigatório';
    }

    const age = parseInt(formData.age);
    if (!formData.age || age < 12 || age > 100) {
      newErrors.age = 'Idade deve ser entre 12 e 100 anos';
    }

    const weight = parseFloat(formData.weight);
    if (!formData.weight || weight < 30 || weight > 300) {
      newErrors.weight = 'Peso deve ser entre 30kg e 300kg';
    }

    const height = parseFloat(formData.height);
    if (!formData.height || height < 100 || height > 250) {
      newErrors.height = 'Altura deve ser entre 100cm e 250cm';
    }

    if (!formData.focus) {
      newErrors.focus = 'Selecione um foco de treino';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Atualizar displayName no Auth
      await updateProfile(user!, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      // Atualizar dados no Firestore
      const updateData: any = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        focus: formData.focus,
        fitnessPath: fitnessPaths.find(p => p.id === formData.focus)?.name || 'Bodybuilding',
        classTitle: fitnessPaths.find(p => p.id === formData.focus)?.name || 'Bodybuilding',
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'users', user!.uid), updateData);

      // Chamar callback de atualização
      onUpdate();
      onClose();
      
      alert('Perfil atualizado com sucesso! 🎉');

    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Editar Perfil</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            {/* Nome */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <FaUser /> Nome
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Seu nome"
                className={errors.firstName ? styles.inputError : ''}
              />
              {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
            </div>

            {/* Sobrenome */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <FaUser /> Sobrenome
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Seu sobrenome"
                className={errors.lastName ? styles.inputError : ''}
              />
              {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
            </div>

            {/* Idade */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <FaBirthdayCake /> Idade
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="Sua idade"
                min="12"
                max="100"
                className={errors.age ? styles.inputError : ''}
              />
              {errors.age && <span className={styles.errorText}>{errors.age}</span>}
            </div>

            {/* Peso */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <FaWeightHanging /> Peso (kg)
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="Seu peso em kg"
                min="30"
                max="300"
                step="0.1"
                className={errors.weight ? styles.inputError : ''}
              />
              {errors.weight && <span className={styles.errorText}>{errors.weight}</span>}
            </div>

            {/* Altura */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <FaRulerVertical /> Altura (cm)
              </label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                placeholder="Sua altura em cm"
                min="100"
                max="250"
                className={errors.height ? styles.inputError : ''}
              />
              {errors.height && <span className={styles.errorText}>{errors.height}</span>}
            </div>

            {/* Foco de Treino */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <FaDumbbell /> Foco de Treino
              </label>
              <select
                value={formData.focus}
                onChange={(e) => handleInputChange('focus', e.target.value)}
                className={errors.focus ? styles.inputError : ''}
              >
                <option value="">Selecione seu foco</option>
                {fitnessPaths.map((path) => (
                  <option key={path.id} value={path.id}>
                    {path.name}
                  </option>
                ))}
              </select>
              {errors.focus && <span className={styles.errorText}>{errors.focus}</span>}
            </div>
          </div>

          <div className={styles.formActions}>
            <button 
              type="button" 
              onClick={onClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? 'Salvando...' : <><FaSave /> Salvar Alterações</>}
            </button>
          </div>
        </form>

        <div className={styles.helpText}>
          <p>💡 <strong>Dica:</strong> Estes dados serão usados para personalizar seus treinos e acompanhar seu progresso.</p>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
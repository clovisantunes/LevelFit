// pages/Profile/Profile.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import {
    FaEdit,
    FaShare,
    FaCog,
    FaUser,
    FaDumbbell,
    FaTrophy,
    FaChartLine,
    FaWeightHanging,
    FaRulerVertical,
    FaHeart,
    FaCalendarAlt
} from 'react-icons/fa';
import styles from './Profile.module.scss';
import MuscleStats from './Components/MuscleStats/MuscleStats';
import MuscleRadarChart from './Components/MuscleRadarChart';
import EditProfileModal from './Components/EditProfileModal/EditProfileModal';
import SettingsModal from './Components/SettingsModal/SettingsModal';

interface UserData {
    firstName?: string;
    lastName?: string;
    age?: number;
    weight?: number;
    height?: number;
    focus?: string;
    fitnessPath?: string;
    level?: number;
    xp?: number;
    createdAt?: any;
    workoutsCompleted?: number;
    currentStreak?: number;
    totalWeightLifted?: number;
    personalRecords?: number;
    muscleStats?: {
        chest: { level: number; xp: number; nextLevelXp: number };
        back: { level: number; xp: number; nextLevelXp: number };
        shoulders: { level: number; xp: number; nextLevelXp: number };
        biceps: { level: number; xp: number; nextLevelXp: number };
        triceps: { level: number; xp: number; nextLevelXp: number };
        legs: { level: number; xp: number; nextLevelXp: number };
        core: { level: number; xp: number; nextLevelXp: number };
    };
}

const Profile = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState<UserData>({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data() as UserData);
                    }
                } catch (error) {
                    console.error('Erro ao buscar dados do usuário:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    }, [user]);

    if (loading) {
        return (
            <div className={styles.profile}>
                <div className={styles.loading}>Carregando perfil...</div>
            </div>
        );
    }


    const profileData = {
        username: user?.displayName?.split(' ')[0] || userData.firstName || 'Aventureiro',
        fullName: user?.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Usuário LevelFit',
        level: userData.level || 1,
        xp: userData.xp || 0,
        nextLevelXp: (userData.level || 1) * 1000 + 1000,
        joinDate: userData.createdAt?.toDate?.()?.toLocaleDateString('pt-BR') || 'Data não disponível',
        focus: userData.fitnessPath || userData.focus || 'Não definido',
        stats: {
            workoutsCompleted: userData.workoutsCompleted || 0,
            currentStreak: userData.currentStreak || 0,
            totalWeightLifted: userData.totalWeightLifted || 0,
            personalRecords: userData.personalRecords || 0
        },
        physicalData: {
            weight: userData.weight ? `${userData.weight} kg` : 'Não informado',
            height: userData.height ? `${userData.height} cm` : 'Não informado',
            age: userData.age ? `${userData.age} anos` : 'Não informado'
        }
    };

    const handleEditProfile = () => {
        setIsEditModalOpen(true);
    };
    const handleShareProfile = () => {
        if (navigator.share) {
            navigator.share({
                title: `Perfil de ${profileData.username} - LevelFit`,
                text: `Venha ver meu progresso no LevelFit! Nível ${profileData.level} e subindo! Nível ${profileData.level} - ${profileData.stats.workoutsCompleted} treinos concluídos!`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link do perfil copiado!');
        }
    };

    const handleSettings = () => {
        setIsSettingsModalOpen(true);
    };
    const handleProfileUpdate = () => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data() as UserData);
                    }
                } catch (error) {
                    console.error('Erro ao buscar dados do usuário:', error);
                }
            }
        };
        fetchUserData();
    };
    const renderOverview = () => (
        <div className={styles.overviewContent}>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <FaDumbbell />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{profileData.stats.workoutsCompleted}</span>
                        <span className={styles.statLabel}>Treinos Concluídos</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <FaChartLine />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{profileData.stats.currentStreak} dias</span>
                        <span className={styles.statLabel}>Sequência Atual</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <FaWeightHanging />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{profileData.stats.totalWeightLifted}kg</span>
                        <span className={styles.statLabel}>Peso Total</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <FaTrophy />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{profileData.stats.personalRecords}</span>
                        <span className={styles.statLabel}>Records Pessoais</span>
                    </div>
                </div>
            </div>

            <div className={styles.physicalData}>
                <h3>📊 Dados Físicos</h3>
                <div className={styles.physicalGrid}>
                    <div className={styles.physicalItem}>
                        <FaWeightHanging />
                        <span>{profileData.physicalData.weight}</span>
                    </div>
                    <div className={styles.physicalItem}>
                        <FaRulerVertical />
                        <span>{profileData.physicalData.height}</span>
                    </div>
                    <div className={styles.physicalItem}>
                        <FaHeart />
                        <span>{profileData.physicalData.age}</span>
                    </div>
                </div>
            </div>

            <div className={styles.progressSection}>
                <h3>🎯 Progresso do Nível</h3>
                <div className={styles.levelProgress}>
                    <div className={styles.levelInfo}>
                        <span>Nível {profileData.level}</span>
                        <span>{profileData.xp} / {profileData.nextLevelXp} XP</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{
                                width: `${(profileData.xp / profileData.nextLevelXp) * 100}%`
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* COMPONENTES DOS MÚSCULOS DENTRO DA RENDEROVERVIEW */}
            {userData.muscleStats && (
                <>
                    <MuscleRadarChart muscleStats={userData.muscleStats} />
                    <MuscleStats muscleStats={userData.muscleStats} />
                </>
            )}
        </div>
    );

    const renderAchievements = () => (
        <div className={styles.achievementsContent}>
            <div className={styles.achievementCard}>
                <div className={styles.achievementIcon}>🎯</div>
                <div className={styles.achievementInfo}>
                    <h4>Início da Jornada</h4>
                    <p>Complete o onboarding</p>
                    <span className={styles.achievementStatusCompleted}>Concluído</span>
                </div>
            </div>

            <div className={styles.achievementCard}>
                <div className={styles.achievementIcon}>💪</div>
                <div className={styles.achievementInfo}>
                    <h4>Primeiro Treino</h4>
                    <p>Complete seu primeiro treino</p>
                    <span className={profileData.stats.workoutsCompleted > 0 ? styles.achievementStatusCompleted : styles.achievementStatusLocked}>
                        {profileData.stats.workoutsCompleted > 0 ? 'Concluído' : 'Bloqueado'}
                    </span>
                </div>
            </div>

            <div className={styles.achievementCard}>
                <div className={styles.achievementIcon}>🔥</div>
                <div className={styles.achievementInfo}>
                    <h4>Sequência de Fogo</h4>
                    <p>7 dias consecutivos de treino</p>
                    <span className={profileData.stats.currentStreak >= 7 ? styles.achievementStatusCompleted : styles.achievementStatusLocked}>
                        {profileData.stats.currentStreak >= 7 ? 'Concluído' : 'Bloqueado'}
                    </span>
                </div>
            </div>

            <div className={styles.achievementCard}>
                <div className={styles.achievementIcon}>🏆</div>
                <div className={styles.achievementInfo}>
                    <h4>Levantador Iniciante</h4>
                    <p>Alcance 1000kg no levantamento total</p>
                    <span className={profileData.stats.totalWeightLifted >= 1000 ? styles.achievementStatusCompleted : styles.achievementStatusLocked}>
                        {profileData.stats.totalWeightLifted >= 1000 ? 'Concluído' : 'Bloqueado'}
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles.profile}>
            <header className={styles.profileHeader}>
                <div className={styles.headerTop}>
                    <button onClick={handleEditProfile} className={styles.iconButton}>
                        <FaEdit />
                    </button>

                    <div className={styles.userMainInfo}>
                        <h1 className={styles.username}>{profileData.username}</h1>
                        <p className={styles.userLevel}>Nível {profileData.level} • {profileData.focus}</p>
                    </div>

                    <div className={styles.headerActions}>
                        <button onClick={handleShareProfile} className={styles.iconButton}>
                            <FaShare />
                        </button>
                        <button onClick={handleSettings} className={styles.iconButton}>
                            <FaCog />
                        </button>
                    </div>
                </div>

                <div className={styles.joinDate}>
                    <FaCalendarAlt />
                    <span>Membro desde {profileData.joinDate}</span>
                </div>
            </header>

            <main className={styles.profileContent}>
                <nav className={styles.profileTabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <FaUser /> Visão Geral
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'achievements' ? styles.active : ''}`}
                        onClick={() => setActiveTab('achievements')}
                    >
                        <FaTrophy /> Conquistas
                    </button>
                </nav>

                <div className={styles.tabContent}>
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'achievements' && renderAchievements()}
                </div>
            </main>
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                userData={userData}
                onUpdate={handleProfileUpdate}
            />
            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
            />

        </div>
    );
};

export default Profile;
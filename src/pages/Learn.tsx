import { useState, useEffect, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DuolingoLearningScreen } from '@/components/learning/DuolingoLearningScreen';
import { LessonPlayer } from '@/components/learning/LessonPlayer';
import { XPGain } from '@/components/rewards/XPGain';
import { CoinGain } from '@/components/rewards/CoinGain';
import { LevelUpModal } from '@/components/rewards/LevelUpModal';
import { LoadingSpinner } from '@/components/learning/LoadingSpinner';
import { StockyCharacter } from '@/components/mascot/StockyCharacter';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { useAchievements } from '@/hooks/useAchievements';
import { useUserStats } from '@/hooks/useUserStats';
import { LessonWithProgress, Lesson } from '@/types/lesson.types';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LEVELS } from '@/types/lesson.types';
import { lessons1to10Data } from '@/data/lessons1to10';

export default function Learn() {
  const { profile, user } = useAuth();
  const { lessons: dbLessons, isLoading: dbIsLoading, updateProgress, refreshLessons } = useLessonProgress();
  const { checkAchievements } = useAchievements();
  const { stats, refreshStats } = useUserStats();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showXPGain, setShowXPGain] = useState(false);
  const [showCoinGain, setShowCoinGain] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [coinAmount, setCoinAmount] = useState(0);
  const [levelUp, setLevelUp] = useState<number | null>(null);

  // Convert local lessons data to LessonWithProgress format
  const localLessons: LessonWithProgress[] = useMemo(() => {
    return lessons1to10Data.map((lessonData, index) => {
      // Generate a unique ID based on lesson identifier
      const id = `lesson-${lessonData.module_id}-${lessonData.day_number}-${lessonData.lesson_number}`;
      
      // First lesson is always unlocked
      const isLocked = index === 0 ? false : lessonData.is_locked;
      
      return {
        id,
        module_id: lessonData.module_id,
        day_number: lessonData.day_number,
        lesson_number: lessonData.lesson_number,
        title: lessonData.title,
        description: lessonData.description,
        lesson_type: lessonData.lesson_type,
        content_json: lessonData.content_json,
        min_score_to_pass: lessonData.min_score_to_pass,
        xp_reward: lessonData.xp_reward,
        coin_reward: lessonData.coin_reward,
        is_locked: isLocked,
        unlock_requirement: lessonData.unlock_requirement,
        estimated_duration_minutes: lessonData.estimated_duration_minutes,
        created_at: new Date().toISOString(),
        progress: null,
        isCompleted: false,
        isLocked: isLocked,
        isCurrent: index === 0, // First lesson is current
      };
    });
  }, []);

  // Always use local lessons (they are hardcoded and always available)
  // Database lessons will be used if they exist and user is logged in
  const lessons = localLessons;
  const isLoading = false; // Local lessons are always available instantly

  const handleLessonClick = (lesson: LessonWithProgress) => {
    if (lesson.isLocked) {
      toast.error('Leçon verrouillée', {
        description: 'Complétez les leçons précédentes pour débloquer.',
        icon: <Lock className="h-4 w-4" />
      });
      return;
    }

    // Convert LessonWithProgress to Lesson for LessonPlayer
    const lessonForPlayer: Lesson = {
      id: lesson.id,
      module_id: lesson.module_id || 1,
      day_number: lesson.day_number || 1,
      lesson_number: lesson.lesson_number || 1,
      title: lesson.title,
      description: lesson.description,
      lesson_type: lesson.lesson_type || 'mixed',
      content: lesson.content_json as any || [],
      min_score_to_pass: lesson.min_score_to_pass || 70,
      xp_reward: lesson.xp_reward || 10,
      coin_reward: lesson.coin_reward || 5,
      is_locked: lesson.is_locked,
      unlock_requirement: lesson.unlock_requirement,
      estimated_duration_minutes: lesson.estimated_duration_minutes || 5,
      created_at: lesson.created_at || new Date().toISOString(),
    };

    setSelectedLesson(lessonForPlayer);
  };

  const handleCompleteLesson = async (score: number) => {
    if (!selectedLesson) return;

    try {
      const passed = score >= selectedLesson.min_score_to_pass;
      
      // Update progress (this will also award rewards internally)
      await updateProgress(
        selectedLesson.id,
        passed ? 'completed' : 'in_progress',
        score
      );

      // Get the lesson to calculate rewards
      const lesson = lessons.find(l => l.id === selectedLesson.id);
      if (lesson && passed) {
        // Calculate rewards
        let xpReward = lesson.xp_reward || 10;
        let coinReward = lesson.coin_reward || 5;

        if (score === 100) {
          xpReward += 10;
          coinReward += 5;
        }

        // Show reward animations
        setXpAmount(xpReward);
        setCoinAmount(coinReward);
        setShowXPGain(true);
        setShowCoinGain(true);

        // Hide after 3 seconds
        setTimeout(() => {
          setShowXPGain(false);
          setShowCoinGain(false);
        }, 3000);

        // Check for level up
        if (profile) {
          const currentXP = profile.xp || 0;
          const currentLevel = LEVELS.reduce((level, lvl) => {
            return currentXP >= lvl.xpRequired ? lvl.level : level;
          }, 1);

          const previousLevel = profile.user_level || 1;
          if (currentLevel > previousLevel) {
            setLevelUp(currentLevel);
          }
        }

        // Check achievements
        await refreshStats();
        if (stats) {
          await checkAchievements({
            lessonsCompleted: stats.lessons_completed,
            perfectScores: stats.perfect_scores,
            streakDays: stats.current_streak_days,
            totalXP: stats.total_xp,
          });
        }
      }

      await refreshLessons();
      setSelectedLesson(null);
    } catch (error) {
      console.error('Error completing lesson:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleExitLesson = () => {
    setSelectedLesson(null);
  };

  // Lesson Player Mode
  if (selectedLesson) {
    return (
      <LessonPlayer
        lesson={selectedLesson}
        onComplete={handleCompleteLesson}
        onExit={handleExitLesson}
      />
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner message="Chargement de ton parcours d'apprentissage..." />
      </MainLayout>
    );
  }

  if (lessons.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="mb-6">
              <StockyCharacter emotion="thinking" size="large" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Aucune leçon disponible
            </h2>
            <p className="text-gray-600 mb-6">
              Les leçons seront bientôt disponibles! En attendant, assurez-vous que la migration de la base de données a été appliquée.
            </p>
            <div className="bg-indigo-50 rounded-xl p-6 text-left max-w-md mx-auto">
              <h3 className="font-bold text-indigo-900 mb-2">Pour commencer:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-indigo-800">
                <li>Appliquez la migration Supabase</li>
                <li>Créez des leçons dans la table `lessons`</li>
                <li>Rafraîchissez la page</li>
              </ol>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <>
      <DuolingoLearningScreen
        lessons={lessons}
        onLessonClick={handleLessonClick}
      />

      {/* Reward Animations */}
      <XPGain amount={xpAmount} show={showXPGain} />
      <CoinGain amount={coinAmount} show={showCoinGain} />
      
      {/* Level Up Modal */}
      {levelUp && (
        <LevelUpModal
          newLevel={levelUp}
          isOpen={!!levelUp}
          onClose={() => setLevelUp(null)}
        />
      )}
    </>
  );
}

// @ts-nocheck
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LearningDashboard } from '@/components/learning/LearningDashboard';
import { LessonPath } from '@/components/learning/LessonPath';
import { LessonPlayer } from '@/components/learning/LessonPlayer';
import { XPGain } from '@/components/rewards/XPGain';
import { CoinGain } from '@/components/rewards/CoinGain';
import { LevelUpModal } from '@/components/rewards/LevelUpModal';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { useAchievements } from '@/hooks/useAchievements';
import { useUserStats } from '@/hooks/useUserStats';
import { LessonWithProgress, Lesson } from '@/types/lesson.types';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { LEVELS } from '@/types/lesson.types';
import { LoadingSpinner } from '@/components/learning/LoadingSpinner';

export default function LearnNew() {
  const { profile } = useAuth();
  const { lessons, isLoading, updateProgress, refreshLessons } = useLessonProgress();
  const { checkAchievements } = useAchievements();
  const { stats, refreshStats } = useUserStats();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showXPGain, setShowXPGain] = useState(false);
  const [showCoinGain, setShowCoinGain] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [coinAmount, setCoinAmount] = useState(0);
  const [levelUp, setLevelUp] = useState<number | null>(null);

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

  return (
    <MainLayout>
      <LearningDashboard />
      
      {isLoading ? (
        <LoadingSpinner message="Chargement de ton parcours d'apprentissage..." />
      ) : (
        <div className="container mx-auto px-4 py-6">
          <LessonPath
            lessons={lessons}
            onLessonClick={handleLessonClick}
          />
        </div>
      )}

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
    </MainLayout>
  );
}


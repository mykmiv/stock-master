// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Lesson, LessonWithProgress, UserLessonProgress, LessonStatus, LEVELS } from '@/types/lesson.types';
import { toast } from 'sonner';

export function useLessonProgress() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<LessonWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLessons = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch all lessons ordered by module, day, and lesson number
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .order('module_id', { ascending: true, nullsFirst: false })
        .order('day_number', { ascending: true, nullsFirst: false })
        .order('lesson_number', { ascending: true, nullsFirst: false });

      if (lessonsError) {
        console.error('Error fetching lessons:', lessonsError);
        // Return empty array if table doesn't exist or error
        setLessons([]);
        setIsLoading(false);
        return;
      }

      // Fetch user progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      const progressMap = new Map<string, UserLessonProgress>();
      (progressData || []).forEach(p => {
        progressMap.set(p.lesson_id, p);
      });

      // Determine which lessons are locked/unlocked
      const lessonsWithProgress: LessonWithProgress[] = (lessonsData || []).map((lesson, index) => {
        const progress = progressMap.get(lesson.id) || null;
        const isCompleted = progress?.status === 'completed' || progress?.status === 'mastered';
        
        // First lesson is always unlocked
        let isLocked = lesson.is_locked;
        if (index === 0) {
          isLocked = false;
        } else if (progress && isCompleted) {
          isLocked = false;
        } else if (index > 0) {
          // Check if previous lesson is completed
          const previousLesson = lessonsData[index - 1];
          const previousProgress = progressMap.get(previousLesson.id);
          isLocked = !(previousProgress?.status === 'completed' || previousProgress?.status === 'mastered');
        }

        // Current lesson is the first incomplete, unlocked lesson
        const isCurrent = !isLocked && !isCompleted && 
          lessonsData.slice(0, index).every((l, i) => {
            const p = progressMap.get(l.id);
            return p?.status === 'completed' || p?.status === 'mastered';
          });

        return {
          ...lesson,
          progress,
          isCompleted,
          isLocked,
          isCurrent,
        };
      });

      setLessons(lessonsWithProgress);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const updateProgress = async (
    lessonId: string, 
    status: LessonStatus, 
    score?: number,
    timeSpent?: number
  ) => {
    if (!user) return;

    try {
      // Check if progress exists
      const { data: existing } = await supabase
        .from('user_lesson_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single();

      const progressData: any = {
        user_id: user.id,
        lesson_id: lessonId,
        status,
        last_accessed: new Date().toISOString(),
      };

      if (score !== undefined) {
        progressData.score = score;
      }

      if (timeSpent !== undefined) {
        progressData.time_spent_seconds = timeSpent;
      }

      if (status === 'completed' || status === 'mastered') {
        progressData.completed_at = new Date().toISOString();
        progressData.attempts = (existing ? (await supabase.from('user_lesson_progress').select('attempts').eq('id', existing.id).single()).data?.attempts || 0 : 0) + 1;
      }

      const wasAlreadyCompleted = existing?.status === 'completed' || existing?.status === 'mastered';

      if (existing) {
        await supabase
          .from('user_lesson_progress')
          .update(progressData)
          .eq('id', existing.id);
      } else {
        await supabase
          .from('user_lesson_progress')
          .insert(progressData);
      }

      // Award XP and coins if lesson completed for the first time
      if ((status === 'completed' || status === 'mastered') && !wasAlreadyCompleted && score !== undefined) {
        // Fetch lesson data
        const { data: lessonData } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', lessonId)
          .single();

        if (lessonData) {
          const lesson: LessonWithProgress = {
            ...lessonData,
            progress: null,
            isCompleted: false,
            isLocked: false,
            isCurrent: false,
          };
          await awardRewards(lesson, score);
        }
      }

      await fetchLessons();
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  };

  const awardRewards = async (lesson: LessonWithProgress, score: number) => {
    if (!user) return;

    try {
      // Get current profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('xp, coins, streak_days, last_activity_date, lessons_completed, perfect_scores')
        .eq('user_id', user.id)
        .single();

      if (profileError || !profile) throw profileError;

      const currentXP = profile.xp || 0;
      const currentCoins = profile.coins || 0;
      const currentLevel = LEVELS.reduce((level, lvl) => {
        return currentXP >= lvl.xpRequired ? lvl.level : level;
      }, 1);

      // Calculate rewards
      let xpReward = lesson.xp_reward || 10;
      let coinReward = lesson.coin_reward || 5;

      // Bonus for perfect score
      if (score === 100) {
        xpReward += 10; // Extra 10 XP for perfect
        coinReward += 5; // Extra 5 coins for perfect
      }

      // Bonus for first try perfect (if attempts === 1)
      // This would need to be checked from the progress

      const newXP = currentXP + xpReward;
      const newCoins = currentCoins + coinReward;

      // Calculate new level
      const newLevel = LEVELS.reduce((level, lvl) => {
        return newXP >= lvl.xpRequired ? lvl.level : level;
      }, 1);

      const leveledUp = newLevel > currentLevel;

      // Update streak
      const today = new Date().toISOString().split('T')[0];
      const lastActivity = profile.last_activity_date;
      let newStreak = profile.streak_days || 0;

      if (lastActivity === today) {
        // Already did something today, keep streak
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastActivity === yesterdayStr) {
          // Continuing streak
          newStreak += 1;
        } else if (!lastActivity || lastActivity < yesterdayStr) {
          // Streak broken, reset to 1
          newStreak = 1;
        }
      }

      // Update profile
      const updateData: any = {
        xp: newXP,
        coins: newCoins,
        streak_days: newStreak,
        last_activity_date: today,
        lessons_completed: (profile.lessons_completed || 0) + 1,
      };

      if (score === 100) {
        updateData.perfect_scores = (profile.perfect_scores || 0) + 1;
      }

      if (leveledUp) {
        updateData.user_level = newLevel;
      }

      await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', user.id);

      // Update user_stats
      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (stats) {
        await supabase
          .from('user_stats')
          .update({
            total_xp: newXP,
            total_coins: newCoins,
            current_streak_days: newStreak,
            longest_streak_days: Math.max(newStreak, stats.longest_streak_days || 0),
            lessons_completed: updateData.lessons_completed,
            perfect_scores: updateData.perfect_scores || stats.perfect_scores || 0,
            last_lesson_date: today,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('user_stats')
          .insert({
            user_id: user.id,
            total_xp: newXP,
            total_coins: newCoins,
            current_streak_days: newStreak,
            longest_streak_days: newStreak,
            lessons_completed: updateData.lessons_completed,
            perfect_scores: updateData.perfect_scores || 0,
            last_lesson_date: today,
          });
      }

      return {
        xpReward,
        coinReward,
        newXP,
        newCoins,
        leveledUp,
        newLevel,
        newStreak,
      };
    } catch (error) {
      console.error('Error awarding rewards:', error);
      throw error;
    }
  };

  return {
    lessons,
    isLoading,
    updateProgress,
    refreshLessons: fetchLessons,
  };
}


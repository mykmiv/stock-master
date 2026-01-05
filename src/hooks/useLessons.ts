// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface LessonWithProgress {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  level: 'beginner' | 'intermediate' | 'advanced';
  orderIndex: number;
  xpReward: number;
  durationMinutes: number;
  isCompleted: boolean;
  quizScore: number | null;
  isLocked: boolean;
}

interface UseLessonsReturn {
  lessons: LessonWithProgress[];
  isLoading: boolean;
  completedCount: number;
  totalCount: number;
  progressPercent: number;
  completeLesson: (lessonId: string, score: number) => Promise<void>;
  refreshLessons: () => Promise<void>;
}

export function useLessons(): UseLessonsReturn {
  const { user, profile, refreshProfile } = useAuth();
  const [lessons, setLessons] = useState<LessonWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLessons = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch all lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .order('level')
        .order('order_index');

      if (lessonsError) throw lessonsError;

      // Fetch user progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_lesson_progress')
        .select('lesson_id, completed, quiz_score')
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      const progressMap = new Map(
        (progressData || []).map(p => [p.lesson_id, { completed: p.completed, quizScore: p.quiz_score }])
      );

      // Get user level and completed lessons count per level
      const userLevel = profile?.level || 'beginner';
      
      // Count completed beginner lessons
      const completedBeginnerCount = (lessonsData || [])
        .filter(l => l.level === 'beginner')
        .filter(l => progressMap.get(l.id)?.completed)
        .length;

      const completedIntermediateCount = (lessonsData || [])
        .filter(l => l.level === 'intermediate')
        .filter(l => progressMap.get(l.id)?.completed)
        .length;

      // Determine unlocked levels
      const intermediateUnlocked = completedBeginnerCount >= 3 || userLevel !== 'beginner';
      const advancedUnlocked = (completedIntermediateCount >= 3 && intermediateUnlocked) || userLevel === 'advanced';

      const lessonsWithProgress: LessonWithProgress[] = (lessonsData || []).map((lesson) => {
        const progress = progressMap.get(lesson.id);
        
        let isLocked = false;
        if (lesson.level === 'intermediate' && !intermediateUnlocked) {
          isLocked = true;
        }
        if (lesson.level === 'advanced' && !advancedUnlocked) {
          isLocked = true;
        }

        return {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          level: lesson.level as 'beginner' | 'intermediate' | 'advanced',
          orderIndex: lesson.order_index,
          xpReward: lesson.xp_reward || 10,
          durationMinutes: lesson.duration_minutes || 5,
          isCompleted: progress?.completed || false,
          quizScore: progress?.quizScore ?? null,
          isLocked,
        };
      });

      setLessons(lessonsWithProgress);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error('Failed to load lessons');
    } finally {
      setIsLoading(false);
    }
  }, [user, profile]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const completeLesson = async (lessonId: string, score: number) => {
    if (!user) return;

    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    const passed = score >= 70;
    
    try {
      // Check if progress already exists
      const { data: existing } = await supabase
        .from('user_lesson_progress')
        .select('id, completed')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single();

      const wasAlreadyCompleted = existing?.completed;

      if (existing) {
        // Update existing progress
        await supabase
          .from('user_lesson_progress')
          .update({
            completed: passed,
            quiz_score: score,
            completed_at: passed ? new Date().toISOString() : null
          })
          .eq('id', existing.id);
      } else {
        // Insert new progress
        await supabase
          .from('user_lesson_progress')
          .insert({
            user_id: user.id,
            lesson_id: lessonId,
            completed: passed,
            quiz_score: score,
            completed_at: passed ? new Date().toISOString() : null
          });
      }

      // Award XP if passed and not already completed
      if (passed && !wasAlreadyCompleted) {
        const newXp = (profile?.xp || 0) + lesson.xpReward;
        
        // Determine new level
        let newLevel: 'beginner' | 'intermediate' | 'advanced' = profile?.level || 'beginner';
        const leveledUp = false;
        
        if (newXp >= 2000 && newLevel !== 'advanced') {
          newLevel = 'advanced';
          toast.success('🎉 Level Up! You are now ADVANCED!', {
            duration: 5000,
            description: 'You have unlocked all advanced lessons!'
          });
        } else if (newXp >= 500 && newLevel === 'beginner') {
          newLevel = 'intermediate';
          toast.success('🎉 Level Up! You are now INTERMEDIATE!', {
            duration: 5000,
            description: 'You have unlocked intermediate lessons!'
          });
        }

        await supabase
          .from('profiles')
          .update({ 
            xp: newXp,
            level: newLevel,
            last_activity_date: new Date().toISOString().split('T')[0]
          })
          .eq('user_id', user.id);

        // Check for badges
        await checkAndAwardBadges(newXp, lessonId, lesson.level);
        
        // Refresh profile to get updated XP
        await refreshProfile();
      }

      // Refresh lessons list
      await fetchLessons();

    } catch (error) {
      console.error('Error completing lesson:', error);
      toast.error('Failed to save progress');
    }
  };

  const checkAndAwardBadges = async (totalXp: number, lessonId: string, lessonLevel: string) => {
    if (!user) return;

    const badgesToCheck = [
      { id: 'first_lesson', condition: true },
      { id: 'xp_100', condition: totalXp >= 100 },
      { id: 'xp_500', condition: totalXp >= 500 },
      { id: 'xp_1000', condition: totalXp >= 1000 },
    ];

    for (const badge of badgesToCheck) {
      if (badge.condition) {
        // Check if already has badge
        const { data: existing } = await supabase
          .from('user_badges')
          .select('id')
          .eq('user_id', user.id)
          .eq('badge_id', badge.id)
          .single();

        if (!existing) {
          await supabase
            .from('user_badges')
            .insert({ user_id: user.id, badge_id: badge.id });
          
          if (badge.id === 'first_lesson') {
            toast.success('🏅 Badge Earned: First Steps!', { description: 'Completed your first lesson' });
          } else if (badge.id === 'xp_500') {
            toast.success('🏅 Badge Earned: Rising Star!', { description: 'Earned 500 XP' });
          }
        }
      }
    }
  };

  const completedCount = lessons.filter(l => l.isCompleted).length;
  const totalCount = lessons.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    lessons,
    isLoading,
    completedCount,
    totalCount,
    progressPercent,
    completeLesson,
    refreshLessons: fetchLessons,
  };
}

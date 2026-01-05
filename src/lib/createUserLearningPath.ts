// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { OnboardingData } from '@/types/onboarding';
import { 
  determineLearningPath, 
  PATH_LESSON_CONFIGS, 
  LearningPathType,
  getPathDisplayName 
} from './learningPathLogic';

export type LearningPace = 'relaxed' | 'standard' | 'intensive' | 'accelerated' | 'flexible';

interface CreatePathResult {
  pathType: LearningPathType;
  pathName: string;
  totalLessons: number;
  estimatedDays: number | null;
  firstLessons: string[];
}

/**
 * Creates a personalized learning path for a user based on their onboarding responses
 */
export async function createUserLearningPath(
  userId: string,
  onboardingData: OnboardingData,
  learningPace: LearningPace = 'standard',
  overridePath?: LearningPathType
): Promise<CreatePathResult> {
  // 1. Use override path if provided, otherwise determine from onboarding
  const pathType = overridePath || determineLearningPath(onboardingData);
  const pathConfig = PATH_LESSON_CONFIGS[pathType];

  console.log(`Assigned path: ${pathType} (${pathConfig.totalLessons} lessons)`);

  // 2. Calculate pace parameters
  const paceConfig: Record<LearningPace, { lessonsPerDay: number | null }> = {
    relaxed: { lessonsPerDay: 2 },
    standard: { lessonsPerDay: 4 },
    intensive: { lessonsPerDay: 6 },
    accelerated: { lessonsPerDay: 8 },
    flexible: { lessonsPerDay: null }
  };

  const pace = paceConfig[learningPace];
  const estimatedDays = pace.lessonsPerDay
    ? Math.ceil(pathConfig.totalLessons / pace.lessonsPerDay)
    : null;

  // 3. Update user profile with learning path info
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      learning_path: pathType,
      learning_path_description: pathConfig.description,
      total_lessons_in_path: pathConfig.totalLessons,
      lessons_per_day: pace.lessonsPerDay || 4,
      estimated_completion_days: estimatedDays,
      started_learning_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  if (profileError) {
    console.error('Error updating profile with learning path:', profileError);
    throw profileError;
  }

  // 4. Get all lessons from DB to map lesson codes to IDs
  const { data: allLessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id, title, order_index')
    .order('order_index', { ascending: true });

  if (lessonsError) {
    console.error('Error fetching lessons:', lessonsError);
    throw lessonsError;
  }

  if (!allLessons || allLessons.length === 0) {
    console.log('No lessons found in database, skipping lesson progress creation');
    return {
      pathType,
      pathName: getPathDisplayName(pathType),
      totalLessons: pathConfig.totalLessons,
      estimatedDays,
      firstLessons: pathConfig.lessonCodes.slice(0, 3)
    };
  }

  // 5. Create a mapping from lesson codes to lesson IDs
  // Lesson codes like "1.1" map to lessons by order_index
  // We'll use order_index to match: 1.1 = index 0, 1.2 = index 1, etc.
  const lessonCodeToId = new Map<string, string>();
  
  // Parse lesson code to get sequential index
  const codeToIndex = (code: string): number => {
    const [module, lesson] = code.split('.').map(Number);
    // Assuming max 10 lessons per module
    return (module - 1) * 10 + (lesson - 1);
  };

  // Map by order_index
  allLessons.forEach(lesson => {
    // Try to map order_index to lesson code
    const moduleNum = Math.floor(lesson.order_index / 10) + 1;
    const lessonNum = (lesson.order_index % 10) + 1;
    const code = `${moduleNum}.${lessonNum}`;
    lessonCodeToId.set(code, lesson.id);
  });

  // Also try direct order_index mapping
  allLessons.forEach((lesson, idx) => {
    const moduleNum = Math.floor(idx / 10) + 1;
    const lessonNum = (idx % 10) + 1;
    const code = `${moduleNum}.${lessonNum}`;
    if (!lessonCodeToId.has(code)) {
      lessonCodeToId.set(code, lesson.id);
    }
  });

  // 6. Create user lesson progress entries
  const userLessons = pathConfig.lessonCodes
    .map((lessonCode, index) => {
      const lessonId = lessonCodeToId.get(lessonCode);
      if (!lessonId) {
        console.warn(`No lesson found for code: ${lessonCode}`);
        return null;
      }

      const dayNumber = pace.lessonsPerDay
        ? Math.floor(index / pace.lessonsPerDay) + 1
        : null;
      const positionInDay = pace.lessonsPerDay
        ? (index % pace.lessonsPerDay) + 1
        : null;

      return {
        user_id: userId,
        lesson_id: lessonId,
        is_locked: index > 2, // First 3 lessons unlocked
        completed: false,
        order_in_path: index + 1,
        day_number: dayNumber,
        position_in_day: positionInDay,
        unlocked_at: index <= 2 ? new Date().toISOString() : null
      };
    })
    .filter(Boolean);

  if (userLessons.length > 0) {
    // Delete any existing progress first
    await supabase
      .from('user_lesson_progress')
      .delete()
      .eq('user_id', userId);

    // Insert new personalized lessons
    const { error: insertError } = await supabase
      .from('user_lesson_progress')
      .insert(userLessons);

    if (insertError) {
      console.error('Error creating user lessons:', insertError);
      // Don't throw - let onboarding complete
    } else {
      console.log(`✅ Created ${userLessons.length} personalized lessons for user ${userId}`);
    }
  }

  return {
    pathType,
    pathName: getPathDisplayName(pathType),
    totalLessons: pathConfig.totalLessons,
    estimatedDays,
    firstLessons: pathConfig.lessonCodes.slice(0, 3)
  };
}

/**
 * Unlock next lessons after completing one
 */
export async function unlockNextLessons(
  userId: string, 
  completedLessonId: string
): Promise<void> {
  // 1. Get user's learning config
  const { data: profile } = await supabase
    .from('profiles')
    .select('lessons_per_day')
    .eq('user_id', userId)
    .single();

  const lessonsPerDay = profile?.lessons_per_day || 4;

  // 2. Get completed lesson's position
  const { data: completedLesson } = await supabase
    .from('user_lesson_progress')
    .select('order_in_path')
    .eq('user_id', userId)
    .eq('lesson_id', completedLessonId)
    .single();

  if (!completedLesson?.order_in_path) return;

  // 3. Determine how many to unlock (current day + preview next day)
  const unlockCount = lessonsPerDay + 2;

  // 4. Get next lessons to unlock
  const { data: nextLessons } = await supabase
    .from('user_lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .eq('is_locked', true)
    .gt('order_in_path', completedLesson.order_in_path)
    .order('order_in_path', { ascending: true })
    .limit(unlockCount);

  // 5. Unlock them
  if (nextLessons && nextLessons.length > 0) {
    const lessonIds = nextLessons.map(l => l.lesson_id);

    await supabase
      .from('user_lesson_progress')
      .update({
        is_locked: false,
        unlocked_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .in('lesson_id', lessonIds);

    console.log(`✅ Unlocked ${lessonIds.length} lessons`);
  }
}

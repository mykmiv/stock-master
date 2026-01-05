// @ts-nocheck
// Script to seed lessons 1-10 into the database
// Run this after applying the migration

import { supabase } from '@/integrations/supabase/client';
import { lessons1to10Data } from '@/data/lessons1to10';

// Make it available globally for browser console
if (typeof window !== 'undefined') {
  (window as any).seedLessons1to10 = seedLessons1to10;
}

export async function seedLessons1to10() {
  console.log('🌱 Starting to seed lessons 1-10...');

  let successCount = 0;
  let errorCount = 0;

  for (const lesson of lessons1to10Data) {
    try {
      // Check if lesson already exists
      const { data: existing } = await supabase
        .from('lessons')
        .select('id')
        .eq('module_id', lesson.module_id)
        .eq('day_number', lesson.day_number)
        .eq('lesson_number', lesson.lesson_number)
        .single();

      if (existing) {
        console.log(`⏭️  Lesson ${lesson.lesson_number} already exists, skipping...`);
        continue;
      }

      // Insert lesson
      const { data, error } = await supabase
        .from('lessons')
        .insert({
          module_id: lesson.module_id,
          day_number: lesson.day_number,
          lesson_number: lesson.lesson_number,
          title: lesson.title,
          description: lesson.description,
          lesson_type: lesson.lesson_type,
          content_json: lesson.content_json,
          min_score_to_pass: lesson.min_score_to_pass,
          xp_reward: lesson.xp_reward,
          coin_reward: lesson.coin_reward,
          is_locked: lesson.is_locked,
          unlock_requirement: lesson.unlock_requirement,
          estimated_duration_minutes: lesson.estimated_duration_minutes,
          level: lesson.level,
          order_index: lesson.order_index,
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Error seeding lesson ${lesson.lesson_number}:`, error);
        errorCount++;
      } else {
        console.log(`✅ Seeded lesson ${lesson.lesson_number}: ${lesson.title}`);
        successCount++;
      }
    } catch (error) {
      console.error(`❌ Exception seeding lesson ${lesson.lesson_number}:`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Seeding Summary:');
  console.log(`✅ Success: ${successCount} lessons`);
  console.log(`❌ Errors: ${errorCount} lessons`);
  console.log(`\n🎉 Seeding complete!`);

  return {
    success: errorCount === 0,
    successCount,
    errorCount
  };
}

// To run this script:
// 1. Import it in your app or run it from browser console
// 2. Call: await seedLessons1to10()


// @ts-nocheck
// Auto-seed lessons on app initialization
// This will check and insert lessons if they don't exist

import { supabase } from '@/integrations/supabase/client';
import { lessons1to10Data } from '@/data/lessons1to10';

let isSeeding = false;
let hasSeeded = false;

export async function autoSeedLessons() {
  // Prevent multiple simultaneous seeding attempts
  if (isSeeding) {
    return { success: false, message: 'Seeding already in progress' };
  }

  isSeeding = true;

  try {
    console.log('🌱 Force inserting/updating lessons 1-10...');

    // Use UPSERT to force insert or update all lessons
    // This will insert if they don't exist, or update if they do
    let successCount = 0;
    let errorCount = 0;

    for (const lesson of lessons1to10Data) {
      try {
        // First, try to insert the lesson
        const { error: insertError } = await supabase
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
          });

        if (insertError) {
          // If it's a duplicate key error, try to update instead
          if (insertError.message.includes('duplicate key') || 
              insertError.message.includes('unique constraint') ||
              insertError.code === '23505') {
            // Update existing lesson
            const { error: updateError } = await supabase
              .from('lessons')
              .update({
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
              .eq('module_id', lesson.module_id)
              .eq('day_number', lesson.day_number)
              .eq('lesson_number', lesson.lesson_number);

            if (updateError) {
              console.error(`❌ Error updating lesson ${lesson.lesson_number}:`, updateError);
              errorCount++;
            } else {
              console.log(`✅ Lesson ${lesson.lesson_number} updated: ${lesson.title}`);
              successCount++;
            }
          } else if (insertError.message.includes('column') || insertError.message.includes('does not exist')) {
            console.warn(`⚠️ Column error for lesson ${lesson.lesson_number}. Migration may not be applied.`);
            errorCount++;
          } else {
            console.error(`❌ Error inserting lesson ${lesson.lesson_number}:`, insertError);
            errorCount++;
          }
        } else {
          console.log(`✅ Lesson ${lesson.lesson_number} inserted: ${lesson.title}`);
          successCount++;
        }
      } catch (error: any) {
        console.error(`❌ Exception seeding lesson ${lesson.lesson_number}:`, error);
        errorCount++;
      }
    }

    console.log(`\n📊 Auto-seeding complete: ${successCount} inserted/updated, ${errorCount} errors`);

    hasSeeded = true;
    isSeeding = false;

    return {
      success: errorCount === 0,
      successCount,
      errorCount,
      message: `Inserted/updated ${successCount} lessons${errorCount > 0 ? `, ${errorCount} errors` : ''}`
    };
  } catch (error: any) {
    console.error('Error in auto-seed:', error);
    isSeeding = false;
    return {
      success: false,
      message: error.message || 'Unknown error',
      errorCount: lessons1to10Data.length
    };
  }
}

// Function to force re-seed (for development)
export async function forceSeedLessons() {
  hasSeeded = false;
  return await autoSeedLessons();
}


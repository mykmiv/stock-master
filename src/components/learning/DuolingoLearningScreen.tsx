import React from 'react';
import { motion } from 'framer-motion';
import { DuolingoStatsBar } from './DuolingoStatsBar';
import { DuolingoSectionHeader } from './DuolingoSectionHeader';
import { DuolingoLearningPath } from './DuolingoLearningPath';
import { DuolingoTimerWidget } from './DuolingoTimerWidget';
import { DuolingoBottomNav } from './DuolingoBottomNav';
import { StockyCharacter } from '@/components/mascot/StockyCharacter';
import { LessonWithProgress } from '@/types/lesson.types';

interface DuolingoLearningScreenProps {
  lessons: LessonWithProgress[];
  onLessonClick: (lesson: LessonWithProgress) => void;
}

export function DuolingoLearningScreen({ 
  lessons, 
  onLessonClick 
}: DuolingoLearningScreenProps) {
  // Group lessons by module for section headers
  const moduleTitle = lessons[0]?.title?.includes('Introduction') 
    ? 'Trading Fundamentals' 
    : 'Stock Market Basics';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Stats Bar */}
      <DuolingoStatsBar />

      {/* Main scrollable content */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Section Header */}
        <DuolingoSectionHeader
          sectionNumber={1}
          unitNumber={1}
          title={moduleTitle}
        />

        {/* Learning Path with S-curve */}
        <div className="relative">
          <DuolingoLearningPath 
            lessons={lessons}
            onLessonClick={onLessonClick}
          />

          {/* Stocky Mascot - positioned on the right side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="absolute right-4 top-48 opacity-85"
          >
            <StockyCharacter emotion="happy" size="medium" />
          </motion.div>
        </div>
      </div>

      {/* Timer Widget */}
      <DuolingoTimerWidget />

      {/* Bottom Navigation */}
      <DuolingoBottomNav />
    </div>
  );
}

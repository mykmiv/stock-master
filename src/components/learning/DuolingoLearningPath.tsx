import React from 'react';
import { motion } from 'framer-motion';
import { DuolingoPathNode } from './DuolingoPathNode';
import { LessonWithProgress } from '@/types/lesson.types';

interface DuolingoLearningPathProps {
  lessons: LessonWithProgress[];
  onLessonClick: (lesson: LessonWithProgress) => void;
}

export function DuolingoLearningPath({ lessons, onLessonClick }: DuolingoLearningPathProps) {
  // Calculate the horizontal position for each node (S-curve pattern)
  const getNodePosition = (index: number): 'left' | 'center' | 'right' => {
    const pattern = ['center', 'right', 'center', 'left'];
    return pattern[index % 4] as 'left' | 'center' | 'right';
  };

  const getHorizontalOffset = (position: 'left' | 'center' | 'right') => {
    switch (position) {
      case 'left': return 'ml-8';
      case 'right': return 'mr-8 ml-auto';
      case 'center': return 'mx-auto';
    }
  };

  return (
    <div className="relative px-6 py-8">
      {/* Path connectors */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        style={{ zIndex: 0 }}
      >
        <defs>
          <pattern id="dash-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
            <line x1="0" y1="5" x2="5" y2="5" stroke="#E5E5E5" strokeWidth="3" />
          </pattern>
        </defs>
      </svg>

      {/* Lesson nodes */}
      <div className="relative space-y-8" style={{ zIndex: 1 }}>
        {lessons.map((lesson, index) => {
          const position = getNodePosition(index);
          const isCurrent = lesson.isCurrent || (index === 0 && !lesson.isCompleted);
          
          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${getHorizontalOffset(position)}`}
              style={{ width: 'fit-content' }}
            >
              {/* Dashed connector line to next node */}
              {index < lessons.length - 1 && (
                <svg
                  className="absolute pointer-events-none"
                  style={{
                    top: `${index * 120 + 80}px`,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100px',
                    height: '40px',
                    zIndex: 0
                  }}
                >
                  <path
                    d={`M 50 0 Q 50 20, ${position === 'left' ? 70 : position === 'right' ? 30 : 50} 40`}
                    fill="none"
                    stroke="#E5E5E5"
                    strokeWidth="3"
                    strokeDasharray="5 5"
                  />
                </svg>
              )}

              <DuolingoPathNode
                lesson={lesson}
                onLessonClick={onLessonClick}
                index={index}
                isCurrent={isCurrent}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

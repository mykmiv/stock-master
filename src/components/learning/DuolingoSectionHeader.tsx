import React from 'react';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';

interface DuolingoSectionHeaderProps {
  sectionNumber: number;
  unitNumber: number;
  title: string;
}

export function DuolingoSectionHeader({ 
  sectionNumber, 
  unitNumber, 
  title 
}: DuolingoSectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 my-4"
    >
      <div 
        className="rounded-2xl p-5 flex items-center justify-between"
        style={{ backgroundColor: '#58CC02' }}
      >
        <div>
          <p className="text-white/80 text-xs font-bold uppercase tracking-wider">
            SECTION {sectionNumber}, UNIT {unitNumber}
          </p>
          <h2 className="text-white text-xl font-extrabold mt-1">
            {title}
          </h2>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>
    </motion.div>
  );
}

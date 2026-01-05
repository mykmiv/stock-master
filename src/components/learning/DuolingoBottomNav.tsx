import React from 'react';
import { Home, Trophy, User, Heart, Globe, MoreHorizontal } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function DuolingoBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const tabs = [
    { 
      id: 'learn', 
      icon: Home, 
      path: '/learn',
      activeColor: 'bg-sky-100',
      iconColor: 'text-sky-500'
    },
    { 
      id: 'league', 
      icon: Trophy, 
      path: '/league',
      activeColor: 'bg-amber-100',
      iconColor: 'text-amber-500'
    },
    { 
      id: 'profile', 
      icon: User, 
      path: '/profile',
      activeColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    { 
      id: 'hearts', 
      icon: Heart, 
      path: '/settings',
      activeColor: 'bg-pink-100',
      iconColor: 'text-pink-500'
    },
    { 
      id: 'community', 
      icon: Globe, 
      path: '/bridge',
      activeColor: 'bg-blue-100',
      iconColor: 'text-blue-500'
    },
    { 
      id: 'more', 
      icon: MoreHorizontal, 
      path: '/dashboard',
      activeColor: 'bg-purple-100',
      iconColor: 'text-purple-500'
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPath === tab.path || 
            (tab.id === 'learn' && currentPath === '/');

          return (
            <motion.button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              whileTap={{ scale: 0.9 }}
              className={`
                relative flex items-center justify-center
                w-12 h-12 rounded-xl transition-all duration-200
                ${isActive ? tab.activeColor : 'hover:bg-gray-100'}
              `}
            >
              <Icon 
                className={`
                  w-7 h-7 transition-all
                  ${isActive ? tab.iconColor : 'text-gray-400'}
                  ${tab.id === 'hearts' && isActive ? 'fill-current' : ''}
                `}
                fill={tab.id === 'hearts' && isActive ? 'currentColor' : 'none'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-2 w-1 h-1 rounded-full bg-current"
                  style={{ color: tab.iconColor.replace('text-', '') }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

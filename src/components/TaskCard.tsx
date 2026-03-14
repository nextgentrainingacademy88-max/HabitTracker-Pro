import React, { useState } from 'react';
import { motion, useAnimation, PanInfo, useMotionValue, useTransform } from 'motion/react';
import * as Icons from 'lucide-react';
import { Habit, TaskCompletion } from '../types';

interface TaskCardProps {
  habit: Habit;
  completion?: TaskCompletion;
  onMark: (status: 'done' | 'skipped' | 'pending') => void;
  onUpdateProgress?: (progress: number) => void;
  isOverdue?: boolean;
  onClick?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ habit, completion, onMark, onUpdateProgress, isOverdue, onClick }) => {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const checkScale = useTransform(x, [0, 100], [0.8, 1.2]);
  const checkOpacity = useTransform(x, [0, 100], [0, 1]);
  
  const skipScale = useTransform(x, [0, -100], [0.8, 1.2]);
  const skipOpacity = useTransform(x, [0, -100], [0, 1]);

  const IconComponent = (Icons as any)[habit.icon] || Icons.Circle;
  const status = completion?.status || 'pending';
  const progress = completion?.progress || 0;
  const isQuantifiable = habit.goalType === 'times' && habit.goalValue > 1;

  const handleDragEnd = async (event: any, info: PanInfo) => {
    setIsSwiping(false);
    const threshold = 100;
    
    if (status === 'pending') {
      if (info.offset.x > threshold) {
        // Swiped right -> Done or Increment
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(50); // Subtle haptic feedback
        }
        
        if (isQuantifiable && onUpdateProgress) {
          const newProgress = progress + 1;
          if (newProgress >= habit.goalValue) {
            await controls.start({ x: window.innerWidth, opacity: 0, transition: { duration: 0.2 } });
            onMark('done');
            controls.set({ x: 0, opacity: 1 });
            x.set(0);
          } else {
            onUpdateProgress(newProgress);
            controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
          }
        } else {
          await controls.start({ x: window.innerWidth, opacity: 0, transition: { duration: 0.2 } });
          onMark('done');
          controls.set({ x: 0, opacity: 1 }); // Reset for when it re-renders as done
          x.set(0);
        }
      } else if (info.offset.x < -threshold) {
        // Swiped left -> Skip
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(50);
        }
        await controls.start({ x: -window.innerWidth, opacity: 0, transition: { duration: 0.2 } });
        onMark('skipped');
        controls.set({ x: 0, opacity: 1 });
        x.set(0);
      } else {
        // Snap back
        controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
      }
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  const handleUndo = () => {
    onMark('pending');
  };

  const handleTap = async () => {
    if (status === 'pending' && isQuantifiable && onUpdateProgress) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(20);
      }
      const newProgress = progress + 1;
      if (newProgress >= habit.goalValue) {
        await controls.start({ scale: 0.95, transition: { duration: 0.1 } });
        await controls.start({ x: window.innerWidth, opacity: 0, transition: { duration: 0.2 } });
        onMark('done');
        controls.set({ x: 0, opacity: 1, scale: 1 });
        x.set(0);
      } else {
        onUpdateProgress(newProgress);
        controls.start({ scale: [1, 0.95, 1], transition: { duration: 0.2 } });
      }
    }
  };

  if (status !== 'pending') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="mb-3 p-4 rounded-2xl flex items-center bg-[#1C1C1E] border border-[#2C2C2E] cursor-pointer"
        onClick={handleUndo}
      >
        <motion.div 
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 shrink-0 bg-[#2C2C2E]"
        >
          {status === 'done' ? (
            <Icons.Check className="w-6 h-6 text-[#3B82F6]" />
          ) : (
            <Icons.X className="w-6 h-6 text-gray-500" />
          )}
        </motion.div>
        <div className="flex-1">
          <h3 className="text-gray-300 font-medium text-lg line-through decoration-gray-500">{habit.name}</h3>
          <p className="text-gray-500 text-sm">Tap to undo</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative mb-3 rounded-2xl overflow-hidden bg-[#3B82F6]">
      {/* Background for swipe actions */}
      <div className="absolute inset-0 flex justify-between items-center px-6">
        <motion.div style={{ scale: checkScale, opacity: checkOpacity }} className="flex items-center text-white">
          <Icons.Check className="w-7 h-7 mr-2" />
          <span className="font-bold text-lg">Done</span>
        </motion.div>
        <motion.div style={{ scale: skipScale, opacity: skipOpacity }} className="flex items-center text-white">
          <span className="font-bold text-lg mr-2">Skip</span>
          <Icons.X className="w-7 h-7" />
        </motion.div>
      </div>
      
      {/* Swipeable Card */}
      <motion.div
        style={{ x, touchAction: 'pan-y' }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={() => setIsSwiping(true)}
        onDragEnd={handleDragEnd}
        onClick={handleTap}
        animate={controls}
        className="relative bg-[#2C2C2E] p-4 rounded-2xl flex items-center shadow-sm z-10"
      >
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 shrink-0"
          style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
        >
          <IconComponent className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0 pr-4" onClick={onClick}>
          <h3 className="text-white font-semibold text-lg truncate">{habit.name}</h3>
          {isOverdue && (
            <div className="text-red-500 text-xs font-bold mt-0.5 flex items-center">
              <Icons.X className="w-3 h-3 mr-1" /> Overdue
            </div>
          )}
          
          {habit.type === 'regular' && (
            <div className="mt-1.5">
              <div className="flex items-center text-xs mb-1.5">
                <motion.span 
                  animate={habit.streak > 0 ? { scale: [1, 1.2, 1] } : {}} 
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="text-orange-500 mr-1.5 inline-block origin-bottom"
                  style={{ 
                    filter: habit.streak > 0 ? `drop-shadow(0 0 ${Math.min(habit.streak, 8)}px rgba(249, 115, 22, 0.6))` : 'none',
                    opacity: habit.streak > 0 ? 1 : 0.5
                  }}
                >
                  🔥
                </motion.span>
                <span className={habit.streak > 0 ? "text-gray-300 font-medium" : "text-gray-500"}>
                  {habit.streak} day{habit.streak !== 1 ? 's' : ''}
                </span>
                {habit.streak > 0 && (
                  <span className="ml-auto text-gray-500 text-[10px] uppercase tracking-wider font-bold">
                    Lvl {Math.floor((habit.streak - 1) / 7) + 1}
                  </span>
                )}
              </div>
              <div className="flex gap-1 h-1.5 w-full mt-2">
                {[0, 1, 2, 3].map((i) => {
                  const fill = habit.streak === 0 ? 0 : Math.max(0, Math.min(7, (((habit.streak - 1) % 28) + 1) - i * 7)) / 7 * 100;
                  return (
                    <div key={i} className="flex-1 bg-[#1C1C1E] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${fill}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 + i * 0.1 }}
                        className="h-full bg-gradient-to-r from-orange-600 to-yellow-400 rounded-full"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Optional: Goal indicator */}
        {isQuantifiable && (
          <div className="flex flex-col items-end ml-2 shrink-0">
            <div className="text-gray-400 text-sm font-medium mb-1">
              {progress} / {habit.goalValue}
            </div>
            <div className="w-12 h-1.5 bg-[#1C1C1E] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#3B82F6] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(progress / habit.goalValue) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Edit2, Pause, Play, Trash2, ChevronLeft, ChevronRight, Trophy, TrendingUp, Check } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Habit, TaskCompletion } from '../types';
import { useAppContext } from '../store';

interface HabitDetailsModalProps {
  habit: Habit | null;
  completions: TaskCompletion[];
  onClose: () => void;
  onEdit: () => void;
}

export const HabitDetailsModal: React.FC<HabitDetailsModalProps> = ({ habit, completions, onClose, onEdit }) => {
  const { updateHabit, deleteHabit, clearHabitHistory } = useAppContext();
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);

  if (!habit) return null;

  const habitCompletions = completions.filter(c => c.habitId === habit.id);
  const totalCompleted = habitCompletions.filter(c => c.status === 'done').length;
  
  // Mocking longest streak and completion rate for prototype
  const longestStreak = Math.max(habit.streak, totalCompleted > 0 ? habit.streak + 5 : 0);
  const completionRate = totalCompleted > 0 ? Math.round((totalCompleted / (habitCompletions.length || 1)) * 100) : 0;

  // Calendar generation (March 2026)
  const daysInMonth = 31;
  const firstDay = 6; // March 1, 2026 is Sunday (6 if Monday is 0)
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const IconComponent = (Icons as any)[habit.icon] || Icons.Circle;

  const handlePauseToggle = () => {
    if (habit.isPaused) {
      updateHabit({ ...habit, isPaused: false });
    } else {
      setShowPauseConfirm(true);
    }
  };

  const confirmPause = () => {
    updateHabit({ ...habit, isPaused: true });
    setShowPauseConfirm(false);
  };

  const handleDelete = (keepHistory: boolean) => {
    deleteHabit(habit.id, keepHistory);
    onClose();
  };

  const handleClearHistory = () => {
    clearHabitHistory(habit.id);
    setShowDeleteMenu(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed inset-0 z-50 bg-[#1A1B23] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-4 text-gray-300 relative">
            <button onClick={onEdit} className="hover:text-white"><Edit2 className="w-5 h-5" /></button>
            <button onClick={handlePauseToggle} className="hover:text-white">
              {habit.isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
            <button onClick={() => setShowDeleteMenu(!showDeleteMenu)} className="hover:text-white"><Trash2 className="w-5 h-5" /></button>
            
            {showDeleteMenu && (
              <div className="absolute top-8 right-0 w-64 bg-[#262730] rounded-xl shadow-xl border border-[#3B3C45] overflow-hidden z-50">
                <button onClick={handleClearHistory} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#3B3C45] border-b border-[#3B3C45]">
                  Clear history
                </button>
                <button onClick={() => handleDelete(false)} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-[#3B3C45] border-b border-[#3B3C45]">
                  Delete habit and clear history
                </button>
                <button onClick={() => handleDelete(true)} className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#3B3C45]">
                  Delete habit and keep history
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 no-scrollbar">
          {/* Title */}
          <div className="flex items-center gap-4 mb-2">
            <IconComponent className="w-8 h-8 text-[#3B82F6]" />
            <h2 className="text-white font-bold text-2xl">{habit.name}</h2>
          </div>

          {/* Top Bar Settings */}
          <div className="flex gap-12 mb-6">
            <div>
              <div className="text-xs text-gray-400 mb-1">Repeat:</div>
              <div className="text-white font-semibold">{habit.scheduleType === 'daily' ? 'Every day' : '3 days a week'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Remind:</div>
              <div className="text-white font-semibold">{habit.reminders ? habit.reminderTime || 'Set time' : 'Set time'}</div>
            </div>
          </div>

          {/* Calendar Visual Timeline */}
          <div className="bg-[#262730] p-6 rounded-3xl">
            <div className="flex justify-between items-center mb-6 text-gray-300">
              <button className="p-1 hover:text-white"><ChevronLeft className="w-5 h-5" /></button>
              <h3 className="font-bold text-sm">March 2026</h3>
              <button className="p-1 hover:text-white"><ChevronRight className="w-5 h-5" /></button>
            </div>
            
            <div className="grid grid-cols-7 gap-y-4 relative">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <div key={i} className="text-center text-xs text-gray-400 font-medium mb-2">{d}</div>
              ))}
              
              {blanks.map(b => (
                <div key={`blank-${b}`} className="relative h-10">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#10B981] -translate-y-1/2 opacity-50" />
                </div>
              ))}
              
              {days.map(d => {
                const dateStr = `2026-03-${d.toString().padStart(2, '0')}`;
                const comp = habitCompletions.find(c => c.date === dateStr);
                const isDone = comp?.status === 'done';
                // Mocking some done days for visual based on the image
                const mockDone = [1, 6, 7, 8, 9].includes(d);
                const displayDone = isDone || mockDone;
                
                const today = new Date();
                const currentDay = today.getDate();
                const isPastOrCurrent = d <= currentDay;
                
                return (
                  <div key={d} className="flex flex-col items-center justify-center relative h-10">
                    {isPastOrCurrent && (
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#10B981] -translate-y-1/2 z-0 opacity-50" />
                    )}
                    {displayDone && isPastOrCurrent ? (
                      <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-[#1A1B23] font-bold text-sm relative z-10">
                        {d}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 text-sm relative z-10">
                        {d}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="bg-gradient-to-br from-[#3B5BDB] to-[#2B44A8] p-6 rounded-3xl relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#10B981] rounded-tl-full opacity-80 translate-x-4 translate-y-4" />
            <div className="absolute right-4 bottom-4 w-24 h-24 bg-[#F59E0B] rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
            
            <div className="relative z-10">
              <div className="text-white font-bold text-5xl mb-1">{habit.streak} <span className="text-2xl font-semibold">days</span></div>
              <div className="text-blue-200 text-sm mb-6">Your current streak</div>
              
              <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                <Trophy className="w-5 h-5 text-[#F59E0B]" />
                {longestStreak} days
              </div>
              <div className="text-blue-200 text-sm">Your longest streak</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#262730] p-5 rounded-3xl">
              <TrendingUp className="w-5 h-5 text-[#F59E0B] mb-4" />
              <div className="text-white font-bold text-3xl mb-1">{completionRate}%</div>
              <div className="text-gray-400 text-xs">Habit completion rate</div>
            </div>
            <div className="bg-[#262730] p-5 rounded-3xl">
              <Check className="w-5 h-5 text-[#10B981] mb-4" />
              <div className="text-white font-bold text-3xl mb-1">{totalCompleted}</div>
              <div className="text-gray-400 text-xs">Total times completed</div>
            </div>
          </div>
        </div>

        {/* Pause Confirmation Modal */}
        {showPauseConfirm && (
          <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-6">
            <div className="bg-[#262730] rounded-3xl p-6 max-w-sm w-full border border-[#3B3C45]">
              <h3 className="text-white font-bold text-xl mb-2">Paused a habit?</h3>
              <p className="text-gray-400 text-sm mb-6">
                It's still on your schedule and can be resumed when you're ready.
              </p>
              <button 
                onClick={confirmPause}
                className="w-full bg-[#3B82F6] text-white font-bold py-3 rounded-xl"
              >
                GOT IT
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

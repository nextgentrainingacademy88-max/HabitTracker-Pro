import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, ChevronLeft, Check, Clock, Calendar as CalendarIcon, Hash } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useAppContext } from '../store';
import { Habit, TimeOfDay } from '../types';

const ICONS = ['Droplets', 'BookOpen', 'Brain', 'Dumbbell', 'Moon', 'Sun', 'Coffee', 'Heart', 'Music', 'PenTool'];
const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F97316', '#EF4444', '#EC4899', '#14B8A6', '#F59E0B'];

interface CreateHabitScreenProps {
  onBack: () => void;
  type: 'regular' | 'one-time';
  initialHabit?: Habit;
}

export const CreateHabitScreen: React.FC<CreateHabitScreenProps> = ({ onBack, type, initialHabit }) => {
  const { addHabit, updateHabit } = useAppContext();
  const [name, setName] = useState(initialHabit?.name || '');
  const [icon, setIcon] = useState(initialHabit?.icon || ICONS[0]);
  const [color, setColor] = useState(initialHabit?.color || COLORS[0]);
  const [goalType, setGoalType] = useState<'times' | 'time'>(initialHabit?.goalType || 'times');
  const [goalValue, setGoalValue] = useState(initialHabit?.goalValue || 1);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay[]>(initialHabit?.timeOfDay || ['anytime']);
  const [scheduleType, setScheduleType] = useState<'daily' | 'weekly' | 'monthly'>(initialHabit?.scheduleType || 'daily');
  const [endDate, setEndDate] = useState<string>(initialHabit?.endDate || '');
  
  // One-time specific
  const [date, setDate] = useState(initialHabit?.date || new Date().toISOString().split('T')[0]);
  const [reminders, setReminders] = useState(initialHabit?.reminders || false);
  const [reminderTime, setReminderTime] = useState(initialHabit?.reminderTime || '09:00');

  const todayString = new Date().toISOString().split('T')[0];

  const handleSave = () => {
    if (!name.trim()) return;

    const habitData: Habit = {
      id: initialHabit?.id || Date.now().toString(),
      name,
      icon,
      color,
      type: initialHabit?.type || type,
      timeOfDay: timeOfDay.length === 0 ? ['anytime'] : timeOfDay,
      streak: initialHabit?.streak || 0,
      goalType,
      goalValue,
      scheduleType,
      scheduleDetails: initialHabit?.scheduleDetails || {},
      reminders,
      ...(endDate ? { endDate } : {}),
      ...(type === 'one-time' ? { date, reminderTime } : {}),
      isPaused: initialHabit?.isPaused || false,
    };

    if (initialHabit) {
      updateHabit(habitData);
    } else {
      addHabit(habitData);
    }
    onBack();
  };

  const toggleTimeOfDay = (t: TimeOfDay) => {
    if (timeOfDay.includes('anytime') && t !== 'anytime') {
      setTimeOfDay([t]);
    } else if (t === 'anytime') {
      setTimeOfDay(['anytime']);
    } else {
      setTimeOfDay(prev => {
        const next = prev.includes(t) ? prev.filter(x => x !== t) : [...prev.filter(x => x !== 'anytime'), t];
        return next.length === 0 ? ['anytime'] : next;
      });
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-[#121212] z-50 flex flex-col"
    >
      <div className="p-6 flex justify-between items-center bg-[#1C1C1E] border-b border-[#2C2C2E]">
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          <ChevronLeft className="w-8 h-8" />
        </button>
        <h2 className="text-white font-bold text-xl">
          {initialHabit ? 'Edit Habit' : type === 'regular' ? 'New Habit' : 'New Task'}
        </h2>
        <button 
          onClick={handleSave}
          disabled={!name.trim()}
          className={`px-4 py-2 rounded-full font-semibold ${name.trim() ? 'bg-[#3B82F6] text-white' : 'bg-[#2C2C2E] text-gray-500'}`}
        >
          Save
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        {/* Basic Info */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name your habit"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#1C1C1E] text-white text-xl p-4 rounded-2xl border border-[#2C2C2E] focus:outline-none focus:border-[#3B82F6] placeholder-gray-600"
          />
          
          <div className="bg-[#1C1C1E] p-4 rounded-2xl border border-[#2C2C2E]">
            <h3 className="text-gray-400 text-sm font-semibold mb-3">Icon</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {ICONS.map(i => {
                const IconComp = (Icons as any)[i] || Icons.Circle;
                return (
                  <button
                    key={i}
                    onClick={() => setIcon(i)}
                    className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center transition-colors ${icon === i ? 'bg-[#3B82F6] text-white' : 'bg-[#2C2C2E] text-gray-400'}`}
                  >
                    <IconComp className="w-6 h-6" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-[#1C1C1E] p-4 rounded-2xl border border-[#2C2C2E]">
            <h3 className="text-gray-400 text-sm font-semibold mb-3">Color</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center transition-transform"
                  style={{ backgroundColor: c, transform: color === c ? 'scale(1.1)' : 'scale(1)' }}
                >
                  {color === c && <Check className="w-5 h-5 text-white" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Goal Setting (Regular only for now, or both) */}
        {type === 'regular' && (
          <div className="bg-[#1C1C1E] p-4 rounded-2xl border border-[#2C2C2E]">
            <h3 className="text-gray-400 text-sm font-semibold mb-3">Goal</h3>
            <div className="flex bg-[#121212] p-1 rounded-xl mb-4">
              <button
                onClick={() => setGoalType('times')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center ${goalType === 'times' ? 'bg-[#2C2C2E] text-white' : 'text-gray-500'}`}
              >
                <Hash className="w-4 h-4 mr-2" /> Number of times
              </button>
              <button
                onClick={() => setGoalType('time')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center ${goalType === 'time' ? 'bg-[#2C2C2E] text-white' : 'text-gray-500'}`}
              >
                <Clock className="w-4 h-4 mr-2" /> Time
              </button>
            </div>
            
            <div className="flex items-center justify-between bg-[#121212] p-4 rounded-xl">
              <span className="text-white font-medium">Daily goal</span>
              <div className="flex items-center">
                <button onClick={() => setGoalValue(Math.max(1, goalValue - 1))} className="w-8 h-8 rounded-full bg-[#2C2C2E] text-white flex items-center justify-center font-bold">-</button>
                <span className="w-12 text-center text-white font-bold text-lg">{goalValue}</span>
                <button onClick={() => setGoalValue(goalValue + 1)} className="w-8 h-8 rounded-full bg-[#2C2C2E] text-white flex items-center justify-center font-bold">+</button>
              </div>
            </div>
          </div>
        )}

        {/* Scheduling */}
        {type === 'regular' ? (
          <div className="bg-[#1C1C1E] p-4 rounded-2xl border border-[#2C2C2E]">
            <h3 className="text-gray-400 text-sm font-semibold mb-3">Schedule</h3>
            
            <div className="flex bg-[#121212] p-1 rounded-xl mb-4">
              {['daily', 'weekly', 'monthly'].map(t => (
                <button
                  key={t}
                  onClick={() => setScheduleType(t as any)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize ${scheduleType === t ? 'bg-[#2C2C2E] text-white' : 'text-gray-500'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-2">Time of day</p>
                <div className="flex flex-wrap gap-2">
                  {['anytime', 'morning', 'afternoon', 'evening'].map(t => (
                    <button
                      key={t}
                      onClick={() => toggleTimeOfDay(t as TimeOfDay)}
                      className={`px-4 py-2 rounded-full text-sm font-medium capitalize border ${
                        timeOfDay.includes(t as TimeOfDay) 
                          ? 'bg-[#3B82F6]/20 border-[#3B82F6] text-[#3B82F6]' 
                          : 'bg-[#121212] border-[#2C2C2E] text-gray-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-[#2C2C2E]">
                <p className="text-gray-400 text-sm mb-2">Ends on (Optional)</p>
                <input 
                  type="date" 
                  min={todayString}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#121212] text-white p-4 rounded-xl border border-[#2C2C2E] focus:outline-none focus:border-[#3B82F6]"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#1C1C1E] p-4 rounded-2xl border border-[#2C2C2E] space-y-4">
            <div>
              <h3 className="text-gray-400 text-sm font-semibold mb-3">Date</h3>
              <input 
                type="date" 
                min={todayString}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#121212] text-white p-4 rounded-xl border border-[#2C2C2E] focus:outline-none focus:border-[#3B82F6]"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-[#2C2C2E]">
              <span className="text-white font-medium">Get reminders</span>
              <button 
                onClick={() => setReminders(!reminders)}
                className={`w-12 h-6 rounded-full relative transition-colors ${reminders ? 'bg-[#3B82F6]' : 'bg-[#2C2C2E]'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${reminders ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            
            {reminders && (
              <input 
                type="time" 
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full bg-[#121212] text-white p-4 rounded-xl border border-[#2C2C2E] focus:outline-none focus:border-[#3B82F6]"
                style={{ colorScheme: 'dark' }}
              />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

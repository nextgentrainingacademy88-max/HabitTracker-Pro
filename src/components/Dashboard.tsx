import React, { useState } from 'react';
import { HeaderGraphic } from './HeaderGraphic';
import { CalendarStrip } from './CalendarStrip';
import { TaskCard } from './TaskCard';
import { HabitDetailsModal } from './HabitDetailsModal';
import { useAppContext } from '../store';
import { Habit } from '../types';
import { Menu, Plus } from 'lucide-react';

interface DashboardProps {
  onOpenSidebar: () => void;
  onOpenAddTask: () => void;
  onEditHabit: (habit: Habit) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenSidebar, onOpenAddTask, onEditHabit }) => {
  const { habits, completions, markCompletion, updateProgress } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const dateString = selectedDate.toISOString().split('T')[0];
  const todayString = new Date().toISOString().split('T')[0];

  const activeHabits = habits.filter(h => {
    if (h.isPaused) return false;
    
    if (h.type === 'one-time') {
      if (h.date === dateString) return true;
      
      // Overdue logic
      if (dateString >= todayString && h.date && h.date < todayString) {
        // Check if it was ever completed or skipped
        const isCompleted = completions.some(c => c.habitId === h.id && (c.status === 'done' || c.status === 'skipped'));
        if (!isCompleted) return true;
      }
      return false;
    }
    if (h.endDate && dateString > h.endDate) {
      return false;
    }
    return true;
  });

  const getHabitsByTime = (time: 'morning' | 'afternoon' | 'evening' | 'anytime') => {
    return activeHabits.filter(h => h.timeOfDay.includes(time));
  };

  const morningHabits = getHabitsByTime('morning');
  const afternoonHabits = getHabitsByTime('afternoon');
  const eveningHabits = getHabitsByTime('evening');
  const anytimeHabits = getHabitsByTime('anytime');

  const renderSection = (title: string, sectionHabits: typeof habits) => {
    if (sectionHabits.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h2 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-3 px-2">
          {title}
        </h2>
        <div>
          {sectionHabits.map(habit => {
            const completion = completions.find(c => c.habitId === habit.id && c.date === dateString);
            const isOverdue = habit.type === 'one-time' && habit.date && habit.date < todayString && dateString >= todayString;
            
            return (
              <TaskCard 
                key={habit.id} 
                habit={habit} 
                completion={completion}
                onMark={(status) => markCompletion(habit.id, dateString, status)}
                onUpdateProgress={(progress) => updateProgress(habit.id, dateString, progress)}
                isOverdue={isOverdue}
                onClick={() => setSelectedHabit(habit)}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#121212] relative overflow-hidden">
      {/* Header Area */}
      <div className="relative shrink-0">
        <HeaderGraphic />
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
          <button onClick={onOpenSidebar} className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white">
            <Menu className="w-6 h-6" />
          </button>
          <div className="text-white font-bold text-lg tracking-wide">Today</div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Calendar Strip */}
      <div className="-mt-6 relative z-20 bg-[#121212] rounded-t-3xl shrink-0">
        <CalendarStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 no-scrollbar">
        {renderSection('Morning', morningHabits)}
        {renderSection('Afternoon', afternoonHabits)}
        {renderSection('Evening', eveningHabits)}
        {renderSection('Do Anytime', anytimeHabits)}
        
        {activeHabits.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            <p>No tasks for this day.</p>
            <p className="text-sm mt-2">Tap + to add a new habit.</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <button 
        onClick={onOpenAddTask}
        className="absolute bottom-6 right-6 w-16 h-16 bg-[#3B82F6] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 z-30 transition-transform active:scale-95"
      >
        <Plus className="w-8 h-8 text-white" />
      </button>

      {/* Habit Details Modal */}
      {selectedHabit && (
        <HabitDetailsModal 
          habit={selectedHabit} 
          completions={completions} 
          onClose={() => setSelectedHabit(null)} 
          onEdit={() => {
            onEditHabit(selectedHabit);
            setSelectedHabit(null);
          }}
        />
      )}
    </div>
  );
};

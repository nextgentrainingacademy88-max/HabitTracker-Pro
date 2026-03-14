import React, { createContext, useContext, useState, useEffect } from 'react';
import { Habit, TaskCompletion, Settings } from './types';

interface AppState {
  habits: Habit[];
  completions: TaskCompletion[];
  settings: Settings;
  addHabit: (habit: Habit) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string, keepHistory: boolean) => void;
  clearHabitHistory: (id: string) => void;
  markCompletion: (habitId: string, date: string, status: 'done' | 'skipped' | 'pending') => void;
  updateProgress: (habitId: string, date: string, progress: number) => void;
  updateSettings: (settings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  morningStart: '06:00',
  afternoonStart: '12:00',
  eveningStart: '17:00',
  units: 'metric',
  sound: true,
  vacationMode: false,
};

// Initial mock data
const initialHabits: Habit[] = [
  {
    id: '1',
    name: 'Drink Water',
    icon: 'Droplets',
    color: '#3B82F6', // Blue
    type: 'regular',
    timeOfDay: ['morning', 'afternoon', 'evening'],
    streak: 135,
    goalType: 'times',
    goalValue: 8,
    scheduleType: 'daily',
    scheduleDetails: {},
    reminders: true,
  },
  {
    id: '2',
    name: 'Read 10 Pages',
    icon: 'BookOpen',
    color: '#10B981', // Green
    type: 'regular',
    timeOfDay: ['evening'],
    streak: 42,
    goalType: 'times',
    goalValue: 1,
    scheduleType: 'daily',
    scheduleDetails: {},
    reminders: false,
  },
  {
    id: '3',
    name: 'Meditate',
    icon: 'Brain',
    color: '#8B5CF6', // Purple
    type: 'regular',
    timeOfDay: ['morning'],
    streak: 7,
    goalType: 'time',
    goalValue: 10,
    scheduleType: 'daily',
    scheduleDetails: {},
    reminders: true,
  },
  {
    id: '4',
    name: 'Call Mom',
    icon: 'Phone',
    color: '#F97316', // Orange
    type: 'one-time',
    timeOfDay: ['anytime'],
    streak: 0,
    goalType: 'times',
    goalValue: 1,
    scheduleType: 'daily',
    scheduleDetails: {},
    date: new Date().toISOString().split('T')[0],
    reminders: true,
    reminderTime: '18:00',
  }
];

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [completions, setCompletions] = useState<TaskCompletion[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load from local storage
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    const savedCompletions = localStorage.getItem('completions');
    if (savedCompletions) setCompletions(JSON.parse(savedCompletions));
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('completions', JSON.stringify(completions));
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [habits, completions, settings]);

  const addHabit = (habit: Habit) => setHabits(prev => [...prev, habit]);
  const updateHabit = (habit: Habit) => setHabits(prev => prev.map(h => h.id === habit.id ? habit : h));
  
  const deleteHabit = (id: string, keepHistory: boolean) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    if (!keepHistory) {
      setCompletions(prev => prev.filter(c => c.habitId !== id));
    }
  };

  const clearHabitHistory = (id: string) => {
    setCompletions(prev => prev.filter(c => c.habitId !== id));
  };
  
  const markCompletion = (habitId: string, date: string, status: 'done' | 'skipped' | 'pending') => {
    setCompletions(prev => {
      const existing = prev.find(c => c.habitId === habitId && c.date === date);
      if (existing) {
        return prev.map(c => c.habitId === habitId && c.date === date ? { ...c, status } : c);
      }
      return [...prev, { habitId, date, status }];
    });
  };

  const updateProgress = (habitId: string, date: string, progress: number) => {
    setCompletions(prev => {
      const existing = prev.find(c => c.habitId === habitId && c.date === date);
      if (existing) {
        return prev.map(c => c.habitId === habitId && c.date === date ? { ...c, progress } : c);
      }
      return [...prev, { habitId, date, status: 'pending', progress }];
    });
  };

  const updateSettings = (newSettings: Partial<Settings>) => setSettings(prev => ({ ...prev, ...newSettings }));

  return (
    <AppContext.Provider value={{ habits, completions, settings, addHabit, updateHabit, deleteHabit, clearHabitHistory, markCompletion, updateProgress, updateSettings }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

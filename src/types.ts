export type HabitType = 'regular' | 'one-time';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: HabitType;
  timeOfDay: TimeOfDay[];
  streak: number;
  goalType: 'times' | 'time';
  goalValue: number;
  scheduleType: 'daily' | 'weekly' | 'monthly';
  scheduleDetails: any;
  date?: string; // For one-time tasks
  endDate?: string; // Expiration date for recurring habits
  reminders: boolean;
  reminderTime?: string;
  isPaused?: boolean;
}

export interface TaskCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD
  status: 'done' | 'skipped' | 'pending';
  progress?: number; // For quantifiable habits
}

export interface Settings {
  morningStart: string;
  afternoonStart: string;
  eveningStart: string;
  units: 'metric' | 'imperial';
  sound: boolean;
  vacationMode: boolean;
}

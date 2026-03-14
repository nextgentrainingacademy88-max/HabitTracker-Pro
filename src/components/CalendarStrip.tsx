import React from 'react';

interface CalendarStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export const CalendarStrip: React.FC<CalendarStripProps> = ({ selectedDate, onSelectDate }) => {
  // Generate current week
  const days = [];
  const today = new Date();
  const currentDay = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1)); // Start on Monday

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    days.push(d);
  }

  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="flex justify-between items-center px-4 py-6 overflow-x-auto no-scrollbar shrink-0">
      {days.map((date, i) => {
        const isSelected = date.toDateString() === selectedDate.toDateString();
        const isToday = date.toDateString() === new Date().toDateString();
        
        return (
          <div 
            key={i} 
            onClick={() => onSelectDate(date)}
            className="flex flex-col items-center cursor-pointer min-w-[48px]"
          >
            <span className={`text-xs font-medium mb-2 ${isSelected ? 'text-[#3B82F6]' : 'text-gray-400'}`}>
              {dayNames[i]}
            </span>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
              ${isSelected ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-500/30' : 
                isToday ? 'bg-[#2C2C2E] text-white border border-[#3B82F6]' : 'bg-[#2C2C2E] text-gray-300'}`}
            >
              {date.getDate()}
            </div>
          </div>
        );
      })}
    </div>
  );
};

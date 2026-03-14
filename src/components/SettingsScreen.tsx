import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { useAppContext } from '../store';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { settings, updateSettings } = useAppContext();

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-[#121212] z-50 flex flex-col"
    >
      <div className="p-6 flex items-center bg-[#1C1C1E] border-b border-[#2C2C2E]">
        <button onClick={onBack} className="text-gray-400 hover:text-white mr-4">
          <ChevronLeft className="w-8 h-8" />
        </button>
        <h2 className="text-white font-bold text-xl">Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        <div className="space-y-4">
          <h3 className="text-gray-400 text-sm font-bold tracking-widest uppercase px-2">Time of Day</h3>
          <div className="bg-[#1C1C1E] rounded-2xl border border-[#2C2C2E] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#2C2C2E]">
              <span className="text-white font-medium">Morning starts at</span>
              <input 
                type="time" 
                value={settings.morningStart}
                onChange={(e) => updateSettings({ morningStart: e.target.value })}
                className="bg-transparent text-white focus:outline-none"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <div className="flex items-center justify-between p-4 border-b border-[#2C2C2E]">
              <span className="text-white font-medium">Afternoon starts at</span>
              <input 
                type="time" 
                value={settings.afternoonStart}
                onChange={(e) => updateSettings({ afternoonStart: e.target.value })}
                className="bg-transparent text-white focus:outline-none"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-white font-medium">Evening starts at</span>
              <input 
                type="time" 
                value={settings.eveningStart}
                onChange={(e) => updateSettings({ eveningStart: e.target.value })}
                className="bg-transparent text-white focus:outline-none"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-gray-400 text-sm font-bold tracking-widest uppercase px-2">General</h3>
          <div className="bg-[#1C1C1E] rounded-2xl border border-[#2C2C2E] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#2C2C2E]">
              <span className="text-white font-medium">Units of measure</span>
              <select 
                value={settings.units}
                onChange={(e) => updateSettings({ units: e.target.value as any })}
                className="bg-transparent text-gray-400 focus:outline-none"
              >
                <option value="metric">Metric</option>
                <option value="imperial">Imperial</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-4 border-b border-[#2C2C2E]">
              <span className="text-white font-medium">Sound</span>
              <button 
                onClick={() => updateSettings({ sound: !settings.sound })}
                className={`w-12 h-6 rounded-full relative transition-colors ${settings.sound ? 'bg-[#3B82F6]' : 'bg-[#2C2C2E]'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.sound ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <span className="text-white font-medium block">Vacation mode</span>
                <span className="text-gray-500 text-xs">Pause streaks while away</span>
              </div>
              <button 
                onClick={() => updateSettings({ vacationMode: !settings.vacationMode })}
                className={`w-12 h-6 rounded-full relative transition-colors ${settings.vacationMode ? 'bg-[#3B82F6]' : 'bg-[#2C2C2E]'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.vacationMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

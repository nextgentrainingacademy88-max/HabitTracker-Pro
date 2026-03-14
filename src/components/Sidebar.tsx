import React from 'react';
import { motion } from 'motion/react';
import { X, Calendar, BarChart2, Trophy, List, Bell, Settings } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Today', icon: Calendar },
    { id: 'stats', label: 'Your stats', icon: BarChart2 },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'all-habits', label: 'All habits', icon: List },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 w-4/5 max-w-sm h-full bg-[#1C1C1E] z-50 flex flex-col shadow-2xl"
      >
        <div className="p-6 flex justify-between items-center border-b border-[#2C2C2E]">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] p-1 mr-4">
              <div className="w-full h-full rounded-full bg-[#1C1C1E] flex items-center justify-center">
                <span className="text-xl">🔥</span>
              </div>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">135 days</h2>
              <p className="text-gray-400 text-sm">Your current streak</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onClose();
              }}
              className="w-full flex items-center px-6 py-4 text-gray-300 hover:bg-[#2C2C2E] hover:text-white transition-colors"
            >
              <item.icon className="w-6 h-6 mr-4 text-[#3B82F6]" />
              <span className="font-medium text-lg">{item.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
};

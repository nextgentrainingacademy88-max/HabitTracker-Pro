import React from 'react';
import { motion } from 'motion/react';
import { X, Repeat, CheckCircle2, TrendingUp, Home, Heart, Star } from 'lucide-react';

interface AddTaskSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: 'regular' | 'one-time') => void;
}

export const AddTaskSheet: React.FC<AddTaskSheetProps> = ({ isOpen, onClose, onSelectType }) => {
  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      />
      
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 w-full bg-[#1C1C1E] rounded-t-3xl z-50 flex flex-col max-h-[90vh]"
      >
        <div className="p-6 flex justify-between items-center border-b border-[#2C2C2E]">
          <h2 className="text-white font-bold text-xl">Create New</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-[#2C2C2E] text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => { onSelectType('regular'); onClose(); }}
              className="bg-[#2C2C2E] p-6 rounded-2xl flex flex-col items-center justify-center border border-transparent hover:border-[#3B82F6] transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-[#3B82F6]/20 flex items-center justify-center mb-4">
                <Repeat className="w-7 h-7 text-[#3B82F6]" />
              </div>
              <span className="text-white font-semibold text-lg mb-1">Regular habit</span>
              <span className="text-gray-400 text-xs text-center">For recurring activities</span>
            </button>
            
            <button 
              onClick={() => { onSelectType('one-time'); onClose(); }}
              className="bg-[#2C2C2E] p-6 rounded-2xl flex flex-col items-center justify-center border border-transparent hover:border-[#10B981] transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-[#10B981]/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-7 h-7 text-[#10B981]" />
              </div>
              <span className="text-white font-semibold text-lg mb-1">One-time task</span>
              <span className="text-gray-400 text-xs text-center">For single to-do items</span>
            </button>
          </div>

          <h3 className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-4">Explore Categories</h3>
          
          <div className="space-y-3">
            {[
              { name: 'Trending habits', icon: TrendingUp, color: 'bg-gradient-to-r from-orange-500 to-pink-500' },
              { name: 'Staying at home', icon: Home, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
              { name: 'Preventive Care', icon: Heart, color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
              { name: 'Must-have habits', icon: Star, color: 'bg-gradient-to-r from-purple-500 to-indigo-500' },
            ].map((cat, i) => (
              <button key={i} className="w-full relative overflow-hidden rounded-2xl h-20 flex items-center px-6">
                <div className={`absolute inset-0 ${cat.color} opacity-20`}></div>
                <div className="relative z-10 flex items-center w-full">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${cat.color}`}>
                    <cat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-semibold text-lg">{cat.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

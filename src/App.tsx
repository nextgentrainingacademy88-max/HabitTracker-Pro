/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { AppProvider } from './store';
import { Dashboard } from './components/Dashboard';
import { Sidebar } from './components/Sidebar';
import { AddTaskSheet } from './components/AddTaskSheet';
import { CreateHabitScreen } from './components/CreateHabitScreen';
import { SettingsScreen } from './components/SettingsScreen';

import { Habit } from './types';

type Screen = 'dashboard' | 'settings' | 'stats' | 'challenges' | 'all-habits' | 'notifications';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [creatingType, setCreatingType] = useState<'regular' | 'one-time' | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  return (
    <div className="w-full h-screen bg-black flex justify-center overflow-hidden font-sans">
      <div className="w-full max-w-md h-full bg-[#121212] text-white relative shadow-2xl overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {currentScreen === 'dashboard' && (
            <Dashboard 
              key="dashboard"
              onOpenSidebar={() => setIsSidebarOpen(true)} 
              onOpenAddTask={() => setIsAddTaskOpen(true)} 
              onEditHabit={(habit) => setEditingHabit(habit)}
            />
          )}
          {currentScreen === 'settings' && (
            <SettingsScreen 
              key="settings"
              onBack={() => setCurrentScreen('dashboard')} 
            />
          )}
          {/* Placeholders for other screens */}
          {['stats', 'challenges', 'all-habits', 'notifications'].includes(currentScreen) && (
            <div key={currentScreen} className="flex flex-col h-full bg-[#121212] p-6">
              <button onClick={() => setCurrentScreen('dashboard')} className="mb-4 text-[#3B82F6] text-left">
                &larr; Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold capitalize">{currentScreen.replace('-', ' ')}</h1>
              <p className="text-gray-500 mt-4">Coming soon...</p>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isSidebarOpen && (
            <Sidebar 
              isOpen={isSidebarOpen} 
              onClose={() => setIsSidebarOpen(false)} 
              onNavigate={handleNavigate}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isAddTaskOpen && (
            <AddTaskSheet 
              isOpen={isAddTaskOpen} 
              onClose={() => setIsAddTaskOpen(false)} 
              onSelectType={(type) => {
                setCreatingType(type);
                setIsAddTaskOpen(false);
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {creatingType && !editingHabit && (
            <CreateHabitScreen 
              type={creatingType} 
              onBack={() => setCreatingType(null)} 
            />
          )}
          {editingHabit && (
            <CreateHabitScreen 
              type={editingHabit.type} 
              initialHabit={editingHabit}
              onBack={() => setEditingHabit(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

import React, { useState } from 'react';
import TaskList from './components/TaskList';
import Sidebar from './components/Sidebar';
import Settings from './components/Settings';
import Progress from './components/Progress';
import { TaskProvider } from './context/TaskContext';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [currentView, setCurrentView] = useState('tasks');

  const renderMainContent = () => {
    if (showSettings) {
      return <Settings onClose={() => setShowSettings(false)} />;
    }

    switch (currentView) {
      case 'progress':
        return <Progress />;
      case 'today':
      case 'tags':
      case 'reminders':
      case 'tasks':
      default:
        return <TaskList view={currentView} />;
    }
  };

  return (
    <TaskProvider>
      <div className="min-h-screen dark:bg-gray-900 transition-colors duration-200">
        <div className="flex min-h-screen">
          <Sidebar 
            onSettingsClick={() => setShowSettings(true)}
            onViewChange={setCurrentView}
          />
          <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {renderMainContent()}
          </main>
        </div>
      </div>
    </TaskProvider>
  );
}

export default App;
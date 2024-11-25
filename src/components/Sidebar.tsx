import React from 'react';
import { LayoutList, CheckCircle2, Calendar, Tag, Bell, Settings, PieChart, Moon, Sun } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

interface SidebarProps {
  onSettingsClick: () => void;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSettingsClick, onViewChange }) => {
  const { 
    categories, 
    getTasksByCategory, 
    selectedCategory,
    setSelectedCategory,
    getUpcomingReminders,
    getTasksByDate,
    darkMode,
    toggleDarkMode
  } = useTasks();
  
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = getTasksByDate(today);
  const upcomingReminders = getUpcomingReminders();
  
  return (
    <aside className={`w-64 p-6 ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border-r`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <CheckCircle2 className="w-8 h-8 text-purple-600" />
          <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Task<span className="text-purple-600">Master</span>
          </h1>
        </div>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg transition-colors ${
            darkMode 
              ? 'text-gray-400 hover:text-gray-300' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
      
      <nav className="space-y-1">
        <SidebarItem 
          icon={LayoutList} 
          text="Alle Aufgaben" 
          active={!selectedCategory}
          onClick={() => {
            setSelectedCategory(null);
            onViewChange('tasks');
          }}
        />
        <SidebarItem 
          icon={Calendar} 
          text="Heute" 
          badge={todayTasks.length}
          onClick={() => onViewChange('today')}
        />
        <SidebarItem 
          icon={Tag} 
          text="Tags"
          onClick={() => onViewChange('tags')}
        />
        <SidebarItem 
          icon={Bell} 
          text="Erinnerungen" 
          badge={upcomingReminders.length}
          onClick={() => onViewChange('reminders')}
        />
        <SidebarItem 
          icon={PieChart} 
          text="Fortschritt"
          onClick={() => onViewChange('progress')}
        />
        <SidebarItem 
          icon={Settings} 
          text="Einstellungen" 
          onClick={onSettingsClick} 
        />
      </nav>
      
      <div className="mt-8">
        <h2 className={`text-sm font-semibold mb-3 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>Listen</h2>
        <div className="space-y-1">
          {categories.map((category) => (
            <ListItem
              key={category.id}
              text={category.name}
              count={getTasksByCategory(category.id).length}
              color={category.color}
              active={selectedCategory === category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                onViewChange('tasks');
              }}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

interface SidebarItemProps {
  icon: React.FC<{ className?: string }>;
  text: string;
  active?: boolean;
  onClick: () => void;
  badge?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, text, active = false, onClick, badge }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors ${
        active ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5" />
        <span className="font-medium">{text}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-600 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
};

interface ListItemProps {
  text: string;
  count: number;
  color: string;
  active: boolean;
  onClick: () => void;
  darkMode: boolean;
}

const ListItem: React.FC<ListItemProps> = ({ text, count, color, active, onClick, darkMode }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors ${
        active 
          ? darkMode ? 'bg-gray-700' : 'bg-gray-100'
          : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{text}</span>
      </div>
      <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>{count}</span>
    </button>
  );
};

export default Sidebar;
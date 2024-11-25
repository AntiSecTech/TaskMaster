import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useTasks } from '../context/TaskContext';

const Progress = () => {
  const { tasks, darkMode } = useTasks();
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const data = [
    { name: 'Abgeschlossen', value: completedTasks },
    { name: 'Offen', value: totalTasks - completedTasks }
  ];
  
  const COLORS = ['#8b5cf6', darkMode ? '#374151' : '#e5e7eb'];

  return (
    <div className={`p-6 rounded-lg shadow-sm ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h2 className={`text-2xl font-bold mb-6 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>Fortschritt</h2>
      
      <div className="h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-4xl font-bold text-purple-600">{completionPercentage}%</p>
        <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Aufgaben abgeschlossen
        </p>
        <div className="flex justify-center gap-8 mt-4">
          <div className="text-center">
            <p className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>{completedTasks}</p>
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Erledigt</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>{totalTasks - completedTasks}</p>
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Offen</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
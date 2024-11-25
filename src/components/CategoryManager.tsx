import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const CategoryManager = () => {
  const { categories, addCategory, removeCategory, darkMode } = useTasks();
  const [newCategory, setNewCategory] = useState({ name: '', color: '#8b5cf6' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.name.trim()) {
      addCategory(newCategory);
      setNewCategory({ name: '', color: '#8b5cf6' });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className={`text-lg font-semibold ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>Listen verwalten</h3>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          placeholder="Neue Liste"
          className={`flex-1 px-3 py-2 rounded-lg border ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-200 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-purple-500`}
        />
        <input
          type="color"
          value={newCategory.color}
          onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
          className="w-14 h-10 rounded-lg cursor-pointer"
        />
        <button
          type="submit"
          className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="space-y-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                {category.name}
              </span>
            </div>
            <button
              onClick={() => removeCategory(category.id)}
              className={`text-gray-400 hover:text-red-500 ${
                darkMode ? 'hover:text-red-400' : ''
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
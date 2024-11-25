import React, { useState } from 'react';
import { Download, Upload, X, List, Tag as TagIcon } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import TagManager from './TagManager';
import CategoryManager from './CategoryManager';

const Settings = ({ onClose }) => {
  const { exportTasks, importTasks, darkMode } = useTasks();
  const [activeTab, setActiveTab] = useState('categories');
  
  const handleExport = () => {
    const dataStr = exportTasks();
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'taskmaster-export.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          importTasks(json);
        } catch (error) {
          alert('Ungültige JSON-Datei');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-lg max-w-2xl mx-auto ${
      darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Einstellungen</h2>
        <button
          onClick={onClose}
          className={`p-2 rounded-lg transition-colors ${
            darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
          }`}
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Daten verwalten</h3>
          <div className="flex space-x-4">
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Download className="w-4 h-4" />
              <span>Exportieren</span>
            </button>
            
            <label className={`flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}>
              <Upload className="w-4 h-4" />
              <span>Importieren</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div>
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'categories'
                  ? 'bg-purple-600 text-white'
                  : darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Listen</span>
            </button>
            <button
              onClick={() => setActiveTab('tags')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'tags'
                  ? 'bg-purple-600 text-white'
                  : darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TagIcon className="w-4 h-4" />
              <span>Tags</span>
            </button>
          </div>

          {activeTab === 'categories' ? <CategoryManager /> : <TagManager />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
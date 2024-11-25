import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

interface NoteEditorProps {
  taskId: number | null;
  onClose: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ taskId, onClose }) => {
  const { tasks, notes, addNote, updateNote, darkMode } = useTasks();
  const [content, setContent] = useState('');

  useEffect(() => {
    if (taskId) {
      const task = tasks.find(t => t.id === taskId);
      const taskNotes = notes.filter(n => n.taskId === taskId);
      setContent(taskNotes[0]?.content || task?.note || '');
    }
  }, [taskId, tasks, notes]);

  const handleSave = () => {
    if (content.trim()) {
      if (taskId) {
        const existingNote = notes.find(n => n.taskId === taskId);
        if (existingNote) {
          updateNote(existingNote.id, content);
        } else {
          addNote({
            content,
            createdAt: new Date().toISOString(),
            taskId,
          });
        }
      } else {
        addNote({
          content,
          createdAt: new Date().toISOString(),
        });
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-2xl rounded-lg shadow-lg ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">
            {taskId ? 'Aufgabennotiz bearbeiten' : 'Neue Notiz'}
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Notiz eingeben..."
            className={`w-full h-48 p-3 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-200 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          
          <div className="flex justify-end mt-4 space-x-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Abbrechen
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
import React, { useState } from 'react';
import { PlusCircle, Calendar, Tag as TagIcon, Bell, X, MessageSquare } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import NoteEditor from './NoteEditor';

interface TaskItemProps {
  task: {
    id: number;
    title: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate: string | null;
    reminder: string | null;
    tags: number[];
    note?: string;
  };
  category?: {
    id: number;
    name: string;
    color: string;
  };
  taskTags: {
    id: number;
    name: string;
    color: string;
  }[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onSetReminder: (id: number, reminder: string | null) => void;
  onEditNote: () => void;
  darkMode: boolean;
}

const TaskList: React.FC = () => {
  const { 
    darkMode,
    categories,
    tags,
    selectedTags,
    toggleSelectedTag,
    addTask,
    toggleTask,
    deleteTask,
    setTaskReminder,
    getFilteredTasks
  } = useTasks();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [taskTags, setTaskTags] = useState<number[]>([]);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const priorityOptions = [
    { value: 'low', label: 'Niedrig', color: 'bg-gray-400' },
    { value: 'medium', label: 'Mittel', color: 'bg-yellow-500' },
    { value: 'high', label: 'Hoch', color: 'bg-red-500' }
  ] as const;

  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask({
        id: Date.now(),
        title: newTaskTitle,
        completed: false,
        priority: selectedPriority,
        dueDate: selectedDate || null,
        categoryId: selectedCategory,
        tags: taskTags,
        reminder: selectedTime ? `${selectedDate}T${selectedTime}` : null,
      });
      setNewTaskTitle('');
      setSelectedCategory(null);
      setSelectedDate('');
      setSelectedTime('');
      setTaskTags([]);
      setSelectedPriority('medium');
    }
  };

  return (
    <div className={`max-w-4xl mx-auto ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Meine Aufgaben</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`p-2 rounded-lg transition-colors ${
              showDatePicker 
                ? 'bg-purple-100 text-purple-600' 
                : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Calendar className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowTagSelector(!showTagSelector)}
            className={`p-2 rounded-lg transition-colors ${
              showTagSelector 
                ? 'bg-purple-100 text-purple-600' 
                : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <TagIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Gefiltert nach:
          </span>
          {selectedTags.map(tagId => {
            const tag = tags.find(t => t.id === tagId);
            return tag ? (
              <span
                key={tagId}
                className="px-2 py-1 text-sm rounded-full text-white flex items-center gap-1"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
                <button
                  onClick={() => toggleSelectedTag(tagId)}
                  className="hover:text-gray-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ) : null;
          })}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Neue Aufgabe hinzufügen..."
            className={`flex-1 px-4 py-3 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-200 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as 'low' | 'medium' | 'high')}
            className={`px-4 py-3 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-200 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(Number(e.target.value) || null)}
            className={`px-4 py-3 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-200 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            <option value="">Keine Liste</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>

        {showDatePicker && (
          <div className="mt-4 flex items-center space-x-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200'
              }`}
            />
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200'
              }`}
            />
          </div>
        )}

        {showTagSelector && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => setTaskTags(prev => 
                  prev.includes(tag.id) 
                    ? prev.filter(id => id !== tag.id)
                    : [...prev, tag.id]
                )}
                className={`px-3 py-1 rounded-full text-sm ${
                  taskTags.includes(tag.id)
                    ? 'text-white'
                    : darkMode ? 'text-gray-300' : 'text-gray-700 border'
                }`}
                style={{ 
                  backgroundColor: taskTags.includes(tag.id) ? tag.color : 'transparent',
                  borderColor: tag.color
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}
      </form>

      <div className="space-y-2">
        {getFilteredTasks().map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            category={categories.find((c) => c.id === task.categoryId)}
            taskTags={tags.filter(tag => task.tags.includes(tag.id))}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onSetReminder={setTaskReminder}
            onEditNote={() => {
              setSelectedTaskId(task.id);
              setShowNoteEditor(true);
            }}
            darkMode={darkMode}
          />
        ))}
      </div>

      {showNoteEditor && (
        <NoteEditor
          taskId={selectedTaskId}
          onClose={() => {
            setShowNoteEditor(false);
            setSelectedTaskId(null);
          }}
        />
      )}
    </div>
  );
};

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  category, 
  taskTags, 
  onToggle, 
  onDelete, 
  onSetReminder,
  onEditNote,
  darkMode 
}) => {
  const [showReminderPicker, setShowReminderPicker] = useState(false);

  const priorityColors = {
    low: 'bg-gray-400',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  } as const;

  return (
    <div className={`flex items-center space-x-4 p-4 rounded-lg border transition-shadow ${
      darkMode 
        ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
        : 'bg-white border-gray-200 hover:shadow-sm'
    }`}>
      <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
      
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
      />

      <span className={`flex-1 ${
        task.completed 
          ? darkMode ? 'text-gray-500' : 'text-gray-400' 
          : darkMode ? 'text-white' : 'text-gray-900'
      } ${task.completed ? 'line-through' : ''}`}>
        {task.title}
      </span>
      
      <div className="flex items-center space-x-2">
        {taskTags.map(tag => (
          <span
            key={tag.id}
            className="px-2 py-1 text-sm rounded-full text-white"
            style={{ backgroundColor: tag.color }}
          >
            {tag.name}
          </span>
        ))}
        
        {category && (
          <span
            className="px-2 py-1 text-sm rounded-full text-white"
            style={{ backgroundColor: category.color }}
          >
            {category.name}
          </span>
        )}

        {task.dueDate && (
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}

        <button
          onClick={onEditNote}
          className={`p-2 rounded-lg transition-colors ${
            task.note 
              ? 'text-purple-600' 
              : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowReminderPicker(!showReminderPicker)}
          className={`p-2 rounded-lg transition-colors ${
            task.reminder 
              ? 'text-purple-600' 
              : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Bell className="w-4 h-4" />
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className={`p-2 rounded-lg transition-colors ${
            darkMode 
              ? 'text-gray-400 hover:text-red-400' 
              : 'text-gray-400 hover:text-red-600'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {showReminderPicker && (
        <div className={`absolute mt-2 p-4 rounded-lg shadow-lg border ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <input
            type="datetime-local"
            value={task.reminder || ''}
            onChange={(e) => {
              onSetReminder(task.id, e.target.value);
              setShowReminderPicker(false);
            }}
            className={`px-3 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-200'
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default TaskList;
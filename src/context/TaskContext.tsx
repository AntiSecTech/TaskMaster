import React, { createContext, useContext, useState, useEffect } from 'react';

// Existing interfaces remain the same
interface Tag {
  id: number;
  name: string;
  color: string;
}

interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  categoryId?: number;
  tags: number[];
  reminder?: string | null;
  note?: string;
}

interface Note {
  id: number;
  content: string;
  createdAt: string;
  taskId?: number;
}

interface Category {
  id: number;
  name: string;
  color: string;
}

interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  tags: Tag[];
  notes: Note[];
  selectedCategory: number | null;
  selectedTags: number[];
  darkMode: boolean;
  addTask: (task: Task) => void;
  toggleTask: (taskId: number) => void;
  deleteTask: (taskId: number) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  removeCategory: (categoryId: number) => void;
  addTag: (tag: Omit<Tag, 'id'>) => void;
  removeTag: (tagId: number) => void;
  addNote: (note: Omit<Note, 'id'>) => void;
  updateNote: (id: number, content: string) => void;
  deleteNote: (id: number) => void;
  setTaskReminder: (taskId: number, reminder: string | null) => void;
  setSelectedCategory: (categoryId: number | null) => void;
  toggleSelectedTag: (tagId: number) => void;
  toggleDarkMode: () => void;
  getFilteredTasks: () => Task[];
  exportTasks: () => string;
  importTasks: (data: { tasks: Task[]; categories: Category[]; tags: Tag[]; notes: Note[] }) => void;
  getTasksByCategory: (categoryId: number) => Task[];
  getTasksByDate: (date: string) => Task[];
  getUpcomingReminders: () => Task[];
  getNotesByTask: (taskId: number) => Note[];
  getStandaloneNotes: () => Note[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Arbeit', color: '#3b82f6' },
    { id: 2, name: 'Privat', color: '#22c55e' },
    { id: 3, name: 'Hobby', color: '#a855f7' },
  ]);

  const [tags, setTags] = useState<Tag[]>([
    { id: 1, name: 'Wichtig', color: '#ef4444' },
    { id: 2, name: 'Routine', color: '#8b5cf6' },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Beispiel Eintrag',
      completed: true,
      priority: 'high',
      dueDate: '2024-11-17',
      categoryId: 0,
      tags: [1],
      reminder: '2024-03-20T09:00',
      note: 'Importieren Sie Ihre JSON!',
    }
  ]);

  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      content: 'Importieren Sie Ihre JSON!',
      createdAt: '2024-03-18T10:00:00',
      taskId: 1,
    },
    {
      id: 2,
      content: 'Allgemeine Notiz ohne zugehörige Aufgabe',
      createdAt: '2024-03-18T11:00:00',
    },
  ]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const toggleTask = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    setNotes(notes.filter((note) => note.taskId !== taskId));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = {
      ...category,
      id: Math.max(0, ...categories.map((c) => c.id)) + 1,
    };
    setCategories([...categories, newCategory]);
  };

  const removeCategory = (categoryId: number) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
    setTasks(tasks.filter((task) => task.categoryId !== categoryId));
  };

  const addTag = (tag: Omit<Tag, 'id'>) => {
    const newTag = {
      ...tag,
      id: Math.max(0, ...tags.map((t) => t.id)) + 1,
    };
    setTags([...tags, newTag]);
  };

  const removeTag = (tagId: number) => {
    setTags(tags.filter((tag) => tag.id !== tagId));
    setTasks(tasks.map(task => ({
      ...task,
      tags: task.tags.filter(id => id !== tagId)
    })));
  };

  const addNote = (note: Omit<Note, 'id'>) => {
    const newNote = {
      ...note,
      id: Math.max(0, ...notes.map((n) => n.id)) + 1,
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (id: number, content: string) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, content } : note
    ));
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const setTaskReminder = (taskId: number, reminder: string | null) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, reminder } : task
    ));
  };

  const toggleSelectedTag = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const getFilteredTasks = () => {
    let filtered = tasks.filter(task => {
      const matchesCategory = !selectedCategory || task.categoryId === selectedCategory;
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tagId => task.tags.includes(tagId));
      return matchesCategory && matchesTags;
    });

    return filtered.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      if (a.priority !== b.priority) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      
      return b.id - a.id;
    });
  };

  const exportTasks = () => {
    return JSON.stringify({ tasks, categories, tags, notes }, null, 2);
  };

  const importTasks = (data: { tasks: Task[]; categories: Category[]; tags: Tag[]; notes: Note[] }) => {
    if (data.tasks && Array.isArray(data.tasks)) setTasks(data.tasks);
    if (data.categories && Array.isArray(data.categories)) setCategories(data.categories);
    if (data.tags && Array.isArray(data.tags)) setTags(data.tags);
    if (data.notes && Array.isArray(data.notes)) setNotes(data.notes);
  };

  const getTasksByCategory = (categoryId: number) => {
    return tasks.filter((task) => task.categoryId === categoryId);
  };

  const getTasksByDate = (date: string) => {
    return tasks.filter((task) => task.dueDate === date);
  };

  const getUpcomingReminders = () => {
    const now = new Date();
    return tasks.filter(task => 
      task.reminder && new Date(task.reminder) > now
    ).sort((a, b) => 
      new Date(a.reminder!).getTime() - new Date(b.reminder!).getTime()
    );
  };

  const getNotesByTask = (taskId: number) => {
    return notes.filter(note => note.taskId === taskId);
  };

  const getStandaloneNotes = () => {
    return notes.filter(note => !note.taskId);
  };

  const contextValue: TaskContextType = {
    tasks,
    categories,
    tags,
    notes,
    selectedCategory,
    selectedTags,
    darkMode,
    addTask,
    toggleTask,
    deleteTask,
    addCategory,
    removeCategory,
    addTag,
    removeTag,
    addNote,
    updateNote,
    deleteNote,
    setTaskReminder,
    setSelectedCategory,
    toggleSelectedTag,
    toggleDarkMode,
    getFilteredTasks,
    exportTasks,
    importTasks,
    getTasksByCategory,
    getTasksByDate,
    getUpcomingReminders,
    getNotesByTask,
    getStandaloneNotes,
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
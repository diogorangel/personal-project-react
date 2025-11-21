'use client'; // Required for using client-side hooks like useState and useEffect in Next.js App Router

import { useState, useCallback, FormEvent, ChangeEvent, useMemo } from 'react';
import { useLocalStorage } from './lib/useLocalStorage';
import './styles/globals.css'; // Import the base styles

// --- NEW: Mock User Database ---
const mockUsers = [
  'Unassigned', // Default option
  'Diogo Rangel Dos Santos',
];

// --- UPDATED: Define the type for a single task item ---
interface Task {
  id: number;
  text: string;
  assignedTo: string;
  // ✅ NEW FIELD: To track completion status
  isComplete: boolean;
}

export default function Home() {
  // #9: Data Persistence with Local Storage
  const [tasks, setTasks] = useLocalStorage<Task[]>('todo-tasks', []);

  // State for the controlled input field (#new-task-input)
  const [taskInput, setTaskInput] = useState<string>('');

  // NEW STATE: State for the controlled select field (default to the first user: 'Unassigned')
  const [assignedToInput, setAssignedToInput] = useState<string>(mockUsers[0]);

  // ✅ FIX: Dynamically calculate the next available ID using useMemo
  const nextId = useMemo(() => {
    const maxId = tasks.reduce((max, task) => Math.max(max, task.id), -1);
    return maxId + 1;
  }, [tasks]);

  // --- Handlers ---
  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTaskInput(event.target.value);
  }, []);

  const handleAssignedToChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setAssignedToInput(event.target.value);
  }, []);

  // #7: Function to add a new task
  const addTask = useCallback(
    (event: FormEvent | null = null) => {
      event?.preventDefault();

      const taskText = taskInput.trim();

      if (taskText === '') {
        alert('Please enter a task!');
        return;
      }

      // Create a new task object
      const newTask: Task = {
        id: nextId,
        text: taskText,
        assignedTo: assignedToInput,
        isComplete: false, // ✅ NEW: Initialize as incomplete
      };

      setTasks((prevTasks) => [...prevTasks, newTask]);

      // #4: Clear the input and reset assignedTo selection
      setTaskInput('');
      setAssignedToInput(mockUsers[0]);
    },
    [taskInput, assignedToInput, setTasks, nextId]
  );

  // #8: Function to delete an item
  const deleteTask = useCallback(
    (id: number) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    },
    [setTasks]
  );
  
  // ✅ NEW HANDLER: Function to toggle task completion status
  const toggleTaskCompletion = useCallback(
    (id: number) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, isComplete: !task.isComplete } : task
        )
      );
    },
    [setTasks]
  );
  
  // --- Task Filtering (for displaying in separate lists) ---
  const pendingTasks = useMemo(() => tasks.filter(task => !task.isComplete), [tasks]);
  const completedTasks = useMemo(() => tasks.filter(task => task.isComplete), [tasks]);


  // --- Helper Component to Render a List ---
  const TaskList = ({ list, isCompletedList }: { list: Task[], isCompletedList: boolean }) => (
    <ul id={isCompletedList ? 'tasks-done-list' : 'task-list'}>
      {list.map((task) => (
        <li key={task.id} className={task.isComplete ? 'completed' : ''}>
          
          <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            {/* ✅ NEW: Checkbox for completion */}
            <input
              type="checkbox"
              checked={task.isComplete}
              onChange={() => toggleTaskCompletion(task.id)}
              style={{ marginRight: '10px' }}
              aria-label={`Mark task ${task.text} as ${task.isComplete ? 'pending' : 'complete'}`}
            />
            
            {/* Display task text and assigned person */}
            <span className="task-text-content">
              <strong>[{task.assignedTo}]</strong> {task.text}
            </span>
          </div>
          
          {/* The delete button */}
          <button
            className="delete-btn"
            onClick={() => deleteTask(task.id)}
            aria-label={`Delete task: ${task.text}`}
          >
            X
          </button>
        </li>
      ))}
      {list.length === 0 && (
        <li>{isCompletedList ? 'No tasks completed yet.' : 'No tasks yet! Add one above.'}</li>
      )}
    </ul>
  );
  

  return (
    <div className="container">
      <h1>My To-Do List</h1>

      <form onSubmit={addTask} className="input-area">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <select
            id="assigned-to-select"
            value={assignedToInput}
            onChange={handleAssignedToChange}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            {mockUsers.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>

          <input
            type="text"
            id="new-task-input"
            placeholder="Add new task..."
            value={taskInput}
            onChange={handleInputChange} // Controlled input
            style={{ flexGrow: 1 }} // Allows the input to take up the remaining space
          />
        </div>

        <button id="add-btn" type="submit" style={{ width: '100%', padding: '10px' }}>
          Add Task
        </button>
      </form>
      
      {/* --- Pending Tasks Section --- */}
      <h2 style={{marginTop: '30px', marginBottom: '15px', color: '#007bff', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>⏳ Pending Tasks ({pendingTasks.length})</h2>
      <TaskList list={pendingTasks} isCompletedList={false} />
      
      <hr style={{margin: '30px 0', border: '0', borderTop: '1px dashed #ccc'}}/>

      {/* --- Completed Tasks Section --- */}
      <h2 style={{marginBottom: '15px', color: '#28a745'}}>✅ Tasks Done ({completedTasks.length})</h2>
      <TaskList list={completedTasks} isCompletedList={true} />
      
    </div>
  );
}
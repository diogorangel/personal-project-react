// src/app/page.tsx

'use client'; // Required for using client-side hooks like useState and useEffect in Next.js App Router

import { useState, useCallback, FormEvent, ChangeEvent } from 'react';
import { useLocalStorage } from './lib/useLocalStorage';
import './styles/globals.css'; // Import the base styles

// Define the type for a single task item
interface Task {
  id: number;
  text: string;
}

// Helper function to generate a unique ID
let nextId = 0;

export default function Home() {
  // #9: Data Persistence with Local Storage
  const [tasks, setTasks] = useLocalStorage<Task[]>('todo-tasks', []);
  
  // State for the controlled input field (#new-task-input)
  const [taskInput, setTaskInput] = useState<string>('');

  // Handle input change
  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTaskInput(event.target.value);
  }, []);

  // #7: Function to add a new task
  const addTask = useCallback((event: FormEvent | null = null) => {
    // Prevent default form submission behavior if triggered by a form
    event?.preventDefault(); 

    const taskText = taskInput.trim();

    if (taskText === "") {
      alert("Please enter a task!");
      return;
    }

    // Create a new task object
    const newTask: Task = {
      id: nextId++,
      text: taskText,
    };

    // Update the tasks state array
    setTasks(prevTasks => [...prevTasks, newTask]);

    // #4: Clear the input
    setTaskInput('');
  }, [taskInput, setTasks]);

  // #8: Function to delete an item
  const deleteTask = useCallback((id: number) => {
    // Filter out the task with the given ID
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, [setTasks]);

  return (
    // #2: Main Layout and Structure
    <div className="container">
      <h1>My Tasks</h1>
      
      {/* Form submission handles Enter key press (Bonus feature from script.js) */}
      <form onSubmit={addTask} className="input-area">
        {/* #4: Input Component */}
        <input 
          type="text" 
          id="new-task-input" 
          placeholder="Add new task..." 
          value={taskInput}
          onChange={handleInputChange} // Controlled input
        />
        {/* #5: Action Button */}
        <button id="add-btn" type="submit">
          Add
        </button>
      </form>

      {/* #6: List Display */}
      <ul id="task-list">
        {tasks.map(task => (
          // #3: Create and append the new <li> element (rendered for each task)
          <li key={task.id}>
            <span>{task.text}</span>
            {/* The delete button calls the deleteTask handler */}
            <button 
              className="delete-btn" 
              onClick={() => deleteTask(task.id)}
              aria-label={`Delete task: ${task.text}`}
            >
              X
            </button>
          </li>
        ))}
        {tasks.length === 0 && (
          <li>No tasks yet! Add one above.</li>
        )}
      </ul>
    </div>
  );
}
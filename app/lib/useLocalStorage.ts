// lib/useLocalStorage.ts

import { useState, useEffect } from 'react';

// Use a type assertion in the initializer to fix the error.
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  
  const [value, setValue] = useState<T>(() => {
    // 1. Check if we are in the browser (client-side)
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // 2. Try to get the item from localStorage
      const item = window.localStorage.getItem(key);

      // 3. If item exists, parse it and assert the type as 'T'
      if (item) {
        // We assume the data saved in localStorage matches the type T.
        // The 'as T' assertion tells TypeScript to trust us.
        return JSON.parse(item) as T; 
      }
      
      // 4. If no item, return the initial value
      return initialValue;

    } catch (error) {
      console.error('Error reading localStorage key “' + key + '”: ', error);
      // If any error occurs (e.g., malformed JSON), return initial value
      return initialValue;
    }
  });

  // useEffect to update local storage whenever the state changes (Work Item #9)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error writing localStorage key “' + key + '”: ', error);
      }
    }
  }, [key, value]); 

  return [value, setValue];
}
// 1. Get references to the HTML elements
const taskInput = document.getElementById('new-task-input');
const addButton = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

// Helper function to create the list item (for use in both Add and Load)
const createTaskElement = (taskText) => {
    const newItem = document.createElement('li');
    newItem.innerHTML = `
        <span>${taskText}</span>
        <button class="delete-btn">X</button>
    `;
    // Add delete functionality to the button (Work Item #8)
    newItem.querySelector('.delete-btn').addEventListener('click', () => {
        newItem.remove(); // Removes the parent <li>
        // Future step: Add logic to remove from Local Storage here
    });
    return newItem;
};

// 2. Function to add a new task (Work Item #7)
const addTask = () => {
    const taskText = taskInput.value.trim();
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }
    // 3. Create and append the new <li> element
    const newItem = createTaskElement(taskText);
    taskList.appendChild(newItem);
    // 4. Clear the input
    taskInput.value = '';
    // Future step: Add logic to save to Local Storage here
};

// 5. Add event listener to the add button
addButton.addEventListener('click', addTask);

// Bonus: Allow adding with the Enter key
taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});

// The Persistence logic (Item #9) would go here, using localStorage.
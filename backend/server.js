const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

const app = express();
const PORT = 5000; // Choose a port for your backend API

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies

// In-memory data store for tasks
let tasks = [
    { id: uuidv4(), title: 'Learn Node.js', completed: false },
    { id: uuidv4(), title: 'Build a React App', completed: false },
    { id: uuidv4(), title: 'Deploy the application', completed: false },
];

// Helper function for validation
const validateTask = (req, res, next) => {
    const { title } = req.body;
    if (req.method === 'POST' && (!title || title.trim() === '')) {
        return res.status(400).json({ message: 'Title is required and cannot be empty.' });
    }
    next();
};

// --- API Endpoints ---

// GET /tasks: Fetch a list of all tasks.
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// POST /tasks: Add a new task.
app.post('/tasks', validateTask, (req, res) => {
    const { title, completed = false } = req.body; // Default completed to false
    const newTask = {
        id: uuidv4(),
        title: title.trim(),
        completed: !!completed // Ensure boolean type
    };
    tasks.push(newTask);
    res.status(201).json(newTask); // 201 Created
});

// PUT /tasks/:id: Update the completed status of a task.
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    if (typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Completed status must be a boolean.' });
    }

    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found.' });
    }

    tasks[taskIndex].completed = completed;
    res.status(200).json(tasks[taskIndex]);
});

// DELETE /tasks/:id: Delete a task by ID.
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== id);

    if (tasks.length === initialLength) {
        return res.status(404).json({ message: 'Task not found.' });
    }

    res.status(204).send(); // 204 No Content for successful deletion
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
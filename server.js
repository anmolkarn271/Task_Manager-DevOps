const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// JSON file for permanent storage
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "tasks.json");

// Create data directory and file if missing
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

// Read tasks from JSON file
function readTasks() {
    try {
        const data = fs.readFileSync(DATA_FILE, "utf8");
        const tasks = JSON.parse(data);

        return Array.isArray(tasks) ? tasks : [];
    } catch (error) {
        console.error("Error reading tasks:", error.message);
        throw error;
    }
}

// Save tasks to JSON file
function saveTasks(tasks) {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(tasks, null, 2),
        "utf8"
    );
}

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Task Manager API is running"
    });
});

// Get all tasks
app.get("/api/tasks", (req, res) => {
    try {
        const tasks = readTasks();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({
            error: "Could not read tasks"
        });
    }
});

// Add a new task
app.post("/api/tasks", (req, res) => {
    try {
        const { title } = req.body;

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                error: "Task title is required"
            });
        }

        const tasks = readTasks();

        const newTask = {
            id: Date.now(),
            title: title.trim(),
            completed: false
        };

        tasks.push(newTask);
        saveTasks(tasks);

        res.status(201).json(newTask);
    } catch (error) {
        console.error("Error adding task:", error.message);

        res.status(500).json({
            error: "Could not add task"
        });
    }
});

// Complete or undo a task
app.patch("/api/tasks/:id", (req, res) => {
    try {
        const taskId = Number(req.params.id);

        if (!Number.isSafeInteger(taskId)) {
            return res.status(400).json({
                error: "Invalid task ID"
            });
        }

        const tasks = readTasks();

        const task = tasks.find(item => item.id === taskId);

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        task.completed = !task.completed;

        saveTasks(tasks);

        res.json(task);
    } catch (error) {
        console.error("Error updating task:", error.message);

        res.status(500).json({
            error: "Could not update task"
        });
    }
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
    try {
        const taskId = Number(req.params.id);

        if (!Number.isSafeInteger(taskId)) {
            return res.status(400).json({
                error: "Invalid task ID"
            });
        }

        const tasks = readTasks();

        const taskIndex = tasks.findIndex(
            item => item.id === taskId
        );

        if (taskIndex === -1) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        const deletedTask = tasks.splice(taskIndex, 1)[0];

        saveTasks(tasks);

        res.json({
            message: "Task deleted successfully",
            task: deletedTask
        });
    } catch (error) {
        console.error("Error deleting task:", error.message);

        res.status(500).json({
            error: "Could not delete task"
        });
    }
});

// Handle unknown API routes
app.use("/api", (req, res) => {
    res.status(404).json({
        error: "API route not found"
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Task Manager running at http://localhost:${PORT}`);
});


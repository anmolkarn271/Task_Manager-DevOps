const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const count = document.getElementById("task-count");

async function apiRequest(url, options = {}) {
const response = await fetch(url, options);

if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `HTTP ${response.status}`);
}

if (response.status === 204) return null;

return response.json();

}

async function loadTasks() {
try {
const tasks = await apiRequest("/api/tasks");

    list.replaceChildren();

    tasks.forEach(task => {
        const li = document.createElement("li");

        if (task.completed) li.classList.add("done");

        const title = document.createElement("span");
        title.className = "task-title";
        title.textContent = task.title;

        const actions = document.createElement("div");
        actions.className = "actions";

        const completeButton = document.createElement("button");
        completeButton.textContent = task.completed ? "Undo" : "Done";

        completeButton.addEventListener("click", async () => {
            try {
                await apiRequest(`/api/tasks/${task.id}`, {
                    method: "PATCH"
                });
                await loadTasks();
            } catch (error) {
                alert("Could not update task: " + error.message);
            }
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete";

        deleteButton.addEventListener("click", async () => {
            try {
                await apiRequest(`/api/tasks/${task.id}`, {
                    method: "DELETE"
                });
                await loadTasks();
            } catch (error) {
                alert("Could not delete task: " + error.message);
            }
        });

        actions.append(completeButton, deleteButton);
        li.append(title, actions);
        list.append(li);
    });

    count.textContent =
        `${tasks.length} task${tasks.length === 1 ? "" : "s"}`;

} catch (error) {
    console.error("Loading tasks failed:", error);
    alert("Could not load tasks. Check the server and try refreshing.");
}

}

form.addEventListener("submit", async event => {
event.preventDefault();

const title = input.value.trim();

if (!title) return;

const submitButton = form.querySelector('button[type="submit"]');
submitButton.disabled = true;

try {
    await apiRequest("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
    });

    input.value = "";
    await loadTasks();

} catch (error) {
    console.error("Adding task failed:", error);
    alert("Could not add task: " + error.message);
} finally {
    submitButton.disabled = false;
}

});

loadTasks();
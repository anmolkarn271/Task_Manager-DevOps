const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const count = document.getElementById("task-count");
const emptyState = document.getElementById("empty-state");

async function apiRequest(url, options = {}) {
const response = await fetch(url, options);


if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `HTTP ${response.status}`);
}

if (response.status === 204) {
    return null;
}

return response.json();


}

function createActionButton(label, className, onClick) {
const button = document.createElement("button");


button.type = "button";
button.textContent = label;

if (className) {
    button.className = className;
}

button.addEventListener("click", onClick);

return button;


}

async function loadTasks() {
try {
const tasks = await apiRequest("/api/tasks");


    list.replaceChildren();

    tasks.forEach(task => {
        const item = document.createElement("li");

        if (task.completed) {
            item.classList.add("done");
        }

        const title = document.createElement("span");
        title.className = "task-title";
        title.textContent = task.title;

        const actions = document.createElement("div");
        actions.className = "actions";

        const completeButton = createActionButton(
            task.completed ? "Undo" : "Done",
            "",
            async () => {
                completeButton.disabled = true;

                try {
                    await apiRequest(`/api/tasks/${task.id}`, {
                        method: "PATCH"
                    });

                    await loadTasks();
                } catch (error) {
                    alert("Could not update task: " + error.message);
                    completeButton.disabled = false;
                }
            }
        );

        const deleteButton = createActionButton(
            "Delete",
            "delete",
            async () => {
                if (!confirm(`Delete "${task.title}"?`)) {
                    return;
                }

                deleteButton.disabled = true;

                try {
                    await apiRequest(`/api/tasks/${task.id}`, {
                        method: "DELETE"
                    });

                    await loadTasks();
                } catch (error) {
                    alert("Could not delete task: " + error.message);
                    deleteButton.disabled = false;
                }
            }
        );

        actions.append(completeButton, deleteButton);
        item.append(title, actions);
        list.append(item);
    });

    count.textContent =
        `${tasks.length} task${tasks.length === 1 ? "" : "s"}`;

    emptyState.hidden = tasks.length !== 0;
} catch (error) {
    console.error("Loading tasks failed:", error);
    alert("Could not load tasks. Check the server and try refreshing.");
}


}

form.addEventListener("submit", async event => {
event.preventDefault();


const title = input.value.trim();

if (!title) {
    input.focus();
    return;
}

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
    input.focus();
} catch (error) {
    console.error("Adding task failed:", error);
    alert("Could not add task: " + error.message);
} finally {
    submitButton.disabled = false;
}


});

loadTasks();

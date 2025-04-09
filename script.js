document.addEventListener('DOMContentLoaded', loadTasks);

const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const totalTasksElement = document.getElementById('totalTasks');
const pendingTasksElement = document.getElementById('pendingTasks');
const completedTasksElement = document.getElementById('completedTasks');

taskForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const task = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        dueDate: document.getElementById('taskdueDate').value, // Updated here
        priority: document.getElementById('priority').value,
        category: document.getElementById('category').value,
        status: 'Pending',
        id: Date.now(),
    };

    if (task.title && task.dueDate) {
        addTask(task);
        taskForm.reset();
    } else {
        alert("Title and Due Date are mandatory.");
    }
});

function addTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTasks();
}

function loadTasks() {
    renderTasks();
}

function renderTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        if (task.status == 'Completed') {
            taskElement.classList.add('completed');
        }

        taskElement.innerHTML = `
            <div>
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p><strong>Due Date:</strong> ${task.dueDate}</p>
                <p><strong>Priority:</strong> ${task.priority}</p>
                <p><strong>Category:</strong> ${task.category}</p>
            </div>
            <div>
                <button onclick="deleteTask(${task.id})">Delete</button>
                <button onclick="editTask(${task.id})">Edit</button>
                <input type="checkbox" ${task.status == 'Completed' ? 'checked' : ''} onchange="toggleComplete(${task.id})">
                <span>${task.status}</span>
            </div>
        `;
        taskList.appendChild(taskElement);
    });

    updateSummary();
}

function deleteTask(id) {
    if (confirm("Are you sure you want to delete this task?")) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.id != id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
}

function editTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.id == id);

    if (task) {
        document.getElementById('title').value = task.title;
        document.getElementById('description').value = task.description;
        document.getElementById('taskdueDate').value = task.dueDate; // Updated here
        document.getElementById('priority').value = task.priority;
        document.getElementById('category').value = task.category;

        deleteTask(id);
    }
}

function toggleComplete(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.id == id);

    if (task) {
        task.status = task.status == 'Completed' ? 'Pending' : 'Completed';
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
}

function updateSummary() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(task => task.status == 'Pending').length;
    const completedTasks = tasks.filter(task => task.status == 'Completed').length;

    totalTasksElement.textContent = totalTasks;
    pendingTasksElement.textContent = pendingTasks;
    completedTasksElement.textContent = completedTasks;
}

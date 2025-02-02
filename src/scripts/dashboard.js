const url = "http://172.17.0.2:3000";
const token = sessionStorage.getItem("token");

if (!isValidToken(token)) {
    window.location.href = "login.html";
} else {
    getAllTasks(token).then((tasks) => {
        tasks.forEach(task => {
            addTask(task.id, task.title, task.completed);
        });
    });
}

function logOut() {
    sessionStorage.clear();
    window.location.href = "login.html";
}

async function isValidToken(token) {
    if (!token) {
        return false;
    }

    const endpoint = "/auth/jwt/verify";

    const response = await fetch(url + endpoint, {
        method: "GET", headers: {'Authorization': `Bearer ${token}`}
    });

    if (response.ok) {
        const data = await response.json();

        if (data.email === sessionStorage.getItem("email")) {
            return true;
        } else {
            console.log("Invalid token");
            return false;
        }
    } else {
        console.log("HTTP-Error:( ");
        return false;
    }
}

async function getAllTasks(token) {
    const endpoint = "/auth/jwt/tasks";

    const response = await fetch(url + endpoint, {
        method: 'GET', headers: {'Authorization': `Bearer ${token}`}
    })

    return await response.json();
}

async function updateTask(token, id) {
    const endpoint = "/auth/jwt/tasks";

    let taskState = getTaskState(id);

    const response = await fetch(url + endpoint, {
        method: 'PUT', headers: {
            'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`
        }, body: taskState
    })

    if (response.ok) {
        console.log("Task updated");
    } else {
        console.log("HTTP-Error:( ");
    }
}

function getTaskState(id) {
    const taskElement = document.querySelector(`.task[taskid="${id}"]`);
    const checked = taskElement.querySelector("input[type='checkbox']").checked;
    const title = taskElement.querySelector(".task_title").value;

    return JSON.stringify({id, title, completed: checked});
}

async function newTask(token) {
    const endpoint = "/auth/jwt/tasks";
    const title = "New task";
    const completed = false;

    const response = await fetch(url + endpoint, {
        method: 'POST', headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }, body: JSON.stringify({title, completed})
    })

    if (response.ok) {
        const data = await response.json();
        console.log(data);
        addTask(data.id, data.title, data.completed);
    } else {
        console.log("HTTP-Error:( ");
    }
}

function addTask(id = 0, title = "", completed = false,) {
    const taskElement = document.createElement("div");
    taskElement.className = "task";
    taskElement.setAttribute("taskid", id);
    taskElement.setAttribute("id", id);

    const containerL = document.createElement("div");
    const containerR = document.createElement("div");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    checkbox.addEventListener("change", (event) => {
        updateTask(token, id);
    });

    const taskTitle = document.createElement("input");
    taskTitle.type = "text";
    taskTitle.className = "task_title";
    taskTitle.value = title;
    taskTitle.addEventListener("change", (event) => {
        updateTask(token, id);
    });

    const copyLink = document.createElement("i");
    copyLink.className = "fa-solid fa-link";
    copyLink.addEventListener("click", (event) => {
        navigator.clipboard.writeText(window.location.href.split('#')[0] + "#" + id);
    });

    const trashCan = document.createElement("i");
    trashCan.className = "fa-solid fa-trash";
    trashCan.addEventListener("click", (event) => {
        deleteTask(token, id);
    });

    containerL.appendChild(checkbox);
    containerL.appendChild(taskTitle);
    taskElement.appendChild(containerL);
    containerR.appendChild(copyLink);
    containerR.appendChild(trashCan);
    taskElement.appendChild(containerR);

    document.querySelector(".tasks").insertBefore(taskElement, document.querySelector(".tasks").children[1])
}

function deleteTask(token, id) {
    const endpoint = "/auth/jwt/task/" + id;

    fetch(url + endpoint, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.ok) {
            document.querySelector(`.task[taskid="${id}"]`).remove();
        } else {
            console.log("HTTP-Error:( ");
        }
    });
}


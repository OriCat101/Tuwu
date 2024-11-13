const url = "http://172.17.0.2:3000";
const token = sessionStorage.getItem("token");

if(!isValidToken(token)) {
    window.location.href = "login.html";
} else {
    getAllTasks(token).then((tasks) => {

        tasks.forEach(task => {
            const taskElement = document.createElement("div");
            taskElement.className = "task";
            taskElement.setAttribute("taskid", task.id);

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            const taskTitle = document.createElement("h3");
            taskTitle.className = "task_title";
            taskTitle.textContent = task.title;

            taskElement.appendChild(checkbox);
            taskElement.appendChild(taskTitle);

            document.querySelector(".tasks").appendChild(taskElement);
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
        method: "GET",
        headers: { 'Authorization': `Bearer ${token}` }
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
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    })

    return await response.json();
}
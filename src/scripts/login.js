const url = "http://172.17.0.2:3000";
let email;
let password;

document.getElementById("login").addEventListener("click", getLoginToken);

async function getLoginToken(event) {
    event.preventDefault();
    const endpoint = "/auth/jwt/sign";
    let token;

    email = document.getElementById("email").value;
    password = document.getElementById("password").value;

    const response = await fetch(url + endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        const data = await response.json();
        token = data.token;
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("email", email);

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);
    } else {
        console.log("HTTP-Error:(");
    }
}


const url = "http://172.17.0.2:3000";
const token = sessionStorage.getItem("token");

if(!isValidToken(token)) {
    window.location.href = "login.html";
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
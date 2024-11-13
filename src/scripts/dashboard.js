if(!sessionStorage.getItem("token")) {
    window.location.href = "login.html";
}

function logOut() {
    sessionStorage.removeItem("token");
    window.location.href = "login.html";
}
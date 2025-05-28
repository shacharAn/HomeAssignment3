//  הרשמה והתחברות (usersList, currentUser)
document.addEventListener("DOMContentLoaded",function(){
    const registerForm = document.getElementById("registerForm");
    if(registerForm){
        registerForm.addEventListener("submit",function(e){
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        if (password.length < 8){
            alert("Password must be at least 8 characters.");
            return;
        }
        let users = JSON.parse(localStorage.getItem("usersList")) || [];
        const userExists = users.find((u) => u.username === username);
        if(userExists){
            alert("Username already exists.");
            return;
        }
        users.push({ username, password });
        localStorage.setItem("usersList",JSON.stringify(users));
        alert("Registration successful! Redirecting to login...");
        window.location.href = "login.html";

    });
} 

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const users = JSON.parse(localStorage.getItem("usersList")) || [];
        const foundUser = users.find((u) => u.username === username && u.password === password);
        if (!foundUser) {
        alert("Invalid username or password.");
        return;
        }
        localStorage.setItem("currentUser", username);
        alert("Login successful!");
        window.location.href = "index.html";
        });
    }
});

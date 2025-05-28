document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  passwordInput.addEventListener("input", function () {
    if (passwordInput.validity.tooShort) {
      passwordInput.setCustomValidity(
        "Password must be at least 8 characters."
      );
    } else {
      passwordInput.setCustomValidity("");
    }
  });
  const registerFormElement = document.getElementById("registerForm");
  if (registerFormElement) {
    registerFormElement.addEventListener(
      "submit",
      function (registrationEvent) {
        registrationEvent.preventDefault();

        const usernameInput = document.getElementById("username");
        const usernameInputValue = usernameInput.value.trim();
        const passwordInputValue = passwordInput.value;

        if (!usernameInputValue) {
          alert("Username is required.");
          return;
        }
        if (passwordInputValue.length < 8) {
          alert("Password must be at least 8 characters.");
          return;
        }

        let registeredUsersList =
          JSON.parse(localStorage.getItem("usersList")) || [];
        const existingUser = registeredUsersList.find(
          (userObject) => userObject.username === usernameInputValue
        );

        if (existingUser) {
          alert("Username already exists.");
          return;
        }

        registeredUsersList.push({
          username: usernameInputValue,
          password: passwordInputValue,
        });
        localStorage.setItem("usersList", JSON.stringify(registeredUsersList));
        alert("Registration successful! Redirecting to login...");
        window.location.href = "login.html";
      }
    );
  }

  const loginFormElement = document.getElementById("loginForm");
  if (loginFormElement) {
    loginFormElement.addEventListener("submit", function (loginEvent) {
      loginEvent.preventDefault();

      const usernameInputValue = document
        .getElementById("username")
        .value.trim();
      const passwordInputValue = document.getElementById("password").value;

      if (!usernameInputValue || !passwordInputValue) {
        alert("Please fill in both fields.");
        return;
      }
      const registeredUsersList =
        JSON.parse(localStorage.getItem("usersList")) || [];
      const matchedUserObject = registeredUsersList.find(
        (userObject) =>
          userObject.username === usernameInputValue &&
          userObject.password === passwordInputValue
      );

      if (!matchedUserObject) {
        alert("Invalid username or password.");
        return;
      }

      localStorage.setItem("currentUser", usernameInputValue);
      alert("Login successful!");
      window.location.href = "index.html";
    });
  }
});

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

  function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const mode = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", mode);
  }

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleDarkMode);
  }

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

        let usersList = loadFromStorage("usersList") || [];
        const existingUser = usersList.find(
          (user) => user.username === usernameInputValue
        );

        if (existingUser) {
          alert("Username already exists.");
          return;
        }

        usersList.push({
          username: usernameInputValue,
          password: passwordInputValue,
        });

        saveToStorage("usersList", usersList);

        alert("Registration successful! Redirecting to login...");
        location.href = "login.html";
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

      let usersList = loadFromStorage("usersList") || [];
      const matchedUser = usersList.find(
        (user) =>
          user.username === usernameInputValue &&
          user.password === passwordInputValue
      );

      if (!matchedUser) {
        alert("Invalid username or password.");
        return;
      }

      saveToStorage("currentUser", usernameInputValue);

      alert("Login successful!");
      location.href = "index.html";
    });
  }
});



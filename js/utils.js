  function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("dark-mode", "enabled");
  } else {
    localStorage.setItem("dark-mode", "disabled");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const user = getCurrentUser();
  const currentPage = location.pathname.split("/").pop();
  const pagesToProtect = [
    "rent.html",
    "favorites.html",
    "mybookings.html",
    "index.html",
  ];

  let isProtected = false;
  for (let i = 0; i < pagesToProtect.length; i++) {
    if (pagesToProtect[i] === currentPage) {
      isProtected = true;
      break;
    }
  }

  if (!user && isProtected) {
    location.href = "login.html";
  }

  const userDisplay = document.getElementById("currentUser");
  if (userDisplay && user) {
    userDisplay.innerHTML = `<i class="bi bi-person-fill"></i> ${user}`;
  }

  const signoutBtn = document.getElementById("signout-btn");
  if (signoutBtn) {
    signoutBtn.addEventListener("click", function () {
      localStorage.removeItem("currentUser");
      location.href = "login.html";
    });
  }

  const hamburger = document.getElementById("hamburger");
  const navBar = document.querySelector(".nav-bar");

  if (hamburger && navBar) {
    hamburger.addEventListener("click", function () {
      navBar.classList.toggle("open");
    });

  }
   if (localStorage.getItem("dark-mode") === "enabled") {
    document.body.classList.add("dark-mode");
  }

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleDarkMode);
  }
});




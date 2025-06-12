document.addEventListener("DOMContentLoaded", function () {
  const user = localStorage.getItem("currentUser");
  const currentPage = location.pathname.substring(
    location.href.lastIndexOf("/") + 1
  );
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
  if (userDisplay) {
    if (user) {
      userDisplay.innerHTML = `<i class="bi bi-person-fill"></i> ${user}`;
    } else {
      userDisplay.innerHTML = `<i class="bi bi-person-fill"></i> Guest`;
    }
  }

  const signoutBtn = document.getElementById("signout-btn");
  if (signoutBtn) {
    signoutBtn.style.display = user ? "inline-block" : "none";

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

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    const icon = document.querySelector("#theme-toggle i");
    if (icon) {
      icon.classList.remove("bi-moon-stars");
      icon.classList.add("bi-sun");
    }
  }
});

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const icon = document.querySelector("#theme-toggle i");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    icon.classList.remove("bi-moon-stars");
    icon.classList.add("bi-sun");
  } else {
    localStorage.setItem("theme", "light");
    icon.classList.remove("bi-sun");
    icon.classList.add("bi-moon-stars");
  }
}

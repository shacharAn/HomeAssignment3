function getCurrentUser() {
  return localStorage.getItem("currentUser");
}

function clearUserData() {
  localStorage.removeItem("currentUser");
}

function getAllBookings() {
  const bookings = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const suffix ="_bookings";
    if (key.indexOf(suffix) === key.length - suffix.length) {
      const userBookings = JSON.parse(localStorage.getItem(key));
      for (let j = 0; j < userBookings.length; j++) {
        bookings.push(userBookings[j]);
      }
    }
  }

  return bookings;
}

  document.addEventListener("DOMContentLoaded", () => {
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

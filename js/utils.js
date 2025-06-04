(function () {
  const user = localStorage.getItem("currentUser");
  const pagesToProtect = ["rent.html", "favorites.html", "mybookings.html"];
  const currentPage = window.location.pathname.split("/").pop();

  if (!user && pagesToProtect.includes(currentPage)) {
    window.location.href = "login.html";
  }

  const userDisplay = document.getElementById("currentUser");
  if (user && userDisplay) {
    userDisplay.innerHTML = `<i class="bi bi-person-fill"></i> ${user}`;
  }
})();

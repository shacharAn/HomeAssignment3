(function () {
  const user = localStorage.getItem("currentUser");
  const currentPage = window.location.pathname.split("/").pop();
  const pagesToProtect = ["rent.html", "favorites.html", "mybookings.html","index.html"];

  if (!user && pagesToProtect.includes(currentPage)) {
    window.location.href = "login.html";
  }

  const userDisplay = document.getElementById("currentUser");
  if (userDisplay) {
    userDisplay.innerHTML = `<i class="bi bi-person-fill"></i> ${user || "Guest"}`;
  }

  const signoutBtn = document.getElementById("signout-btn");
  if (signoutBtn) {
    signoutBtn.style.display = user ? "inline-block" : "none";
    signoutBtn.addEventListener("click", function () {
      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
      });
    }
})();

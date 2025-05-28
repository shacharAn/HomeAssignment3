(function redirectIfNotLoggedIn() {
  const pagesToProtect = ["rent.html", "favorites.html", "mybookings.html"];
  const currentPage = window.location.pathname.split("/").pop();

  const user = localStorage.getItem("currentUser");
  if (!user && pagesToProtect.includes(currentPage)) {
    window.location.href = "login.html";
  }
})();

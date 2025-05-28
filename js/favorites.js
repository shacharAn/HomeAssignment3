window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("favorites-container");
  const username = localStorage.getItem("currentUser");

  if (!username) {
    window.location.href = "login.html";
    return;
  }

  const key = `${username}_favorites`;
  const favoriteListings = JSON.parse(localStorage.getItem(key)) || [];

  if (favoriteListings.length === 0) {
    container.innerHTML = "<p>You have no favorite listings.</p>";
    return;
  }

  favoriteListings.forEach((listing) => {
    const card = document.createElement("div");
    card.className = "favorite-card";
    card.innerHTML = `
      <h3>${listing.name}</h3>
      <img src="${listing.picture_url}" alt="${listing.name}" width="250">
      <p>${listing.description}</p>
      <button data-id="${listing.listing_id}">Remove from Favorites</button>
    `;
    container.appendChild(card);
  });

  container.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      const idToRemove = event.target.dataset.id;
      const updatedFavorites = favoriteListings.filter((fav) => fav.listing_id !== idToRemove);
      localStorage.setItem(key, JSON.stringify(updatedFavorites));
      window.location.reload();
    }
  });
});

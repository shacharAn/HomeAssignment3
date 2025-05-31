document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("favorites-container");
  const countDisplay = document.getElementById("favorites-count");
  const userDisplay = document.getElementById("currentUser");
  const username = localStorage.getItem("currentUser");

  if (!username) {
    window.location.href = "login.html";
    return;
  }

  userDisplay.textContent = `👤 ${username}`;

  const key = `${username}_favorites`;
  const favoriteIds = JSON.parse(localStorage.getItem(key)) || [];

  const favorites = amsterdam.filter((apt) =>
    favoriteIds.some((fav) => fav.listing_id === apt.listing_id)
  );

  countDisplay.textContent = `${favorites.length} apartment${favorites.length !== 1 ? "s" : ""} in your favorites`;

  if (favorites.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-heart-icon">🤍</div>
        <p>No favorites yet</p>
        <p>Start browsing apartments and save your favorites for easy access later!</p>
        <button onclick="window.location.href='index.html'">Browse Apartments</button>
      </div>
    `;
    return;
  }

  favorites.forEach((apt) => {
    const card = document.createElement("div");
    card.className = "favorite-card";

    const imgSrc = apt.picture_url && apt.picture_url.startsWith("http")
      ? apt.picture_url
      : "images/placeholder.png";

    const rating = apt.review_scores_rating || "9.0";
    const reviews = apt.number_of_reviews || "0";
    const price = apt.price || "";
    const guests = apt.accommodates || "?";
    const beds = apt.beds || "?";
    const baths = apt.bathrooms_text || "?";

    card.innerHTML = `
      <div class="heart">🤍</div>
      <img src="${imgSrc}" alt="${apt.name}" />
      <div class="tag">Entire home/apt</div>
      <h2>${apt.name}</h2>

      <p class="location">📍 ${apt.neighbourhood_cleansed || "Unknown location"}</p>

      <p class="description">${apt.description.substring(0, 90)}...</p>

      <p class="details">👥 ${guests} guests &nbsp;&nbsp; 🛏️ ${beds} beds &nbsp;&nbsp; 🛁 ${baths}</p>

      <p class="price">💶 <strong>${price}</strong> / night</p>

      <div class="rating">⭐ <span>${parseFloat(rating).toFixed(1)}</span> (${reviews})</div>

      <div class="buttons">
        <button class="book-btn" onclick="window.open('${apt.listing_url}', '_blank')">Book Now</button>
        <button class="remove-btn" data-id="${apt.listing_id}">🗑️</button>
      </div>
    `;

    container.appendChild(card);
  });

  container.addEventListener("click", (e) => {
    if (e.target.matches(".remove-btn")) {
      const id = e.target.getAttribute("data-id");
      const updated = favoriteIds.filter((f) => f.listing_id !== id);
      localStorage.setItem(key, JSON.stringify(updated));
      location.reload();
    }
  });

  const signOutBtn = document.getElementById("signout-btn");
  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
    });
  }
});

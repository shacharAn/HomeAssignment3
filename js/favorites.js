document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("favorites-container");
  const countDisplay = document.getElementById("favorites-count");
  const userDisplay = document.getElementById("currentUser");
  const username = localStorage.getItem("currentUser");

  if (!username) {
    window.location.href = "login.html";
    return;
  }

  userDisplay.textContent = ` ${username}`;

  const key = `${username}_favorites`;
  const favoriteIds = JSON.parse(localStorage.getItem(key)) || [];

  const favorites = amsterdam.filter((apt) =>
    favoriteIds.some((fav) => fav.listing_id === apt.listing_id)
  );

  countDisplay.textContent = `${favorites.length} apartment${
    favorites.length !== 1 ? "s" : ""
  } in your favorites`;

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
    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper";

    const card = document.createElement("div");
    card.className = "favorite-card";

    const imgSrc =
      apt.picture_url && apt.picture_url.startsWith("http")
        ? apt.picture_url
        : "images/placeholder.png";

    const rating = apt.review_scores_rating || "9.0";
    const reviews = apt.number_of_reviews || "0";
    const price = apt.price || "";

    card.innerHTML = `
      <div class="heart" title="Remove from favorites" data-id="${apt.listing_id}"><i class="fi fi-sr-heart"></i></div>
      <img src="${imgSrc}" alt="${apt.name}" />
      <div class="card-body">
        <h2>${apt.name}</h2>
        <p class="location"><i class="fi fi-sr-marker"></i> ${apt.neighbourhood_cleansed}</p>
        <div class="price-rating">
          <span>${price} </span>
          <span><i class="fi fi-sr-star"></i> ${parseFloat(rating).toFixed(1)} (${reviews})</span>
        </div>
      </div>
      <button class="book-btn" onclick="window.location.href='rent.html'"> Rent </button>
    `;

    wrapper.appendChild(card);
    container.appendChild(wrapper);
  });

  container.addEventListener("click", (e) => {
    if (e.target.closest(".heart")) {
      const id = e.target.closest(".heart").getAttribute("data-id");
      const key = `${localStorage.getItem("currentUser")}_favorites`;
      const favorites = JSON.parse(localStorage.getItem(key)) || [];
      const updated = favorites.filter((f) => f.listing_id !== id);
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

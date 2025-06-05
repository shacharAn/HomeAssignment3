document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("favorites-container");
  const countDisplay = document.getElementById("favorites-count");
  const username = localStorage.getItem("currentUser");
  const key = `${username}_favorites`;
  let favoriteIds = localStorage.getItem(key);

  favoriteIds = favoriteIds ? JSON.parse(favoriteIds) : [];

  const favorites = [];
  for (let i = 0; i < amsterdam.length; i++) {
    for (let j = 0; j < favoriteIds.length; j++) {
      if (amsterdam[i].listing_id === favoriteIds[j].listing_id) {
        favorites.push(amsterdam[i]);
        break;
      }
    }
  }

  countDisplay.textContent = `${favorites.length} apartment${favorites.length !== 1 ? "s" : ""} in your favorites`;

  if (favorites.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-heart-icon">
          <i class="bi bi-heart-fill text-danger"></i>
        </div>
        <p>No favorites yet</p>
        <p>Start browsing apartments and save your favorites for easy access later! <i class="bi bi-stars"></i></p>
        <button onclick="location.href='index.html'" class="btn btn-outline-primary">
          <i class="bi bi-search"></i> Browse Apartments
        </button>
      </div>
    `;
    return;
  }

  favorites.forEach((apt) => {
    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper";

    const card = document.createElement("div");
    card.className = "favorite-card";

    let imgSrc = "images/placeholder.png";
    if (apt.picture_url && apt.picture_url.indexOf("http") === 0) {
      imgSrc = apt.picture_url;
    }

    let rating = "9.0";
    if (apt.review_scores_rating !== undefined) {
      rating = apt.review_scores_rating;
    }

    let reviews = "0";
    if (apt.number_of_reviews !== undefined) {
      reviews = apt.number_of_reviews;
    }

    let price = "";
    if (apt.price !== undefined) {
      price = apt.price;
    }

    card.innerHTML = `
      <div class="heart" title="Remove from favorites" data-id="${apt.listing_id}">
        <i class="bi bi-heart-fill text-danger"></i>
      </div>
      <img src="${imgSrc}" alt="${apt.name}" />
      <div class="card-body">
        <h2>${apt.name}</h2>
        <p class="location">
          <i class="bi bi-geo-alt-fill text-success"></i> ${apt.neighbourhood_cleansed}
        </p>
        <div class="price-rating">
          <span>Price per night: ${price}</span>
          <span><i class="bi bi-star-fill"></i> ${parseFloat(rating).toFixed(1)} (${reviews})</span>
        </div>
      </div>
      <button class="book-btn">Rent</button>
    `;

    card.querySelector(".book-btn").addEventListener("click", () => {
      localStorage.setItem("selectedListing", JSON.stringify(apt));
      location.href = "rent.html";
    });

    wrapper.appendChild(card);
    container.appendChild(wrapper);
  });

  container.addEventListener("click", function (e) {
    const target = e.target;
    if (target.classList.contains("bi-heart-fill") || target.classList.contains("heart")) {
      const heartDiv = target.classList.contains("heart") ? target : target.parentNode;
      const id = heartDiv.getAttribute("data-id");
      const key = localStorage.getItem("currentUser") + "_favorites";
      let favorites = JSON.parse(localStorage.getItem(key)) || [];

      const updated = favorites.filter((fav) => fav.listing_id !== id);

      localStorage.setItem(key, JSON.stringify(updated));
      location.reload();
    }
  });
});
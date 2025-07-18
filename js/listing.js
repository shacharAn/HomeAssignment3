let currentPage = 1;
const pageSize = 6;
let allApartments = amsterdam;

document.addEventListener("DOMContentLoaded", function () {

  const currentUser = getCurrentUser();
  if (!currentUser) {
    location.href = "login.html";
  }

  const currentUserSpan = document.getElementById("currentUser");
  const signoutBtn = document.getElementById("signout-btn");

  if (currentUserSpan && currentUser) {
    currentUserSpan.innerHTML = `<i class="bi bi-person-fill"></i> ${currentUser}`;
  }

  if (signoutBtn) {
    signoutBtn.addEventListener("click", function () {
      clearUserData();
      location.href = "login.html";
    });
  }

  const ratingSelect = document.getElementById("rating");
  const ratings = [3, 3.5, 4, 4.5, 5];

  for (let i = 0; i < ratings.length; i++) {
    const option = document.createElement("option");
    option.value = ratings[i];
    option.textContent = ratings[i] + " +";
    ratingSelect.appendChild(option);
  }

  const roomSelect = document.getElementById("roomSelect");
  roomSelect.innerHTML = "";

  const noFilterOption = document.createElement("option");
  noFilterOption.value = "";
  noFilterOption.textContent = "No Room Filter";
  roomSelect.appendChild(noFilterOption);

  const roomNumbers = [];

  for (let ap of amsterdam) {
    const room = parseInt(ap.bedrooms);
    if (!isNaN(room) && !roomNumbers.includes(room)) {
      roomNumbers.push(room);
    }
  }

  roomNumbers.sort((a, b) => a - b);
  roomNumbers.forEach((room) => {
    if (room < 5) {
      const option = document.createElement("option");
      option.value = room;
      option.textContent = room + " rooms";
      roomSelect.appendChild(option);
    }
  });

  const fivePlusOption = document.createElement("option");
  fivePlusOption.value = "5+";
  fivePlusOption.textContent = "5+ rooms";
  roomSelect.appendChild(fivePlusOption);

  const minPriceInput = document.getElementById("minPrice");
  const maxPriceInput = document.getElementById("maxPrice");

  [minPriceInput, maxPriceInput].forEach((input) => {
    input.addEventListener("input", () => {
      let value = parseInt(input.value);
      if (isNaN(value)) return;

      if (value < 0) {
        alert("Price cannot be negative.");
      } else if (value > 8000) {
        alert("Maximum price allowed is 8000.");
      }
    });
  });

  document.getElementById("filterBtn").addEventListener("click", function () {
    const selectedRating = parseFloat(ratingSelect.value) || 0;
    const selectedRooms = roomSelect.value;
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

    if (minPrice > maxPrice) {
      alert("Minimum price must be less than or equal to maximum price.");
      return;
    }

      const filtered = amsterdam.filter((ap) => {
      const rating = parseFloat(ap.review_scores_rating) || 0;
      const price = parseFloat(ap.price.replace(/[^0-9.]/g, "")) || 0;
      const rooms = parseInt(ap.bedrooms) || 0;

      const ratingMatch = rating >= selectedRating;
      const priceMatch = price >= minPrice && price <= maxPrice;
      const roomMatch =
        selectedRooms === "" ||
        (selectedRooms === "5+"
          ? rooms >= 5
          : rooms === parseInt(selectedRooms));

      return ratingMatch && priceMatch && roomMatch;
    });

    currentPage = 1;
    allApartments = filtered;
    displayApartments(allApartments);
  });

  document.getElementById("resetBtn").addEventListener("click", function () {
    ratingSelect.value = "";
    roomSelect.value = "";
    minPriceInput.value = "";
    maxPriceInput.value = "";
    currentPage = 1;
    allApartments = amsterdam;
    displayApartments(allApartments);
  });

  document.getElementById("prevPage").addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      displayApartments(allApartments);

      setTimeout(() => {
        window.scrollTo({
          top: 500,
          behavior: "smooth"
        });
      }, 0);
    }
  });

  document.getElementById("nextPage").addEventListener("click", function () {
    const totalPages = Math.ceil(allApartments.length / pageSize);
    if (currentPage < totalPages) {
      currentPage++;
      displayApartments(allApartments);

      setTimeout(() => {
        window.scrollTo({
          top: 500,
          behavior: "smooth"
        });
      }, 0);
    }
  });

  displayApartments(allApartments);
});

function getCurrentUser() {
  return localStorage.getItem("currentUser");
}

function clearUserData() {
  localStorage.removeItem("currentUser");
}

function paginate(array, pageNumber, pageSize) {
  const start = (pageNumber - 1) * pageSize;
  return array.slice(start, start + pageSize);
}

function displayApartments(apartments) {
  const track = document.getElementById("results");
  track.innerHTML = "";
  const paginated = paginate(apartments, currentPage, pageSize);
  const countElement = document.getElementById("apartment-count");

  if (countElement) {
    countElement.textContent = `${apartments.length} apartments found`;
  }

  paginated.forEach((ap) => {
    const card = document.createElement("div");
    card.className = "apartment-card";
    card.innerHTML = `
  <div class="fav-icon-container">
    <i class="bi bi-heart fav-icon" title="Add to Favorites"></i>
  </div>
  <img src="${ap.picture_url}" alt="${ap.name}" class="apartment-image"/>
  <div class="card-body">
    <h3>${ap.name}</h3>
    <p><strong>ID:</strong> ${ap.listing_id}</p>
    <p><strong>Rating:</strong> ${ap.review_scores_rating}</p>
    <p><strong>Bedrooms:</strong> ${ap.bedrooms}</p>
    <p><strong>Price:</strong> ${ap.price}</p>
    <div class="action-icons">
      <button class="toggle-details-btn">▼ Show more</button>
    </div>
    <div class="apartment-details hidden">
      <p>${ap.description}</p>
    </div>
    <div class="card-actions">
      <a href="${ap.listing_url}" target="_blank" class="link">Go to listing</a>
      <button class="rent-btn">Rent this apartment</button>
    </div>
  </div>
  `;

    card.querySelector(".rent-btn").addEventListener("click", () => {
      localStorage.setItem("selectedListing", JSON.stringify(ap));
      location.href = "rent.html";
    });

    const favIcon = card.querySelector(".fav-icon");
    const user = getCurrentUser();
    const favKey = `${user}_favorites`;
    let favList = JSON.parse(localStorage.getItem(favKey)) || [];

    const isFav = favList.some((fav) => fav.listing_id === ap.listing_id);
    favIcon.classList.toggle("bi-heart-fill", isFav);
    favIcon.classList.toggle("bi-heart", !isFav);

    favIcon.addEventListener("click", () => {
      favList = JSON.parse(localStorage.getItem(favKey)) || [];
      const index = favList.findIndex(
        (fav) => fav.listing_id === ap.listing_id
      );
      if (index > -1) {
        favList.splice(index, 1);
      } else {
        favList.push(ap);
      }
      localStorage.setItem(favKey, JSON.stringify(favList));
      favIcon.classList.toggle("bi-heart-fill");
      favIcon.classList.toggle("bi-heart");
    });

    card
    card.querySelector(".toggle-details-btn")
      .addEventListener("click", function () {
        const detailsDiv = card.querySelector(".apartment-details");
        const actionsDiv = card.querySelector(".card-actions"); // ✨ הכפתורים
        const isHidden = detailsDiv.classList.contains("hidden");

        detailsDiv.classList.toggle("hidden", !isHidden);
        actionsDiv.classList.toggle("hidden", isHidden);

        this.textContent = isHidden ? "➤  Hide details" : "▼ Show more";
      });

    track.appendChild(card);
  });

  const pageIndicator = document.getElementById("page-indicator");
  const totalPages = Math.ceil(apartments.length / pageSize);
  pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
}

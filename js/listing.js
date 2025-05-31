document.addEventListener("DOMContentLoaded", function () {
  const apartments = window.amsterdam;
  console.log(amsterdam);

const currentUserSpan = document.getElementById("currentUser");
const signoutBtn = document.getElementById("signout-btn");
const currentUser = getCurrentUser();

if (currentUserSpan) {
  currentUserSpan.textContent = currentUser ? `👤 ${currentUser}` : "👤 Guest";
}

if (signoutBtn) {
  signoutBtn.style.display = currentUser ? "inline-block" : "none";
  signoutBtn.addEventListener("click", function () {
    clearUserData();
    window.location.href = "login.html";
  });
}
 const apartmentCountSpan = document.getElementById("apartment-count");
  if (apartmentCountSpan) {
    apartmentCountSpan.textContent = apartments.length;
  }

  const ratingSelect = document.getElementById("rating");
  for (let i = 1; i <= 10; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i + "+";
    ratingSelect.appendChild(option);
  }

  const priceSlider = document.getElementById("priceSlider");
  const priceLabel = document.getElementById("priceRangeLabel");

noUiSlider.create(priceSlider, {
  start: [100, 800],
  connect: true,
  range: {
    min: 0,
    max: 800,
  },
  step: 10,
  tooltips: true,
  format: {
    to: value => `$${Math.round(value)}`,
    from: value => Number(value.replace(/[^\d]/g, ''))
  }
});

priceSlider.noUiSlider.on("update", function (values) {
  const [min, max] = values;
  priceLabel.textContent = `${min} - ${max === "₪800" ? "₪800+" : max}`;
});

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

  document.getElementById("filterBtn").addEventListener("click", function () {
    const selectedRating = parseInt(ratingSelect.value) || 0;
    const [minPrice, maxPrice] = priceSlider.noUiSlider.get().map(val => parseInt(val.replace(/[^\d]/g, '')));
    const selectedRooms = roomSelect.value;

    const filtered = amsterdam.filter((ap) => {
      const rating = parseFloat(ap.review_scores_rating) || 0;
      const price = parseFloat(ap.price.replace(/[^0-9.]/g, "")) || 0;
      const rooms = parseInt(ap.bedrooms) || 0;

      const ratingMatch = rating >= selectedRating;
      const priceMatch = price >= minPrice && price <= maxPrice;

      let roomMatch = true;
      if (selectedRooms === "5+") {
        roomMatch = rooms >= 5;
      } else if (selectedRooms !== "") {
        roomMatch = rooms === parseInt(selectedRooms);
      }

      return ratingMatch && priceMatch && roomMatch;
    });

    displayApartments(filtered);
  });

    document.getElementById("resetBtn").addEventListener("click", function () {
    ratingSelect.value = "";
    roomSelect.value = "";

    if (priceSlider && priceSlider.noUiSlider) {
      priceSlider.noUiSlider.set([0, 800]);
    }

    displayApartments(apartments);
  });

  displayApartments(amsterdam);
});

function getCurrentUser() {
  return localStorage.getItem("currentUser");
}

function clearUserData() {
  localStorage.removeItem("currentUser");
}

function displayApartments(apartments) {
  const track = document.getElementById("results");
  track.innerHTML = "";

  const countElement = document.getElementById("apartment-count");
  if (countElement) {
    countElement.textContent = `${apartments.length} apartments found`;
  }
  if (apartments.length === 0) {
    track.innerHTML = "<p>No apartments match your criteria.</p>";
    return;
  }

  apartments.forEach((ap) => {
    const card = document.createElement("div");
    card.className = "apartment-card";

    card.innerHTML = `
      <img src="${ap.picture_url}" alt="${ap.name}" class="apartment-image"/>
      <div class = "apartment-info">
      <h3>${ap.name}</h3>
      <p><strong>ID:</strong> ${ap.listing_id}</p>
      <p><strong>Description:</strong> ${ap.description}</p>
      <a href="${ap.listing_url}" target="_blank">View Listing</a>
      <div class="action-buttons">
      <button class="rent-btn">Rent</button>
      <button class="fav-btn">Add to Favorites</button>
    </div>
  </div>
    `;

    card.querySelector(".rent-btn").addEventListener("click", () => {
      localStorage.setItem("selectedListing", JSON.stringify(ap));
      window.location.href = "rent.html";
    });

    const favBtn = card.querySelector(".fav-btn");
    const user = getCurrentUser();
    const favKey = `${user}_favorites`;
    let favList = JSON.parse(localStorage.getItem(favKey)) || [];
    const isFav = favList.some((fav) => fav.listing_id === ap.listing_id);
    favBtn.textContent = isFav ? "Remove from Favorites" : "Add to Favorites";

    favBtn.addEventListener("click", () => {
      favList = JSON.parse(localStorage.getItem(favKey)) || [];
      const index = favList.findIndex(
        (fav) => fav.listing_id === ap.listing_id);
      if (index > -1) {
        favList.splice(index, 1);
        favBtn.textContent = "Add to Favorites";
      } else {
        favList.push({ listing_id: ap.listing_id });
        favBtn.textContent = "Remove from Favorites";
      }
      localStorage.setItem(favKey, JSON.stringify(favList));
    });
    track.appendChild(card);
  });

  let currentSlide = 0;
  const cardWidth = 460;
  const cardMargin = 20;

  function updateCarousel() {
    const totalItems = track.children.length;
    const visibleCards = 2;
    const maxSlide = Math.max(0, totalItems - visibleCards);

    if (currentSlide < 0) currentSlide = 0;
    if (currentSlide > maxSlide) currentSlide = maxSlide;

    const offset = currentSlide * (cardWidth + cardMargin);
    track.style.transform = `translateX(-${offset}px)`;
  }

  const rightBtn = document.querySelector(".right-btn");
  const leftBtn = document.querySelector(".left-btn");

  if (rightBtn && leftBtn) {
    rightBtn.onclick = () => {
      currentSlide++;
      updateCarousel();
    };
    leftBtn.onclick = () => {
      currentSlide--;
      updateCarousel();
    };
  }
  updateCarousel();
}

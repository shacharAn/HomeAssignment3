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


      const roomMatch = selectedRooms === "" || rooms === parseInt(selectedRooms);

      return ratingMatch && priceMatch && roomMatch;
    });

    displayApartments(filtered);
  });

    document.getElementById("resetBtn").addEventListener("click", function () {
    ratingSelect.value = "";
    roomSelect.value = "";

    priceSlider.noUiSlider.set([0, 800]);

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

function paginate(array, pageNumber, pageSize) {
  const start = (pageNumber - 1) * pageSize;
  return array.slice(start, start + pageSize);
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
      <div class="apartment-info">
      <h3>${ap.name}</h3>
      <p><strong>ID:</strong> ${ap.listing_id}</p>
      <p><strong>Rating:</strong> ${ap.review_scores_rating}</p>
      <p><strong>Bedrooms:</strong> ${ap.bedrooms}</p>
      <p><strong>Price:</strong> ${ap.price}</p>
      <a href="${ap.listing_url}" target="_blank">View Listing</a>

      <div class="action-icons">
        <i class="bi bi-heart fav-icon" title="Add to Favorites"></i>
        <i class="bi bi-box-arrow-in-right rent-icon" title="Rent Apartment"></i>
        <button class="toggle-details-btn">➤ Show more</button>
      </div>
      
      <div class="apartment-details hidden">
      <p>${ap.description}...</p>
    </div>
  </div>
`;


    card.querySelector(".rent-icon").addEventListener("click", () => {
      localStorage.setItem("selectedListing", JSON.stringify(ap));
      window.location.href = "rent.html";
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
  const index = favList.findIndex(fav => fav.listing_id === ap.listing_id);
  if (index > -1) {
    favList.splice(index, 1);
  } else {
    favList.push(ap);
  }
  localStorage.setItem(favKey, JSON.stringify(favList));
  favIcon.classList.toggle("bi-heart-fill");
  favIcon.classList.toggle("bi-heart");
});

    card.querySelector(".toggle-details-btn").addEventListener("click", function () {
    const detailsDiv = card.querySelector(".apartment-details");
    const isHidden = detailsDiv.classList.contains("hidden");

    detailsDiv.classList.toggle("hidden");
    this.textContent = isHidden ? "▼ Hide details" : "➤ Show more";
  });

    track.appendChild(card);
  });

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

  let currentPage = 1;
  const pageSize = 10;
  let allApartments = window.amsterdam;
  document.addEventListener("DOMContentLoaded", function () {

  // const apartments = window.amsterdam;

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
  start: [0, 800],
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
    for (let ap of window.amsterdam) {
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

    const filtered = window.amsterdam.filter((ap) => {
      const rating = parseFloat(ap.review_scores_rating) || 0;
      const price = parseFloat(ap.price.replace(/[^0-9.]/g, "")) || 0;
      const rooms = parseInt(ap.bedrooms) || 0;

      const ratingMatch = rating >= selectedRating;
      const priceMatch = price >= minPrice && price <= maxPrice;


      const roomMatch = selectedRooms === "" || rooms === parseInt(selectedRooms);

      return ratingMatch && priceMatch && roomMatch;
    });

    currentPage = 1;
    allApartments = filtered;
    displayApartments(allApartments);

    // displayApartments(filtered);
  });

    document.getElementById("resetBtn").addEventListener("click", function () {
    ratingSelect.value = "";
    roomSelect.value = "";

    priceSlider.noUiSlider.set([0, 800]);

    currentPage = 1;
    allApartments = window.amsterdam;
    displayApartments(allApartments);
    // displayApartments(apartments);
  });

  displayApartments(allApartments);
  // displayApartments(amsterdam);
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

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) {
      btn.classList.add("active");
    }
    btn.addEventListener("click", () => {
      currentPage = i;
      displayApartments(allApartments);
    });
    paginationContainer.appendChild(btn);
  }
}
function displayApartments(apartments) {
  const track = document.getElementById("results");
  const paginated = paginate(apartments, currentPage, pageSize);
  track.innerHTML = "";

  const countElement = document.getElementById("apartment-count");
  if (countElement) {
    countElement.textContent = `${apartments.length} apartments found`;
  }
  if (apartments.length === 0) {
    track.innerHTML = "<p>No apartments match your criteria.</p>";
    return;
  }

  paginated.forEach((ap) => {
  // apartments.forEach((ap) => {
    const card = document.createElement("div");
    card.className = "apartment-card";

    card.innerHTML = `
      <div class="fav-icon-container">
    <i class="bi bi-heart fav-icon" title="Add to Favorites"></i>
      </div>
      <div class="apartment-image-wrapper">
        <img src="${ap.picture_url}" alt="${ap.name}" class="apartment-image"/>
        <button class="rent-btn">Rent this apartment</button>
      </div>
      <div class="apartment-info">
      <h3>${ap.name}</h3>
      <p><strong>ID:</strong> ${ap.listing_id}</p>
      <p><strong>Rating:</strong> ${ap.review_scores_rating}</p>
      <p><strong>Bedrooms:</strong> ${ap.bedrooms}</p>
      <p><strong>Price:</strong> ${ap.price}</p>
      <a href="${ap.listing_url}" target="_blank">View Listing</a>

      <div class="action-icons">
        <button class="toggle-details-btn">➤ Show more</button>
      </div>
      
      <div class="apartment-details hidden">
      <p>${ap.description}</p>
    </div>
  </div>
`;


    card.querySelector(".rent-btn").addEventListener("click", () => {
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

  renderPagination(apartments.length);

}

  document.addEventListener("DOMContentLoaded", function () {
  const currentUserSpan = document.getElementById("currentUser");
  const currentUser = getCurrentUser();
  currentUserSpan.textContent = currentUser ? currentUser : "Guest";

  const signoutBtn = document.getElementById("signout-btn");
  signoutBtn.addEventListener("click", function () {
    clearUserData();
    window.location.href = "login.html";
  });

  const apartmentCountSpan = document.getElementById("apartment-count");
  apartmentCountSpan.textContent = amsterdam.length;

  const ratingSelect = document.getElementById("rating");
  for (let i = 1; i <= 10; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i + "+";
    ratingSelect.appendChild(option);
  }

const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const minPriceValue = document.getElementById("minPriceValue");
const maxPriceValue = document.getElementById("maxPriceValue");

const updatePriceLabels = () => {
  minPriceValue.textContent = `₪${minPriceInput.value}`;
  maxPriceValue.textContent = maxPriceInput.value === "800" ? "₪800+" : `₪${maxPriceInput.value}`;
};

minPriceInput.addEventListener("input", updatePriceLabels);
maxPriceInput.addEventListener("input", updatePriceLabels);
updatePriceLabels();


  const roomSelect = document.getElementById("roomSelect");
  roomSelect.innerHTML = "";

  const noFilterOption = document.createElement("option");
  noFilterOption.value = "";
  noFilterOption.textContent = "No Room Filter";
  roomSelect.appendChild(noFilterOption);

  const roomNumbers = [];

for (let i = 0; i < amsterdam.length; i++) {
  const room = parseInt(amsterdam[i].bedrooms);
  if (!isNaN(room) && roomNumbers.indexOf(room) === -1) {
    roomNumbers.push(room);
  }
}

roomNumbers.sort(function (a, b) {
  return a - b;
});


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

  const filterBtn = document.getElementById("filterBtn");
  filterBtn.addEventListener("click", function () {
    const selectedRating =
      parseInt(document.getElementById("rating").value) || 0;
//     
const minPrice = parseInt(minPriceInput.value);
const maxPrice = parseInt(maxPriceInput.value);

    const selectedRooms = document.getElementById("roomSelect").value;

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

  displayApartments(amsterdam);
});

function getCurrentUser() {
  return localStorage.getItem("currentUser");
}

function clearUserData() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

function displayApartments(apartments) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";

  if (apartments.length === 0) {
    resultsContainer.innerHTML = "<p>No apartments match your criteria.</p>";
    return;
  }

  apartments.forEach((ap) => {
    const card = document.createElement("div");
    card.className = "apartment-card";

    card.innerHTML = `
      <img src="${ap.picture_url}" alt="${ap.name}" class="apartment-image"/>
      <h3>${ap.name}</h3>
      <p><strong>ID:</strong> ${ap.listing_id}</p>
      <p><strong>Description:</strong> ${ap.description}</p>
      <a href="${ap.listing_url}" target="_blank">View Listing</a><br/>
      <button class="rent-btn">Rent</button>
      <button class="fav-btn">Add to Favorites</button>
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
        (fav) => fav.listing_id === ap.listing_id
      );
      if (index > -1) {
        favList.splice(index, 1);
        favBtn.textContent = "Add to Favorites";
      } else {
        favList.push(ap);
        favBtn.textContent = "Remove from Favorites";
      }
      localStorage.setItem(favKey, JSON.stringify(favList));
    });

    resultsContainer.appendChild(card);
  });
}

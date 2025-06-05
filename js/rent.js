function isDateRangeOverlap(start1, end1, start2, end2) {
  return !(end1 < start2 || start1 > end2);
}

function checkAvailability(listingId, startDate, endDate) {
  const allBookings = getAllBookings();
  return !allBookings.some(
    (booking) =>
      booking.listing_id === listingId &&
      isDateRangeOverlap(startDate, endDate, booking.startDate, booking.endDate)
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const selectedListingJSON = localStorage.getItem("selectedListing");
  if (!selectedListingJSON) {
    document.querySelector(".rent-container").innerHTML = `
      <section class="empty-state">
        <h1>Rent an Apartment</h1>
        <p>No apartment selected</p>
        <p>Please choose an apartment from the home page <i class="bi bi-stars"></i></p>
        <button onclick="location.href='index.html'" class="btn btn-outline-primary">
          <i class="bi bi-search"></i> Browse Apartments
        </button>
      </section>
    `;
    return;
  }

  const listing = JSON.parse(selectedListingJSON);
  const minNights = parseInt(listing.minimum_nights) || 2;
  const maxNights = parseInt(listing.maximum_nights) || 60;
  document.getElementById("min-nights-display").textContent = minNights;

  document.getElementById("listing-details").innerHTML = `
    <div class="card mb-4">
      <img src="${listing.picture_url}" class="card-img-top rent-img" alt="Listing image">
      <div class="card-body">
        <h2>${listing.name}</h2>
        <p class="text-muted">
          <i class="bi bi-geo-alt-fill"></i> ${listing.neighbourhood_cleansed || "Unknown"}
        </p>
        <p><strong>Price:</strong> ${listing.price}</p>
        <p><strong>Min nights:</strong> ${listing.minimum_nights}</p>
        <p><i class="bi bi-star-fill text-warning"></i> ${parseFloat(listing.review_scores_rating || 4.8).toFixed(1)} (${listing.number_of_reviews || 0})</p>
        <p>${listing.description}</p>
        <div id="map" style="height: 300px; margin-top: 1rem;"></div>
      </div>
    </div>
  `;

  const map = L.map("map").setView([listing.latitude || 52.3676, listing.longitude || 4.9041], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  }).addTo(map);
  L.marker([listing.latitude || 52.3676, listing.longitude || 4.9041]).addTo(map)
    .bindPopup(`<b>${listing.name}</b>`)
    .openPopup();

  const today = new Date().toISOString().split("T")[0];
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  startDateInput.min = today;
  endDateInput.min = today;

  startDateInput.addEventListener("change", () => {
    const start = startDateInput.value;
    endDateInput.min = start;
  });

  [startDateInput, endDateInput].forEach((input) => {
    input.addEventListener("input", () => {
      const start = startDateInput.value;
      const end = endDateInput.value;
      if (start && end && !checkAvailability(listing.listing_id, start, end)) {
        input.setCustomValidity("These dates are already booked.");
        input.reportValidity();
      } else {
        input.setCustomValidity("");
      }
    });
  });

  document.getElementById("rental-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const start = startDateInput.value;
    const end = endDateInput.value;
    const result = document.getElementById("result");

    if (!start || !end || end < start) {
      result.innerHTML = `<div class="alert alert-danger">Check-out must be after check-in.</div>`;
      return;
    }

    const nights = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
    if (nights < minNights) {
      result.innerHTML = `<div class="alert alert-warning">Minimum stay is ${minNights} nights.</div>`;
      return;
    }
    if (nights > maxNights) {
      result.innerHTML = `<div class="alert alert-warning">Maximum stay is ${maxNights} nights.</div>`;
      return;
    }

    if (!checkAvailability(listing.listing_id, start, end)) {
      result.innerHTML = `<div class="alert alert-danger">These dates are already booked.</div>`;
      return;
    }

    const price = parseFloat(listing.price.replace(/[^\d.]/g, "")) || 0;
    const total = (price * nights).toFixed(2);

    result.innerHTML = `
      <div class="alert alert-success">
        ${listing.price} x ${nights} nights = $${total}<br>
        <strong>Total: $${total}</strong>
      </div>
    `;

    document.getElementById("summary-name").textContent = listing.name;
    document.getElementById("summary-start").textContent = start;
    document.getElementById("summary-end").textContent = end;
    document.getElementById("summary-nights").textContent = nights;
    document.getElementById("summary-total").textContent = total;

    document.getElementById("payment-form").classList.remove("hidden");
  });

  document.getElementById("payment-form").addEventListener("submit", function handleSubmit(e) {
    e.preventDefault();

    const cardNumber = document.getElementById("cardNumber").value;
    const expiryDate = document.getElementById("expiryDate").value;
    const cvv = document.getElementById("cvv").value;

    if (!/^\d{16}$/.test(cardNumber)) {
      alert("Invalid card number");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      alert("Invalid expiry date. Use MM/YY format.");
      return;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      alert("Invalid CVV");
      return;
    }

    const currentUser = localStorage.getItem("currentUser");
    const key = `${currentUser}_bookings`;
    const start = startDateInput.value;
    const end = endDateInput.value;
    const nights = document.getElementById("summary-nights").textContent;
    const total = document.getElementById("summary-total").textContent;

    const booking = {
      listing_id: listing.listing_id,
      startDate: start,
      endDate: end,
      nights: nights,
      total: total,
      name: listing.name,
    };

    const existing = JSON.parse(localStorage.getItem(key)) || [];
    existing.push(booking);
    localStorage.setItem(key, JSON.stringify(existing));
    localStorage.removeItem("selectedListing");

    alert("Booking confirmed!");

    document.getElementById("payment-form").classList.add("hidden");
    document.getElementById("rental-form").reset();
    document.getElementById("result").innerHTML = "";

    document.getElementById("payment-form").removeEventListener("submit", handleSubmit);

    location.href = "mybookings.html";
  });
});

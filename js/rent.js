
function isDateRangeOverlap(startDate1, endDate1, startDate2, endDate2) {
  return !(endDate1 < startDate2 || startDate1 > endDate2);
}

function checkAvailability(listingId, startDate, endDate) {
  const allBookingsArray = getAllBookings();

  for (let bookingObject of allBookingsArray) {
    if (
      bookingObject.listing_id === listingId &&
      isDateRangeOverlap(
        startDate,
        endDate,
        bookingObject.startDate,
        bookingObject.endDate
      )
    ) {
      return false;
    }
  }

  return true;
}

window.addEventListener("DOMContentLoaded", function () {
  const selectedListingJSON = localStorage.getItem("selectedListing");
 if (!selectedListingJSON) {
  document.querySelector(".rent-container").innerHTML = `
    <section class="empty-state">
      <h1 class="text-center mb-3">Rent an Apartment</h1>
      <p>No apartment selected</p>
      <p>To book an apartment, please start from the home page and select a listing you like ✨</p>
      <button onclick="window.location.href='index.html'" class="btn btn-outline-primary">
        <i class="bi bi-search"></i> Browse Apartments
      </button>
    </section>
  `;
  return;
}


  const currentListing = JSON.parse(selectedListingJSON);
  const minNights = parseInt(currentListing.minimum_nights) || 2;
  const maxNights = parseInt(currentListing.maximum_nights) || 60;
  document.getElementById("min-nights-display").textContent = minNights;

  document.getElementById("listing-details").innerHTML = `
    <div class="card mb-4">
      <img src="${currentListing.picture_url}" class="card-img-top rent-img" alt="Listing image">
      <div class="card-body">
        <h2 class="card-title">${currentListing.name}</h2>
        <p class="card-subtitle text-muted">
          <i class="bi bi-geo-alt-fill"></i>
          ${currentListing.neighbourhood_cleansed || "Unknown location"}
        </p>
        <p><strong>Price per night:</strong> ${currentListing.price}</p>
        <p><strong>Minimum nights:</strong> ${currentListing.minimum_nights}</p>
        <p class="text-warning">
          <i class="bi bi-star-fill"></i>
          ${parseFloat(currentListing.review_scores_rating || 4.8).toFixed(1)}
          (${currentListing.number_of_reviews || 0})
        </p>
        <p class="card-text">${currentListing.description}</p>
      </div>
    </div>
  `;

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("startDate").setAttribute("min", today);
  document.getElementById("endDate").setAttribute("min", today);

  document.getElementById("rental-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const selectedStartDate = document.getElementById("startDate").value;
    const selectedEndDate = document.getElementById("endDate").value;

    if (!selectedStartDate || !selectedEndDate) return;

    if (selectedEndDate < selectedStartDate) {
      document.getElementById("result").innerHTML = `
        <div class="alert alert-danger">Check-out date must be after check-in date.</div>
      `;
      return;
    }

    const start = new Date(selectedStartDate);
    const end = new Date(selectedEndDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (nights < minNights) {
      document.getElementById("result").innerHTML = `
        <div class="alert alert-warning">Minimum stay is ${minNights} nights.</div>
      `;
      return;
    }

    if (nights > maxNights) {
      document.getElementById("result").innerHTML = `
        <div class="alert alert-warning">Maximum stay is ${maxNights} nights.</div>
      `;
      return;
    }

    if (!checkAvailability(currentListing.listing_id, selectedStartDate, selectedEndDate)) {
      document.getElementById("result").innerHTML = `
        <div class="alert alert-danger">These dates are already booked.</div>
      `;
      return;
    }

    const pricePerNight = parseFloat(currentListing.price.replace(/[^\d.]/g, "")) || 0;
    const total = pricePerNight * nights;

    document.getElementById("result").innerHTML = `
      <div class="alert alert-success">
        ${currentListing.price} x ${nights} nights = $${total.toFixed(2)}<br>
        <strong>Total: $${total.toFixed(2)}</strong>
      </div>
    `;

    document.getElementById("summary-name").textContent = currentListing.name;
    document.getElementById("summary-start").textContent = selectedStartDate;
    document.getElementById("summary-end").textContent = selectedEndDate;
    document.getElementById("summary-nights").textContent = nights;
    document.getElementById("summary-total").textContent = total.toFixed(2);

    document.getElementById("payment-form").style.display = "block";

    document.getElementById("payment-form").addEventListener("submit", function (e) {
      e.preventDefault();

      const currentUsername = localStorage.getItem("currentUser") || "guest";
      const userBookingKey = `${currentUsername}_bookings`;

      const newBookingObject = {
        listing_id: currentListing.listing_id,
        startDate: selectedStartDate,
        endDate: selectedEndDate,
        nights: nights,
        total: total.toFixed(2),
        name: currentListing.name,
      };

      const existingBookingsArray = JSON.parse(localStorage.getItem(userBookingKey)) || [];
      existingBookingsArray.push(newBookingObject);
      localStorage.setItem(userBookingKey, JSON.stringify(existingBookingsArray));
     localStorage.removeItem("selectedListing");
  
      alert("Booking confirmed!");
      window.location.href = "mybookings.html";
    });
  });
});

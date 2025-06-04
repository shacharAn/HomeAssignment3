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
    document.getElementById(
      "listing-details"
    ).innerHTML = `<p style="color:red;">No apartment selected.</p>`;
    return;
  }

  const currentListing = JSON.parse(selectedListingJSON);
  const minNights = parseInt(currentListing.minimum_nights) || 2;
  const maxNights = parseInt(currentListing.maximum_nights) || 60;
  document.getElementById("min-nights-display").textContent = minNights;

document.getElementById("listing-details").innerHTML = `
  <img class="rent-img" src="${currentListing.picture_url}" alt="Listing image">
  <h2>${currentListing.name}</h2>

  <p class="apt-location"><i class="bi bi-geo-alt-fill"></i> ${currentListing.neighbourhood_cleansed || "Unknown location"}</p>
  
  <p><strong>Price per night:</strong> ${currentListing.price}</p>
  <p><strong>Minimum nights:</strong> ${currentListing.minimum_nights}</p>

  <p class="apt-rating"><i class="bi bi-star-fill"></i> ${parseFloat(currentListing.review_scores_rating || 4.8).toFixed(1)} (${currentListing.number_of_reviews || 0})</p>

  <p>${currentListing.description}</p>
`;


  const today = new Date().toISOString().split("T")[0];
  document.getElementById("startDate").setAttribute("min", today);
  document.getElementById("endDate").setAttribute("min", today);

  document
    .getElementById("rental-form")
    .addEventListener("submit", function (formSubmitEvent) {
      formSubmitEvent.preventDefault();

      const selectedStartDate = document.getElementById("startDate").value;
      const selectedEndDate = document.getElementById("endDate").value;

      if (!selectedStartDate || !selectedEndDate) return;

      if (selectedEndDate < selectedStartDate) {
        document.getElementById("result").innerText =
          "❌ Check-out date must be after check-in date.";
        return;
      }

      const start = new Date(selectedStartDate);
      const end = new Date(selectedEndDate);
      const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      if (nights < minNights) {
        document.getElementById(
          "result"
        ).innerText = `❌ Minimum stay is ${minNights} nights.`;
        return;
      }

      if (nights > maxNights) {
        document.getElementById(
          "result"
        ).innerText = `❌ Maximum stay is ${maxNights} nights.`;
        return;
      }

      if (
        !checkAvailability(
          currentListing.listing_id,
          selectedStartDate,
          selectedEndDate
        )
      ) {
        document.getElementById("result").innerText =
          "❌ These dates are already booked.";
        return;
      }

      const pricePerNight =
        parseFloat(currentListing.price.replace(/[^\d.]/g, "")) || 0;
      const total = pricePerNight * nights;

      document.getElementById("result").innerHTML = `
      <p>${currentListing.price} x ${nights} nights = $${total.toFixed(2)}</p>
      <p class="total-line">Total: $${total.toFixed(2)}</p>
    `;

      document.getElementById("summary-name").textContent = currentListing.name;
      document.getElementById("summary-start").textContent = selectedStartDate;
      document.getElementById("summary-end").textContent = selectedEndDate;
      document.getElementById("summary-nights").textContent = nights;
      document.getElementById("summary-total").textContent = total.toFixed(2);

      document.getElementById("payment-form").style.display = "block";

      document
        .getElementById("payment-form")
        .addEventListener("submit", function (e) {
          e.preventDefault();

          const currentUsername =
            localStorage.getItem("currentUser") || "guest";
          const userBookingKey = `${currentUsername}_bookings`;

          const newBookingObject = {
            listing_id: currentListing.listing_id,
            startDate: selectedStartDate,
            endDate: selectedEndDate,
            nights: nights,
            total: total.toFixed(2),
            name: currentListing.name,
          };

          const existingBookingsArray =
            JSON.parse(localStorage.getItem(userBookingKey)) || [];
          existingBookingsArray.push(newBookingObject);
          localStorage.setItem(
            userBookingKey,
            JSON.stringify(existingBookingsArray)
          );

          alert("✅ Booking confirmed!");
          window.location.href = "mybookings.html";
        });
    });
});

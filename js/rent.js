function isDateRangeOverlap(startDate1, endDate1, startDate2, endDate2) {
  return !(endDate1 < startDate2 || startDate1 > endDate2);
}

function checkAvailability(listingId, startDate, endDate) {
  const allBookingsArray = getAllBookings();

  for (let bookingIndex = 0; bookingIndex < allBookingsArray.length; bookingIndex++) {
    const bookingObject = allBookingsArray[bookingIndex];
    if (
      bookingObject.listing_id === listingId &&
      isDateRangeOverlap(startDate, endDate, bookingObject.startDate, bookingObject.endDate)
    ) {
      return false;
    }
  }

  return true;
}

window.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const currentListingId = urlParams.get("id");

  const currentListing = amsterdam.find((listingObject) => listingObject.listing_id === currentListingId);
  if (currentListing) {
    document.getElementById("listing-details").innerHTML = `
      <h2>${currentListing.name}</h2>
      <img src="${currentListing.picture_url}" alt="Listing image" width="300">
      <p>${currentListing.description}</p>
    `;
  }

  document.getElementById("rental-form").addEventListener("submit", function (formSubmitEvent) {
    formSubmitEvent.preventDefault();

    const selectedStartDate = document.getElementById("startDate").value;
    const selectedEndDate = document.getElementById("endDate").value;

    if (checkAvailability(currentListingId, selectedStartDate, selectedEndDate)) {
      const currentUsername = localStorage.getItem("currentUser");
      const userBookingKey = `${currentUsername}_bookings`;

      const newBookingObject = {
        listing_id: currentListingId,
        startDate: selectedStartDate,
        endDate: selectedEndDate,
      };

      const existingBookingsArray = JSON.parse(localStorage.getItem(userBookingKey)) || [];
      existingBookingsArray.push(newBookingObject);
      localStorage.setItem(userBookingKey, JSON.stringify(existingBookingsArray));

      document.getElementById("result").innerText = "Dates are available! Booking saved.";
    } else {
      document.getElementById("result").innerText = "These dates are already booked.";
    }
  });
});

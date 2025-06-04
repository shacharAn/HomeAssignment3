const bookingsContainer = document.getElementById("bookingsContainer");
const allCount = document.getElementById("allCount");
const upcomingCount = document.getElementById("upcomingCount");
const pastCount = document.getElementById("pastCount");
const tabs = document.querySelectorAll(".tab-btn");

const currentUsername = localStorage.getItem("currentUser") || "guest";
const bookings = JSON.parse(localStorage.getItem(`${currentUsername}_bookings`)) || [];

let activeTab = "all";

function toDateOnly(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function renderBookings() {
  bookingsContainer.innerHTML = "";

  const today = toDateOnly(new Date());

  const filtered = bookings.filter((booking) => {
    const checkIn = toDateOnly(new Date(booking.startDate));
    const checkOut = toDateOnly(new Date(booking.endDate));
    if (activeTab === "upcoming") return checkIn > today;
    if (activeTab === "past") return checkOut < today;
    return true;
  });
  filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  allCount.textContent = bookings.length;
  upcomingCount.textContent = bookings.filter(
    (b) => toDateOnly(new Date(b.startDate)) > today
  ).length;
  pastCount.textContent = bookings.filter(
    (b) => toDateOnly(new Date(b.endDate)) < today
  ).length;

  if (filtered.length === 0) {
    bookingsContainer.innerHTML = `
      <div class="empty-bookings">
        <p>No bookings to show</p>
        <p class="empty-sub">Start exploring apartments and make your first booking! ✨</p>
        <a class="browse-btn" href="index.html">🔍 Browse Apartments</a>
      </div>
    `;
    return;
  }

  filtered.forEach((booking) => {
    const checkIn = new Date(booking.startDate);
    const checkOut = new Date(booking.endDate);
    const isUpcoming = toDateOnly(checkIn) > today;
    const isPast = toDateOnly(checkOut) < today;
    const status = isUpcoming ? "Upcoming" : isPast ? "Past" : "Current";

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const apartment = window.amsterdam.find((a) => a.listing_id === booking.listing_id);
    const pricePerNight = apartment ? parseFloat(apartment.price.replace(/[^\d.]/g, "")) : 0;
    const totalPrice = nights * pricePerNight;

    const card = document.createElement("div");
    card.className = "booking-card";

    card.innerHTML = `
      <div class="booking-info">
        <h3>🏡 ${apartment?.name || "Apartment in Amsterdam"}</h3>
        <div class="booking-details">
          <p><strong>Check-in:</strong> ${booking.startDate}</p>
          <p><strong>Check-out:</strong> ${booking.endDate}</p>
          <p><strong>Nights:</strong> ${nights}</p>
          <p><strong>Total price:</strong> $${totalPrice.toFixed(2)}</p>
          <span class="badge ${status.toLowerCase()}">${status}</span>
          ${
            isUpcoming
              ? `<button class="cancel-btn" data-id="${booking.listing_id}">Cancel Booking</button>`
              : ""
          }
        </div>
      </div>
      <img class="booking-img" src="${apartment?.picture_url || "images/default.jpg"}" alt="Apartment image" />
    `;

    bookingsContainer.appendChild(card);
  });

  document.querySelectorAll(".cancel-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      cancelBooking(this.dataset.id);
    });
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    activeTab = tab.dataset.type;
    renderBookings();
  });
});

function cancelBooking(id) {
  const index = bookings.findIndex((b) => b.listing_id === id);
  if (index !== -1) {
    bookings.splice(index, 1);
    localStorage.setItem(`${currentUsername}_bookings`, JSON.stringify(bookings));
    renderBookings();
  }
}

window.addEventListener("DOMContentLoaded", renderBookings);
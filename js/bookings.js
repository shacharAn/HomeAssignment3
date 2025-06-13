document.addEventListener("DOMContentLoaded", function () {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    location.href = "login.html";
  }

  function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const mode = document.body.classList.contains("dark-mode")
      ? "dark"
      : "light";
    localStorage.setItem("theme", mode);
  }

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleDarkMode);
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  const bookingsContainer = document.getElementById("bookingsContainer");
  const allCount = document.getElementById("allCount");
  const upcomingCount = document.getElementById("upcomingCount");
  const pastCount = document.getElementById("pastCount");
  const tabs = document.querySelectorAll(".tab-btn");
  const currentUsername = currentUser; const bookings =
    JSON.parse(localStorage.getItem(`${currentUsername}_bookings`)) || [];

  let activeTab = "all";

  function toDateOnly(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  function renderBookings() {
    bookingsContainer.innerHTML = "";
    const today = toDateOnly(new Date());

    let upcomingCounter = 0;
    let pastCounter = 0;
    for (let i = 0; i < bookings.length; i++) {
      const checkIn = toDateOnly(new Date(bookings[i].startDate));
      const checkOut = toDateOnly(new Date(bookings[i].endDate));
      if (checkIn > today) upcomingCounter++;
      if (checkOut < today) pastCounter++;
    }

    allCount.textContent = bookings.length;
    upcomingCount.textContent = upcomingCounter;
    pastCount.textContent = pastCounter;

    let filtered = [];
    for (let i = 0; i < bookings.length; i++) {
      const checkIn = toDateOnly(new Date(bookings[i].startDate));
      const checkOut = toDateOnly(new Date(bookings[i].endDate));
      if (
        (activeTab === "upcoming" && checkIn > today) ||
        (activeTab === "past" && checkOut < today) ||
        activeTab === "all"
      ) {
        filtered.push(bookings[i]);
      }
    }

    filtered.sort((a, b) => {
      const aStart = new Date(a.startDate);
      const bStart = new Date(b.startDate);
      return bStart - aStart;
    });

    if (filtered.length === 0) {
      bookingsContainer.innerHTML = `
      <div class="empty-state browse-wrapper">
        <p>No bookings to show</p>
        <p class="empty-sub">Start exploring apartments and make your first booking! <i class="bi bi-stars gold-icon"></i></p>
        <button class="browse-btn" onclick="location.href='index.html'">
        <i class="bi bi-search"></i> Browse Apartments</button> </div>
    `;
      return;
    }

    for (let i = 0; i < filtered.length; i++) {
      const booking = filtered[i];
      const checkIn = new Date(booking.startDate);
      const checkOut = new Date(booking.endDate);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

      let apartment = null;
      for (let j = 0; j < amsterdam.length; j++) {
        if (amsterdam[j].listing_id === booking.listing_id) {
          apartment = amsterdam[j];
          break;
        }
      }

      let pricePerNight = 0;
      if (apartment && apartment.price) {
        let priceStr = "";
        for (let k = 0; k < apartment.price.length; k++) {
          const ch = apartment.price[k];
          if ((ch >= "0" && ch <= "9") || ch === ".") {
            priceStr += ch;
          }
        }
        pricePerNight = parseFloat(priceStr);
      }

      const totalPrice = nights * pricePerNight;
      const isUpcoming = toDateOnly(checkIn) > today;
      const isPast = toDateOnly(checkOut) < today;
      let status = "Current";
      if (isUpcoming) status = "Upcoming";
      if (isPast) status = "Past";

      const card = document.createElement("div");
      card.className = "booking-card";

      const image =
        apartment && apartment.picture_url
          ? apartment.picture_url
          : "images/default.jpg";
      const name =
        apartment && apartment.name ? apartment.name : "Apartment in Amsterdam";

      card.innerHTML = `
      <div class="booking-info">
        <h3><i class="bi bi-house-fill"></i> ${apartment?.name || "Apartment in Amsterdam"
        }</h3>
        <div class="booking-details">
          <p><strong>Check-in:</strong> ${booking.startDate}</p>
          <p><strong>Check-out:</strong> ${booking.endDate}</p>
          <p><strong>Nights:</strong> ${nights}</p>
          <p><strong>Total price:</strong> $${totalPrice.toFixed(2)}</p>
          <span class="badge ${status.toLowerCase()}">${status}</span>
          ${isUpcoming
          ? `<button class="cancel-btn" data-id="${booking.listing_id}">Cancel Booking</button>`
          : ""
        }
        </div>
      </div>
      <img class="booking-img" src="${apartment?.picture_url || "images/default.jpg"
        }" alt="Apartment image" />
    `;

      bookingsContainer.appendChild(card);
    }

    const cancelBtns = document.querySelectorAll(".cancel-btn");
    for (let i = 0; i < cancelBtns.length; i++) {
      cancelBtns[i].addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        cancelBooking(id);
      });
    }
  }

  for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function () {
      for (let j = 0; j < tabs.length; j++) {
        tabs[j].classList.remove("active");
      }
      this.classList.add("active");
      activeTab = this.getAttribute("data-type");
      renderBookings();
    });
  }

  function cancelBooking(id) {
    for (let i = 0; i < bookings.length; i++) {
      if (bookings[i].listing_id === id) {
        bookings.splice(i, 1);
        break;
      }
    }
    localStorage.setItem(
      currentUsername + "_bookings",
      JSON.stringify(bookings)
    );
    renderBookings();
  }

  const defaultTab = document.querySelector(".tab-btn[data-type='all']");
  if (defaultTab) {
    defaultTab.classList.add("active");
  }

  renderBookings();
});

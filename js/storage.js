
function saveToStorage(key, value) {
  if (typeof value === "string") {
    localStorage.setItem(key, value);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

function loadFromStorage(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

function removeFromStorage(key) {
  localStorage.removeItem(key);
}

function getCurrentUser() {
  return localStorage.getItem("currentUser");
}

function clearUserData() {
  localStorage.removeItem("currentUser");
}

function getAllBookings() {
  const bookings = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.endsWith("_bookings")) {
      const userBookings = JSON.parse(localStorage.getItem(key));
      bookings.push(...userBookings);
    }
  }
  return bookings;
}

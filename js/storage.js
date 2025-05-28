
<<<<<<< HEAD





















function getAllBookings() {
  const bookings = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.endsWith("_bookings")) {
      const userBookings = JSON.parse(localStorage.getItem(key));
      for (let j = 0; j < userBookings.length; j++) {
        bookings.push(userBookings[j]);
      }
    }
  }

  return bookings;
}
=======
>>>>>>> aca69b616f1f849c7fd564817dc0211747e864e9

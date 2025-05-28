function isDateRangeOverlap(start1, end1, start2, end2) {
  return !(end1 < start2 || start1 > end2);
}

function checkAvailability(listingId, startDate, endDate) {
  const bookings = getAllBookings();

  for (let i = 0; i < bookings.length; i++) {
    const booking = bookings[i];
    if (
      booking.listing_id === listingId &&
      isDateRangeOverlap(startDate, endDate, booking.startDate, booking.endDate)
    ) {
      return false;
    }
  }

  return true;
}

    document.addEventListener("DOMContentLoaded",function(){
    const currentUser = localStorage.getItem("currentUser");
    const Key = `${currentUser}_bookings`;
    const bookings = JSON.parse(localStorage.getItem(Key)) || [];
    const container = document.getElementById("bookingsContainer");
    if(bookings.length == 0){
        container.innerHTML = `<p class="text-muted">You have no bookings yet.</p>`;
        return;
    }

    const today = new Date();
    bookings.forEach((booking) => {
        const start = new Date(booking.startDate)
        const end = new Date(booking.endDate);
        const isFuture = end >= today;
        const card = document.createElement("div");
        card.className = "col-md-6 mb-3";
    
    card.innerHTML = `
        <div class="card ${isFuture ? 'border-success' : 'border-secondary'}">
            <div class="card-body">
                <h5 class="card-title">Listing ID: ${booking.listingId}</h5>
                <p class="card-text">
                    <strong>From:</strong> ${booking.startDate}<br>
                    <strong>To:</strong> ${booking.endDate}<br>
                    <strong>Status:</strong> ${isFuture ? '<span class="text-success">Upcoming</span>' : '<span class="text-muted">Past</span>'}
                </p>
                ${isFuture ? `<button class="btn btn-danger btn-sm cancel-btn" data-index="${index}">Cancel Booking</button>` : ''}
            </div>
        </div>`;

    container.appendChild(card);
    });

    container.addEventListener("click", function (e) {
        if (e.target.classList.contains("cancel-btn")) {
            const indexToRemove = parseInt(e.target.getAttribute("data-index"));
            bookings.splice(indexToRemove, 1); 
            localStorage.setItem(Key, JSON.stringify(bookings)); 
            const cardToRemove = e.target.closest(".col-md-6");
    if (cardToRemove) {
        cardToRemove.remove();
    }

    alert("Booking cancelled.");

    if (bookings.length === 0) {
        container.innerHTML = `<p class="text-muted">You have no bookings yet.</p>`;
    }
    }
});
});
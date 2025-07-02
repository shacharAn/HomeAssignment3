# Additions to the Project
This file describes the optional features that were implemented in our apartment rental system, as per the "additions.md" requirement.

## Map Integration
**Feature:** Display apartment location using Google Maps or Leaflet  
**Implementation:**  
We integrated **Leaflet.js** to show the location of each apartment on a dynamic map:
- On the `rent.html` page, the map is displayed below the apartment information.
- The map centers on the apartment's coordinates (predefined or simulated).
- A marker is added to indicate the apartment’s location.

## Calendar Datepicker
**Feature:** Use of Datepicker to display available/unavailable dates  
**Implementation:**  
A calendar (Datepicker) was used to enhance date selection for apartment booking:
- We used the native HTML5 `input type="date"` field for selecting start and end dates.
- Date availability was validated using JavaScript logic that checks existing bookings stored in `localStorage`.
- Blocked or overlapping date ranges are prevented during booking using the `isDateRangeOverlap` function.


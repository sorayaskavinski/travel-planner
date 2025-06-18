// scripts/storage.js
const ITINERARY_KEY = 'itineraries'; // use this key consistently

// Save a new itinerary to localStorage
export function saveItinerary(itinerary) {
  const existing = JSON.parse(localStorage.getItem(ITINERARY_KEY) || '[]');
  existing.push(itinerary);
  localStorage.setItem(ITINERARY_KEY, JSON.stringify(existing));
}

// Get all saved itineraries
export function getItineraries() {
  return JSON.parse(localStorage.getItem(ITINERARY_KEY) || '[]');
}

// Clear all saved itineraries
export function clearItineraries() {
  localStorage.removeItem(ITINERARY_KEY);
}

// Download a specific itinerary as a JSON file
export function downloadItinerary(itinerary) {
  const blob = new Blob([JSON.stringify(itinerary, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `itinerary-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

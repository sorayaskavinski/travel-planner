import { fetchCities, fetchRestaurants, fetchEvents } from './api.js';
import { saveItinerary, getItineraries, clearItineraries, downloadItinerary } from './storage.js';

//===========================//
//       DOM Elements        //
//===========================//

// Search elements
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const results = document.getElementById('results');
const dateInput = document.getElementById('dateInput');

// Filters
const ratingFilter = document.getElementById('filterRating');
const priceFilter = document.getElementById('filterPrice');
const applyRestaurantFiltersBtn = document.getElementById('applyRestaurantFilters');
const eventCategoryFilter = document.getElementById('filterEventCategory');
const applyEventFiltersBtn = document.getElementById('applyEventFilters');

// Display containers
const restaurantContainer = document.getElementById('restaurants');
const eventContainer = document.getElementById('events');

// Itinerary elements
const itineraryList = document.getElementById('itineraryList');
const savedSection = document.getElementById('savedItineraries');
const downloadSelectedBtn = document.getElementById('downloadSelected');
const clearAllBtn = document.getElementById('clearAllItineraries');

// Desktop and Mobile buttons
const saveItineraryBtnDesktop = document.getElementById('saveItineraryBtnDesktop');
const saveItineraryBtnMobile = document.getElementById('saveItineraryBtnMobile');
const viewItinerariesBtnDesktop = document.getElementById('viewItinerariesBtnDesktop');
const viewItinerariesBtnMobile = document.getElementById('viewItinerariesBtnMobile');

// Toggle menu
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

//===========================//
//         Global Data       //
//===========================//
let allRestaurants = [];
let currentRestaurants = [];
let allEvents = [];
let currentEvents = [];
let selectedCity = null;
let selectedRestaurant = null;
let selectedEvent = null;

//===========================//
//         Functions         //
//===========================//

function renderItems(items, container, type) {
  container.innerHTML = '';

  if (!Array.isArray(items) || items.length === 0) {
    container.innerHTML = `<p>😕 No ${type} found.</p>`;
    return;
  }

  const title = type === 'restaurants' ? '🍽️ Recommended Restaurants:' : '🎭 Events:';
  container.innerHTML = `<h4>${title}</h4>` + items.map(item => {
    return type === 'restaurants' ? `
      <div class="restaurant-card">
        <img src="${item.image}" alt="${item.name}" width="100" />
        <p>
          <strong><a href="${item.url}" target="_blank">${item.name}</a></strong><br/>
          ${item.address}<br/>
          ⭐ ${item.rating} (${item.review_count} reviews) ${item.price ? '– ' + item.price : ''}<br/>
          📞 ${item.phone}<br/>
          ${item.is_closed ? '<span style="color:red">Closed</span>' : '<span style="color:green">Open</span>'}
        </p>
      </div>
    ` : `
      <div class="event-card">
        <img src="${item.image}" alt="${item.name}" width="100" />
        <p>
          <strong><a href="${item.url}" target="_blank">${item.name}</a></strong><br/>
          📅 ${item.date} ${item.time ? 'at ' + item.time : ''}<br/>
          📍 ${item.venue}, ${item.address}, ${item.city}, ${item.country}<br/>
          🎫 Category: ${item.category}
        </p>
      </div>
    `;
  }).join('');
}

function applyRestaurantFilters() {
  const rating = parseFloat(ratingFilter.value);
  const price = priceFilter.value;

  const filtered = allRestaurants.filter(r => {
    const matchRating = rating ? r.rating >= rating : true;
    const matchPrice = price ? r.price === price : true;
    return matchRating && matchPrice;
  });

  currentRestaurants = filtered;
  renderItems(filtered, restaurantContainer, 'restaurants');
}

function applyEventFilters() {
  const category = eventCategoryFilter.value.toLowerCase();

  const filtered = allEvents.filter(e =>
    category ? e.category.toLowerCase().includes(category) : true
  );

  currentEvents = filtered;
  renderItems(filtered, eventContainer, 'events');
}

function handleCitySelection(city, country) {
  selectedCity = { city, country };
  cityInput.value = `${city}, ${country}`;
  results.innerHTML = '';
  document.getElementById('extras').style.display = 'block';
}

function handleSaveItinerary() {
  if (!selectedCity) {
    alert('Please select a city before saving.');
    return;
  }

  const itinerary = {
    city: selectedCity,
    restaurant: selectedRestaurant || null,
    event: selectedEvent || null,
    date: dateInput.value || '',
    savedAt: new Date().toISOString()
  };

  saveItinerary(itinerary);
  alert('Itinerary saved successfully!');
}

function handleViewItineraries() {
  const itineraries = getItineraries();
  itineraryList.innerHTML = '';

  if (itineraries.length === 0) {
    itineraryList.innerHTML = '<p>No itineraries saved yet.</p>';
    return;
  }

  savedSection.style.display = 'block';

  itineraries.forEach((itinerary, index) => {
    itineraryList.innerHTML += `
      <div class="itinerary-card" data-index="${index}">
        <p><strong>City:</strong> ${itinerary.city?.city}, ${itinerary.city?.country}</p>
        <p><strong>Restaurant:</strong> ${itinerary.restaurant?.name || 'N/A'}</p>
        <p><strong>Event:</strong> ${itinerary.event?.name || 'N/A'}</p>
        <input type="radio" name="selectedItinerary" value="${index}"> Select
        <hr/>
      </div>
    `;
  });
}

//===========================//
//         Listeners         //
//===========================//

// City Search
searchBtn.addEventListener('click', async () => {
  const query = cityInput.value.trim();
  if (!query) return;

  const cities = await fetchCities(query);

  results.innerHTML = cities.length ? cities.map(city => `
    <div class="result-item" data-city="${city.name}" data-country="${city.countryCode}">
      <p><strong>${city.name}</strong> <small>(${city.countryCode})</small></p>
    </div>
  `).join('') : '<p>No results found.</p>';
});

// City Click
results.addEventListener('click', async (event) => {
  const item = event.target.closest('.result-item');
  if (!item) return;

  const city = item.getAttribute('data-city');
  const country = item.getAttribute('data-country');

  handleCitySelection(city, country);

  allRestaurants = await fetchRestaurants(city, country);
  currentRestaurants = allRestaurants;
  renderItems(allRestaurants, restaurantContainer, 'restaurants');
});

// Date Change - Fetch Events
dateInput.addEventListener('change', async () => {
  const selectedDate = dateInput.value;
  const [city, country] = cityInput.value.split(',').map(s => s.trim());

  if (!city || !country || !selectedDate) {
    alert('Please select city, country, and date.');
    return;
  }

  allEvents = await fetchEvents(city, country, selectedDate);
  currentEvents = allEvents;
  renderItems(allEvents, eventContainer, 'events');
});

// Apply Filters
applyRestaurantFiltersBtn.addEventListener('click', applyRestaurantFilters);
applyEventFiltersBtn.addEventListener('click', applyEventFilters);

// Restaurant selection
restaurantContainer.addEventListener('click', (e) => {
  const card = e.target.closest('.restaurant-card');
  if (card) {
    const link = card.querySelector('a');
    const img = card.querySelector('img');
    selectedRestaurant = {
      name: link.innerText,
      url: link.href,
      address: card.innerHTML.match(/<br\/>(.*?)<br\/>/)?.[1]?.trim() || '',
      image: img?.src || '',
    };
  }
});

// Event selection
eventContainer.addEventListener('click', (e) => {
  const card = e.target.closest('.event-card');
  if (card) {
    const link = card.querySelector('a');
    const img = card.querySelector('img');
    selectedEvent = {
      name: link.innerText,
      url: link.href,
      date: card.innerHTML.match(/📅 (.*?)<br\/>/)?.[1]?.trim() || '',
      location: card.innerHTML.match(/📍 (.*?)<br\/>/)?.[1]?.trim() || '',
      category: card.innerHTML.match(/🎫 Category: (.*?)<\/p>/)?.[1]?.trim() || '',
      image: img?.src || '',
    };
  }
});

// Save Itinerary (Desktop and Mobile)
saveItineraryBtnDesktop.addEventListener('click', handleSaveItinerary);
saveItineraryBtnMobile.addEventListener('click', handleSaveItinerary);

// View Itineraries (Desktop and Mobile)
viewItinerariesBtnDesktop.addEventListener('click', handleViewItineraries);
viewItinerariesBtnMobile.addEventListener('click', handleViewItineraries);

// Download selected itinerary
downloadSelectedBtn.addEventListener('click', () => {
  const selected = document.querySelector('input[name="selectedItinerary"]:checked');
  if (!selected) {
    alert('Please select an itinerary to download.');
    return;
  }

  const itineraries = getItineraries();
  const index = parseInt(selected.value);
  downloadItinerary(itineraries[index]);
});

// Clear all itineraries
clearAllBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all saved itineraries?')) {
    clearItineraries();
    itineraryList.innerHTML = '<p>All itineraries cleared.</p>';
  }
});

// Toggle Menu
menuToggle?.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

//===========================//
//      Restore on Load      //
//===========================//
window.addEventListener('DOMContentLoaded', () => {
  const itineraries = getItineraries();
  if (itineraries && itineraries.length > 0) {
    const view = confirm(`You have ${itineraries.length} saved itinerary(ies). View now?`);
    if (view) {
      savedSection.style.display = 'block';
      handleViewItineraries();
    }
  }
});

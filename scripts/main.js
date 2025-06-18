import { fetchCities, fetchRestaurants, fetchEvents } from './api.js';

// DOM Elements
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const results = document.getElementById('results');
const dateInput = document.getElementById('dateInput');
const ratingFilter = document.getElementById('filterRating');
const priceFilter = document.getElementById('filterPrice');
const applyRestaurantFiltersBtn = document.getElementById('applyRestaurantFilters');
const eventCategoryFilter = document.getElementById('filterEventCategory');
const applyEventFiltersBtn = document.getElementById('applyEventFilters');
const restaurantContainer = document.getElementById('restaurants');
const eventContainer = document.getElementById('events');


// Global Data
let allRestaurants = [];
let currentRestaurants = [];
let allEvents = [];
let currentEvents = [];

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
          <strong><a href="${item.url}" target="_blank" class="restaurant-link">${item.name}</a></strong><br/>
          ${item.address}<br/>
          ⭐ ${item.rating} (${item.review_count} reviews) ${item.price ? '– ' + item.price : ''}<br/>
          📞 ${item.phone}<br/>
          ${item.is_closed ? '<span style="color:red">Closed</span>' : '<span style="color:green">Open</span>'} <br/>
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
  cityInput.value = `${city}, ${country}`;
  results.innerHTML = '';
  document.getElementById('extras').style.display = 'block';
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












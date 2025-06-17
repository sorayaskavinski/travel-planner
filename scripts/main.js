import { fetchCities, fetchRestaurants } from './api.js';

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const results = document.getElementById('results');

searchBtn.addEventListener('click', async () => {
  const query = cityInput.value.trim();
  if (!query) return;

  const cities = await fetchCities(query);

  if (cities.length) {
    results.innerHTML = cities.map(city => `
      <div class="result-item" data-city="${city.name}" data-country="${city.countryCode}">
        <p><strong>${city.name}</strong> <small>(${city.countryCode})</small></p>
      </div>
    `).join('');
  } else {
    results.innerHTML = '<p>No results found.</p>';
  }

  //get restaurants
  const items = document.querySelectorAll('.result-item');
  items.forEach(item => {
    item.addEventListener('click', async () => {
      const city = item.getAttribute('data-city');
      const country = item.getAttribute('data-country');

      cityInput.value = `${city}, ${country}`;
      results.innerHTML = '';
      alert(`You've selected: ${city}, ${country}`);

      document.getElementById('extras').style.display = 'block';

      const restaurants = await fetchRestaurants(city, country);
      renderRestaurants(restaurants);

      function renderRestaurants(restaurants) {
      const container = document.getElementById('restaurants');
      container.innerHTML = "<h4>🍽️ Recommended Restaurants:</h4>" +
        restaurants.map(r => `
          <div class="restaurant-card">
            <img src="${r.image}" alt="${r.name}" width="100" />
            <p><strong>${r.name}</strong><br/>
            ${r.address}<br/>
            ⭐ ${r.rating} – <a href="${r.url}" target="_blank">See on Yelp</a></p>
          </div>
        `).join('');
    }

    });
  });
});

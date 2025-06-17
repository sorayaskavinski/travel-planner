import { fetchCities } from './api.js';

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const results = document.getElementById('results');

searchBtn.addEventListener('click', async () => {
  const query = cityInput.value.trim();
  if (!query) return;

  const cities = await fetchCities(query);

  if (cities.length) {
    results.innerHTML = cities.map(city => `
      <div class="result-item" data-city="${city.city}" data-country="${city.country}">
        <p><strong>${city.city}</strong>, ${city.country}</p>
      </div>
    `).join('');
  } else {
    results.innerHTML = '<p>No results found.</p>';
  }

  // ➕ Adding and event listener
  const items = document.querySelectorAll('.result-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      const city = item.getAttribute('data-city');
      const country = item.getAttribute('data-country');
      alert(`You've selected: ${city}, ${country}`);
      
      cityInput.value = `${city}, ${country}`;
      results.innerHTML = '';
    });
  });
});

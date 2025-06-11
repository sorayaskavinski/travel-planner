import { fetchCities } from './api.js';

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const results = document.getElementById('results');

searchBtn.addEventListener('click', async () => {
  const query = cityInput.value.trim();
  if (!query) return;

  const cities = await fetchCities(query);
  results.innerHTML = cities.length
    ? cities.map(city => `<p>${city.city}, ${city.country}</p>`).join('')
    : '<p>No results found.</p>';
});

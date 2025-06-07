const javascriptLogo = './javascript.svg';
const viteLogo = '/vite.svg';
import { setupCounter } from './counter.js';
import { fetchCities } from './api.js';

const app = document.querySelector('#app'); 
app.innerHTML=` 
    <a href="https://vite.dev" target="_blank">
    <img src="${viteLogo}" class="logo" alt="Vite logo" />
  </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
    <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
  </a>
`;


setupCounter(document.querySelector('#counter'))

document.addEventListener('DOMContentLoaded', async () => {
  const cities = await fetchCities('Paris');
  console.log(cities); 
});
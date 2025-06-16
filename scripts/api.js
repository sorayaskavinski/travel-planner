const GEO_API_URL = import.meta.env.VITE_GEO_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const API_HOST = import.meta.env.VITE_API_HOST;
console.log(GEO_API_URL); 


export async function fetchCities(query) {
  try {
    const response = await fetch(`${GEO_API_URL}?namePrefix=${query}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST,
      },
    });

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error while searching cities: ', error);
    return [];
  }
}

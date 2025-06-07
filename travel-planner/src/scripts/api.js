const GEO_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities';
const API_KEY = '706db45873mshfbc21bddaf47f67p1d89f9jsn62c3df8b1009'; 

export async function fetchCities(query) {
  try {
    const response = await fetch(`${GEO_API_URL}?namePrefix=${query}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      }
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Erro ao buscar cidades:", error);
    return [];
  }
}

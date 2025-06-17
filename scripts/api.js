export async function fetchCities(query) {
  try {
    const response = await fetch(`/.netlify/functions/getCities?namePrefix=${query}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error while searching cities: ", error);
    return [];
  }
}

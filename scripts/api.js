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

//restaurant API
export async function fetchRestaurants(city, country) {
  try {
    const response = await fetch(`/.netlify/functions/getRestaurants?city=${city}&country=${country}`);
    const data = await response.json();
    return data.restaurants || [];
  } catch (err) {
    console.error("Error at searching restaurants", err);
    return [];
  }
}

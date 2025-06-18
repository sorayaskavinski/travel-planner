// Fetch Cities
export async function fetchCities(query) {
  try {
    const response = await fetch(`/.netlify/functions/getCities?namePrefix=${encodeURIComponent(query)}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("❌ Error fetching cities:", error);
    return [];
  }
}

// Fetch Restaurants
export async function fetchRestaurants(city, country) {
  try {
    const url = `/.netlify/functions/getRestaurants?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.restaurants || [];
  } catch (error) {
    console.error("❌ Error fetching restaurants:", error);
    return [];
  }
}

// Fetch Events
export async function fetchEvents(city, country, date) {
  try {
    const url = `/.netlify/functions/getEvents?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&date=${encodeURIComponent(date)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error("❌ Error fetching events:", error);
    return [];
  }
}

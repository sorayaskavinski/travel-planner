exports.handler = async (event) => {
  const query = event.queryStringParameters.namePrefix;
  const username = process.env.GEONAMES_USERNAME;

  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing namePrefix parameter" }),
    };
  }

  const url = `https://secure.geonames.org/searchJSON?name_startsWith=${encodeURIComponent(query)}&maxRows=10&featureClass=P&orderby=population&username=${username}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.geonames) {
      return {
        statusCode: 200,
        body: JSON.stringify([]),
      };
    }

    
    const cities = data.geonames.map(city => ({
      name: city.name,
      countryCode: city.countryCode,
      lat: city.lat,
      lng: city.lng,
      population: city.population,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(cities),
    };
  } catch (error) {
    console.error("GeoNames API error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching cities" }),
    };
  }
};

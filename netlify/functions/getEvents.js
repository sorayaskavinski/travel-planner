exports.handler = async (event) => {
  const { city, country, date } = event.queryStringParameters;

  if (!city || !country || !date) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required parameters: city, country, or date" }),
    };
  }

  const startDate = `${date}T00:00:00Z`;
  const endDate = `${date}T23:59:59Z`;

  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.TICKETMASTER_API_KEY}&city=${encodeURIComponent(city)}&countryCode=${encodeURIComponent(country)}&startDateTime=${startDate}&endDateTime=${endDate}&size=20`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Ticketmaster API Error: ${response.statusText}`);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Failed to fetch from Ticketmaster API" }),
      };
    }

    const data = await response.json();

    const events = (data._embedded?.events || []).map(e => ({
      id: e.id,
      name: e.name,
      url: e.url,
      date: e.dates?.start?.localDate || '',
      time: e.dates?.start?.localTime || '',
      image: e.images?.[0]?.url || '',
      venue: e._embedded?.venues?.[0]?.name || '',
      address: e._embedded?.venues?.[0]?.address?.line1 || '',
      city: e._embedded?.venues?.[0]?.city?.name || '',
      country: e._embedded?.venues?.[0]?.country?.name || '',
      category: e.classifications?.[0]?.segment?.name || 'General',
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ events }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};

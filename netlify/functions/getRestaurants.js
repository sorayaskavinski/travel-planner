exports.handler = async (event) => {
  const { city, country } = event.queryStringParameters;

  const location = `${city}, ${country}`;
  const url = `https://yelp-business-api.p.rapidapi.com/search?location=${encodeURIComponent(location)}&search_term=restaurants&limit=10&offset=0&business_details_type=basic`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.YELP_API_KEY,
      'X-RapidAPI-Host': 'yelp-business-api.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    const businesses = data.business_search_result;

    const restaurants = (businesses || []).map(b => ({
      id: b.id,
      name: b.name,
      address: `${b.address1}, ${b.city}, ${b.state} ${b.zip}`,
      rating: b.avg_rating,
      review_count: b.review_count,
      price: b.localized_price || '',
      image: b.photo_url,
      url: `https://www.yelp.com/biz/${b.alias}`,
      phone: b.localized_phone || '',
      is_closed: b.is_closed
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ restaurants }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

  } catch (error) {
    console.error("Error fetching from Yelp API:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch restaurants" }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};

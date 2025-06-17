exports.handler = async (event) => {
  const { city, country } = event.queryStringParameters;

  const url = `https://yelp-business-api.p.rapidapi.com/businesses/search?location=${encodeURIComponent(city + ', ' + country)}&term=restaurants&limit=10`;

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

        const restaurants = data.businesses?.map(biz => ({
            id: biz.id,
            name: biz.name,
            rating: biz.rating,
            address: biz.location?.display_address?.join(', '),
            url: biz.url,
            image: biz.image_url
        })) || [];

        return {
            statusCode: 200,
            body: JSON.stringify({ restaurants })
        };
        } catch (err) {
        console.error("Yelp fetch failed:", err);  
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message || "Unknown error" }) 
        };
    };
};

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event) => {
  const { namePrefix } = event.queryStringParameters;

  const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${namePrefix}&limit=10`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '706db45873mshfbc21bddaf47f67p1d89f9jsn62c3df8b1009',
      'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error while fetching cities', details: error.message })
    };
  }
};

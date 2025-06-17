exports.handler = async (event) => { 
  
  const query = event.queryStringParameters.namePrefix;
  

  const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.GEO_API_KEY,
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
      body: JSON.stringify({ error: 'Failed fetching data' })
    };
  }
};

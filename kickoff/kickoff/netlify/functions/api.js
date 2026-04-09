exports.handler = async function(event) {
  const API_KEY = '236ca5027f10499b83d53864805c1e4a';
  const BASE    = 'https://api.football-data.org/v4';

  // path comes in as ?path=/competitions/PL/matches
  const path = event.queryStringParameters?.path;
  if (!path) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing path param' }) };
  }

  try {
    const response = await fetch(BASE + path, {
      headers: { 'X-Auth-Token': API_KEY }
    });
    const data = await response.json();
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};

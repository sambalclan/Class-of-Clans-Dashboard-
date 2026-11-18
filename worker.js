// worker.js — supports only /clan (and /api/clan)

const BASE = 'https://cocproxy.royaleapi.dev/v1';
const TAG = '#2RVRP900V';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store'
};

const json = (value, status = 200) => new Response(
  JSON.stringify(value),
  {
    status,
    headers: {
      ...CORS,
      'Content-Type': 'application/json; charset=utf-8'
    }
  }
);

const message = e => String(e?.message || e);

// Ask the Clash of Clans API for the clan
async function getClan(env) {
  const response = await fetch(
    `${BASE}/clans/${encodeURIComponent(TAG)}`,
    {
      headers: {
        Authorization: `Bearer ${env.COC_API_TOKEN}`,
        Accept: 'application/json'
      },
      signal: AbortSignal.timeout(15000)
    }
  );

  if (!response.ok) {
    const body = await response.text();
    const error = new Error(
      `CoC ${response.status}: ${body.slice(0, 150)}`
    );
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (request.method !== 'GET') {
      return json({ error: 'Method not allowed' }, 405);
    }

    const path =
      new URL(request.url).pathname.replace(/\/$/, '') || '/';

    if (path !== '/clan' && path !== '/api/clan') {
      return json({ error: 'Not found' }, 404);
    }

    if (!env.COC_API_TOKEN) {
      return json({ error: 'COC_API_TOKEN missing' }, 500);
    }

    try {
      return json(await getClan(env));
    } catch (error) {
      console.error('Clan request failed', error);
      return json(
        { error: 'Request failed', detail: message(error) },
        error.status || 500
      );
    }
  }
};

const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
};

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return json(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secret) {
    return json(res, 503, { ok: false, error: 'SUPABASE_NOT_CONFIGURED' });
  }

  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/applications?select=id&limit=1`, {
      headers: {
        apikey: secret,
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('Supabase health check failed', response.status, detail.slice(0, 500));
      return json(res, 502, { ok: false, error: 'SUPABASE_UNREACHABLE' });
    }

    return json(res, 200, { ok: true, database: 'connected' });
  } catch (error) {
    console.error('Supabase health exception', error);
    return json(res, 502, { ok: false, error: 'SUPABASE_UNREACHABLE' });
  }
};

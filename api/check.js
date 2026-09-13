const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
};

const validWallet = (value) => /^0x[a-fA-F0-9]{40}$/.test(String(value || '').trim());
const publicStatuses = new Set(['PENDING', 'GTD', 'FCFS', 'NOT_SELECTED']);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !secret) {
    return json(res, 503, { ok: false, error: 'SUPABASE_NOT_CONFIGURED' });
  }

  const wallet = String(req.body?.wallet || '').trim().toLowerCase();
  if (!validWallet(wallet)) {
    return json(res, 400, { ok: false, error: 'INVALID_WALLET' });
  }

  try {
    const base = supabaseUrl.replace(/\/$/, '');
    const url = `${base}/rest/v1/applications?select=status&wallet=eq.${encodeURIComponent(wallet)}&limit=1`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: secret,
        Accept: 'application/json'
      },
      cache: 'no-store'
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      console.error('Supabase checker query failed', response.status, JSON.stringify(data).slice(0, 1000));
      return json(res, 502, { ok: false, error: 'DATABASE_READ_FAILED' });
    }

    const row = Array.isArray(data) ? data[0] : null;
    if (!row) {
      return json(res, 200, { ok: true, found: false, status: 'NOT_FOUND' });
    }

    const status = publicStatuses.has(row.status) ? row.status : 'PENDING';
    return json(res, 200, { ok: true, found: true, status });
  } catch (error) {
    console.error('Whitelist checker exception', error);
    return json(res, 502, { ok: false, error: 'DATABASE_READ_FAILED' });
  }
};

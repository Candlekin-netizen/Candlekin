const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
};

const validX = (value) => /^@?[A-Za-z0-9_]{1,15}$/.test(String(value || '').trim());
const validWallet = (value) => /^0x[a-fA-F0-9]{40}$/.test(String(value || '').trim());

const validSharedPost = (value, xUsername) => {
  try {
    const u = new URL(String(value || '').trim());
    const host = u.hostname.toLowerCase().replace(/^www\./, '');
    const match = u.pathname.match(/^\/([^/]+)\/status\/(\d+)/i);
    const handle = String(xUsername || '').trim().replace(/^@/, '').toLowerCase();
    return (host === 'x.com' || host === 'twitter.com')
      && Boolean(match)
      && Boolean(handle)
      && match[1].toLowerCase() === handle;
  } catch {
    return false;
  }
};

const validAnswers = (answers) => Array.isArray(answers)
  && answers.length === 6
  && answers.every((value) => Number.isInteger(value) && value >= 0 && value <= 3);

const signalFromAnswers = (answers) => {
  const map = ['00', '01', '10', '11'];
  const raw = answers.map((answer) => map[answer]).join('');
  return raw.replace(/^(.{4})(.{4})(.{4})$/, '$1 $2 $3');
};

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

  const body = req.body || {};
  const xUsername = String(body.x_username || '').trim();
  const wallet = String(body.wallet || '').trim();
  const sharedPostUrl = String(body.shared_post_url || '').trim();
  const answers = body.answers;

  if (!validX(xUsername)) {
    return json(res, 400, { ok: false, error: 'INVALID_X_USERNAME' });
  }
  if (!validWallet(wallet)) {
    return json(res, 400, { ok: false, error: 'INVALID_WALLET' });
  }
  if (!validAnswers(answers)) {
    return json(res, 400, { ok: false, error: 'INVALID_ANSWERS' });
  }
  if (!validSharedPost(sharedPostUrl, xUsername)) {
    return json(res, 400, { ok: false, error: 'INVALID_SHARED_POST_URL' });
  }

  const payload = {
    x_username: xUsername.startsWith('@') ? xUsername.toLowerCase() : `@${xUsername.toLowerCase()}`,
    wallet: wallet.toLowerCase(),
    answers,
    genesis_signal: signalFromAnswers(answers),
    shared_post_url: sharedPostUrl
  };

  try {
    const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/applications`, {
      method: 'POST',
      headers: {
        apikey: secret,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => null);

    if (response.status === 409) {
      return json(res, 409, {
        ok: false,
        error: 'DUPLICATE_APPLICATION',
        message: 'This wallet or X username has already applied.'
      });
    }

    if (!response.ok) {
      console.error('Supabase insert failed', response.status, JSON.stringify(data).slice(0, 1000));
      return json(res, 502, { ok: false, error: 'DATABASE_WRITE_FAILED' });
    }

    const row = Array.isArray(data) ? data[0] : data;
    return json(res, 201, {
      ok: true,
      application: {
        id: row?.id || null,
        genesis_signal: row?.genesis_signal || payload.genesis_signal,
        status: row?.status || 'PENDING',
        created_at: row?.created_at || null
      }
    });
  } catch (error) {
    console.error('Whitelist submission exception', error);
    return json(res, 502, { ok: false, error: 'DATABASE_WRITE_FAILED' });
  }
};

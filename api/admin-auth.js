const crypto = require('crypto');

const COOKIE_NAME = 'ck_admin';
const SESSION_SECONDS = 60 * 60 * 12;

const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
};

const safeEqual = (a, b) => {
  const aa = Buffer.from(String(a || ''));
  const bb = Buffer.from(String(b || ''));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
};

const parseCookies = (req) => Object.fromEntries(
  String(req.headers.cookie || '').split(';').map(v => v.trim()).filter(Boolean).map(v => {
    const i = v.indexOf('=');
    return [v.slice(0, i), decodeURIComponent(v.slice(i + 1))];
  })
);

const signingKey = () => process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
const sign = (value) => crypto.createHmac('sha256', signingKey()).update(value).digest('hex');

const makeToken = () => {
  const exp = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = String(exp);
  return `${payload}.${sign(payload)}`;
};

const validToken = (token) => {
  if (!signingKey() || !token || !token.includes('.')) return false;
  const [exp, signature] = token.split('.');
  if (!/^\d+$/.test(exp) || Number(exp) <= Math.floor(Date.now() / 1000)) return false;
  return safeEqual(signature, sign(exp));
};

module.exports = async function handler(req, res) {
  const configured = Boolean(process.env.ADMIN_PASSWORD && signingKey());

  if (req.method === 'GET') {
    const token = parseCookies(req)[COOKIE_NAME];
    return json(res, 200, { ok: true, configured, authenticated: configured && validToken(token) });
  }

  if (req.method === 'POST') {
    if (!configured) return json(res, 503, { ok: false, error: 'ADMIN_NOT_CONFIGURED' });
    const password = String(req.body?.password || '');
    if (!safeEqual(password, process.env.ADMIN_PASSWORD)) {
      return json(res, 401, { ok: false, error: 'INVALID_PASSWORD' });
    }
    const token = makeToken();
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`);
    return json(res, 200, { ok: true, authenticated: true });
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
    return json(res, 200, { ok: true });
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  return json(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
};

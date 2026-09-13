const crypto = require('crypto');

const COOKIE_NAME = 'ck_admin';
const VALID_STATUSES = new Set(['PENDING', 'GTD', 'FCFS', 'NOT_SELECTED']);

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

const authenticated = (req) => {
  const token = parseCookies(req)[COOKIE_NAME];
  if (!signingKey() || !token || !token.includes('.')) return false;
  const [exp, signature] = token.split('.');
  if (!/^\d+$/.test(exp) || Number(exp) <= Math.floor(Date.now() / 1000)) return false;
  return safeEqual(signature, sign(exp));
};

const uuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
const baseUrl = () => String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
const headers = (extra = {}) => ({ apikey: process.env.SUPABASE_SECRET_KEY, ...extra });

const countFor = async (status) => {
  const response = await fetch(`${baseUrl()}/rest/v1/applications?select=id&status=eq.${status}`, {
    method: 'HEAD',
    headers: headers({ Prefer: 'count=exact' })
  });
  const range = response.headers.get('content-range') || '';
  const match = range.match(/\/(\d+|\*)$/);
  return match && match[1] !== '*' ? Number(match[1]) : 0;
};

module.exports = async function handler(req, res) {
  if (!process.env.ADMIN_PASSWORD) return json(res, 503, { ok: false, error: 'ADMIN_NOT_CONFIGURED' });
  if (!authenticated(req)) return json(res, 401, { ok: false, error: 'UNAUTHORIZED' });
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return json(res, 503, { ok: false, error: 'SUPABASE_NOT_CONFIGURED' });
  }

  if (req.method === 'GET') {
    try {
      const host = req.headers.host || 'localhost';
      const u = new URL(req.url, `https://${host}`);
      const status = String(u.searchParams.get('status') || 'ALL').toUpperCase();
      const rawQ = String(u.searchParams.get('q') || '').trim();
      const q = rawQ.replace(/[^A-Za-z0-9_@.\-]/g, '').slice(0, 64);
      const offset = Math.max(0, Number.parseInt(u.searchParams.get('offset') || '0', 10) || 0);
      const limit = Math.min(200, Math.max(20, Number.parseInt(u.searchParams.get('limit') || '100', 10) || 100));

      const params = new URLSearchParams();
      params.set('select', 'id,x_username,wallet,genesis_signal,shared_post_url,status,created_at,updated_at');
      params.set('order', 'created_at.desc');
      if (VALID_STATUSES.has(status)) params.set('status', `eq.${status}`);
      if (q) params.set('or', `(x_username.ilike.*${q}*,wallet.ilike.*${q}*)`);

      const response = await fetch(`${baseUrl()}/rest/v1/applications?${params.toString()}`, {
        headers: headers({ Prefer: 'count=exact', Range: `${offset}-${offset + limit - 1}`, 'Range-Unit': 'items' })
      });
      const rows = await response.json().catch(() => null);
      if (!response.ok) {
        console.error('Admin list failed', response.status, JSON.stringify(rows).slice(0, 800));
        return json(res, 502, { ok: false, error: 'DATABASE_READ_FAILED' });
      }

      const range = response.headers.get('content-range') || '';
      const match = range.match(/\/(\d+|\*)$/);
      const total = match && match[1] !== '*' ? Number(match[1]) : (Array.isArray(rows) ? rows.length : 0);
      const [pending, gtd, fcfs, notSelected] = await Promise.all([
        countFor('PENDING'), countFor('GTD'), countFor('FCFS'), countFor('NOT_SELECTED')
      ]);

      return json(res, 200, {
        ok: true,
        rows: Array.isArray(rows) ? rows : [],
        total,
        offset,
        limit,
        summary: { PENDING: pending, GTD: gtd, FCFS: fcfs, NOT_SELECTED: notSelected }
      });
    } catch (error) {
      console.error('Admin list exception', error);
      return json(res, 502, { ok: false, error: 'DATABASE_READ_FAILED' });
    }
  }

  if (req.method === 'PATCH') {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(String) : [];
    const status = String(req.body?.status || '').toUpperCase();
    if (!VALID_STATUSES.has(status)) return json(res, 400, { ok: false, error: 'INVALID_STATUS' });
    if (!ids.length || ids.length > 250 || ids.some(id => !uuid(id))) {
      return json(res, 400, { ok: false, error: 'INVALID_IDS' });
    }

    try {
      const response = await fetch(`${baseUrl()}/rest/v1/applications?id=in.(${ids.join(',')})`, {
        method: 'PATCH',
        headers: headers({ 'Content-Type': 'application/json', Prefer: 'return=representation' }),
        body: JSON.stringify({ status, updated_at: new Date().toISOString() })
      });
      const rows = await response.json().catch(() => null);
      if (!response.ok) {
        console.error('Admin update failed', response.status, JSON.stringify(rows).slice(0, 800));
        return json(res, 502, { ok: false, error: 'DATABASE_UPDATE_FAILED' });
      }
      return json(res, 200, { ok: true, updated: Array.isArray(rows) ? rows.length : ids.length, status });
    } catch (error) {
      console.error('Admin update exception', error);
      return json(res, 502, { ok: false, error: 'DATABASE_UPDATE_FAILED' });
    }
  }

  res.setHeader('Allow', 'GET, PATCH');
  return json(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
};

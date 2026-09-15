const crypto = require('crypto');

const COOKIE_NAME = 'ck_admin';

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

const validToken = (token) => {
  if (!signingKey() || !token || !token.includes('.')) return false;
  const [exp, signature] = token.split('.');
  if (!/^\d+$/.test(exp) || Number(exp) <= Math.floor(Date.now() / 1000)) return false;
  return safeEqual(signature, sign(exp));
};

const isAdmin = (req) => {
  if (!process.env.ADMIN_PASSWORD || !signingKey()) return false;
  return validToken(parseCookies(req)[COOKIE_NAME]);
};

module.exports = { isAdmin };

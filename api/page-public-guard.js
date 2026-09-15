const baseHandler = require('./page-market');
const { isAdmin } = require('./_admin-session');

const VALID_PHASES = new Set([
  'WHITELIST_OPEN',
  'WHITELIST_CLOSED',
  'CHECKER_OPEN',
  'PUBLIC_MINT',
  'SOLD_OUT',
  'REVEALED'
]);

const publicPhase = () => {
  const configured = String(process.env.CANDLEKIN_PUBLIC_PHASE || 'WHITELIST_OPEN').toUpperCase();
  return VALID_PHASES.has(configured) ? configured : 'WHITELIST_OPEN';
};

module.exports = async function handler(req, res) {
  let body = '';
  const headers = new Map();
  const proxy = {
    statusCode: 200,
    setHeader(name, value) { headers.set(String(name).toLowerCase(), value); },
    getHeader(name) { return headers.get(String(name).toLowerCase()); },
    end(chunk = '') { body += Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk); }
  };

  await baseHandler(req, proxy);

  const contentType = String(headers.get('content-type') || '');
  if (proxy.statusCode === 200 && contentType.includes('text/html')) {
    try {
      const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
      const url = new URL(req.url, `https://${host}`);
      const requested = String(url.searchParams.get('phase') || '').toUpperCase();
      const adminPreview = url.searchParams.get('adminPreview') === '1' && isAdmin(req);
      const viewPhase = adminPreview && VALID_PHASES.has(requested) ? requested : publicPhase();

      const phaseBoxPattern = /<div class="phasebox" id="phaseBox">[\s\S]*?<\/div><\/div>\s*<script>/;
      if (!phaseBoxPattern.test(body)) throw new Error('Lifecycle selector hook not found.');
      body = body.replace(phaseBoxPattern, '<script>');

      const requestedHook = "const requestedPhase=params.get('phase');";
      const initialHook = "const initialPhase=validPhases.includes(requestedPhase)?requestedPhase:'WHITELIST_OPEN';";
      if (!body.includes(requestedHook) || !body.includes(initialHook)) {
        throw new Error('Lifecycle initialization hooks not found.');
      }
      body = body
        .replace('const internalMode=true;', 'const internalMode=false;')
        .replace(requestedHook, 'const requestedPhase=null;')
        .replace(initialHook, `const initialPhase='${viewPhase}';`)
        .replace('4,096 market states.', '4,096 market-born identities.')
        .replace('One unique state per NFT after Reveal.', 'A 12-bit identity layer after Reveal.')
        .replace('A unique 12-bit market-state identity revealed after mint.', 'A 12-bit market-state identity layer revealed after mint.');

      if (body.includes('Lifecycle // internal') || body.includes('id="phaseSelect"')) {
        throw new Error('Internal lifecycle control survived public guard.');
      }

      const runtime = `<script>window.CandlekinRuntime=${JSON.stringify({
        adminPreview,
        publicPhase: publicPhase(),
        viewPhase
      })};</script>`;
      body = body.includes('</head>') ? body.replace('</head>', `${runtime}</head>`) : runtime + body;
    } catch (error) {
      console.error('Public lifecycle guard failed closed', error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      return res.end('Unable to render Candlekin safely.');
    }
  }

  res.statusCode = proxy.statusCode;
  for (const [name, value] of headers.entries()) res.setHeader(name, value);
  res.setHeader('Cache-Control', 'no-store');
  res.end(body);
};

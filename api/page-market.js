const baseHandler = require('./page-mint-fixed');

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
    const assets = [
      '<link rel="stylesheet" href="/market-lab.css">',
      '<link rel="stylesheet" href="/site-polish.css">',
      '<link rel="stylesheet" href="/world-home.css">',
      '<link rel="stylesheet" href="/wallet-collection.css">',
      '<link rel="stylesheet" href="/wallet-connect-ui.css">',
      '<link rel="stylesheet" href="/collection-preview.css">',
      '<link rel="stylesheet" href="/market-lab-owned-preview.css">',
      '<script src="/market-lab.js"></script>',
      '<script src="/site-polish.js"></script>',
      '<script src="/social-task-gate.js"></script>',
      '<script src="/whitelist-final-polish.js"></script>',
      '<script src="/lifecycle-polish.js"></script>',
      '<script src="/world-home.js"></script>',
      '<script src="/wallet-provider-fix.js"></script>',
      '<script src="/wallet-collection.js"></script>',
      '<script src="/wallet-connect-ui.js"></script>',
      '<script src="/pre-reveal-polish.js"></script>',
      '<script src="/collection-preview.js"></script>',
      '<script src="/market-lab-owned-preview.js"></script>',
      '<script src="/production-mainnet.js"></script>',
      '<script type="module" src="/reown-appkit.js"></script>'
    ].join('');
    body = body.includes('</body>') ? body.replace('</body>', assets + '</body>') : body + assets;
  }

  res.statusCode = proxy.statusCode;
  for (const [name, value] of headers.entries()) res.setHeader(name, value);
  res.setHeader('Cache-Control', 'no-store');
  res.end(body);
};

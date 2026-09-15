module.exports = async function handler(req, res) {
  try {
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const source = await fetch(`${proto}://${host}/admin.html?source=1`, { cache: 'no-store' });
    if (!source.ok) {
      res.statusCode = 502;
      return res.end('Unable to load Candlekin admin.');
    }
    let html = await source.text();
    const hook = '<div class="spacer"></div><button class="btn secondary" onclick="loadData()">Refresh</button>';
    const replacement = '<div class="spacer"></div><button class="btn secondary" onclick="location.href=\'/admin/preview\'">Lifecycle monitor</button><button class="btn secondary" onclick="loadData()">Refresh</button>';
    if (!html.includes(hook)) {
      res.statusCode = 500;
      return res.end('Admin navigation hook not found.');
    }
    html = html.replace(hook, replacement);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.end(html);
  } catch (error) {
    console.error('Admin page bridge failed', error);
    res.statusCode = 500;
    res.end('Unable to render Candlekin admin.');
  }
};

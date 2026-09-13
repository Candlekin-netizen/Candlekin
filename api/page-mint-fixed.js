const baseHandler = require('./page');

function replaceMintUi(html) {
  const mintEraPattern = /function mintEraHome\(title,desc\)\{[\s\S]*?\}(?=\s*function mintPage\(\))/;
  const mintPagePattern = /function mintPage\(\)\{[\s\S]*?\}(?=\s*function collectionPage\(\))/;

  const liveMintEra = "function mintEraHome(title,desc){const label=state.phase==='GTD_MINT'?'GTD':state.phase==='FCFS_MINT'?'FCFS':'PUBLIC';const headline=label==='GTD'?'GTD mint is live.':label==='FCFS'?'FCFS mint is live.':'Public mint is live.';const copy=label==='GTD'?'Eligible GTD wallets can use their reserved allocation on OpenSea during this stage.':label==='FCFS'?'Eligible FCFS wallets can mint on OpenSea while presale supply remains.':'Public mint is open on OpenSea. No whitelist is required.';return `<section class='hero'><div class='wrap hero-grid'><div><div class='chips'><span class='chip'><span class='dot'></span>${label} stage live</span><span class='chip'>OpenSea</span></div><div class='eyebrow'>Candlekin // mint</div><h1>${headline}</h1><p class='lead'>${copy}</p><div class='actions'><button class='btn' type='button' onclick=\"setPage('mint')\">View ${label} stage</button></div></div>${heroArt(label+' mint')}</div></section>${journeySection()}${faq()}`}";

  const liveMintPage = "function mintPage(){if(!['GTD_MINT','FCFS_MINT','PUBLIC_MINT'].includes(state.phase))return home();const label=state.phase==='GTD_MINT'?'GTD':state.phase==='FCFS_MINT'?'FCFS':'PUBLIC';const access=label==='GTD'?'GTD allowlist':label==='FCFS'?'FCFS allowlist':'Open to everyone';const allocation=label==='GTD'?'Reserved allocation':label==='FCFS'?'First come, first served':'No whitelist required';const note=label==='GTD'?'This stage is reserved for wallets assigned GTD during whitelist curation.':label==='FCFS'?'This stage is available to wallets assigned FCFS while presale supply remains.':'Public mint is available without whitelist access.';return `<section class='hero'><div class='wrap'><div class='chips'><span class='chip'><span class='dot'></span>${label} on OpenSea</span></div><div class='eyebrow'>Candlekin // mint</div><h1>${label} mint.</h1><p class='lead'>Mint execution happens on OpenSea. Candlekin keeps the project identity, whitelist and collection experience here.</p></div></section><section><div class='wrap mint-grid'><div class='card'><div class='eyebrow'>OpenSea stage</div><h2>${label}</h2><div class='list'><div class='list-row'><span>Stage</span><strong>${label}</strong></div><div class='list-row'><span>Access</span><strong>${access}</strong></div><div class='list-row'><span>Allocation</span><strong>${allocation}</strong></div><div class='list-row'><span>Destination</span><strong>OpenSea</strong></div></div><p style='margin-top:18px'>${note}</p><div class='actions'><button class='btn' type='button' disabled>OpenSea link pending</button></div></div>${heroArt('Pre-reveal mint art')}</div></section>`}";

  if (!mintEraPattern.test(html) || !mintPagePattern.test(html)) {
    throw new Error('Mint UI hooks not found.');
  }

  html = html.replace(mintEraPattern, liveMintEra);
  html = html.replace(mintPagePattern, liveMintPage);
  html = html
    .replace('A guaranteed allowlist tier. Current direction remains one guaranteed free mint; exact count and window are still TBD.', 'A guaranteed allowlist tier with a reserved allocation before FCFS and Public.')
    .replace('The final OpenSea mint stage. No whitelist is required. Wallet limit and final timing remain TBD.', 'The final OpenSea mint stage. No whitelist is required.');
  return html;
}

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
      body = replaceMintUi(body);
    } catch (error) {
      console.error('Mint UI bridge failed', error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.end('Unable to render Candlekin mint stages.');
    }
  }

  res.statusCode = proxy.statusCode;
  for (const [name, value] of headers.entries()) res.setHeader(name, value);
  res.setHeader('Cache-Control', 'no-store');
  res.end(body);
};

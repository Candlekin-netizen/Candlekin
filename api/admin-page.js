const { isAdmin } = require('../lib/admin-session');
const { CHAIN_ID, CONTRACT, SEADROP, rpcUrl } = require('../lib/mainnet');

const VALID_PHASES = ['WORLD_INTRO','WHITELIST_OPEN','WHITELIST_CLOSED','CHECKER_OPEN','PUBLIC_MINT','SOLD_OUT','REVEALED'];
const publicPhase = () => {
  const value = String(process.env.CANDLEKIN_PUBLIC_PHASE || 'WORLD_INTRO').toUpperCase();
  return VALID_PHASES.includes(value) ? value : 'WORLD_INTRO';
};

function monitorPage() {
  const current = publicPhase();
  const rpcConfigured = Boolean(rpcUrl());
  const phaseButtons = [
    ['WORLD_INTRO','WORLD INTRO'],
    ['WHITELIST_OPEN','WHITELIST OPEN'],
    ['WHITELIST_CLOSED','WHITELIST CLOSED'],
    ['CHECKER_OPEN','CHECKER OPEN'],
    ['PUBLIC_MINT','MINT LIVE'],
    ['SOLD_OUT','SOLD OUT'],
    ['REVEALED','REVEALED']
  ];
  const buttons = phaseButtons.map(([value,label])=>`<button class="phase${value===current?' active':''}" data-phase="${value}">${label}</button>`).join('');
  const currentLabel = current === 'PUBLIC_MINT' ? 'MINT_LIVE' : current;

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Candlekin // Lifecycle Monitor</title><style>
:root{--bg:#07101a;--panel:#0b1622;--line:#23384d;--text:#efe7d1;--muted:#91a4b7;--lime:#ccff00;--warn:#ffd36b;--bad:#ff8989}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,system-ui,sans-serif}button,a{font:inherit}.top{position:sticky;top:0;z-index:5;background:#07101af2;border-bottom:1px solid var(--line)}.wrap{width:min(1500px,calc(100% - 32px));margin:auto}.bar{min-height:70px;display:flex;align-items:center;gap:12px}.brand{font-weight:900;letter-spacing:.12em}.lime{color:var(--lime)}.spacer{flex:1}.btn,.phase{border:1px solid #36516a;background:transparent;color:var(--text);border-radius:10px;padding:10px 13px;text-decoration:none;cursor:pointer;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.phase.active{background:var(--lime);color:#07101a;border-color:#aeca1f;font-weight:800}.main{padding:24px 0 40px}.meta{display:grid;grid-template-columns:repeat(7,1fr);gap:10px;margin-bottom:16px}.card{border:1px solid var(--line);background:var(--panel);border-radius:13px;padding:14px}.k{font:10px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.13em;color:var(--muted);text-transform:uppercase}.v{margin-top:7px;font:14px ui-monospace,SFMono-Regular,Menlo,monospace;overflow-wrap:anywhere}.toolbar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}.note{color:var(--muted);font-size:13px;line-height:1.6;margin:12px 0}.preview{border:1px solid var(--line);border-radius:14px;overflow:hidden;background:#09131e}.previewhead{display:flex;justify-content:space-between;gap:10px;padding:10px 13px;border-bottom:1px solid var(--line);font:12px ui-monospace,SFMono-Regular,Menlo,monospace}.preview iframe{width:100%;height:76vh;border:0;background:var(--bg)}.warn{color:var(--warn)}.bad{color:var(--bad)}@media(max-width:1100px){.meta{grid-template-columns:repeat(3,1fr)}}@media(max-width:700px){.meta{grid-template-columns:1fr 1fr}.bar{flex-wrap:wrap;padding:10px 0}.preview iframe{height:68vh}}
</style></head><body><header class="top"><div class="wrap bar"><div class="brand">CANDLEKIN <span class="lime">// ADMIN</span></div><div class="spacer"></div><a class="btn" href="/admin">Curation</a><button class="btn" onclick="location.reload()">Refresh</button></div></header><main class="main"><div class="wrap"><div class="meta"><div class="card"><div class="k">Public lifecycle</div><div class="v lime">${currentLabel}</div></div><div class="card"><div class="k">Mainnet chain</div><div class="v">${CHAIN_ID}</div></div><div class="card"><div class="k">Candlekin CA</div><div class="v">${CONTRACT}</div></div><div class="card"><div class="k">SeaDrop</div><div class="v">${SEADROP}</div></div><div class="card"><div class="k">Mainnet RPC</div><div class="v ${rpcConfigured?'lime':'bad'}">${rpcConfigured?'CONFIGURED':'MISSING'}</div></div><div class="card"><div class="k">Market Genome</div><div class="v warn">PRODUCTION MAP PENDING</div></div><div class="card"><div class="k">Preview mode</div><div class="v warn">ADMIN ONLY</div></div></div><div class="toolbar">${buttons}</div><div class="note">Previewing a lifecycle here does <strong>not</strong> change the public lifecycle. WORLD INTRO is now the first public phase before whitelist. Anonymous visitors receive only the server-controlled public state. The public page never receives the internal selector. Market Lab demo logic remains admin-preview-only until the production mapping is frozen.</div><div class="preview"><div class="previewhead"><span>ADMIN PREVIEW</span><span id="viewLabel">Viewing: ${currentLabel}</span></div><iframe id="frame" title="Candlekin lifecycle preview" src="/?adminPreview=1&phase=${encodeURIComponent(current)}"></iframe></div></div></main><script>const frame=document.getElementById('frame'),label=document.getElementById('viewLabel');document.querySelectorAll('[data-phase]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-phase]').forEach(x=>x.classList.remove('active'));button.classList.add('active');const phase=button.dataset.phase;label.textContent='Viewing: '+(phase==='PUBLIC_MINT'?'MINT_LIVE':phase);frame.src='/?adminPreview=1&phase='+encodeURIComponent(phase)}));</script></body></html>`;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');

  if (!isAdmin(req)) {
    res.statusCode = 302;
    res.setHeader('Location', '/admin');
    return res.end('Redirecting to admin login.');
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.end(monitorPage());
};

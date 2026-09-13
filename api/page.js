module.exports = async function handler(req, res) {
  try {
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const sourceUrl = `${proto}://${host}/index.html?source=1`;
    const headers = {};
    if (req.headers.cookie) headers.cookie = req.headers.cookie;
    if (req.headers.authorization) headers.authorization = req.headers.authorization;

    const source = await fetch(sourceUrl, { headers, cache: 'no-store' });
    if (!source.ok) {
      res.statusCode = 502;
      return res.end('Unable to load Candlekin frontend.');
    }

    let html = await source.text();

    const oldSubmit = "function submitPreviewApplication(){if(!canSubmit()){syncWhitelistValidity();return}state.applicationSubmitted=true;render()}";
    const liveSubmit = `async function submitPreviewApplication(){
  if(!canSubmit()){syncWhitelistValidity();return}
  const btn=document.getElementById('submitApplicationBtn');
  const originalText=btn?.textContent||'Submit application';
  if(btn){btn.disabled=true;btn.textContent='Submitting...'}
  document.getElementById('submitApplicationError')?.remove();
  try{
    const response=await fetch('/api/apply',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        x_username:state.form.x,
        wallet:state.form.wallet,
        answers:state.answers,
        shared_post_url:state.form.sharedUrl
      })
    });
    const data=await response.json().catch(()=>({}));
    if(response.ok&&data.ok){
      state.applicationSubmitted=true;
      render();
      return;
    }
    const messages={
      DUPLICATE_APPLICATION:'This wallet or X username has already submitted an application.',
      INVALID_X_USERNAME:'Enter a valid X username.',
      INVALID_WALLET:'Enter a valid EVM wallet address.',
      INVALID_ANSWERS:'Complete all six calibration answers.',
      INVALID_SHARED_POST_URL:'Paste a valid X post URL.',
      SUPABASE_NOT_CONFIGURED:'Whitelist database is not configured yet.',
      DATABASE_WRITE_FAILED:'Database connection failed. Please try again.'
    };
    throw new Error(messages[data.error]||'Application could not be submitted. Please try again.');
  }catch(error){
    if(btn){btn.disabled=false;btn.textContent=originalText}
    const notice=document.createElement('div');
    notice.id='submitApplicationError';
    notice.className='notice';
    notice.style.marginTop='16px';
    notice.textContent=error.message||'Application could not be submitted. Please try again.';
    btn?.parentElement?.insertAdjacentElement('afterend',notice);
  }
}`;

    if (!html.includes(oldSubmit)) {
      res.statusCode = 500;
      return res.end('Whitelist submit hook not found.');
    }
    html = html.replace(oldSubmit, liveSubmit);

    const oldCheckerNotice = '<div class="notice">Preview: <span class="mono">0x1111...1111</span> = GTD, <span class="mono">0x2222...2222</span> = FCFS. Other valid wallets = Public-only.</div>';
    const liveCheckerNotice = '<div class="notice">Enter the same wallet address used for your whitelist application. Results are read live from the finalized curation database.</div>';
    if (html.includes(oldCheckerNotice)) {
      html = html.replace(oldCheckerNotice, liveCheckerNotice);
    }

    const oldChecker = "function runChecker(){const v=(document.getElementById('checkerInput')?.value||'').trim().toLowerCase(),box=document.getElementById('checkerResult');if(!box)return;box.classList.add('active');if(!/^0x[a-f0-9]{40}$/.test(v)){box.innerHTML=`<div class=\"card\"><div class=\"result-badge none\">Invalid wallet</div><p style=\"margin-top:12px\">Enter a valid EVM wallet address.</p></div>`;return}const r=checkerDB[v];if(r==='GTD'){box.innerHTML=`<div class=\"card\"><div class=\"result-badge gtd\">GTD</div><h3 style=\"margin-top:12px\">Guaranteed allowlist.</h3><div class=\"list\"><div class=\"list-row\"><span>Tier</span><strong>GTD</strong></div><div class=\"list-row\"><span>Next</span><strong>GTD presale on OpenSea</strong></div></div></div>`;return}if(r==='FCFS'){box.innerHTML=`<div class=\"card\"><div class=\"result-badge fcfs\">FCFS</div><h3 style=\"margin-top:12px\">FCFS allowlist.</h3><div class=\"list\"><div class=\"list-row\"><span>Tier</span><strong>FCFS</strong></div><div class=\"list-row\"><span>Guarantee</span><strong>No — first come, first served</strong></div></div></div>`;return}box.innerHTML=`<div class=\"card\"><div class=\"result-badge none\">Public only</div><h3 style=\"margin-top:12px\">Not on the presale allowlists.</h3><p>You can still participate when Public opens on OpenSea.</p></div>`}";

    const liveChecker = `async function runChecker(){
  const input=document.getElementById('checkerInput');
  const v=(input?.value||'').trim().toLowerCase();
  const box=document.getElementById('checkerResult');
  if(!box)return;
  box.classList.add('active');
  if(!/^0x[a-f0-9]{40}$/.test(v)){
    box.innerHTML='<div class="card"><div class="result-badge none">Invalid wallet</div><p style="margin-top:12px">Enter a valid EVM wallet address.</p></div>';
    return;
  }
  box.innerHTML='<div class="card"><div class="result-badge none">Checking...</div><p style="margin-top:12px">Reading finalized whitelist status.</p></div>';
  try{
    const response=await fetch('/api/check',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({wallet:v})
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok||!data.ok){
      throw new Error(data.error||'CHECK_FAILED');
    }
    const r=data.status;
    if(r==='GTD'){
      box.innerHTML='<div class="card"><div class="result-badge gtd">GTD</div><h3 style="margin-top:12px">Guaranteed allowlist.</h3><div class="list"><div class="list-row"><span>Tier</span><strong>GTD</strong></div><div class="list-row"><span>Next</span><strong>GTD presale on OpenSea</strong></div></div></div>';
      return;
    }
    if(r==='FCFS'){
      box.innerHTML='<div class="card"><div class="result-badge fcfs">FCFS</div><h3 style="margin-top:12px">FCFS allowlist.</h3><div class="list"><div class="list-row"><span>Tier</span><strong>FCFS</strong></div><div class="list-row"><span>Guarantee</span><strong>No — first come, first served</strong></div></div></div>';
      return;
    }
    if(r==='PENDING'){
      box.innerHTML='<div class="card"><div class="result-badge none">Pending</div><h3 style="margin-top:12px">Application still under review.</h3><p>Your wallet is registered, but a final whitelist decision has not been assigned yet.</p></div>';
      return;
    }
    if(r==='NOT_SELECTED'){
      box.innerHTML='<div class="card"><div class="result-badge none">Not selected</div><h3 style="margin-top:12px">Not selected for presale.</h3><p>You can still participate when Public opens on OpenSea.</p></div>';
      return;
    }
    box.innerHTML='<div class="card"><div class="result-badge none">Not found</div><h3 style="margin-top:12px">No whitelist application found.</h3><p>Check that you entered the same wallet used for your application.</p></div>';
  }catch(error){
    box.innerHTML='<div class="card"><div class="result-badge none">Unavailable</div><h3 style="margin-top:12px">Checker temporarily unavailable.</h3><p>Please try again in a moment.</p></div>';
  }
}`;

    if (!html.includes(oldChecker)) {
      res.statusCode = 500;
      return res.end('Whitelist checker hook not found.');
    }
    html = html.replace(oldChecker, liveChecker);

    // Public-facing cleanup. Internal lifecycle controls remain available only
    // when the explicit ?internal=1 query parameter is present.
    const internalMode = String(req.query?.internal || '') === '1';

    html = html
      .replace('Candlekin production preview — 4,096 hard-pixel market-state characters on Robinhood Chain.', 'Candlekin — 4,096 hard-pixel market-state characters on Robinhood Chain.')
      .replaceAll('Candlekin — Production Preview', 'Candlekin')
      .replace('<span class="preview-pill">PROTOTYPE PREVIEW</span>', '')
      .replace('<div>Preview build. Mint execution will happen on OpenSea.</div>', '<div>Primary mint execution will happen on OpenSea.</div>')
      .replace('Preview validation is strict: X, wallet, all six answers and the shared X post URL are required.', 'X, wallet, all six answers and the shared X post URL are required.')
      .replace('>Submit preview</button>', '>Submit application</button>')
      .replace('Share on X also includes a Candlekin preview link so X can render the card image.', 'Share on X also includes a Candlekin share-card link so X can render the card image.');

    if (!internalMode) {
      html = html.replace('</head>', '<style>.phasebox{display:none!important}</style></head>');
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(html);
  } catch (error) {
    console.error('Frontend render bridge failed', error);
    res.statusCode = 500;
    res.end('Unable to render Candlekin frontend.');
  }
};

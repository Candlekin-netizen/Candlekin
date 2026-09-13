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

(function(){
  const LIGHTHOUSE_GATEWAY='https://fast-narwhal-vdgsu.lighthouseweb3.xyz/ipfs/';
  const EXPLORER='https://explorer.testnet.chain.robinhood.com';
  const CONTRACT='0x3D8A54bdee95791D4AE9D9D5163bf6ddA3c607f8';

  function esc(value){return String(value??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));}
  function ipfsToHttp(uri){return uri&&uri.startsWith('ipfs://')?LIGHTHOUSE_GATEWAY+uri.slice(7):uri||'';}
  function currentToken(id){return (state.walletOwnedData||[]).find(t=>Number(t.id)===Number(id))||null;}
  function traitsHtml(attrs){
    const list=Array.isArray(attrs)?attrs:[];
    if(!list.length)return '<p class="wallet-muted">No trait attributes returned by metadata.</p>';
    return `<div class="ck-preview-traits">${list.map(a=>`<div class="ck-preview-trait"><span>${esc(a.trait_type||'Trait')}</span><strong>${esc(a.value??'—')}</strong></div>`).join('')}</div>`;
  }
  function close(){
    document.querySelector('.ck-preview-backdrop')?.remove();
    document.body.classList.remove('ck-preview-open');
  }
  function renderToken(token){
    const id=Number(token.id);
    const imageUrl=token.imageUrl||ipfsToHttp(token.image||'');
    const metadataUrl=token.metadataUrl||ipfsToHttp(token.uri||'');
    return `<div class="ck-preview-head"><div class="eyebrow">Candlekin // token preview</div><button class="ck-preview-close" type="button" aria-label="Close preview">×</button></div><div class="ck-preview-body"><div class="ck-preview-art"><img src="${esc(imageUrl)}" alt="${esc(token.name||`Candlekin #${String(id).padStart(4,'0')}`)}"></div><div class="ck-preview-meta"><div class="tiny">Token #${id}</div><h2>${esc(token.name||`Candlekin #${String(id).padStart(4,'0')}`)}</h2><div class="ck-preview-status"><span class="dot"></span><span>Owned by connected wallet</span></div>${traitsHtml(token.attributes)}<div class="ck-preview-actions"><button class="btn" type="button" data-ck-market="${id}">Open in Market Lab</button><a class="btn secondary" href="${esc(imageUrl)}" target="_blank" rel="noopener noreferrer">Open image ↗</a><a class="btn secondary" href="${esc(metadataUrl)}" target="_blank" rel="noopener noreferrer">Metadata ↗</a><a class="btn ghost" href="${EXPLORER}/token/${CONTRACT}/instance/${id}" target="_blank" rel="noopener noreferrer">Explorer ↗</a></div></div></div>`;
  }
  async function openToken(id){
    let token=currentToken(id);
    const overlay=document.createElement('div');
    overlay.className='ck-preview-backdrop';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.innerHTML='<div class="ck-preview-dialog"><div class="ck-preview-loading"><div><div class="wallet-spinner" style="margin:0 auto 18px"></div><p>Loading Candlekin preview…</p></div></div></div>';
    document.body.appendChild(overlay);
    document.body.classList.add('ck-preview-open');
    const dialog=overlay.querySelector('.ck-preview-dialog');
    try{
      if(!token){
        const card=[...document.querySelectorAll('.wallet-nft-card')].find(el=>el.querySelector('.tiny')?.textContent?.includes(`#${id}`));
        const metadataUrl=card?.querySelector('.wallet-image-link')?.href||'';
        if(!metadataUrl)throw new Error('Token metadata is not loaded yet.');
        const r=await fetch(metadataUrl,{cache:'no-store'});
        if(!r.ok)throw new Error(`Metadata returned HTTP ${r.status}.`);
        const m=await r.json();
        token={id,name:m.name,image:m.image,imageUrl:ipfsToHttp(m.image),metadataUrl,attributes:m.attributes||[]};
      }
      dialog.innerHTML=renderToken(token);
      dialog.querySelector('.ck-preview-close')?.addEventListener('click',close);
      dialog.querySelector('[data-ck-market]')?.addEventListener('click',e=>{const tokenId=Number(e.currentTarget.dataset.ckMarket);close();openGenome(tokenId);});
    }catch(err){
      dialog.innerHTML=`<div class="ck-preview-head"><div class="eyebrow">Candlekin // token preview</div><button class="ck-preview-close" type="button">×</button></div><div class="ck-preview-loading"><div><h3>Preview unavailable.</h3><p class="ck-preview-error">${esc(err?.message||'Unable to load this token.')}</p></div></div>`;
      dialog.querySelector('.ck-preview-close')?.addEventListener('click',close);
    }
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('.ck-preview-backdrop')===e.target){close();return;}
    const card=e.target.closest('.wallet-nft-card');
    if(!card)return;
    if(e.target.closest('.actions'))return;
    const tiny=card.querySelector('.tiny')?.textContent||'';
    const match=tiny.match(/#(\d+)/);
    if(!match)return;
    e.preventDefault();
    e.stopPropagation();
    openToken(Number(match[1]));
  },true);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});

  window.CandlekinPreview={openToken,close};
})();

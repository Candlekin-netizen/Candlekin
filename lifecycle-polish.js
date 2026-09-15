(function(){
  const MINT_PHASE='PUBLIC_MINT';
  const MINT_PHASES=new Set(['GTD_MINT','FCFS_MINT','PUBLIC_MINT']);
  const OPEN_SEA_URL=''; // Set the canonical Candlekin OpenSea drop URL here when published.
  const MINT_PUBLISHED=Boolean(OPEN_SEA_URL);

  window.CandlekinMintConfig={openSeaUrl:OPEN_SEA_URL,published:MINT_PUBLISHED};

  // The website only needs one public mint-era state. GTD / FCFS / Public remain
  // OpenSea / SeaDrop stage configuration details, not separate website modes.
  if(MINT_PHASES.has(state.phase)) state.phase=MINT_PHASE;
  if(state.phase==='CURATION_ADMIN') state.phase='WHITELIST_CLOSED';

  phases[MINT_PHASE]={
    status:MINT_PUBLISHED?'Mint is live':'Mint destination pending',
    cta:MINT_PUBLISHED?'Mint on OpenSea':'OpenSea link pending',
    help:MINT_PUBLISHED
      ?'Candlekin minting is live on OpenSea. Access, price and wallet limits follow the active OpenSea / SeaDrop stage.'
      :'The canonical OpenSea destination will be published here when the mint stage opens.'
  };

  const priorAvailablePages=availablePages;
  availablePages=function(){
    if(state.phase==='CURATION_ADMIN') state.phase='WHITELIST_CLOSED';
    if(MINT_PHASES.has(state.phase)) return ['home','mint','collection','docs','faq'];
    return priorAvailablePages().filter(page=>page!=='admin');
  };

  function openSeaAction(){
    return OPEN_SEA_URL
      ? `<a class="btn" href="${OPEN_SEA_URL}" target="_blank" rel="noopener noreferrer">Mint on OpenSea ↗</a>`
      : '<button class="btn" type="button" disabled>OpenSea destination not published</button>';
  }

  const priorHome=home;
  home=function(){
    if(!MINT_PHASES.has(state.phase)) return priorHome();
    if(!MINT_PUBLISHED){
      return `<section class="hero"><div class="wrap hero-grid"><div><div class="chips"><span class="chip"><span class="dot"></span>Mint destination pending</span><span class="chip">OpenSea</span></div><div class="eyebrow">Candlekin // mint</div><h1>Mint details are being finalized.</h1><p class="lead">The canonical OpenSea destination will be published here when the mint stage opens. Do not mint from links shared only through replies, DMs or unofficial pages.</p><div class="actions">${openSeaAction()}<button class="btn secondary" type="button" onclick="setPage('collection')">My Candlekin</button></div></div>${heroArt('Official mint destination')}</div></section>${journeySection()}${faq()}`;
    }
    return `<section class="hero"><div class="wrap hero-grid"><div><div class="chips"><span class="chip"><span class="dot"></span>Mint is live</span><span class="chip">OpenSea</span></div><div class="eyebrow">Candlekin // mint live</div><h1>Mint is live.</h1><p class="lead">Candlekin minting is live on OpenSea. Your current access, price and wallet limits are enforced by the active OpenSea / SeaDrop stage.</p><div class="actions">${openSeaAction()}<button class="btn secondary" type="button" onclick="setPage('collection')">My Candlekin</button></div></div>${heroArt('Mint live on OpenSea')}</div></section>${journeySection()}${faq()}`;
  };

  mintPage=function(){
    if(!MINT_PHASES.has(state.phase)) return home();
    const title=MINT_PUBLISHED?'Enter the mint.':'Official mint destination.';
    const lead=MINT_PUBLISHED
      ?'Candlekin.xyz does not duplicate sale logic. Eligibility, active stage, price, timing and wallet limits are enforced on OpenSea / SeaDrop.'
      :'The canonical OpenSea link has not been published yet. Candlekin.xyz will link directly to the official destination when the stage opens.';
    return `<section class="hero"><div class="wrap hero-grid"><div><div class="chips"><span class="chip"><span class="dot"></span>${MINT_PUBLISHED?'Mint is live':'Destination pending'}</span><span class="chip">OpenSea / SeaDrop</span></div><div class="eyebrow">Candlekin // mint</div><h1>${title}</h1><p class="lead">${lead}</p><div class="actions">${openSeaAction()}<button class="btn secondary" type="button" onclick="setPage('collection')">View My Candlekin</button></div></div>${heroArt(MINT_PUBLISHED?'Mint execution on OpenSea':'Official mint destination')}</div></section>`;
  };

  function syncLifecycleSelector(){
    const select=document.getElementById('phaseSelect');
    if(!select) return;
    const options=[
      ['WHITELIST_OPEN','WHITELIST_OPEN'],
      ['WHITELIST_CLOSED','WHITELIST_CLOSED'],
      ['CHECKER_OPEN','CHECKER_OPEN'],
      [MINT_PHASE,'MINT_LIVE'],
      ['SOLD_OUT','SOLD_OUT'],
      ['REVEALED','REVEALED']
    ];
    select.innerHTML=options.map(([value,label])=>`<option value="${value}">${label}</option>`).join('');
    select.value=MINT_PHASES.has(state.phase)?MINT_PHASE:state.phase;
  }

  const priorRender=render;
  render=function(){
    if(MINT_PHASES.has(state.phase)) state.phase=MINT_PHASE;
    if(state.phase==='CURATION_ADMIN') state.phase='WHITELIST_CLOSED';
    priorRender();
    syncLifecycleSelector();
  };

  // Normalize legacy preview URLs so bookmarks do not expose removed internal states.
  const url=new URL(location.href);
  if(MINT_PHASES.has(url.searchParams.get('phase'))){
    url.searchParams.set('phase',MINT_PHASE);
    history.replaceState(null,'',url);
  }else if(url.searchParams.get('phase')==='CURATION_ADMIN'){
    url.searchParams.set('phase','WHITELIST_CLOSED');
    history.replaceState(null,'',url);
  }

  render();
})();

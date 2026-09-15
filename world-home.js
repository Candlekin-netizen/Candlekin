(function(){
  const WORLD_IMG='https://res.cloudinary.com/lqk65ybn/image/upload/v1789455712/main_website.png';
  const MINT_PHASES=new Set(['GTD_MINT','FCFS_MINT','PUBLIC_MINT']);

  function chips(items){
    return `<div class="chips">${items.map((item,index)=>`<span class="chip">${index===0?'<span class="dot"></span>':''}${item}</span>`).join('')}</div>`;
  }

  function worldHero({items=[],eyebrow,title,lead,actions=''}){
    return `<section class="ck-world-hero" style="--ck-world-image:url('${WORLD_IMG}')"><div class="ck-world-copy">${chips(items)}<div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p class="lead">${lead}</p>${actions?`<div class="actions">${actions}</div>`:''}</div></section>`;
  }

  function checkerBody(){
    return `<section id="checker"><div class="wrap status-grid"><div class="card"><div class="eyebrow">Allocation checker</div><h2>Wallet status.</h2><div class="notice">Enter the same wallet used for your whitelist application. Checker results show GTD, FCFS, or not selected for presale.</div><div style="height:18px"></div><label>Wallet address</label><input id="checkerInput" placeholder="0x..."><div class="actions"><button class="btn" type="button" onclick="runChecker()">Check status</button></div><div id="checkerResult" class="checker-result"></div></div>${signalMatrix()}</div></section>${faq()}`;
  }

  const priorHome=home;
  home=function(){
    if(state.phase==='WHITELIST_OPEN'){
      return worldHero({
        items:['Whitelist applications open','4,096 supply','Robinhood Chain'],
        eyebrow:'Candlekin // whitelist season',
        title:'Register your signal.',
        lead:'Apply, generate a Genesis Signal and enter review. Selected whitelist applicants receive either GTD or FCFS. Everyone else can join Public later.',
        actions:'<button class="btn" type="button" onclick="setPage(\'whitelist\')">Open whitelist</button>'
      })+collectionOverview()+identitySection()+journeySection()+faq();
    }

    if(state.phase==='WHITELIST_CLOSED'){
      return worldHero({
        items:['Whitelist closed','Review in progress'],
        eyebrow:'Candlekin // curation',
        title:'Applications are under review.',
        lead:'The applicant pool is locked. Candlekin is preparing the GTD and FCFS presale allocations before the checker opens.'
      })+collectionOverview()+journeySection()+faq();
    }

    if(state.phase==='CHECKER_OPEN'){
      return worldHero({
        items:['Checker open','GTD / FCFS'],
        eyebrow:'Candlekin // allocation',
        title:'Check your allocation.',
        lead:'See the presale allocation attached to the wallet used in your whitelist application.',
        actions:'<button class="btn" type="button" onclick="document.getElementById(\'checker\')?.scrollIntoView({behavior:\'smooth\'})">Check wallet</button>'
      })+checkerBody();
    }

    if(MINT_PHASES.has(state.phase)){
      const published=Boolean(window.CandlekinMintConfig?.published);
      return worldHero({
        items:published?['Mint is live','OpenSea']:['Mint destination pending','OpenSea'],
        eyebrow:published?'Candlekin // mint live':'Candlekin // mint',
        title:published?'Mint is live.':'Mint details are being finalized.',
        lead:published
          ?'Candlekin minting is live on OpenSea. Access, price, timing and wallet limits follow the active OpenSea / SeaDrop stage.'
          :'The canonical OpenSea destination will be published here when the mint stage opens. Do not mint from links shared only through replies, DMs or unofficial pages.',
        actions:'<button class="btn" type="button" onclick="setPage(\'mint\')">'+(published?'Enter mint':'View mint details')+'</button><button class="btn secondary" type="button" onclick="setPage(\'collection\')">My Candlekin</button>'
      })+journeySection()+faq();
    }

    if(state.phase==='SOLD_OUT'){
      return worldHero({
        items:['Sold out','Identity sealed'],
        eyebrow:'Candlekin // sealed',
        title:'4,096 / 4,096.',
        lead:'Minting is complete. Ownership is live while final artwork, traits and Market Genome remain sealed until Reveal.',
        actions:'<button class="btn secondary" type="button" onclick="setPage(\'collection\')">My Candlekin</button>'
      })+collectionOverview()+journeySection()+faq();
    }

    if(state.phase==='REVEALED'){
      return worldHero({
        items:['Reveal live','Market Lab online'],
        eyebrow:'Candlekin // revealed',
        title:'The identities are awake.',
        lead:'Final artwork and visual traits are visible. Market Lab opens the separate Market Genome identity layer.',
        actions:'<button class="btn" type="button" onclick="setPage(\'marketlab\')">Open Market Lab</button><button class="btn secondary" type="button" onclick="setPage(\'collection\')">My Candlekin</button>'
      })+collectionOverview()+identitySection()+journeySection()+faq();
    }

    return priorHome();
  };

  render();
})();

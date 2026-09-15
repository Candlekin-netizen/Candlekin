(function(){
  const X_HANDLE='@candlekinHQ';
  const X_URL='https://x.com/candlekinHQ';

  try {
    if (typeof SOCIAL_LINKS !== 'undefined') SOCIAL_LINKS.profile=X_URL;
  } catch (_) {}

  availablePages=function(){
    if(state.phase==='CURATION_ADMIN') return ['admin','docs'];
    if(state.phase==='WHITELIST_OPEN'||state.phase==='WHITELIST_CLOSED') return ['home','whitelist','docs','faq'];
    if(state.phase==='CHECKER_OPEN') return ['home','docs','faq'];
    if(['GTD_MINT','FCFS_MINT','PUBLIC_MINT'].includes(state.phase)) return ['home','mint','collection','docs','faq'];
    if(state.phase==='SOLD_OUT') return ['home','collection','docs','faq'];
    if(state.phase==='REVEALED') return ['home','collection','marketlab','docs','faq'];
    return ['home','docs'];
  };

  renderNav=function(){
    const labels={home:'Home',whitelist:'Whitelist',mint:'Mint',collection:'My Candlekin',marketlab:'Market Lab',docs:'Docs',faq:'FAQ',admin:'Admin'};
    const buttons=availablePages().map(p=>`<button type="button" class="${state.page===p?'active':''}" onclick="setPage('${p}')">${labels[p]}</button>`).join('');
    document.getElementById('mainNav').innerHTML=buttons+`<a class="site-external" href="${X_URL}" target="_blank" rel="noopener noreferrer" aria-label="Candlekin on X">X ↗</a>`;
  };

  function docsPage(){
    return `<section class="hero"><div class="wrap hero-grid"><div><div class="chips"><span class="chip"><span class="dot"></span>Project docs</span><span class="chip">4,096 fixed supply</span><span class="chip">Robinhood Chain</span></div><div class="eyebrow">Candlekin // docs</div><h1>How Candlekin works.</h1><p class="lead">The collection, access flow, reveal model and identity systems in one place. Mint execution is handled through OpenSea / SeaDrop; Candlekin.xyz is the project identity, whitelist, ownership and Market Lab layer.</p><div class="actions"><a class="btn" href="${X_URL}" target="_blank" rel="noopener noreferrer">Follow ${X_HANDLE} ↗</a></div></div>${heroArt('Project documentation')}</div></section>
    <section><div class="wrap"><div class="section-head"><div><div class="eyebrow">Collection</div><h2>Fixed supply. Two families.</h2></div><div class="subtle">Candlekin is an ERC-721 collection built around candlestick-inspired hard-pixel characters.</div></div><div class="docs-grid"><div class="card"><h3>Supply</h3><div class="list"><div class="list-row"><span>Total</span><strong>4,096</strong></div><div class="list-row"><span>Bullkin</span><strong>2,048</strong></div><div class="list-row"><span>Bearkin</span><strong>2,048</strong></div><div class="list-row"><span>Chain</span><strong>Robinhood Chain</strong></div></div></div><div class="card"><h3>My Candlekin</h3><p>My Candlekin is an ownership view, not a whitelist page. It appears once minting can create owned tokens. Before Reveal it shows sealed ownership; after Reveal it shows final art, traits and Market Lab access.</p></div></div></div></section>
    <section><div class="wrap"><div class="section-head"><div><div class="eyebrow">Access & mint</div><h2>Application is not mint execution.</h2></div></div><div class="docs-grid"><div class="card"><h3>Whitelist flow</h3><p>Applications are curated into mutually exclusive GTD or FCFS presale allocations. Applicants who are not selected for presale can still participate in Public.</p><div class="docs-code">APPLICATION → CURATION → GTD / FCFS / NOT SELECTED → CHECKER</div></div><div class="card"><h3>Mint stages</h3><p>The mint lifecycle is GTD presale → FCFS presale → Public. OpenSea / SeaDrop is the execution layer. Price, timing and wallet limits follow the active stage configuration rather than static website copy.</p></div></div></div></section>
    <section><div class="wrap"><div class="section-head"><div><div class="eyebrow">Identity systems</div><h2>Three layers, kept separate.</h2></div></div><div class="grid-3"><div class="card"><h3>Genesis Signal</h3><p>A 12-bit participant identity generated from six calibration questions. It does not determine GTD/FCFS selection, NFT family, visual traits, rarity, token ID or Market Genome.</p></div><div class="card"><h3>Visual DNA</h3><p>The revealed artwork and trait composition of the NFT.</p></div><div class="card"><h3>Market Genome</h3><p>A separate 12-bit post-Reveal identity model using Momentum, Volatility and Conviction axes. It is collectible identity and lore, not a live market signal, prediction or trading recommendation.</p></div></div></div></section>
    <section><div class="wrap"><div class="section-head"><div><div class="eyebrow">Reveal</div><h2>Same NFT. New metadata view.</h2></div></div><div class="docs-grid"><div class="card"><h3>Before Reveal</h3><p>Minted tokens already have an owner and token ID, but they resolve to shared sealed metadata.</p></div><div class="card"><h3>After Reveal</h3><p>The contract switches permanently to token-specific metadata. Token ID, owner and contract stay the same. Reveal is one-way.</p></div></div></div></section>
    <section><div class="wrap"><div class="section-head"><div><div class="eyebrow">Market Lab</div><h2>Decode, compare, explore.</h2></div></div><div class="card docs-callout"><p>Market Lab is the post-Reveal identity explorer for the 12-bit Market Genome: decoder, three-axis view, profile, collection-wide comparison, share card and 4,096-state atlas. Owning one Candlekin is enough: its genome can be compared with any revealed token in the collection. Percentages show position within an identity axis; they are not performance probabilities.</p></div></div></section>
    <section><div class="wrap"><div class="section-head"><div><div class="eyebrow">Official contract</div><h2>Verify before you mint.</h2></div></div><div class="docs-grid"><div class="card"><h3>Canonical address</h3><p>The official Candlekin mainnet contract address will be published on Candlekin.xyz before the mint opens. Never rely on an address shared only through replies, DMs or unofficial links.</p></div><div class="card"><h3>Official mint destination</h3><p>The canonical OpenSea destination will be linked directly from Candlekin.xyz and the official ${X_HANDLE} account when the mint stage opens.</p></div></div></div></section>`;
  }

  try {
    shareCaption=function(){return `Signal registered.\n\n${safeSignal()}\n\n${X_HANDLE} // Genesis`};
  } catch (_) {}

  const basePageHtml=pageHtml;
  function polishHtml(html){
    return String(html)
      .replaceAll('@Candlekin',X_HANDLE)
      .replaceAll('Checker results will be GTD, FCFS or Public-only.','Checker results show GTD, FCFS, or not selected for presale. Public remains open to everyone.')
      .replaceAll('Every state is now visible.','Revealed identities are now visible.')
      .replaceAll('Final artwork, visual traits and Market Genome are now presented.','Final artwork and visual traits are visible. Market Lab explores the separate Market Genome identity layer.')
      .replaceAll('Post-Reveal utility','Post-Reveal identity explorer')
      .replaceAll('OpenSea link pending','OpenSea link will appear when the stage opens')
      .replaceAll('OpenSea URL pending','OpenSea link will appear when the stage opens')
      .replaceAll('Official X links will be connected once the profile and whitelist post URLs are final.','The official X profile is live at @candlekinHQ. Whitelist post links will activate when the campaign post is published.')
      .replaceAll('Primary mint execution will happen on OpenSea.','Primary mint execution takes place on OpenSea.')
      .replaceAll('4,096 market states.','4,096 market-born identities.')
      .replaceAll('One unique state per NFT after Reveal.','A 12-bit identity state for each NFT after Reveal.')
      .replaceAll('A unique 12-bit market-state identity revealed after mint.','A 12-bit market-state identity revealed after mint.')
      .replaceAll('Connect your wallet to read the Candlekin it owns on Robinhood Chain Testnet. Your collection loads directly below on this page.','Connect your wallet to view the Candlekin it owns. Your collection loads directly below on this page.')
      .replaceAll('Reading ownership from the Candlekin testnet contract, then loading metadata through the Candlekin Lighthouse gateway.','Reading wallet ownership, then loading Candlekin metadata.')
      .replaceAll('This wallet does not own a Candlekin on testnet yet.','This wallet does not own a Candlekin yet.')
      .replaceAll('Ownership is read directly from the deployed Candlekin testnet contract.','Ownership is read directly from the deployed Candlekin contract.')
      .replaceAll('No demo collection is shown here. This area only displays tokens owned by the connected address.','Only tokens owned by the connected address are shown here.');
  }

  pageHtml=function(){
    if(state.page==='docs') return docsPage();
    return polishHtml(basePageHtml());
  };

  window.mlCopyGenome=async function(){
    const id=Number(state.labId||(state.owned&&state.owned[0])||1842);
    const g=demoGenomeFor(id);
    const profile=[band('m',g.m),band('v',g.v),band('c',g.c)].join(' · ');
    const text=`Candlekin #${String(id).padStart(4,'0')}\nMarket Genome: ${g.bits}\nProfile: ${profile}\n\n${X_HANDLE} // Market Lab`;
    const status=document.getElementById('mlShareStatus');
    try{await navigator.clipboard.writeText(text);if(status)status.textContent='Genome text copied.'}catch{if(status)status.textContent='Copy failed. Select and copy manually.'}
  };

  window.mlShareOnX=function(){
    const id=Number(state.labId||(state.owned&&state.owned[0])||1842);
    const g=demoGenomeFor(id);
    const profile=[band('m',g.m),band('v',g.v),band('c',g.c)].join(' · ');
    const text=`Candlekin #${String(id).padStart(4,'0')}\n${g.bits}\n${profile}\n\n${X_HANDLE} // Market Lab`;
    const url=`https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(location.origin)}`;
    window.open(url,'_blank','noopener,noreferrer');
  };

  function patchFooter(){
    const footer=document.querySelector('.footer-inner');
    if(!footer||footer.querySelector('.footer-links'))return;
    const links=document.createElement('div');
    links.className='footer-links';
    links.innerHTML=`<button type="button" onclick="setPage('docs')">Docs</button><a href="${X_URL}" target="_blank" rel="noopener noreferrer">${X_HANDLE} ↗</a>`;
    footer.appendChild(links);
  }

  const baseRender=render;
  render=function(){baseRender();patchFooter()};
  render();
})();

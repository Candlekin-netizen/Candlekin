(function(){
  const X_HANDLE='@Candlekin';
  const X_URL='https://x.com/Candlekin';
  const TESTNET_CONTRACT='0x3D8A54bdee95791D4AE9D9D5163bf6ddA3c607f8';
  const TESTNET_EXPLORER=`https://explorer.testnet.chain.robinhood.com/address/${TESTNET_CONTRACT}`;

  try {
    if (typeof SOCIAL_LINKS !== 'undefined') SOCIAL_LINKS.profile=X_URL;
  } catch (_) {}

  const baseAvailablePages=availablePages;
  availablePages=function(){
    const pages=[...baseAvailablePages()];
    if(!pages.includes('docs')){
      const faqIndex=pages.indexOf('faq');
      if(faqIndex>=0) pages.splice(faqIndex,0,'docs');
      else pages.push('docs');
    }
    return pages;
  };

  renderNav=function(){
    const labels={home:'Home',whitelist:'Whitelist',mint:'Mint',collection:'Collection',marketlab:'Market Lab',docs:'Docs',faq:'FAQ',admin:'Admin'};
    const buttons=availablePages().map(p=>`<button type="button" class="${state.page===p?'active':''}" onclick="setPage('${p}')">${labels[p]}</button>`).join('');
    document.getElementById('mainNav').innerHTML=buttons+`<a class="site-external" href="${X_URL}" target="_blank" rel="noopener noreferrer" aria-label="Candlekin on X">X ↗</a>`;
  };

  function docsPage(){
    return `<section class="hero"><div class="wrap hero-grid"><div><div class="chips"><span class="chip"><span class="dot"></span>Project docs</span><span class="chip">4,096 fixed supply</span><span class="chip">Robinhood Chain</span></div><div class="eyebrow">Candlekin // docs</div><h1>How Candlekin works.</h1><p class="lead">The collection, access flow, reveal model and identity systems in one place. Mint execution is handled through OpenSea / SeaDrop; Candlekin.xyz is the project identity, whitelist, collection and Market Lab layer.</p><div class="actions"><a class="btn" href="${X_URL}" target="_blank" rel="noopener noreferrer">Follow ${X_HANDLE} ↗</a></div></div>${heroArt('Project documentation')}</div></section>
    <section><div class="wrap"><div class="section-head"><div><div class="eyebrow">Collection</div><h2>Fixed supply. Two families.</h2></div><div class="subtle">Candlekin is an ERC-721 collection built around candlestick-inspired hard-pixel characters.</div></div><div class="docs-grid"><div class="card"><h3>Supply</h3><div class="list"><div class="list-row"><span>Total</span><strong>4,096</strong></div><div class="list-row"><span>Bullkin</span><strong>2,048</strong></div><div class="list-row"><span>Bearkin</span><strong>2,048</strong></div><div class="list-row"><span>Chain</span><strong>Robinhood Chain</strong></div></div></div><div class="card"><h3>Visual DNA</h3><p>Appearance is defined by the artwork trait system: Background, Head, Body, Body Accessory, Glasses and Special Trait. Visual DNA is separate from whitelist status and Market Genome.</p></div></div></div></section>
    <section><div class="wrap"><div class="section-head"><div><div class="eyebrow">Access & mint</div><h2>Application is not mint execution.</h2></div></div><div class="docs-grid"><div class="card"><h3>Whitelist flow</h3><p>Applications are curated into mutually exclusive GTD or FCFS presale allocations. Applicants who are not selected for presale can still participate in Public.</p><div class="docs-code">APPLICATION → CURATION → GTD / FCFS / NOT SELECTED → CHECKER</div></div><div class="card"><h3>Mint stages</h3><p>The mint lifecycle is GTD presale → FCFS presale → Public. OpenSea / SeaDrop is the execution layer. Final price, timing and wallet limits are stage configuration and are not promised by static website copy.</p></div></div></div></section>
    <section><div class="wrap"><div class="section-head"><div><div class="eyebrow">Identity systems</div><h2>Three layers, kept separate.</h2></div></div><div class="grid-3"><div class="card"><h3>Genesis Signal</h3><p>A 12-bit participant identity generated from six calibration questions. It does not determine GTD/FCFS selection, NFT family, visual traits, rarity, token ID or Market Genome.</p></div><div class="card"><h3>Visual DNA</h3><p>The revealed artwork and trait composition of the NFT.</p></div><div class="card"><h3>Market Genome</h3><p>A separate 12-bit post-Reveal identity model using Momentum, Volatility and Conviction axes. It is collectible identity and lore, not a live market signal, prediction or trading recommendation.</p></div></div></div></section>
    <section><div class="wrap"><div class="section-head"><div><div class="eyebrow">Reveal</div><h2>Same NFT. New metadata view.</h2></div></div><div class="docs-grid"><div class="card"><h3>Before Reveal</h3><p>Minted tokens share sealed metadata while ownership and token IDs already exist onchain.</p></div><div class="card"><h3>After Reveal</h3><p>The contract switches permanently to token-specific metadata. Token ID, owner and contract stay the same. Reveal is one-way.</p></div></div></div></section>
    <section><div class="wrap"><div class="section-head"><div><div class="eyebrow">Market Lab</div><h2>Decode, compare, explore.</h2></div></div><div class="card docs-callout"><p>Market Lab is the post-Reveal identity explorer for the 12-bit Market Genome: decoder, three-axis view, profile, comparison, share card and 4,096-state atlas. Percentages show position within an identity axis; they are not performance probabilities.</p></div></div></section>
    <section><div class="wrap"><div class="section-head"><div><div class="eyebrow">Contract status</div><h2>Testnet validated. Mainnet not published yet.</h2></div></div><div class="docs-grid"><div class="card"><h3>Robinhood Chain Testnet</h3><div class="list"><div class="list-row"><span>Chain ID</span><strong>46630</strong></div><div class="list-row"><span>Contract</span><strong class="mono">0x3D8A...607f8</strong></div><div class="list-row"><span>Validation</span><strong>SeaDrop mint + Reveal PASS</strong></div></div><p style="margin-top:16px"><a class="docs-link" href="${TESTNET_EXPLORER}" target="_blank" rel="noopener noreferrer">View verified testnet contract ↗</a></p></div><div class="card"><h3>Mainnet safety</h3><p>The mainnet Candlekin contract is not published yet. Before mint, the canonical mainnet contract and OpenSea destination will be published on Candlekin.xyz and the official ${X_HANDLE} account. Do not treat the testnet address as a mainnet mint address.</p></div></div></div></section>`;
  }

  const basePageHtml=pageHtml;
  function polishHtml(html){
    return String(html)
      .replaceAll('Checker results will be GTD, FCFS or Public-only.','Checker results show GTD, FCFS, or not selected for presale. Public remains open to everyone.')
      .replaceAll('Every state is now visible.','Revealed identities are now visible.')
      .replaceAll('Final artwork, visual traits and Market Genome are now presented.','Final artwork and visual traits are visible. Market Lab explores the separate Market Genome identity layer.')
      .replaceAll('Post-Reveal utility','Post-Reveal identity explorer')
      .replaceAll('OpenSea link pending','OpenSea link will appear when the stage opens')
      .replaceAll('OpenSea URL pending','OpenSea link will appear when the stage opens')
      .replaceAll('Official X links will be connected once the profile and whitelist post URLs are final.','The official X profile is live. Whitelist post links will activate when the campaign post is published.')
      .replaceAll('Primary mint execution will happen on OpenSea.','Primary mint execution takes place on OpenSea.');
  }

  pageHtml=function(){
    if(state.page==='docs') return docsPage();
    return polishHtml(basePageHtml());
  };

  function patchFooter(){
    const footer=document.querySelector('.footer-inner');
    if(!footer || footer.querySelector('.footer-links')) return;
    const links=document.createElement('div');
    links.className='footer-links';
    links.innerHTML=`<button type="button" onclick="setPage('docs')">Docs</button><a href="${X_URL}" target="_blank" rel="noopener noreferrer">${X_HANDLE} ↗</a>`;
    footer.appendChild(links);
  }

  const baseRender=render;
  render=function(){
    baseRender();
    patchFooter();
  };

  render();
})();

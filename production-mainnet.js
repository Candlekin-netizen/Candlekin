(function(){
  const CONTRACT='0x1422F37Cdc2a845B9dB8b5D4faDf9C6AFA1d3A50';
  const EXPLORER=`https://robinhoodchain.blockscout.com/address/${CONTRACT}`;
  const GENOME_PRODUCTION_READY=false;
  const isAdminPreview=()=>Boolean(window.CandlekinRuntime?.adminPreview);
  const genomeEnabled=()=>GENOME_PRODUCTION_READY||isAdminPreview();

  const priorAvailablePages=availablePages;
  availablePages=function(){
    const pages=priorAvailablePages();
    if(state.phase==='REVEALED'&&!genomeEnabled()) return pages.filter(page=>page!=='marketlab');
    return pages;
  };

  const priorMarketLab=marketLab;
  marketLab=function(){
    if(genomeEnabled()) return priorMarketLab();
    return `<section class="hero"><div class="wrap hero-grid"><div><div class="chips"><span class="chip">Reveal live</span><span class="chip">Market Genome pending</span></div><div class="eyebrow">Candlekin // Market Lab</div><h1>Genome activation pending.</h1><p class="lead">Final artwork and visual traits can be revealed independently. Market Lab will activate only after the production token-to-genome mapping is frozen and verified.</p><div class="notice" style="margin-top:22px">No preview or demo genome is exposed as production identity.</div><div class="actions"><button class="btn secondary" type="button" onclick="setPage('collection')">My Candlekin</button></div></div>${heroArt('Market Genome pending')}</div></section>`;
  };

  const priorPageHtml=pageHtml;
  pageHtml=function(){
    let html=priorPageHtml();
    html=String(html)
      .replace('The official Candlekin mainnet contract address will be published on Candlekin.xyz before the mint opens. Never rely on an address shared only through replies, DMs or unofficial links.', `Canonical Mainnet contract: <span class="mono">${CONTRACT}</span>. Verify it through Candlekin.xyz before interacting with mint links.`)
      .replace('<h3>Official mint destination</h3>', `<h3>Mainnet verification</h3><p><a class="site-external" href="${EXPLORER}" target="_blank" rel="noopener noreferrer">Open contract explorer ↗</a></p><h3>Official mint destination</h3>`);
    return html;
  };

  window.CandlekinProduction={
    chainId:4663,
    contract:CONTRACT,
    genomeProductionReady:GENOME_PRODUCTION_READY
  };

  render();
})();

(function(){
  const TESTNET_CHAIN_HEX='0xb626';
  const CANDLEKIN='0x3D8A54bdee95791D4AE9D9D5163bf6ddA3c607f8';
  const SEADROP='0x00005EA00Ac477B1030CE78506496e8C2dE24bf5';
  const FEE_RECIPIENT='0x10E4ea8dAc0c3CeC091f33F3521d7eB1A3A5206A';
  const OWNER=FEE_RECIPIENT.toLowerCase();
  const PRICE_WEI=1000000000000n;
  const PRICE_HEX='0xe8d4a51000';
  const MINT_PUBLIC_SELECTOR='0x161ac21f';
  const TOTAL_SUPPLY_SELECTOR='0x18160ddd';
  const EXPLORER='https://explorer.testnet.chain.robinhood.com';
  const DROP_END=1789544896;

  const mintState={status:'idle',message:'',txHash:'',supplyBefore:null,supplyAfter:null};

  function esc(value){return String(value??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));}
  function provider(){
    const selected=window.CandlekinWalletProvider?.get?.();
    if(selected&&typeof selected.request==='function')return selected;
    if(window.okxwallet&&typeof window.okxwallet.request==='function')return window.okxwallet;
    if(window.ethereum&&typeof window.ethereum.request==='function')return window.ethereum;
    return null;
  }
  function padAddress(address){return String(address).toLowerCase().replace(/^0x/,'').padStart(64,'0');}
  function padUint(value){return BigInt(value).toString(16).padStart(64,'0');}
  function mintCalldata(){
    return MINT_PUBLIC_SELECTOR+
      padAddress(CANDLEKIN)+
      padAddress(FEE_RECIPIENT)+
      '0'.repeat(64)+
      padUint(1);
  }
  function short(address){return address?`${address.slice(0,6)}…${address.slice(-4)}`:'—';}
  function formatEnd(){
    return new Intl.DateTimeFormat('en-GB',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Jakarta'}).format(new Date(DROP_END*1000))+' WIB';
  }
  function isOwner(){return String(state.walletAddress||'').toLowerCase()===OWNER;}
  function connected(){return !!(state.walletConnected&&state.walletAddress);}
  function statusHtml(){
    if(mintState.status==='pending')return `<div class="ck-phase6-status pending"><strong><span class="ck-phase6-spinner"></span>Transaction submitted.</strong><p>${esc(mintState.message||'Waiting for Robinhood Chain Testnet confirmation…')}</p>${mintState.txHash?`<a class="ck-phase6-hash" href="${EXPLORER}/tx/${mintState.txHash}" target="_blank" rel="noopener noreferrer">${mintState.txHash} ↗</a>`:''}</div>`;
    if(mintState.status==='success')return `<div class="ck-phase6-status success"><strong>Mint confirmed.</strong><p>${esc(mintState.message)}</p>${mintState.txHash?`<a class="ck-phase6-hash" href="${EXPLORER}/tx/${mintState.txHash}" target="_blank" rel="noopener noreferrer">${mintState.txHash} ↗</a>`:''}<div class="ck-phase6-actions"><button class="btn secondary" type="button" onclick="setPage('collection')">View My Candlekin</button></div></div>`;
    if(mintState.status==='error')return `<div class="ck-phase6-status error"><strong>Mint not completed.</strong><p>${esc(mintState.message)}</p>${mintState.txHash?`<a class="ck-phase6-hash" href="${EXPLORER}/tx/${mintState.txHash}" target="_blank" rel="noopener noreferrer">${mintState.txHash} ↗</a>`:''}</div>`;
    return `<div class="ck-phase6-status"><strong>Ready for the Phase 6 browser-wallet test.</strong><p>The site will estimate the exact SeaDrop call first. Your wallet remains the transaction signer.</p></div>`;
  }
  function mintAction(){
    if(!connected())return `<button class="btn" type="button" onclick="connectWallet()">Connect non-owner wallet</button>`;
    if(isOwner())return `<button class="btn" type="button" disabled>Owner wallet blocked</button>`;
    if(mintState.status==='pending')return `<button class="btn" type="button" disabled>Mint pending…</button>`;
    return `<button class="btn" type="button" onclick="phase6MintOne()">Mint 1 testnet Candlekin</button>`;
  }

  const previousMintPage=mintPage;
  mintPage=function(){
    if(state.phase!=='PUBLIC_MINT')return previousMintPage();
    const ownerWarning=connected()&&isOwner()?`<div class="ck-phase6-owner-warning"><strong>Use a non-owner wallet.</strong><br>This connected address is the Candlekin testnet owner/deployer, so Phase 6 intentionally blocks minting from it.</div>`:'';
    return `<section class="ck-phase6-hero"><div class="ck-phase6-wrap"><div class="ck-phase6-banner"><strong>Phase 6 // Robinhood Chain Testnet only</strong><span>This temporary mint harness exists on the preview branch only.</span></div><div class="section-head"><div><div class="eyebrow">Candlekin // real wallet mint test</div><h1>Mint one. Prove the route.</h1></div><div class="subtle">This calls the canonical SeaDrop directly from your connected wallet. It does not use an owner mint or bypass the Candlekin contract.</div></div><div class="ck-phase6-grid"><div class="card ck-phase6-card"><div class="eyebrow">Test mint</div><div class="ck-phase6-price">0.000001 ETH</div><div class="ck-phase6-unit">1 Candlekin // max 1 for this Public Drop wallet</div><div class="ck-phase6-wallet"><span>Connected wallet</span><code>${connected()?esc(short(state.walletAddress)):'Not connected'}</code></div>${ownerWarning}<div class="ck-phase6-actions">${mintAction()}${connected()?'<button class="btn ghost" type="button" onclick="disconnectWallet()">Disconnect</button>':''}</div><div class="ck-phase6-note">Your wallet should be on Robinhood Chain Testnet (46630) and hold enough testnet ETH for 0.000001 ETH plus gas. Do not use the owner/deployer wallet for this checkpoint.</div>${statusHtml()}</div><div class="card"><div class="eyebrow">Route verification</div><h3>What this button calls.</h3><div class="ck-phase6-facts list"><div class="list-row"><span>Network</span><strong>Robinhood Testnet // 46630</strong></div><div class="list-row"><span>SeaDrop</span><strong>${short(SEADROP)}</strong></div><div class="list-row"><span>Candlekin</span><strong>${short(CANDLEKIN)}</strong></div><div class="list-row"><span>Function</span><strong>mintPublic(..., 1)</strong></div><div class="list-row"><span>Recipient</span><strong>Connected wallet</strong></div><div class="list-row"><span>Configured end</span><strong>${formatEnd()}</strong></div>${mintState.supplyBefore!==null?`<div class="list-row"><span>Supply before</span><strong>${mintState.supplyBefore}</strong></div>`:''}${mintState.supplyAfter!==null?`<div class="list-row"><span>Supply after</span><strong>${mintState.supplyAfter}</strong></div>`:''}</div><div class="notice" style="margin-top:18px">The deployed testnet contract is already revealed from earlier validation. During MINT_LIVE, Candlekin.xyz still keeps owned cards visually sealed until the lifecycle is switched to REVEALED.</div></div></div></div></section>`;
  };

  async function ensureChain(p){
    const chain=await p.request({method:'eth_chainId'});
    if(String(chain).toLowerCase()===TESTNET_CHAIN_HEX)return;
    await p.request({method:'wallet_switchEthereumChain',params:[{chainId:TESTNET_CHAIN_HEX}]});
  }
  async function totalSupply(p){
    const raw=await p.request({method:'eth_call',params:[{to:CANDLEKIN,data:TOTAL_SUPPLY_SELECTOR},'latest']});
    return Number(BigInt(raw||'0x0'));
  }
  async function waitReceipt(p,hash){
    const started=Date.now();
    while(Date.now()-started<180000){
      const receipt=await p.request({method:'eth_getTransactionReceipt',params:[hash]});
      if(receipt)return receipt;
      await new Promise(resolve=>setTimeout(resolve,1800));
    }
    throw new Error('Transaction is still pending after 3 minutes. Use the transaction link to continue tracking it.');
  }
  function explainError(err){
    const raw=String(err?.shortMessage||err?.message||err||'Mint failed.');
    if(/user rejected|user denied|4001/i.test(raw))return 'Transaction was rejected in the wallet.';
    if(/insufficient funds/i.test(raw))return 'This wallet does not have enough Robinhood Testnet ETH for mint price plus gas.';
    if(/NotActive|not active|start|end time/i.test(raw))return 'The configured SeaDrop Public Drop is not active at this time.';
    if(/MintQuantityExceedsMaxMintedPerWallet|max minted|wallet/i.test(raw))return 'This wallet has already reached the Phase 6 Public Drop wallet limit.';
    if(/IncorrectPayment|payment/i.test(raw))return 'SeaDrop rejected the payment amount. Expected exactly 0.000001 ETH.';
    return raw.length>280?raw.slice(0,277)+'…':raw;
  }

  window.phase6MintOne=async function(){
    if(state.phase!=='PUBLIC_MINT'||mintState.status==='pending')return;
    try{
      if(!connected()){
        connectWallet();
        return;
      }
      if(isOwner())throw new Error('Phase 6 requires a non-owner wallet. Disconnect the deployer wallet and connect another wallet.');
      const p=provider();
      if(!p)throw new Error('Connected wallet provider is unavailable. Reconnect the wallet and try again.');
      await ensureChain(p);
      const accounts=await p.request({method:'eth_accounts'});
      const from=String(accounts?.[0]||state.walletAddress||'');
      if(!from)throw new Error('No connected account was returned by the wallet.');
      if(from.toLowerCase()===OWNER)throw new Error('Phase 6 requires a non-owner wallet.');
      mintState.supplyBefore=await totalSupply(p);
      mintState.supplyAfter=null;
      mintState.status='pending';
      mintState.message='Simulating the canonical SeaDrop mint before wallet approval…';
      mintState.txHash='';
      render();
      const tx={from,to:SEADROP,value:PRICE_HEX,data:mintCalldata()};
      await p.request({method:'eth_estimateGas',params:[tx]});
      mintState.message='Simulation passed. Approve the transaction in your wallet.';
      render();
      const hash=await p.request({method:'eth_sendTransaction',params:[tx]});
      mintState.txHash=hash;
      mintState.message='Wallet approved. Waiting for the transaction receipt…';
      render();
      const receipt=await waitReceipt(p,hash);
      if(!receipt||BigInt(receipt.status||'0x0')!==1n)throw new Error('Transaction was mined but reverted.');
      mintState.supplyAfter=await totalSupply(p);
      const delta=mintState.supplyAfter-mintState.supplyBefore;
      if(delta!==1)throw new Error(`Transaction succeeded, but supply changed by ${delta} instead of exactly 1. Check the explorer before continuing.`);
      mintState.status='success';
      mintState.message=`Supply moved ${mintState.supplyBefore} → ${mintState.supplyAfter}. Candlekin #${mintState.supplyAfter} was minted through canonical SeaDrop to the connected wallet.`;
      render();
      try{await window.refreshCandlekinWallet?.();}catch(_){/* collection can be refreshed manually */}
    }catch(err){
      console.error('[Candlekin Phase 6 mint]',err);
      mintState.status='error';
      mintState.message=explainError(err);
      render();
    }
  };

  if(phases?.PUBLIC_MINT){
    phases.PUBLIC_MINT.status='Phase 6 testnet mint ready';
    phases.PUBLIC_MINT.cta='Testnet mint';
    phases.PUBLIC_MINT.help='Temporary preview-only SeaDrop mint harness. Use a non-owner wallet on Robinhood Chain Testnet.';
  }

  const priorRender=render;
  render=function(){priorRender();};
  render();
})();

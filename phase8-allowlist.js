(function(){
  const TESTNET_CHAIN_HEX='0xb626';
  const CANDLEKIN='0x3D8A54bdee95791D4AE9D9D5163bf6ddA3c607f8';
  const SEADROP='0x00005EA00Ac477B1030CE78506496e8C2dE24bf5';
  const FEE_RECIPIENT='0x10E4ea8dAc0c3CeC091f33F3521d7eB1A3A5206A';
  const MINT_ALLOWLIST_SELECTOR='0x4300a4e6';
  const TOTAL_SUPPLY_SELECTOR='0x18160ddd';
  const EXPLORER='https://explorer.testnet.chain.robinhood.com';
  const ROOT='0x028ed64933893dc3afb03d48c4c87a86d8f5509b74f1a284b03565c5b5b3c6cc';
  const NOT_SELECTED='0xa85c8d2a471bbd8888f618f4ba6db3d8e6773d09';

  const TIERS={
    '0x7cf0c0d155a6a3d8c2ee3fb42239951e6379c31e':{
      role:'GTD',
      mintPrice:0n,
      maxTotalMintableByWallet:1n,
      startTime:1789463412n,
      endTime:1789485312n,
      dropStageIndex:1n,
      maxTokenSupplyForStage:4096n,
      feeBps:0n,
      restrictFeeRecipients:false,
      proof:['0xdb1368d306e2b48e873b1a3a97b92c3d1e2356ef389aa0e6187246337af36588']
    },
    '0xf590b355cc15ab7bae1a01bcff1654bb0c0a3fac':{
      role:'FCFS',
      mintPrice:2000000000000n,
      maxTotalMintableByWallet:1n,
      startTime:1789463412n,
      endTime:1789485312n,
      dropStageIndex:2n,
      maxTokenSupplyForStage:4096n,
      feeBps:0n,
      restrictFeeRecipients:false,
      proof:['0x3ced42af7662d25c3f2188d9e699ba56afed71a61ec481aa1d3a9ba35f25893a']
    }
  };

  const mintState={status:'idle',message:'',txHash:'',supplyBefore:null,supplyAfter:null,wallet:'',capCheck:''};

  function esc(value){return String(value??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));}
  function provider(){
    const selected=window.CandlekinWalletProvider?.get?.();
    if(selected&&typeof selected.request==='function')return selected;
    if(window.okxwallet&&typeof window.okxwallet.request==='function')return window.okxwallet;
    if(window.ethereum&&typeof window.ethereum.request==='function')return window.ethereum;
    return null;
  }
  function short(address){return address?`${address.slice(0,6)}…${address.slice(-4)}`:'—';}
  function connected(){return !!(state.walletConnected&&state.walletAddress);}
  function currentAddress(){return String(state.walletAddress||'').toLowerCase();}
  function tier(){return TIERS[currentAddress()]||null;}
  function isNotSelected(){return currentAddress()===NOT_SELECTED;}
  function padAddress(address){return String(address).toLowerCase().replace(/^0x/,'').padStart(64,'0');}
  function padUint(value){return BigInt(value).toString(16).padStart(64,'0');}
  function padBool(value){return value?'1'.padStart(64,'0'):'0'.repeat(64);}
  function word32(value){return String(value).toLowerCase().replace(/^0x/,'').padStart(64,'0');}
  function valueHex(value){return '0x'+BigInt(value).toString(16);}
  function formatPrice(value){return BigInt(value)===0n?'0 ETH':`${Number(BigInt(value))/1e18} ETH`;}
  function formatTime(value){
    return new Intl.DateTimeFormat('en-GB',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Jakarta'}).format(new Date(Number(value)*1000))+' WIB';
  }
  function resetIfWalletChanged(){
    const addr=currentAddress();
    if(mintState.wallet&&mintState.wallet!==addr){
      mintState.status='idle';mintState.message='';mintState.txHash='';mintState.supplyBefore=null;mintState.supplyAfter=null;mintState.capCheck='';
    }
    mintState.wallet=addr;
  }
  function mintCalldata(cfg){
    const words=[
      padAddress(CANDLEKIN),
      padAddress(FEE_RECIPIENT),
      '0'.repeat(64),
      padUint(1),
      padUint(cfg.mintPrice),
      padUint(cfg.maxTotalMintableByWallet),
      padUint(cfg.startTime),
      padUint(cfg.endTime),
      padUint(cfg.dropStageIndex),
      padUint(cfg.maxTokenSupplyForStage),
      padUint(cfg.feeBps),
      padBool(cfg.restrictFeeRecipients),
      padUint(13*32)
    ];
    const tail=[padUint(cfg.proof.length),...cfg.proof.map(word32)];
    return MINT_ALLOWLIST_SELECTOR+words.join('')+tail.join('');
  }
  function statusHtml(){
    const cap=mintState.capCheck?`<p style="margin-top:8px">${esc(mintState.capCheck)}</p>`:'';
    if(mintState.status==='pending')return `<div class="ck-phase6-status pending"><strong><span class="ck-phase6-spinner"></span>Allowlist mint submitted.</strong><p>${esc(mintState.message||'Waiting for confirmation…')}</p>${mintState.txHash?`<a class="ck-phase6-hash" href="${EXPLORER}/tx/${mintState.txHash}" target="_blank" rel="noopener noreferrer">${mintState.txHash} ↗</a>`:''}</div>`;
    if(mintState.status==='success')return `<div class="ck-phase6-status success"><strong>Allowlist mint confirmed.</strong><p>${esc(mintState.message)}</p>${cap}${mintState.txHash?`<a class="ck-phase6-hash" href="${EXPLORER}/tx/${mintState.txHash}" target="_blank" rel="noopener noreferrer">${mintState.txHash} ↗</a>`:''}<div class="ck-phase6-actions"><button class="btn secondary" type="button" onclick="setPage('collection')">View My Candlekin</button></div></div>`;
    if(mintState.status==='error')return `<div class="ck-phase6-status error"><strong>Mint not completed.</strong><p>${esc(mintState.message)}</p>${mintState.txHash?`<a class="ck-phase6-hash" href="${EXPLORER}/tx/${mintState.txHash}" target="_blank" rel="noopener noreferrer">${mintState.txHash} ↗</a>`:''}</div>`;
    return `<div class="ck-phase6-status"><strong>Phase 8 allowlist route ready.</strong><p>The site estimates the exact SeaDrop allowlist call before your wallet can sign anything.</p></div>`;
  }
  function eligibilityHtml(){
    if(!connected())return '<div class="notice">Connect one of the curated GTD or FCFS test wallets. No transaction is prepared until the connected address matches a proof bundle.</div>';
    const cfg=tier();
    if(cfg)return `<div class="notice"><strong>${cfg.role} proof matched.</strong><br>Wallet ${esc(short(state.walletAddress))} is mapped to the Phase 8 ${cfg.role} leaf and proof.</div>`;
    if(isNotSelected())return '<div class="ck-phase6-owner-warning"><strong>NOT_SELECTED — correctly excluded.</strong><br>This wallet has no valid Phase 8 Merkle proof. The website will not send a mint transaction from it.</div>';
    return '<div class="ck-phase6-owner-warning"><strong>No Phase 8 proof for this wallet.</strong><br>Disconnect and connect the curated GTD or FCFS test wallet.</div>';
  }
  function mintAction(){
    if(!connected())return '<button class="btn" type="button" onclick="connectWallet()">Connect GTD / FCFS wallet</button>';
    const cfg=tier();
    if(!cfg)return '<button class="btn" type="button" disabled>Wallet not eligible</button>';
    if(mintState.status==='pending')return '<button class="btn" type="button" disabled>Mint pending…</button>';
    if(mintState.status==='success')return '<button class="btn" type="button" disabled>Mint completed for this test</button>';
    return `<button class="btn" type="button" onclick="phase8MintOne()">Mint 1 // ${cfg.role}</button>`;
  }

  const previousMintPage=mintPage;
  mintPage=function(){
    if(state.phase!=='PUBLIC_MINT')return previousMintPage();
    resetIfWalletChanged();
    const cfg=tier();
    const role=cfg?.role||'—';
    const price=cfg?formatPrice(cfg.mintPrice):'—';
    const end=cfg?formatTime(cfg.endTime):'—';
    return `<section class="ck-phase6-hero"><div class="ck-phase6-wrap"><div class="ck-phase6-banner"><strong>Phase 8 // allowlist testnet mint</strong><span>Public mint is disabled. Only the embedded GTD / FCFS proofs can use this temporary preview harness.</span></div><div class="section-head"><div><div class="eyebrow">Candlekin // GTD + FCFS verification</div><h1>Mint from the allowlist.</h1></div><div class="subtle">The wallet signs a canonical SeaDrop <code>mintAllowList</code> call. The proof is public test data; no private key or owner mint is involved.</div></div><div class="ck-phase6-grid"><div class="card ck-phase6-card"><div class="eyebrow">Matched allocation</div><div class="ck-phase6-price">${esc(price)}</div><div class="ck-phase6-unit">${esc(role)} // max 1 for this test wallet</div><div class="ck-phase6-wallet"><span>Connected wallet</span><code>${connected()?esc(short(state.walletAddress)):'Not connected'}</code></div>${eligibilityHtml()}<div class="ck-phase6-actions">${mintAction()}${connected()?'<button class="btn ghost" type="button" onclick="disconnectWallet()">Disconnect</button>':''}</div><div class="ck-phase6-note">GTD: 0 ETH. FCFS: 0.000002 ETH. Gas still requires Robinhood Testnet ETH. The stage window ends ${esc(end)}.</div>${statusHtml()}</div><div class="card"><div class="eyebrow">Route verification</div><h3>What this test proves.</h3><div class="ck-phase6-facts list"><div class="list-row"><span>Network</span><strong>Robinhood Testnet // 46630</strong></div><div class="list-row"><span>SeaDrop</span><strong>${short(SEADROP)}</strong></div><div class="list-row"><span>Candlekin</span><strong>${short(CANDLEKIN)}</strong></div><div class="list-row"><span>Merkle root</span><strong>${short(ROOT)}</strong></div><div class="list-row"><span>Function</span><strong>mintAllowList(..., 1)</strong></div><div class="list-row"><span>Allocation</span><strong>${esc(role)}</strong></div>${cfg?`<div class="list-row"><span>Stage index</span><strong>${cfg.dropStageIndex}</strong></div><div class="list-row"><span>Stage end</span><strong>${esc(end)}</strong></div>`:''}${mintState.supplyBefore!==null?`<div class="list-row"><span>Supply before</span><strong>${mintState.supplyBefore}</strong></div>`:''}${mintState.supplyAfter!==null?`<div class="list-row"><span>Supply after</span><strong>${mintState.supplyAfter}</strong></div>`:''}</div><div class="notice" style="margin-top:18px">The testnet NFT contract is already revealed from earlier validation. While lifecycle is MINT_LIVE, My Candlekin still hides final artwork and traits until the UI is switched to REVEALED.</div></div></div></div></section>`;
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
    throw new Error('Transaction is still pending after 3 minutes. Use the explorer link to continue tracking it.');
  }
  function explainError(err,cfg){
    const raw=String(err?.shortMessage||err?.message||err||'Mint failed.');
    if(/user rejected|user denied|4001/i.test(raw))return 'Transaction was rejected in the wallet.';
    if(/insufficient funds/i.test(raw))return 'This wallet does not have enough Robinhood Testnet ETH for mint value plus gas.';
    if(/NotActive|not active|start|end time/i.test(raw))return 'This allowlist stage is not active at the current block time.';
    if(/MintQuantityExceedsMaxMintedPerWallet|max minted|exceeds.*wallet/i.test(raw))return 'SeaDrop rejected the mint because this wallet has already reached its 1-per-wallet cap.';
    if(/InvalidProof|proof/i.test(raw))return 'SeaDrop rejected the Merkle proof for this wallet and MintParams bundle.';
    if(/IncorrectPayment|payment/i.test(raw))return `SeaDrop rejected the payment amount. Expected ${formatPrice(cfg?.mintPrice||0n)}.`;
    return raw.length>320?raw.slice(0,317)+'…':raw;
  }
  async function checkWalletCap(p,tx){
    try{
      await p.request({method:'eth_estimateGas',params:[tx]});
      return 'WARNING: a second mint still simulated successfully; do not send another transaction.';
    }catch(err){
      const raw=String(err?.shortMessage||err?.message||err||'');
      if(/MintQuantityExceedsMaxMintedPerWallet|max minted|exceeds.*wallet/i.test(raw))return 'Wallet-cap check PASS: a second mint is rejected by SeaDrop.';
      return 'Second-mint simulation reverted as expected, but the wallet RPC did not expose a decoded cap error.';
    }
  }

  window.phase8MintOne=async function(){
    if(state.phase!=='PUBLIC_MINT'||mintState.status==='pending')return;
    const cfg=tier();
    try{
      if(!connected()){
        connectWallet();
        return;
      }
      if(!cfg)throw new Error('This connected wallet has no Phase 8 GTD/FCFS proof.');
      const p=provider();
      if(!p)throw new Error('Connected wallet provider is unavailable. Reconnect and try again.');
      await ensureChain(p);
      const accounts=await p.request({method:'eth_accounts'});
      const from=String(accounts?.[0]||state.walletAddress||'').toLowerCase();
      if(!from)throw new Error('No connected account was returned by the wallet.');
      if(from!==currentAddress())throw new Error('Wallet account changed. Refresh or reconnect before minting.');
      if(!TIERS[from])throw new Error('This wallet is not part of the Phase 8 allowlist test.');

      mintState.wallet=from;
      mintState.supplyBefore=await totalSupply(p);
      mintState.supplyAfter=null;
      mintState.capCheck='';
      mintState.status='pending';
      mintState.message=`Simulating the ${cfg.role} allowlist call before wallet approval…`;
      mintState.txHash='';
      render();

      const tx={from,to:SEADROP,value:valueHex(cfg.mintPrice),data:mintCalldata(cfg)};
      await p.request({method:'eth_estimateGas',params:[tx]});
      mintState.message=`Simulation passed for ${cfg.role}. Approve the transaction in your wallet.`;
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

      mintState.capCheck=await checkWalletCap(p,tx);
      mintState.status='success';
      mintState.message=`${cfg.role} mint succeeded. Supply moved ${mintState.supplyBefore} → ${mintState.supplyAfter}; the new Candlekin is owned by the connected allowlisted wallet.`;
      render();
      try{await window.refreshCandlekinWallet?.();}catch(_){/* collection can be refreshed manually */}
    }catch(err){
      console.error('[Candlekin Phase 8 allowlist mint]',err);
      mintState.status='error';
      mintState.message=explainError(err,cfg);
      render();
    }
  };

  if(phases?.PUBLIC_MINT){
    phases.PUBLIC_MINT.status='Phase 8 allowlist test ready';
    phases.PUBLIC_MINT.cta='Allowlist mint';
    phases.PUBLIC_MINT.help='Temporary preview-only GTD / FCFS SeaDrop allowlist harness. Public mint is disabled.';
  }

  const priorRender=render;
  render=function(){priorRender();};
  render();
})();

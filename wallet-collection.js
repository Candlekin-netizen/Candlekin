(function(){
  const CHAIN_ID_DEC = 4663;
  const CHAIN_ID_HEX = '0x1237';
  const CONTRACT = '0x1422F37Cdc2a845B9dB8b5D4faDf9C6AFA1d3A50';
  const RPC_URL = `${window.location.origin}/api/rpc-mainnet`;
  const EXPLORER_URL = 'https://robinhoodchain.blockscout.com';
  const LIGHTHOUSE_GATEWAY = 'https://fast-narwhal-vdgsu.lighthouseweb3.xyz/ipfs/';
  const TOKEN_URI_SELECTOR = '0xc87b56dd';

  state.walletConnected = false;
  state.walletAddress = '';
  state.walletLoading = false;
  state.walletError = '';
  state.walletOwnedData = [];
  state.owned = [];

  let listenersBound = false;
  let boundProvider = null;

  function walletProvider(){
    if(window.CandlekinWalletProvider && typeof window.CandlekinWalletProvider.get === 'function'){
      const p = window.CandlekinWalletProvider.get();
      if(p && typeof p.request === 'function') return p;
    }
    if(window.okxwallet && typeof window.okxwallet.request === 'function') return window.okxwallet;
    if(window.ethereum && typeof window.ethereum.request === 'function') return window.ethereum;
    return null;
  }

  function shortAddress(address){
    return address ? `${address.slice(0,6)}…${address.slice(-4)}` : '';
  }

  function encodeUint(value){
    return BigInt(value).toString(16).padStart(64,'0');
  }

  function decodeAbiString(raw){
    if(!raw || raw === '0x') return '';
    const hex = raw.slice(2);
    if(hex.length < 128) return '';
    const offset = Number(BigInt('0x' + hex.slice(0,64))) * 2;
    const length = Number(BigInt('0x' + hex.slice(offset, offset + 64)));
    const start = offset + 64;
    const data = hex.slice(start, start + length * 2);
    const pairs = data.match(/.{1,2}/g) || [];
    const bytes = new Uint8Array(pairs.map(v => parseInt(v,16)));
    return new TextDecoder().decode(bytes);
  }

  function ipfsToHttp(uri){
    if(!uri) return '';
    if(uri.startsWith('ipfs://')) return LIGHTHOUSE_GATEWAY + uri.slice(7);
    return uri;
  }

  async function ensureMainnet(provider){
    if(!provider) throw new Error('No browser wallet detected. Install a wallet that supports EVM networks.');
    const current = await provider.request({method:'eth_chainId'});
    if(String(current).toLowerCase() === CHAIN_ID_HEX.toLowerCase()) return;
    try{
      await provider.request({method:'wallet_switchEthereumChain',params:[{chainId:CHAIN_ID_HEX}]});
    }catch(err){
      if(err && Number(err.code) === 4902){
        await provider.request({
          method:'wallet_addEthereumChain',
          params:[{
            chainId:CHAIN_ID_HEX,
            chainName:'Robinhood Chain',
            nativeCurrency:{name:'Ether',symbol:'ETH',decimals:18},
            rpcUrls:[RPC_URL],
            blockExplorerUrls:[EXPLORER_URL]
          }]
        });
        return;
      }
      throw err;
    }
  }

  async function ethCall(data){
    const provider = walletProvider();
    if(!provider) throw new Error('Wallet provider is unavailable.');
    return await provider.request({
      method:'eth_call',
      params:[{to:CONTRACT,data},'latest']
    });
  }

  async function tokenUri(tokenId){
    return decodeAbiString(await ethCall(TOKEN_URI_SELECTOR + encodeUint(tokenId)));
  }

  async function getOwnedIds(address){
    const response = await fetch(`/api/owned?address=${encodeURIComponent(address)}`, {cache:'no-store'});
    const data = await response.json().catch(()=>({}));
    if(!response.ok || !data.ok){
      const messages={
        MAINNET_RPC_NOT_CONFIGURED:'Candlekin Mainnet RPC is not configured on the website yet.',
        OWNERSHIP_INDEX_MISMATCH:'Ownership index is still synchronizing. Try again shortly.',
        OWNERSHIP_LOOKUP_FAILED:'Unable to read Candlekin ownership from Robinhood Chain.'
      };
      throw new Error(messages[data.error] || 'Unable to load Candlekin ownership.');
    }
    return Array.isArray(data.ids) ? data.ids.map(Number).filter(Number.isFinite).sort((a,b)=>a-b) : [];
  }

  async function getTokenData(tokenId){
    const uri = await tokenUri(tokenId);
    const metadataUrl = ipfsToHttp(uri);
    const response = await fetch(metadataUrl,{cache:'no-store'});
    if(!response.ok) throw new Error(`Metadata for #${tokenId} returned HTTP ${response.status}.`);
    const metadata = await response.json();
    return {
      id:tokenId,
      uri,
      metadataUrl,
      name:metadata.name || `Candlekin #${String(tokenId).padStart(4,'0')}`,
      description:metadata.description || '',
      image:metadata.image || '',
      imageUrl:ipfsToHttp(metadata.image || ''),
      attributes:Array.isArray(metadata.attributes) ? metadata.attributes : []
    };
  }

  async function loadOwnedCollection(){
    if(!state.walletAddress || !walletProvider()) return;
    state.walletLoading = true;
    state.walletError = '';
    state.walletOwnedData = [];
    render();
    try{
      const ids = await getOwnedIds(state.walletAddress);
      state.owned = ids;
      state.walletOwnedData = await Promise.all(ids.map(getTokenData));
    }catch(err){
      console.error('[Candlekin wallet reader]',err);
      state.walletError = err && err.message ? err.message : 'Unable to load this wallet collection.';
      state.owned = [];
      state.walletOwnedData = [];
    }finally{
      state.walletLoading = false;
      render();
    }
  }

  function bindWalletListeners(){
    const provider = walletProvider();
    if(!provider || !provider.on || (listenersBound && boundProvider === provider)) return;
    listenersBound = true;
    boundProvider = provider;
    provider.on('accountsChanged',async accounts => {
      if(!accounts || !accounts.length){
        disconnectWallet();
        return;
      }
      state.walletAddress = accounts[0];
      state.walletConnected = true;
      await loadOwnedCollection();
    });
    provider.on('chainChanged',async chainId => {
      if(String(chainId).toLowerCase() !== CHAIN_ID_HEX.toLowerCase()){
        state.walletConnected = false;
        state.walletAddress = '';
        state.walletOwnedData = [];
        state.owned = [];
        state.walletError = `Switch to Robinhood Chain Mainnet (Chain ID ${CHAIN_ID_DEC}) to read My Candlekin.`;
        render();
        return;
      }
      if(state.walletAddress) await loadOwnedCollection();
    });
  }

  connectWallet = async function(){
    state.walletError = '';
    try{
      const provider = walletProvider();
      if(!provider) throw new Error('No browser wallet detected. Install or unlock an EVM wallet first.');
      await ensureMainnet(provider);
      const accounts = await provider.request({method:'eth_requestAccounts'});
      if(!accounts || !accounts.length) throw new Error('Wallet connection was not approved.');
      state.walletAddress = accounts[0];
      state.walletConnected = true;
      bindWalletListeners();
      await loadOwnedCollection();
    }catch(err){
      state.walletConnected = false;
      state.walletAddress = '';
      state.walletLoading = false;
      state.walletError = err && err.message ? err.message : 'Wallet connection failed.';
      render();
    }
  };

  disconnectWallet = function(){
    state.walletConnected = false;
    state.walletAddress = '';
    state.walletLoading = false;
    state.walletError = '';
    state.walletOwnedData = [];
    state.owned = [];
    render();
  };

  window.connectWallet = connectWallet;
  window.disconnectWallet = disconnectWallet;
  window.refreshCandlekinWallet = loadOwnedCollection;

  function traitRows(attributes){
    if(!attributes.length) return '<p class="wallet-muted">No trait attributes returned by metadata.</p>';
    return `<div class="wallet-traits">${attributes.map(a=>`<div class="wallet-trait"><span>${escapeHtml(a.trait_type || 'Trait')}</span><strong>${escapeHtml(a.value ?? '—')}</strong></div>`).join('')}</div>`;
  }

  function connectedCollection(){
    if(state.walletLoading){
      return `<div class="wallet-collection-state"><div class="wallet-spinner"></div><h3>Reading your wallet…</h3><p>Reading ownership from Candlekin on Robinhood Chain Mainnet, then loading metadata through the Candlekin Lighthouse gateway.</p></div>`;
    }
    if(state.walletError){
      return `<div class="wallet-collection-state wallet-error"><h3>Could not load My Candlekin.</h3><p>${escapeHtml(state.walletError)}</p><button class="btn secondary" type="button" onclick="refreshCandlekinWallet()">Try again</button></div>`;
    }
    if(!state.walletOwnedData.length){
      return `<div class="wallet-collection-state"><div class="eyebrow">0 Candlekin found</div><h3>This wallet does not own a Candlekin yet.</h3><p>Once this wallet mints or receives a Candlekin on Robinhood Chain Mainnet, it will appear here automatically.</p><button class="btn secondary" type="button" onclick="refreshCandlekinWallet()">Refresh</button></div>`;
    }
    return `<div class="nft-grid wallet-nft-grid">${state.walletOwnedData.map(token=>`<article class="card nft-card wallet-nft-card"><a class="wallet-image-link" href="${escapeHtml(token.metadataUrl)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(token.imageUrl)}" alt="${escapeHtml(token.name)}"></a><div class="wallet-card-head"><div><div class="tiny">Token #${token.id}</div><div class="token">${escapeHtml(token.name)}</div></div><span class="pill">Owned</span></div>${traitRows(token.attributes)}${state.phase==='REVEALED'?`<div class="actions"><button class="btn small" type="button" onclick="openGenome(${token.id})">Open in Market Lab</button><a class="btn small secondary wallet-link-btn" href="${EXPLORER_URL}/token/${CONTRACT}/instance/${token.id}" target="_blank" rel="noopener noreferrer">Explorer ↗</a></div>`:''}</article>`).join('')}</div>`;
  }

  collectionPage = function(){
    const revealed = state.phase === 'REVEALED';
    const connected = state.walletConnected && state.walletAddress;
    return `<section class="hero wallet-hero"><div class="wrap hero-grid"><div><div class="eyebrow">Collection // My Candlekin</div><h1>View your Candlekin.</h1><p class="lead">Connect your wallet to read the Candlekin it owns on Robinhood Chain Mainnet. Your collection loads directly below on this page.</p>${connected?`<div class="wallet-connected-box"><span class="dot"></span><div><span>Connected wallet</span><strong>${escapeHtml(shortAddress(state.walletAddress))}</strong></div></div><div class="actions"><button class="btn secondary" type="button" onclick="refreshCandlekinWallet()">Refresh collection</button><button class="btn ghost" type="button" onclick="disconnectWallet()">Disconnect</button></div>`:`<div class="actions"><button class="btn" type="button" onclick="connectWallet()">Connect wallet</button></div>${state.walletError?`<div class="wallet-inline-error">${escapeHtml(state.walletError)}</div>`:''}`}</div>${heroArt(revealed?'Revealed collection':'Sealed collection')}</div></section><section class="wallet-collection-section"><div class="wrap"><div class="section-head"><div><div class="eyebrow">Owned tokens</div><h2>Your collection.</h2></div><div class="subtle">Ownership is indexed from the deployed Candlekin Mainnet contract. ${revealed?'Final metadata and artwork are loaded through the Candlekin Lighthouse IPFS gateway.':'Token ownership is visible while identity remains sealed.'}</div></div>${connected?connectedCollection():`<div class="wallet-collection-lock"><div class="wallet-lock-icon">◆</div><h3>Connect a wallet to view its Candlekin.</h3><p>No demo collection is shown here. This area only displays tokens owned by the connected address.</p><button class="btn" type="button" onclick="connectWallet()">Connect wallet</button></div>`}</div></section>`;
  };

  bindWalletListeners();
  render();
})();

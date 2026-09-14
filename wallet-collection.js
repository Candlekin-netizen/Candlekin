(function(){
  const CHAIN_ID_DEC = 46630;
  const CHAIN_ID_HEX = '0xB626';
  const CONTRACT = '0x3D8A54bdee95791D4AE9D9D5163bf6ddA3c607f8';
  const DEPLOY_BLOCK = 119220627;
  const RPC_URL = 'https://rpc.testnet.chain.robinhood.com';
  const EXPLORER_URL = 'https://explorer.testnet.chain.robinhood.com';
  const LIGHTHOUSE_GATEWAY = 'https://fast-narwhal-vdgsu.lighthouseweb3.xyz/ipfs/';
  const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
  const TOKEN_URI_SELECTOR = '0xc87b56dd';

  state.walletConnected = false;
  state.walletAddress = '';
  state.walletLoading = false;
  state.walletError = '';
  state.walletOwnedData = [];

  let listenersBound = false;

  function shortAddress(address){
    return address ? `${address.slice(0,6)}…${address.slice(-4)}` : '';
  }

  function topicAddress(address){
    return '0x' + address.toLowerCase().replace(/^0x/,'').padStart(64,'0');
  }

  function indexedAddress(topic){
    return '0x' + String(topic || '').slice(-40).toLowerCase();
  }

  function hexTokenId(topic){
    return Number(BigInt(topic));
  }

  function ipfsToHttp(uri){
    if(!uri) return '';
    if(uri.startsWith('ipfs://')) return LIGHTHOUSE_GATEWAY + uri.slice(7);
    return uri;
  }

  function decodeAbiString(raw){
    if(!raw || raw === '0x') return '';
    const hex = raw.slice(2);
    if(hex.length < 128) return '';
    const offset = Number(BigInt('0x' + hex.slice(0,64))) * 2;
    const length = Number(BigInt('0x' + hex.slice(offset, offset + 64)));
    const start = offset + 64;
    const data = hex.slice(start, start + length * 2);
    const bytes = new Uint8Array(data.match(/.{1,2}/g).map(v => parseInt(v,16)));
    return new TextDecoder().decode(bytes);
  }

  async function ensureTestnet(){
    const provider = window.ethereum;
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
            chainName:'Robinhood Chain Testnet',
            nativeCurrency:{name:'Ether',symbol:'ETH',decimals:18},
            rpcUrls:[RPC_URL],
            blockExplorerUrls:[EXPLORER_URL]
          }]
        });
      }else{
        throw err;
      }
    }
  }

  async function ethCall(data){
    return await window.ethereum.request({
      method:'eth_call',
      params:[{to:CONTRACT,data},'latest']
    });
  }

  async function tokenUri(tokenId){
    const arg = BigInt(tokenId).toString(16).padStart(64,'0');
    return decodeAbiString(await ethCall(TOKEN_URI_SELECTOR + arg));
  }

  async function getOwnedIds(address){
    const addrTopic = topicAddress(address);
    const fromBlock = '0x' + DEPLOY_BLOCK.toString(16);
    const filters = [
      {address:CONTRACT,fromBlock,toBlock:'latest',topics:[TRANSFER_TOPIC,null,addrTopic]},
      {address:CONTRACT,fromBlock,toBlock:'latest',topics:[TRANSFER_TOPIC,addrTopic]}
    ];
    const [incoming,outgoing] = await Promise.all(filters.map(filter => window.ethereum.request({method:'eth_getLogs',params:[filter]})));
    const byLog = new Map();
    [...incoming,...outgoing].forEach(log => byLog.set(`${log.transactionHash}:${log.logIndex}`,log));
    const logs = [...byLog.values()].sort((a,b) => {
      const blockDiff = BigInt(a.blockNumber) - BigInt(b.blockNumber);
      if(blockDiff !== 0n) return blockDiff < 0n ? -1 : 1;
      const logDiff = BigInt(a.logIndex) - BigInt(b.logIndex);
      return logDiff < 0n ? -1 : logDiff > 0n ? 1 : 0;
    });
    const mine = new Set();
    const wallet = address.toLowerCase();
    for(const log of logs){
      const from = indexedAddress(log.topics[1]);
      const to = indexedAddress(log.topics[2]);
      const id = hexTokenId(log.topics[3]);
      if(from === wallet) mine.delete(id);
      if(to === wallet) mine.add(id);
    }
    return [...mine].sort((a,b)=>a-b);
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
    if(!state.walletAddress || !window.ethereum) return;
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
    if(listenersBound || !window.ethereum || !window.ethereum.on) return;
    listenersBound = true;
    window.ethereum.on('accountsChanged',async accounts => {
      if(!accounts || !accounts.length){
        disconnectWallet();
        return;
      }
      state.walletAddress = accounts[0];
      state.walletConnected = true;
      await loadOwnedCollection();
    });
    window.ethereum.on('chainChanged',async chainId => {
      if(String(chainId).toLowerCase() !== CHAIN_ID_HEX.toLowerCase()){
        state.walletConnected = false;
        state.walletAddress = '';
        state.walletOwnedData = [];
        state.owned = [];
        state.walletError = 'Switch to Robinhood Chain Testnet to read My Candlekin.';
        render();
        return;
      }
      if(state.walletAddress) await loadOwnedCollection();
    });
  }

  connectWallet = async function(){
    state.walletError = '';
    try{
      if(!window.ethereum) throw new Error('No browser wallet detected. Install an EVM wallet first.');
      await ensureTestnet();
      const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
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
      return `<div class="wallet-collection-state"><div class="wallet-spinner"></div><h3>Reading your wallet…</h3><p>Loading Candlekin ownership and metadata from Robinhood Chain Testnet.</p></div>`;
    }
    if(state.walletError){
      return `<div class="wallet-collection-state wallet-error"><h3>Could not load My Candlekin.</h3><p>${escapeHtml(state.walletError)}</p><button class="btn secondary" type="button" onclick="connectWallet()">Try again</button></div>`;
    }
    if(!state.walletOwnedData.length){
      return `<div class="wallet-collection-state"><div class="eyebrow">0 Candlekin found</div><h3>This wallet does not own a Candlekin on testnet yet.</h3><p>Once this wallet mints or receives a Candlekin, it will appear here automatically.</p><button class="btn secondary" type="button" onclick="refreshCandlekinWallet()">Refresh</button></div>`;
    }
    return `<div class="nft-grid wallet-nft-grid">${state.walletOwnedData.map(token=>`<article class="card nft-card wallet-nft-card"><a class="wallet-image-link" href="${escapeHtml(token.metadataUrl)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(token.imageUrl)}" alt="${escapeHtml(token.name)}"></a><div class="wallet-card-head"><div><div class="tiny">Token #${token.id}</div><div class="token">${escapeHtml(token.name)}</div></div><span class="pill">Owned</span></div>${traitRows(token.attributes)}${state.phase==='REVEALED'?`<div class="actions"><button class="btn small" type="button" onclick="openGenome(${token.id})">Open in Market Lab</button><a class="btn small secondary wallet-link-btn" href="${EXPLORER_URL}/token/${CONTRACT}/instance/${token.id}" target="_blank" rel="noopener noreferrer">Explorer ↗</a></div>`:''}</article>`).join('')}</div>`;
  }

  collectionPage = function(){
    const revealed = state.phase === 'REVEALED';
    const connected = state.walletConnected && state.walletAddress;
    return `<section class="hero wallet-hero"><div class="wrap hero-grid"><div><div class="eyebrow">Collection // My Candlekin</div><h1>View your Candlekin.</h1><p class="lead">Connect your wallet to read the Candlekin it owns on Robinhood Chain Testnet. Your collection loads directly below on this page.</p>${connected?`<div class="wallet-connected-box"><span class="dot"></span><div><span>Connected wallet</span><strong>${escapeHtml(shortAddress(state.walletAddress))}</strong></div></div><div class="actions"><button class="btn secondary" type="button" onclick="refreshCandlekinWallet()">Refresh collection</button><button class="btn ghost" type="button" onclick="disconnectWallet()">Disconnect</button></div>`:`<div class="actions"><button class="btn" type="button" onclick="connectWallet()">Connect wallet</button></div>${state.walletError?`<div class="wallet-inline-error">${escapeHtml(state.walletError)}</div>`:''}`}</div>${heroArt(revealed?'Revealed collection':'Sealed collection')}</div></section><section class="wallet-collection-section"><div class="wrap"><div class="section-head"><div><div class="eyebrow">Owned tokens</div><h2>Your collection.</h2></div><div class="subtle">Ownership is read from the deployed Candlekin testnet contract. ${revealed?'Final token metadata is live.':'Token ownership is visible while identity remains sealed.'}</div></div>${connected?connectedCollection():`<div class="wallet-collection-lock"><div class="wallet-lock-icon">◆</div><h3>Connect a wallet to view its Candlekin.</h3><p>No demo collection is shown here. This area only displays tokens owned by the connected address.</p><button class="btn" type="button" onclick="connectWallet()">Connect wallet</button></div>`}</div></section>`;
  };

  bindWalletListeners();
  render();
})();

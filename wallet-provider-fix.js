(function(){
  const providers=[];
  let selected=null;

  function providerName(provider, info){
    if(info?.name) return info.name;
    if(provider?.isRabby) return 'Rabby Wallet';
    if(provider?.isMetaMask) return 'MetaMask';
    if(provider?.isOkxWallet || provider?.isOKExWallet || provider===window.okxwallet) return 'OKX Wallet';
    if(provider?.isCoinbaseWallet) return 'Coinbase Wallet';
    return 'Browser Wallet';
  }

  function providerRdns(provider, info){
    if(info?.rdns) return info.rdns;
    if(provider?.isRabby) return 'io.rabby';
    if(provider?.isMetaMask) return 'io.metamask';
    if(provider?.isOkxWallet || provider?.isOKExWallet || provider===window.okxwallet) return 'com.okex.wallet';
    if(provider?.isCoinbaseWallet) return 'com.coinbase.wallet';
    return 'injected';
  }

  function add(provider, info={}){
    if(!provider || typeof provider.request!=='function') return;
    if(providers.some(item=>item.provider===provider)) return;
    providers.push({
      provider,
      info:{
        name:providerName(provider,info),
        rdns:providerRdns(provider,info),
        icon:info?.icon||'',
        uuid:info?.uuid||''
      }
    });
  }

  function collectLegacy(){
    add(window.okxwallet,{name:'OKX Wallet',rdns:'com.okex.wallet'});
    if(window.ethereum && Array.isArray(window.ethereum.providers)){
      window.ethereum.providers.forEach(provider=>add(provider));
    }
    add(window.ethereum);
  }

  window.addEventListener('eip6963:announceProvider',event=>{
    if(event?.detail?.provider) add(event.detail.provider,event.detail.info||{});
  });
  window.dispatchEvent(new Event('eip6963:requestProvider'));
  collectLegacy();
  setTimeout(collectLegacy,250);
  setTimeout(()=>window.dispatchEvent(new Event('eip6963:requestProvider')),350);

  window.CandlekinWalletProvider={
    list(){
      collectLegacy();
      return providers.slice();
    },
    select(providerOrItem){
      const provider=providerOrItem?.provider||providerOrItem;
      if(provider && typeof provider.request==='function') selected=provider;
      return selected;
    },
    clear(){selected=null;},
    get(){
      collectLegacy();
      if(selected && typeof selected.request==='function') return selected;
      const okx=providers.find(item=>item.provider===window.okxwallet || item.info.rdns==='com.okex.wallet');
      return okx?.provider || providers[0]?.provider || null;
    },
    info(provider){
      collectLegacy();
      const target=provider||this.get();
      return providers.find(item=>item.provider===target)?.info||{name:providerName(target),rdns:providerRdns(target),icon:'',uuid:''};
    },
    name(){return this.info().name||'';}
  };
})();

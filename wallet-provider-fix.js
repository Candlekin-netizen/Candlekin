(function(){
  function findOkxProvider(){
    if(window.okxwallet && typeof window.okxwallet.request === 'function') return window.okxwallet;
    if(window.ethereum && Array.isArray(window.ethereum.providers)){
      const match = window.ethereum.providers.find(p => p && (p.isOkxWallet || p.isOKExWallet) && typeof p.request === 'function');
      if(match) return match;
    }
    if(window.ethereum && (window.ethereum.isOkxWallet || window.ethereum.isOKExWallet) && typeof window.ethereum.request === 'function') return window.ethereum;
    return null;
  }

  const okx = findOkxProvider();
  if(!window.ethereum && okx){
    try{
      Object.defineProperty(window,'ethereum',{configurable:true,enumerable:true,writable:false,value:okx});
    }catch(_){
      try{ window.ethereum = okx; }catch(__){}
    }
  }

  window.CandlekinWalletProvider = {
    get(){
      return findOkxProvider() || (window.ethereum && typeof window.ethereum.request === 'function' ? window.ethereum : null);
    },
    name(){
      const p = this.get();
      if(!p) return '';
      return p.isOkxWallet || p.isOKExWallet || p === window.okxwallet ? 'OKX Wallet' : 'EVM Wallet';
    }
  };
})();

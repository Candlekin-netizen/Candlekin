(function(){
  function esc(value){return String(value??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));}
  function initials(name){return String(name||'W').split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();}
  function providerItems(){
    const api=window.CandlekinWalletProvider;
    if(!api||typeof api.list!=='function') return [];
    const seen=new Set();
    return api.list().filter(item=>{
      const key=item.info?.rdns||item.info?.uuid||item.info?.name||String(item.provider);
      if(seen.has(key)) return false;
      seen.add(key);
      return true;
    }).sort((a,b)=>{
      const order=name=>/metamask/i.test(name)?1:/rabby/i.test(name)?2:/okx/i.test(name)?3:/coinbase/i.test(name)?4:9;
      return order(a.info?.name)-order(b.info?.name);
    });
  }
  function close(){
    document.querySelector('.ck-wallet-backdrop')?.remove();
    document.body.classList.remove('ck-wallet-modal-open');
  }
  function walletButton(item,index){
    const info=item.info||{};
    const icon=info.icon?`<img src="${esc(info.icon)}" alt="">`:initials(info.name);
    return `<button class="ck-wallet-option" type="button" data-ck-wallet="${index}"><span class="ck-wallet-icon">${icon}</span><span class="ck-wallet-copy"><strong>${esc(info.name||'Browser Wallet')}</strong><span>${esc(info.rdns||'Injected EVM wallet')}</span></span><span class="ck-wallet-arrow">→</span></button>`;
  }
  function reownReady(){return !!(window.CandlekinAppKit&&typeof window.CandlekinAppKit.open==='function');}
  async function openReown(status){
    if(!reownReady()){
      if(status) status.textContent='WalletConnect is still initializing. Try again in a moment.';
      return;
    }
    try{
      if(status) status.textContent='Opening mobile and WalletConnect options…';
      close();
      await window.CandlekinAppKit.open();
    }catch(err){
      if(status) status.textContent=err?.message||'Unable to open WalletConnect.';
    }
  }
  function open(){
    close();
    const items=providerItems();
    const overlay=document.createElement('div');
    overlay.className='ck-wallet-backdrop';
    overlay.innerHTML=`<div class="ck-wallet-dialog" role="dialog" aria-modal="true" aria-label="Connect wallet"><div class="ck-wallet-head"><div><div class="eyebrow">Candlekin // wallet</div><h2>Connect wallet.</h2></div><button class="ck-wallet-close" type="button" aria-label="Close">×</button></div><div class="ck-wallet-body"><p class="ck-wallet-note">Choose a wallet detected in this browser, or use WalletConnect for QR and mobile wallet deep links. Candlekin never asks for your seed phrase or private key.</p><div class="ck-wallet-list">${items.length?items.map(walletButton).join(''):`<div class="ck-wallet-option ck-wallet-empty" style="cursor:default"><span class="ck-wallet-icon">!</span><span class="ck-wallet-copy"><strong>No browser wallet detected</strong><span>Use WalletConnect below, install a browser wallet, or open Candlekin inside a wallet browser.</span></span></div>`}</div><div class="ck-wallet-mobile"><button class="ck-wallet-option ck-wallet-reown" type="button" data-ck-reown><span class="ck-wallet-icon">QR</span><span class="ck-wallet-copy"><strong>More wallets / Mobile</strong><span>WalletConnect QR, mobile deep links and additional EVM wallets via Reown AppKit.</span></span><span class="ck-wallet-badge">${reownReady()?'READY':'LOADING'}</span></button></div><div class="ck-wallet-status" id="ckWalletStatus"></div><div class="ck-wallet-foot"><span>Robinhood Chain Testnet // 46630</span><span>Reown AppKit + Wagmi/Viem</span></div></div>`;
    document.body.appendChild(overlay);
    document.body.classList.add('ck-wallet-modal-open');
    const status=overlay.querySelector('#ckWalletStatus');
    overlay.querySelector('.ck-wallet-close')?.addEventListener('click',close);
    overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
    overlay.querySelector('[data-ck-reown]')?.addEventListener('click',()=>openReown(status));
    overlay.querySelectorAll('[data-ck-wallet]').forEach(button=>button.addEventListener('click',async()=>{
      const item=items[Number(button.dataset.ckWallet)];
      if(!item) return;
      try{
        status.textContent=`Opening ${item.info?.name||'wallet'}…`;
        window.CandlekinWalletProvider?.select(item);
        close();
        await legacyConnect();
      }catch(err){
        if(!document.body.contains(overlay)) document.body.appendChild(overlay);
        document.body.classList.add('ck-wallet-modal-open');
        status.textContent=err?.message||'Wallet connection failed.';
      }
    }));
    const readyHandler=()=>{
      const badge=overlay.querySelector('.ck-wallet-badge');
      if(badge) badge.textContent='READY';
    };
    window.addEventListener('candlekin:appkit-ready',readyHandler,{once:true});
  }

  const legacyConnect=window.connectWallet;
  if(typeof legacyConnect!=='function') return;
  window.CandlekinLegacyWalletConnect=legacyConnect;
  window.connectWallet=function(){open();};
  window.openCandlekinWallet=open;
  window.closeCandlekinWallet=close;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
})();

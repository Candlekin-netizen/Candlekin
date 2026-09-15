(function(){
  function sealOwnedCards(){
    if(state.phase==='REVEALED'||state.page!=='collection') return;
    document.querySelectorAll('.wallet-nft-card').forEach(card=>{
      card.classList.add('ck-sealed-owned-card');
      card.querySelector('.wallet-image-link')?.remove();
      card.querySelector('.wallet-traits')?.remove();
      card.querySelector('.actions')?.remove();
      if(!card.querySelector('.ck-sealed-owned-copy')){
        const copy=document.createElement('div');
        copy.className='ck-sealed-owned-copy';
        copy.innerHTML='<strong>Identity sealed</strong><p>Final artwork, visual traits and Market Genome stay hidden until Reveal.</p>';
        card.appendChild(copy);
      }
    });
  }

  const priorRender=render;
  render=function(){
    priorRender();
    sealOwnedCards();
  };

  // The testnet contract has already been revealed for validation. During simulated
  // pre-Reveal lifecycle phases, do not let the UI expose that final metadata via
  // the internal token preview modal.
  document.addEventListener('click',event=>{
    if(state.phase==='REVEALED') return;
    const card=event.target.closest('.wallet-nft-card');
    if(!card) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  },true);

  sealOwnedCards();
})();

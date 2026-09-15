(function(){
  const COLLECTION_SIZE=4096;
  const LIGHTHOUSE_GATEWAY='https://fast-narwhal-vdgsu.lighthouseweb3.xyz/ipfs/';
  const FINAL_METADATA_CID='bafybeibym2vpueziuqhzd64kahviyin4kqlp4yc3iuvyx4txvdk6k4e37u';
  const collectionCache=new Map();

  // The base scaffold carries sample token IDs for layout work. Never treat them
  // as user ownership once the real wallet layer is active.
  if(!state.walletConnected) state.owned=[];

  function esc(value){return String(value??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));}
  function ownedIds(){
    const fromData=(state.walletOwnedData||[]).map(t=>Number(t.id)).filter(Number.isFinite);
    if(fromData.length)return fromData;
    return (state.owned||[]).map(Number).filter(Number.isFinite);
  }
  function validCollectionId(value){
    const id=Math.trunc(Number(value));
    return Number.isFinite(id)&&id>=1&&id<=COLLECTION_SIZE?id:0;
  }
  function fallbackCompare(primary){
    const otherOwned=ownedIds().find(id=>id!==primary);
    if(otherOwned)return otherOwned;
    return primary>=COLLECTION_SIZE?1:primary+1;
  }
  function normalizeSelection(){
    if(state.phase!=='REVEALED'||state.page!=='marketlab')return false;
    const ids=ownedIds();
    if(!ids.length)return false;
    let changed=false;
    const current=Number(state.labId);
    if(!ids.includes(current)){
      state.labId=ids[0];
      changed=true;
    }
    const primary=Number(state.labId);
    const compare=validCollectionId(state.compareId);
    if(!compare||compare===primary){
      state.compareId=fallbackCompare(primary);
      changed=true;
    }
    return changed;
  }
  function selectedId(){
    const ids=ownedIds();
    const requested=Number(state.labId);
    return ids.includes(requested)?requested:Number(ids[0]||requested||0);
  }
  function ownedTokenData(id){return (state.walletOwnedData||[]).find(t=>Number(t.id)===Number(id))||null;}
  function tokenData(id){return ownedTokenData(id)||collectionCache.get(Number(id))||null;}
  function attr(token,name){
    const target=String(name).toLowerCase();
    const hit=(token?.attributes||[]).find(a=>String(a.trait_type||'').toLowerCase()===target);
    return hit?String(hit.value??'—'):'';
  }
  function ipfsToHttp(uri){return uri&&uri.startsWith('ipfs://')?LIGHTHOUSE_GATEWAY+uri.slice(7):uri||'';}
  async function fetchCollectionToken(id){
    id=validCollectionId(id);
    if(!id)throw new Error('Invalid Candlekin token ID.');
    const existing=tokenData(id);
    if(existing)return existing;
    const metadataUrl=`${LIGHTHOUSE_GATEWAY}${FINAL_METADATA_CID}/${id}.json`;
    const response=await fetch(metadataUrl,{cache:'force-cache'});
    if(!response.ok)throw new Error(`Metadata for #${id} returned HTTP ${response.status}.`);
    const metadata=await response.json();
    const token={
      id,
      name:metadata.name||`Candlekin #${String(id).padStart(4,'0')}`,
      metadataUrl,
      image:metadata.image||'',
      imageUrl:ipfsToHttp(metadata.image||''),
      attributes:Array.isArray(metadata.attributes)?metadata.attributes:[]
    };
    collectionCache.set(id,token);
    return token;
  }

  function updateFamily(container,token){
    const family=attr(token,'Family');
    if(!family||!container)return;
    const heading=container.querySelector('h3');
    if(heading)heading.textContent=family;
    const familyRow=[...container.querySelectorAll('.list-row')].find(row=>row.querySelector('span')?.textContent?.trim()==='Family');
    if(familyRow?.querySelector('strong'))familyRow.querySelector('strong').textContent=family;
  }

  function enhanceHero(){
    const hero=document.querySelector('.ml-token-hero');
    if(!hero)return;
    const id=selectedId();
    const token=ownedTokenData(id);
    if(!token)return;

    const image=hero.querySelector('img');
    if(image){
      image.src=token.imageUrl;
      image.alt=token.name;
      image.classList.add('ml-selected-art');
      image.setAttribute('role','button');
      image.setAttribute('tabindex','0');
      image.setAttribute('aria-label',`Preview ${token.name}`);
      image.onclick=()=>window.CandlekinPreview?.openToken(id);
      image.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();window.CandlekinPreview?.openToken(id);}};
    }
    updateFamily(hero,token);
  }

  function ownedCompareImage(token){
    return `<button class="ml-compare-art-button" type="button" data-compare-art="${token.id}" aria-label="Preview ${esc(token.name)}"><img src="${esc(token.imageUrl)}" alt="${esc(token.name)}"></button>`;
  }
  function publicCompareImage(token){
    return `<div class="ml-compare-art-button ml-compare-art-static" title="${esc(token.name)}"><img src="${esc(token.imageUrl)}" alt="${esc(token.name)}"></div>`;
  }
  function loadingCompareImage(id){
    return `<div class="ml-compare-art-empty" data-compare-loading="${id}">Loading revealed artwork for #${String(id).padStart(4,'0')}…</div>`;
  }

  async function hydrateCompareCard(card,id){
    if(!card||!validCollectionId(id))return;
    const owned=ownedTokenData(id);
    if(owned){
      if(!card.querySelector('.ml-compare-art-button')){
        card.querySelector('.eyebrow')?.insertAdjacentHTML('afterend',ownedCompareImage(owned));
      }
      updateFamily(card,owned);
      return;
    }
    if(!card.querySelector('.ml-compare-art-button,.ml-compare-art-empty')){
      card.querySelector('.eyebrow')?.insertAdjacentHTML('afterend',loadingCompareImage(id));
    }
    try{
      const token=await fetchCollectionToken(id);
      if(!card.isConnected||Number(card.dataset.mlCompareCard)!==Number(id))return;
      const loading=card.querySelector(`[data-compare-loading="${id}"]`);
      if(loading)loading.outerHTML=publicCompareImage(token);
      updateFamily(card,token);
    }catch(err){
      const loading=card.querySelector(`[data-compare-loading="${id}"]`);
      if(loading)loading.textContent='Artwork unavailable. Genome comparison remains available.';
    }
  }

  function enhanceCompare(){
    const grid=document.querySelector('.ml-compare-grid');
    if(!grid)return;
    const currentId=selectedId();
    const requestedCompare=validCollectionId(state.compareId);
    const otherId=requestedCompare&&requestedCompare!==currentId?requestedCompare:fallbackCompare(currentId);
    if(Number(state.compareId)!==otherId)state.compareId=otherId;
    const cards=[...grid.querySelectorAll('[data-ml-compare-card]')];
    cards.forEach(card=>hydrateCompareCard(card,Number(card.dataset.mlCompareCard)));

    grid.querySelectorAll('[data-compare-art]').forEach(button=>{
      if(button.dataset.bound==='1')return;
      button.dataset.bound='1';
      button.addEventListener('click',()=>window.CandlekinPreview?.openToken(Number(button.dataset.compareArt)));
    });
  }

  function enhance(){
    if(state.phase!=='REVEALED'||state.page!=='marketlab')return;
    enhanceHero();
    enhanceCompare();
  }

  function renderAtSameScroll(mutator){
    const y=window.scrollY;
    mutator();
    render();
    requestAnimationFrame(()=>window.scrollTo({top:y,left:0,behavior:'auto'}));
  }

  window.mlSelectToken=function(id){
    renderAtSameScroll(()=>{state.labId=Number(id);});
  };

  window.mlSetCompare=function(id){
    const primary=selectedId();
    let next=validCollectionId(id)||fallbackCompare(primary);
    if(next===primary)next=fallbackCompare(primary);
    renderAtSameScroll(()=>{state.compareId=next;});
  };

  window.mlApplyCompare=function(){
    const input=document.getElementById('mlCompareInput');
    if(input)window.mlSetCompare(input.value);
  };

  window.mlRandomCompare=function(){
    const primary=selectedId();
    let next=primary;
    while(next===primary)next=1+Math.floor(Math.random()*COLLECTION_SIZE);
    window.mlSetCompare(next);
  };

  const baseRender=render;
  render=function(){
    normalizeSelection();
    baseRender();
    enhance();
  };

  if(normalizeSelection()) render();
  else enhance();
})();

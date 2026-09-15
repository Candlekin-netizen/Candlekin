(function(){
  function esc(value){return String(value??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));}
  function ownedIds(){
    const fromData=(state.walletOwnedData||[]).map(t=>Number(t.id)).filter(Number.isFinite);
    if(fromData.length)return fromData;
    return (state.owned||[]).map(Number).filter(Number.isFinite);
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
    const compare=Number(state.compareId);
    if(!ids.includes(compare)||compare===Number(state.labId)){
      state.compareId=ids.find(id=>id!==Number(state.labId))||Number(state.labId);
      changed=true;
    }
    return changed;
  }
  function selectedId(){
    const ids=ownedIds();
    const requested=Number(state.labId);
    return ids.includes(requested)?requested:Number(ids[0]||requested||0);
  }
  function tokenData(id){return (state.walletOwnedData||[]).find(t=>Number(t.id)===Number(id))||null;}
  function attr(token,name){
    const target=String(name).toLowerCase();
    const hit=(token?.attributes||[]).find(a=>String(a.trait_type||'').toLowerCase()===target);
    return hit?String(hit.value??'—'):'';
  }

  function updateFamily(container,token){
    const family=attr(token,'Family');
    if(!family||!container)return;
    const familyRow=[...container.querySelectorAll('.list-row')].find(row=>row.querySelector('span')?.textContent?.trim()==='Family');
    if(familyRow?.querySelector('strong'))familyRow.querySelector('strong').textContent=family;
  }

  function clarifyGenomeState(hero){
    if(!hero)return;
    const row=[...hero.querySelectorAll('.list-row')].find(item=>item.querySelector('span')?.textContent?.trim()==='State index');
    if(!row)return;
    const strong=row.querySelector('strong');
    const value=(strong?.textContent||'').split('/')[0].trim();
    row.querySelector('span').textContent='Genome state';
    if(strong)strong.textContent=value;
    if(!hero.querySelector('[data-genome-space]')){
      row.insertAdjacentHTML('afterend','<div class="list-row" data-genome-space><span>State space</span><strong>4,096 combinations</strong></div>');
    }
  }

  function enhanceHero(){
    const hero=document.querySelector('.ml-token-hero');
    if(!hero)return;
    clarifyGenomeState(hero);
    const id=selectedId();
    const token=tokenData(id);
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

  function compareImage(id){
    const token=tokenData(id);
    if(!token)return `<div class="ml-compare-art-empty">Artwork loads from the connected wallet.</div>`;
    return `<button class="ml-compare-art-button" type="button" data-compare-art="${id}" aria-label="Preview ${esc(token.name)}"><img src="${esc(token.imageUrl)}" alt="${esc(token.name)}"></button>`;
  }

  function enhanceCompare(){
    const grid=document.querySelector('.ml-compare-grid');
    if(!grid)return;
    const idsAvailable=ownedIds();
    const currentId=selectedId();
    const requestedCompare=Number(state.compareId);
    const otherId=idsAvailable.includes(requestedCompare)&&requestedCompare!==currentId
      ? requestedCompare
      : Number(idsAvailable.find(id=>id!==currentId)||currentId);
    const cards=[...grid.querySelectorAll(':scope > .card')];
    const ids=[currentId,otherId];

    cards.slice(0,2).forEach((card,index)=>{
      const id=ids[index];
      const token=tokenData(id);
      const eyebrow=card.querySelector('.eyebrow');
      if(eyebrow&&!card.querySelector('.ml-compare-art-button,.ml-compare-art-empty')){
        eyebrow.insertAdjacentHTML('afterend',compareImage(id));
      }
      if(token){
        const family=attr(token,'Family');
        const heading=card.querySelector('h3');
        if(family&&heading)heading.textContent=family;
      }
    });

    grid.querySelectorAll('[data-compare-art]').forEach(button=>{
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
    renderAtSameScroll(()=>{state.compareId=Number(id);});
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

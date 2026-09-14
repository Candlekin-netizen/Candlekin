(function(){
  function esc(value){return String(value??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));}
  function selectedId(){return Number(state.labId||(state.owned&&state.owned[0])||0);}
  function tokenData(id){return (state.walletOwnedData||[]).find(t=>Number(t.id)===Number(id))||null;}
  function attr(token,name){
    const target=String(name).toLowerCase();
    const hit=(token?.attributes||[]).find(a=>String(a.trait_type||'').toLowerCase()===target);
    return hit?String(hit.value??'—'):'';
  }
  function traitSummary(token){
    const wanted=['Family','Background','Body','Head','Body Accessory','Glasses','Special Trait'];
    const rows=wanted.map(name=>[name,attr(token,name)]).filter(([,value])=>value&&value!=='—').slice(0,6);
    if(!rows.length)return '';
    return `<div class="ml-owned-traits">${rows.map(([name,value])=>`<div class="ml-owned-trait"><span>${esc(name)}</span><strong>${esc(value)}</strong></div>`).join('')}</div>`;
  }
  function enhance(){
    if(state.phase!=='REVEALED'||state.page!=='marketlab')return;
    const hero=document.querySelector('.ml-token-hero');
    if(!hero||hero.querySelector('.ml-owned-preview'))return;
    const id=selectedId();
    const token=tokenData(id);

    if(token){
      const family=attr(token,'Family');
      const familyRow=[...hero.querySelectorAll('.list-row')].find(row=>row.querySelector('span')?.textContent?.trim()==='Family');
      if(family&&familyRow?.querySelector('strong'))familyRow.querySelector('strong').textContent=family;
      hero.insertAdjacentHTML('beforeend',`<div class="ml-owned-preview"><div class="ml-owned-preview-head"><div class="eyebrow">Selected artwork</div><span class="pill">Owned</span></div><button class="ml-owned-art-button" type="button" data-ml-art="${id}" aria-label="Preview ${esc(token.name)}"><img src="${esc(token.imageUrl)}" alt="${esc(token.name)}"></button><div class="ml-owned-art-copy"><h3>${esc(token.name)}</h3><p class="ml-owned-preview-note">The artwork shown here is the revealed token owned by the connected wallet. The pod image above remains the Market Lab visual system.</p>${traitSummary(token)}</div></div>`);
      hero.querySelector('[data-ml-art]')?.addEventListener('click',()=>window.CandlekinPreview?.openToken(id));
    }else{
      hero.insertAdjacentHTML('beforeend',`<div class="ml-owned-preview"><div class="eyebrow">Selected artwork</div><div class="ml-owned-preview-empty">Connect the owning wallet in My Candlekin to load the revealed artwork beside its Market Genome.</div></div>`);
    }
  }

  const baseRender=render;
  render=function(){baseRender();enhance();};
  enhance();
})();

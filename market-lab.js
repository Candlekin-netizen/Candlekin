(function(){
  const COLLECTION_SIZE=4096;
  const tokenIds = () => (state.owned && state.owned.length ? state.owned : [1842,2291,3807]);

  function mlBits(bits){ return String(bits || '').replace(/\s/g,''); }
  function mlSegment(bits,start){ return mlBits(bits).slice(start,start+4); }
  function mlStateIndex(bits){ return parseInt(mlBits(bits),2) || 0; }
  function mlHamming(a,b){
    const x=mlBits(a), y=mlBits(b);
    let n=0;
    for(let i=0;i<Math.min(x.length,y.length);i++) if(x[i]!==y[i]) n++;
    return n + Math.abs(x.length-y.length);
  }
  function mlCollectionId(value){
    const n=Math.trunc(Number(value));
    if(!Number.isFinite(n))return 1;
    return Math.min(COLLECTION_SIZE,Math.max(1,n));
  }
  function mlDefaultCompareId(currentId){
    const ownedOther=tokenIds().map(Number).find(id=>id!==Number(currentId));
    if(ownedOther)return ownedOther;
    return Number(currentId)>=COLLECTION_SIZE?1:Number(currentId)+1;
  }
  function mlNormalizedCompareId(currentId,value){
    let id=mlCollectionId(value);
    if(id===Number(currentId))id=mlDefaultCompareId(currentId);
    return id;
  }
  function mlProfile(g){
    const signature=[band('m',g.m),band('v',g.v),band('c',g.c)];
    const leader=[['Momentum',g.mp],['Volatility',g.vp],['Conviction',g.cp]].sort((a,b)=>b[1]-a[1])[0][0];
    const copy=leader==='Momentum'
      ? 'This genome is momentum-led: its identity leans most strongly toward directional energy, while volatility and conviction shape how that state expresses itself.'
      : leader==='Volatility'
        ? 'This genome is volatility-led: responsiveness and state change are its strongest identity axis, moderated by momentum and conviction.'
        : 'This genome is conviction-led: persistence is its strongest identity axis, while momentum and volatility define the surrounding state.';
    return {name:signature.join(' · '),copy,leader};
  }
  function mlTokenOptions(selected){
    return tokenIds().map(id=>`<option value="${id}" ${Number(selected)===Number(id)?'selected':''}>Candlekin #${String(id).padStart(4,'0')}</option>`).join('');
  }
  function mlAxisCard(label,key,bits,value,pct,word,copy){
    return `<div class="card ml-axis-card"><div class="eyebrow">${label}</div><div class="ml-axis-head"><div><div class="profile-word">${word}</div><div class="mono ml-four-bits">${bits}</div></div><div class="ml-score">${value}<span>/15</span></div></div><div class="meter"><span style="width:${pct}%"></span></div><div class="ml-axis-meta"><span>${pct}% position</span><span>${key}</span></div><p>${copy}</p></div>`;
  }
  function mlAnatomy(g){
    const groups=[
      ['Momentum',mlSegment(g.bits,0),'M','Directional energy / pace'],
      ['Volatility',mlSegment(g.bits,4),'V','Responsiveness / state change'],
      ['Conviction',mlSegment(g.bits,8),'C','Persistence / firmness']
    ];
    return `<section><div class="wrap"><div class="section-head"><div><div class="eyebrow">Genome anatomy</div><h2>12 bits. Three independent axes.</h2></div><div class="subtle">Market Genome is the NFT's permanent post-Reveal identity. It does not come from the whitelist Genesis Signal and it does not determine visual traits.</div></div><div class="ml-anatomy">${groups.map(([name,bits,key,desc])=>`<div class="card"><div class="ml-anatomy-key">${key}</div><div class="mono ml-anatomy-bits">${bits}</div><h3>${name}</h3><p>${desc}.</p><div class="tiny">4 bits // ${parseInt(bits,2)} of 15</div></div>`).join('')}</div></div></section>`;
  }
  function mlCompare(currentId){
    state.compareId=mlNormalizedCompareId(currentId,state.compareId||mlDefaultCompareId(currentId));
    const otherId=Number(state.compareId);
    const a=demoGenomeFor(currentId), b=demoGenomeFor(otherId);
    const da=demoOwned[currentId] || {family:'Candlekin'};
    const db=demoOwned[otherId] || {family:'Candlekin'};
    const distance=mlHamming(a.bits,b.bits);
    return `<section><div class="wrap"><div class="section-head"><div><div class="eyebrow">Compare Candlekin</div><h2>Your token against the collection.</h2></div><div class="subtle">Compare your Market Genome with any revealed Candlekin from #0001 to #4096. Ownership of the comparison token is not required.</div></div><div class="card ml-compare-toolbar"><div><label>Your Candlekin</label><select onchange="mlSelectToken(this.value)">${mlTokenOptions(currentId)}</select><div class="field-help">Primary selection stays within the connected wallet.</div></div><div class="vs">VS</div><div><label>Compare with any Candlekin</label><div class="ml-compare-picker"><span class="ml-token-prefix">#</span><input id="mlCompareInput" type="number" min="1" max="4096" inputmode="numeric" value="${otherId}" aria-label="Comparison Candlekin token ID" onkeydown="if(event.key==='Enter'){event.preventDefault();mlApplyCompare()}"><button class="btn secondary small" type="button" onclick="mlApplyCompare()">Compare</button><button class="btn ghost small" type="button" onclick="mlRandomCompare()">Random</button></div><div class="field-help">Enter any revealed token ID. Random never requires you to own a second Candlekin.</div></div></div><div class="compare-grid ml-compare-grid"><div class="card" data-ml-compare-card="${currentId}"><div class="eyebrow">Candlekin #${String(currentId).padStart(4,'0')}</div><h3>${da.family}</h3><div class="bitline">${a.bits}</div><div class="list"><div class="list-row"><span>Momentum</span><strong>${band('m',a.m)} // ${a.mp}%</strong></div><div class="list-row"><span>Volatility</span><strong>${band('v',a.v)} // ${a.vp}%</strong></div><div class="list-row"><span>Conviction</span><strong>${band('c',a.c)} // ${a.cp}%</strong></div></div></div><div class="ml-distance"><strong>${distance}</strong><span>bits differ</span><small>${12-distance} bits match</small></div><div class="card" data-ml-compare-card="${otherId}"><div class="eyebrow">Candlekin #${String(otherId).padStart(4,'0')}</div><h3>${db.family}</h3><div class="bitline">${b.bits}</div><div class="list"><div class="list-row"><span>Momentum</span><strong>${band('m',b.m)} // ${b.mp}%</strong></div><div class="list-row"><span>Volatility</span><strong>${band('v',b.v)} // ${b.vp}%</strong></div><div class="list-row"><span>Conviction</span><strong>${band('c',b.c)} // ${b.cp}%</strong></div></div></div></div></div></section>`;
  }
  function mlAtlas(g){
    const selected=mlStateIndex(g.bits);
    let cells='';
    for(let i=0;i<4096;i++){
      const row=Math.floor(i/64), col=i%64;
      cells+=`<div class="ml-atlas-cell ${i===selected?'selected':''}" title="State ${i} // row ${row+1}, column ${col+1}"></div>`;
    }
    return `<section><div class="wrap"><div class="section-head"><div><div class="eyebrow">Genome Atlas</div><h2>4,096 possible states.</h2></div><div class="subtle">The complete 12-bit state space maps from 0000 0000 0000 to 1111 1111 1111. The selected Candlekin is highlighted.</div></div><div class="status-grid"><div class="card"><div class="ml-atlas-shell"><div class="ml-atlas">${cells}</div></div></div><div class="card"><div class="eyebrow">Selected coordinate</div><div class="profile-word">State ${selected}</div><div class="bitline">${g.bits}</div><div class="list" style="margin-top:18px"><div class="list-row"><span>Binary range</span><strong>12-bit</strong></div><div class="list-row"><span>State space</span><strong>4,096</strong></div><div class="list-row"><span>Coordinate</span><strong>${Math.floor(selected/64)+1} × ${(selected%64)+1}</strong></div></div><p style="margin-top:18px">Atlas position is identity context, not a performance score or rarity ranking.</p></div></div></div></section>`;
  }
  function mlShare(currentId,g,profile){
    const d=demoOwned[currentId] || {family:'Candlekin'};
    return `<section><div class="wrap"><div class="section-head"><div><div class="eyebrow">Genome share</div><h2>Share the decoded identity.</h2></div><div class="subtle">This is separate from the whitelist Genesis Signal. It represents the NFT itself after Reveal.</div></div><div class="status-grid"><div class="card ml-share-card"><div class="eyebrow">Candlekin // Market Genome</div><div class="ml-share-token">#${String(currentId).padStart(4,'0')} <span>${d.family}</span></div><div class="bitline">${g.bits}</div><div class="ml-share-signature">${profile.name}</div><div class="ml-share-footer"><span>Momentum ${g.mp}%</span><span>Volatility ${g.vp}%</span><span>Conviction ${g.cp}%</span></div></div><div class="card"><div class="eyebrow">Share actions</div><h3>Post-Reveal identity card.</h3><p>Share this Candlekin's decoded Market Genome as its identity layer.</p><div class="actions"><button class="btn" type="button" onclick="mlShareOnX()">Share on X</button><button class="btn secondary" type="button" onclick="mlCopyGenome()">Copy genome text</button></div><div id="mlShareStatus" class="field-help" style="margin-top:14px"></div></div></div></div></section>`;
  }

  marketLab=function(){
    if(state.phase!=='REVEALED') return home();
    const currentId=Number(state.labId || tokenIds()[0] || 1842);
    const g=demoGenomeFor(currentId);
    const d=demoOwned[currentId] || {family:'Candlekin'};
    const profile=mlProfile(g);
    return `<section class="hero"><div class="wrap hero-grid"><div><div class="chips"><span class="chip"><span class="dot"></span>Market Lab online</span><span class="chip">Post-Reveal identity explorer</span></div><div class="eyebrow">Candlekin // Market Lab</div><h1>Decode the state.</h1><p class="lead">Read your Candlekin's 12-bit Market Genome, compare it with any revealed token and explore the full 4,096-state identity space.</p><div class="notice" style="margin-top:22px">Market Genome is collectible identity and lore. It is not a live market signal, price prediction, or trading recommendation.</div><div class="actions"><select class="ml-token-select" onchange="mlSelectToken(this.value)">${mlTokenOptions(currentId)}</select><button class="btn secondary" type="button" onclick="setPage('collection')">Back to collection</button></div></div><div class="card ml-token-hero"><img src="${HERO_IMG}" alt="Candlekin #${currentId}"><div class="eyebrow" style="margin-top:18px">Your Candlekin</div><h3>Candlekin #${String(currentId).padStart(4,'0')}</h3><div class="list"><div class="list-row"><span>Family</span><strong>${d.family}</strong></div><div class="list-row"><span>Market Genome</span><strong class="mono">${g.bits}</strong></div><div class="list-row"><span>Genome state</span><strong>${mlStateIndex(g.bits)}</strong></div><div class="list-row"><span>State space</span><strong>4,096 combinations</strong></div></div></div></div></section><section><div class="wrap"><div class="section-head"><div><div class="eyebrow">Genome Decoder</div><h2>Read the three axes.</h2></div><div class="subtle">Each 4-bit segment resolves to 0–15. Percentages visualize position within the axis; they are not performance probabilities.</div></div><div class="genome-grid">${mlAxisCard('Momentum','MMMM',mlSegment(g.bits,0),g.m,g.mp,band('m',g.m),'Directional energy encoded in the first four bits.')}${mlAxisCard('Volatility','VVVV',mlSegment(g.bits,4),g.v,g.vp,band('v',g.v),'Responsiveness encoded in the middle four bits.')}${mlAxisCard('Conviction','CCCC',mlSegment(g.bits,8),g.c,g.cp,band('c',g.c),'Persistence encoded in the final four bits.')}</div></div></section><section><div class="wrap"><div class="card highlight ml-profile"><div><div class="eyebrow">Market Profile</div><div class="profile-word">${profile.name}</div><p>${profile.copy}</p></div><div class="ml-profile-side"><div class="tiny">Dominant axis</div><strong>${profile.leader}</strong><div class="tiny" style="margin-top:16px">Exact genome</div><span class="mono">${g.bits}</span></div></div></div></section>${mlAnatomy(g)}${mlCompare(currentId)}${mlShare(currentId,g,profile)}${mlAtlas(g)}`;
  };

  window.mlSelectToken=function(id){ state.labId=Number(id); render(); window.scrollTo({top:0,behavior:'smooth'}); };
  window.mlSetCompare=function(id){
    const currentId=Number(state.labId||tokenIds()[0]||1);
    state.compareId=mlNormalizedCompareId(currentId,id);
    render();
    setTimeout(()=>document.querySelector('.ml-compare-toolbar')?.scrollIntoView({behavior:'smooth',block:'start'}),40);
  };
  window.mlApplyCompare=function(){
    const input=document.getElementById('mlCompareInput');
    if(input)window.mlSetCompare(input.value);
  };
  window.mlRandomCompare=function(){
    const currentId=Number(state.labId||tokenIds()[0]||1);
    let id=currentId;
    while(id===currentId)id=1+Math.floor(Math.random()*COLLECTION_SIZE);
    window.mlSetCompare(id);
  };
  window.mlCopyGenome=async function(){
    const id=Number(state.labId||tokenIds()[0]||1842), g=demoGenomeFor(id), p=mlProfile(g);
    const text=`Candlekin #${String(id).padStart(4,'0')}\nMarket Genome: ${g.bits}\nProfile: ${p.name}\n\n@Candlekin // Market Lab`;
    const status=document.getElementById('mlShareStatus');
    try{ await navigator.clipboard.writeText(text); if(status) status.textContent='Genome text copied.'; }
    catch{ if(status) status.textContent='Copy failed. Select and copy manually.'; }
  };
  window.mlShareOnX=function(){
    const id=Number(state.labId||tokenIds()[0]||1842), g=demoGenomeFor(id), p=mlProfile(g);
    const text=`Candlekin #${String(id).padStart(4,'0')}\n${g.bits}\n${p.name}\n\n@Candlekin // Market Lab`;
    const url=`https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(location.origin)}`;
    window.open(url,'_blank','noopener,noreferrer');
  };

  if(state.phase==='REVEALED' && state.page==='marketlab') render();
})();

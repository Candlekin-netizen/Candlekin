(function(){
  // Final whitelist-open polish. Keep Genesis Signal expressive but explicitly
  // separate from curation and NFT outcome.
  try{
    qs[0][1]=['Momentum','Structure','Volume','Confirmation'];
    qs[1][1]=['Observe','Enter early','Wait for confirmation','Ignore the noise'];
    qs[2][1]=['Trending','Volatile','Compressed','Reversing'];
    qs[3][1]=['Patience','Conviction','Risk control','Adaptability'];
    qs[4][1]=['Breakout','Reversal','Acceleration','Range expansion'];
    qs[5][1]=['Timing','Clarity','Persistence','Alignment'];
  }catch(_){}

  validX=function(){
    return /^@?[A-Za-z0-9_]{1,15}$/.test(state.form.x.trim());
  };

  validSharedPost=function(){
    try{
      const u=new URL(state.form.sharedUrl.trim());
      const host=u.hostname.toLowerCase().replace(/^www\./,'');
      if(host!=='x.com'&&host!=='twitter.com') return false;
      const match=u.pathname.match(/^\/([^/]+)\/status\/(\d+)/i);
      if(!match) return false;
      const entered=state.form.x.trim().replace(/^@/,'').toLowerCase();
      return Boolean(entered)&&match[1].toLowerCase()===entered;
    }catch(_){
      return false;
    }
  };

  safeSignal=function(){
    const raw=state.answers.map(a=>a===null?'--':['00','01','10','11'][a]).join('');
    return raw.replace(/^(.{4})(.{4})(.{4})$/,'$1 $2 $3');
  };

  const priorWhitelistPage=whitelistPage;
  whitelistPage=function(){
    let html=priorWhitelistPage();
    if(state.phase!=='WHITELIST_OPEN') return html;
    html=String(html)
      .replace(
        'X, wallet, all six answers and the shared X post URL are required.',
        'X username, wallet, all four social task links, six calibration answers and your shared Genesis post URL are required.'
      )
      .replace(
        '<div class="question"><label>Calibration question ',
        '<div class="notice" style="margin-top:20px">There are no right or wrong answers. Your six choices only encode your 12-bit Genesis Signal; they do not affect GTD/FCFS selection, NFT family, traits, rarity, token ID or Market Genome.</div><div class="question"><label>Calibration question '
      );
    return html;
  };

  const priorSyncWhitelistValidity=syncWhitelistValidity;
  syncWhitelistValidity=function(){
    priorSyncWhitelistValidity();
    const field=document.getElementById('sharedUrl');
    const help=document.getElementById('sharedHelp');
    if(field&&help&&field.value.trim()&&!validSharedPost()){
      help.className='field-help bad';
      help.textContent='Paste your own X post URL from the same username entered above.';
    }
  };

  render();
})();

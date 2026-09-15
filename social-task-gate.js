(function(){
  const STORAGE_KEY='candlekin_social_tasks_v1';
  const TASK_KEYS=['follow','like','repost','comment'];
  const COMPLETE_DELAY_MS=1800;

  function loadState(){
    try{
      const raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
      return TASK_KEYS.reduce((acc,key)=>{acc[key]=raw[key]===true;return acc;},{});
    }catch(_){
      return TASK_KEYS.reduce((acc,key)=>{acc[key]=false;return acc;},{});
    }
  }

  const done=loadState();
  const opening={follow:false,like:false,repost:false,comment:false};

  function save(){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(done));}catch(_){}
  }

  function postUrl(){
    try{return String(SOCIAL_LINKS?.whitelistPost||'').trim();}catch(_){return '';}
  }

  function taskUrl(key){
    if(key==='follow') return 'https://x.com/intent/follow?screen_name=candlekinHQ';
    return postUrl();
  }

  function available(key){return Boolean(taskUrl(key));}
  function allDone(){return TASK_KEYS.every(key=>available(key)&&done[key]);}

  function statusLabel(key){
    if(!available(key)) return 'LINK PENDING';
    if(done[key]) return 'DONE ✓';
    if(opening[key]) return 'OPENED…';
    return key==='follow'?'FOLLOW ON X ↗':'OPEN POST ↗';
  }

  function cardClass(key){
    if(done[key]) return ' complete';
    if(opening[key]) return ' opening';
    return '';
  }

  window.ckOpenSocialTask=function(key){
    if(!TASK_KEYS.includes(key)||!available(key)) return;
    const url=taskUrl(key);
    const popup=window.open(url,'_blank','noopener,noreferrer');
    opening[key]=true;
    render();
    setTimeout(()=>{
      opening[key]=false;
      done[key]=true;
      save();
      render();
    },COMPLETE_DELAY_MS);
    return popup;
  };

  socialTaskHtml=function(){
    const tasks=[
      ['follow','Follow @candlekinHQ','Open the official X follow prompt.'],
      ['like','Like whitelist post','Open the official whitelist post and like it.'],
      ['repost','Repost whitelist post','Open the official whitelist post and repost it.'],
      ['comment','Comment on whitelist post','Open the official whitelist post and leave a comment.']
    ];
    return `<div class="social-tasks"><div class="social-tasks-head"><div><div class="eyebrow" style="margin-bottom:7px">Social tasks</div><h3 style="margin:0">Support Candlekin on X.</h3></div><p>Open each required X task before submitting your whitelist application.</p></div><div class="social-task-list">${tasks.map(([key,title,desc])=>{
      const isAvailable=available(key);
      return `<div class="social-task${cardClass(key)}"><div class="social-task-name"><strong>${title}</strong><span>${desc}</span></div>${isAvailable?`<button class="social-task-link ready" type="button" onclick="ckOpenSocialTask('${key}')" ${done[key]?'disabled':''}>${statusLabel(key)}</button>`:`<span class="social-task-link pending">LINK PENDING</span>`}</div>`;
    }).join('')}</div><div class="social-review-note">This step confirms that each official task link was opened. Candlekin does not inspect or verify your X account activity.</div></div>`;
  };

  const priorCanSubmit=canSubmit;
  canSubmit=function(){return priorCanSubmit()&&allDone();};

  const priorChecklistHtml=checklistHtml;
  checklistHtml=function(){
    let html=priorChecklistHtml();
    const row=`<div class="check-item ${allDone()?'done':'todo'}"><span>Social task links</span><strong>${allDone()?'READY':'REQUIRED'}</strong></div>`;
    return html.replace('</div>',row+'</div>');
  };

  const style=document.createElement('style');
  style.textContent=`
    .social-task{transition:border-color .18s ease,background .18s ease,box-shadow .18s ease}
    .social-task.opening{border-color:#6b5c28;background:rgba(255,211,107,.045)}
    .social-task.complete{border-color:#58752f;background:rgba(204,255,0,.045);box-shadow:inset 0 0 0 1px rgba(204,255,0,.08)}
    .social-task.complete .social-task-name strong{color:#eaf6cf}
    .social-task-link{background:transparent;cursor:pointer}
    .social-task.opening .social-task-link{color:var(--warn);border-color:#6b5c28}
    .social-task.complete .social-task-link{color:var(--lime);border-color:#58752f;cursor:default}
    .social-task-link:disabled{opacity:1}
  `;
  document.head.appendChild(style);

  render();
})();

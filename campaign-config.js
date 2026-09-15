(function(){
  const WHITELIST_POST=''; // Set the canonical @candlekinHQ whitelist campaign post URL after publication.

  window.CandlekinCampaign={
    whitelistPost:WHITELIST_POST
  };

  try{
    if(typeof SOCIAL_LINKS!=='undefined') SOCIAL_LINKS.whitelistPost=WHITELIST_POST;
  }catch(_){}
})();

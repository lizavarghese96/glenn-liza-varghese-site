(function(){
  function setYear(){
    var yearEl = document.getElementById('year');
    if(yearEl){ yearEl.textContent = String(new Date().getFullYear()); }
  }

  function enableSmoothScroll(){
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click', function(e){
        var href = a.getAttribute('href');
        if(href && href.length > 1){
          var el = document.querySelector(href);
          if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
        }
      });
    });
  }

  function initReveal(){
    var revealEls = document.querySelectorAll('.reveal');
    if(revealEls.length === 0) return;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('show');
          io.unobserve(entry.target);
        }
      });
    },{threshold:0.12});
    revealEls.forEach(function(el){ io.observe(el); });
  }

  function prefixInternalLinks(){
    if(!window.__partials) return;
    window.__partials.rewriteBaseHrefs(document);
  }

  function headerElevateOnScroll(){
    var header = document.querySelector('header');
    if(!header) return;
    var last = 0;
    window.addEventListener('scroll', function(){
      var y = window.scrollY || document.documentElement.scrollTop;
      header.style.boxShadow = y > 4 ? '0 6px 18px rgba(17,24,39,.06)' : '0 2px 12px rgba(13,29,54,.04)';
      last = y;
    }, { passive:true });
  }

  function heroParallax(){
    var chips = document.querySelectorAll('.hero .chip');
    if(chips.length === 0) return;
    window.addEventListener('scroll', function(){
      var y = window.scrollY || document.documentElement.scrollTop;
      chips.forEach(function(ch, i){
        ch.style.transform = 'translateY(' + Math.min(20, y * (0.02 + i*0.01)) + 'px)';
      });
    }, { passive:true });
  }

  window.initSite = function(){
    setYear();
    prefixInternalLinks();
    enableSmoothScroll();
    initReveal();
    headerElevateOnScroll();
    heroParallax();
  };
})();
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

  window.initSite = function(){
    setYear();
    prefixInternalLinks();
    enableSmoothScroll();
    initReveal();
  };
})();
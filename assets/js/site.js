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

  // Theme helpers
  function getStoredTheme(){
    try{ return localStorage.getItem('theme') || ''; }catch(e){ return ''; }
  }
  function setStoredTheme(value){
    try{ localStorage.setItem('theme', value); }catch(e){}
  }
  function updateThemeToggleIcon(){
    var btn = document.getElementById('theme-toggle');
    if(!btn) return;
    var current = document.documentElement.getAttribute('data-theme');
    var isDark = current ? current === 'dark' : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    btn.textContent = isDark ? '☀️' : '🌙';
    btn.setAttribute('aria-pressed', String(isDark));
    btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }
  function applyThemeFromStorage(){
    var t = getStoredTheme();
    var html = document.documentElement;
    if(t === 'dark' || t === 'light'){
      html.setAttribute('data-theme', t);
    }else{
      html.removeAttribute('data-theme');
    }
    updateThemeToggleIcon();
  }
  function toggleTheme(){
    var html = document.documentElement;
    var current = html.getAttribute('data-theme');
    var next = (current === 'dark') ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    setStoredTheme(next);
    updateThemeToggleIcon();
  }
  function initThemeToggle(){
    var btn = document.getElementById('theme-toggle');
    if(!btn) return;
    btn.addEventListener('click', toggleTheme);
    updateThemeToggleIcon();
  }

  // Micro-interaction: 3D card tilt
  function enableCardTilt(){
    var cards = document.querySelectorAll('.card');
    if(cards.length === 0) return;
    var max = 6; // degrees
    cards.forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        var x = e.clientX - r.left;
        var y = e.clientY - r.top;
        var px = (x / r.width) * 2 - 1;
        var py = (y / r.height) * 2 - 1;
        var rx = (-py) * max;
        var ry = (px) * max;
        card.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateZ(0)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = '';
      });
    });
  }

  window.initSite = function(){
    setYear();
    prefixInternalLinks();
    enableSmoothScroll();
    initReveal();
    applyThemeFromStorage();
    initThemeToggle();
    enableCardTilt();
  };
})();
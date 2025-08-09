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
    btn.textContent = (current === 'brutalist') ? '🧱' : (isDark ? '☀️' : '🌙');
    btn.setAttribute('aria-pressed', String(isDark || current === 'brutalist'));
    btn.title = (current === 'brutalist') ? 'Switch to light mode' : (isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  function applyThemeFromStorage(){
    var t = getStoredTheme();
    var html = document.documentElement;
    if(t === 'dark' || t === 'light' || t === 'brutalist'){
      html.setAttribute('data-theme', t);
    }else{
      html.removeAttribute('data-theme');
    }
    updateThemeToggleIcon();
  }
  function toggleTheme(){
    var html = document.documentElement;
    var current = html.getAttribute('data-theme') || 'light';
    var next = (current === 'light') ? 'dark' : (current === 'dark' ? 'brutalist' : 'light');
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

  // Chatbot UI (frontend only; placeholder backend)
  function ensureChatbot(){
    if(document.getElementById('chat-launcher')) return;
    var launcher = document.createElement('button');
    launcher.id = 'chat-launcher';
    launcher.className = 'chat-launcher';
    launcher.type = 'button';
    launcher.setAttribute('aria-haspopup', 'dialog');
    launcher.setAttribute('aria-controls', 'chat-panel');
    launcher.title = 'Chat with AI';
    launcher.textContent = 'Chat';

    var panel = document.createElement('div');
    panel.id = 'chat-panel';
    panel.className = 'chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-labelledby', 'chat-title');
    panel.innerHTML = [
      '<div class="chat-header">',
      '  <h3 id="chat-title" class="chat-title">Assistant</h3>',
      '  <div style="display:flex;gap:8px;align-items:center">',
      '    <button type="button" id="chat-min" class="btn" aria-label="Minimize">—</button>',
      '    <button type="button" id="chat-close" class="btn" aria-label="Close">×</button>',
      '  </div>',
      '</div>',
      '<div class="chat-body" id="chat-body" aria-live="polite"></div>',
      '<div class="chat-footer">',
      '  <form id="chat-form">',
      '    <label class="sr-only" for="chat-input">Message</label>',
      '    <input id="chat-input" type="text" placeholder="Ask anything..." autocomplete="off" required />',
      '    <button type="submit">Send</button>',
      '  </form>',
      '  <div class="chat-note">AI responses are generated; verify important info. <a data-href="pages/privacy.html">Privacy</a></div>',
      '</div>'
    ].join('');

    document.body.appendChild(launcher);
    document.body.appendChild(panel);
    if(window.__partials){ try{ window.__partials.rewriteBaseHrefs(panel); }catch(e){} }

    function showPanel(){ panel.style.display = 'flex'; launcher.setAttribute('aria-expanded', 'true'); document.getElementById('chat-input').focus(); }
    function hidePanel(){ panel.style.display = 'none'; launcher.setAttribute('aria-expanded', 'false'); }

    launcher.addEventListener('click', function(){
      if(panel.style.display === 'flex') hidePanel(); else showPanel();
    });
    panel.querySelector('#chat-close').addEventListener('click', hidePanel);
    panel.querySelector('#chat-min').addEventListener('click', function(){ panel.style.display = 'none'; launcher.focus(); });

    var bodyEl = panel.querySelector('#chat-body');
    var form = panel.querySelector('#chat-form');
    var input = panel.querySelector('#chat-input');

    function appendMessage(role, text){
      var row = document.createElement('div');
      row.className = 'chat-msg ' + (role === 'user' ? 'user' : 'bot');
      var bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.textContent = text;
      row.appendChild(bubble);
      bodyEl.appendChild(row);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    async function callBackend(message){
      // Placeholder: GitHub Pages cannot host serverless; echo with canned response.
      // You can wire this to an API endpoint later.
      await new Promise(function(r){ setTimeout(r, 500); });
      return "Thanks! This demo chat is running on the client. Connect it to an API (OpenAI, Azure, etc.) to make it live.";
    }

    form.addEventListener('submit', async function(e){
      e.preventDefault();
      var msg = input.value.trim();
      if(!msg) return;
      appendMessage('user', msg);
      input.value = '';
      appendMessage('bot', '…');
      try{
        var reply = await callBackend(msg);
        bodyEl.lastChild.querySelector('.bubble').textContent = reply;
      }catch(err){
        bodyEl.lastChild.querySelector('.bubble').textContent = 'Error fetching response. Try again later.';
      }
    });
  }

  // Scroll-snap experimental toggle
  function applyScrollModeFromStorage(){
    try{
      var s = localStorage.getItem('scrollMode') || '';
      if(s){ document.documentElement.setAttribute('data-scroll', s); }
    }catch(e){}
  }
  function initScrollToggle(){
    var btn = document.getElementById('toggle-scroll');
    if(!btn) return;
    btn.addEventListener('click', function(){
      var html = document.documentElement;
      var current = html.getAttribute('data-scroll');
      var next = current === 'snap' ? '' : 'snap';
      if(next){ html.setAttribute('data-scroll', next); } else { html.removeAttribute('data-scroll'); }
      try{ if(next){ localStorage.setItem('scrollMode', next); } else { localStorage.removeItem('scrollMode'); } }catch(e){}
    });
  }

  function initBrutalistToggle(){
    var btn = document.getElementById('toggle-brutalist');
    if(!btn) return;
    btn.addEventListener('click', function(){
      var html = document.documentElement;
      var current = html.getAttribute('data-theme') || 'light';
      var next = current === 'brutalist' ? 'light' : 'brutalist';
      html.setAttribute('data-theme', next);
      setStoredTheme(next);
      updateThemeToggleIcon();
    });
  }

  // Ethical/sustainable: lazy-load images and add width/height if missing (best-effort)
  function enhanceImages(){
    document.querySelectorAll('img').forEach(function(img){
      if(!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
      if(!img.getAttribute('alt')) img.setAttribute('alt', '');
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
    ensureChatbot();
    applyScrollModeFromStorage();
    initScrollToggle();
    initBrutalistToggle();
    enhanceImages();
  };
})();
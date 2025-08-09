(function(){
  function computePathPrefix(){
    var segments = window.location.pathname.split('/').filter(Boolean);
    // segments[0] is the site base (e.g., repo name on GitHub Pages)
    // We need to go up for every segment beyond base and filename
    var ups = Math.max(0, segments.length - 2);
    var prefix = '';
    for(var i=0;i<ups;i++) prefix += '../';
    return prefix;
  }

  function rewriteBaseHrefs(container){
    var prefix = computePathPrefix();
    container.querySelectorAll('a[data-href]').forEach(function(a){
      var target = a.getAttribute('data-href');
      a.setAttribute('href', prefix + target);
    });
  }

  function loadIncludes(){
    var includeEls = document.querySelectorAll('[data-include]');
    if(includeEls.length === 0){
      if(window.initSite) window.initSite();
      return;
    }
    var remaining = includeEls.length;
    includeEls.forEach(function(el){
      var url = el.getAttribute('data-include');
      // Make URL relative to current document
      var href = url;
      if(!/^(https?:)?\//.test(url)){
        // relative include path: honor document location
        href = url;
      }
      fetch(href).then(function(r){return r.text()}).then(function(html){
        el.innerHTML = html;
        rewriteBaseHrefs(el);
      }).catch(function(){
        el.innerHTML = '<!-- include failed: ' + href + ' -->';
      }).finally(function(){
        remaining -= 1;
        if(remaining === 0 && window.initSite){ window.initSite(); }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', loadIncludes);
  window.__partials = { rewriteBaseHrefs: rewriteBaseHrefs };
})();
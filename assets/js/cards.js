async function loadCards(jsonPath, containerId, urlPrefix){
  try{
    const response = await fetch(jsonPath);
    const items = await response.json();
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = items.map(function(x){
      const tags = Array.isArray(x.tags) ? x.tags.join(' • ') : '';
      const summary = x.summary || '';
      const date = x.date || '';
      const href = (urlPrefix || '') + x.url;
      return [
        '<article class="card">',
        tags ? ('<span class="tag">' + tags + '</span>') : '',
        '<h3><a href="' + href + '">' + x.title + '</a></h3>',
        summary ? ('<p>' + summary + '</p>') : '',
        date ? ('<small>' + date + '</small>') : '',
        '</article>'
      ].join('');
    }).join('');
  }catch(err){
    console.error('loadCards failed for', jsonPath, err);
  }
}
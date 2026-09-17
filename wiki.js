/* Wiki module: renders the FMHY-derived dataset in content/wiki as browsable pages + global search. */
(() => {
  const BASE = './content/wiki/';
  const wiki = {
    index: null,
    pages: new Map(),
    search: null,
    searchPromise: null,
    current: null,
    filter: '',
    starredOnly: false
  };
  window.AIOWiki = wiki;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const fmt = value => Number(value || 0).toLocaleString('en-US');
  const $ = id => document.getElementById(id);

  async function getJSON(path) {
    const response = await fetch(path, { cache: 'force-cache' });
    if (!response.ok) throw new Error(`${path} → ${response.status}`);
    return response.json();
  }

  async function loadIndex() {
    if (wiki.index) return wiki.index;
    wiki.index = await getJSON(`${BASE}index.json`);
    renderSidebar();
    renderHomeGrid();
    updateStats();
    return wiki.index;
  }

  async function loadPage(slug) {
    if (wiki.pages.has(slug)) return wiki.pages.get(slug);
    const page = await getJSON(`${BASE}${slug}.json`);
    wiki.pages.set(slug, page);
    return page;
  }

  function loadSearch() {
    if (wiki.search) return Promise.resolve(wiki.search);
    if (!wiki.searchPromise) wiki.searchPromise = getJSON(`${BASE}search.json`).then(rows => { wiki.search = rows; return rows; });
    return wiki.searchPromise;
  }

  /* ---------- sidebar & home ---------- */
  function renderSidebar() {
    const nav = $('wiki-nav');
    if (!nav) return;
    nav.innerHTML = wiki.index.pages.map(page => `<a class="nav-item wiki-link" href="#wiki/${page.slug}" data-wiki-page="${page.slug}"><span class="category-dot dot-${page.tone}"></span>${esc(page.title)} <span class="nav-count">${fmt(page.entries)}</span></a>`).join('');
  }

  function renderHomeGrid() {
    const grid = $('wiki-home-grid');
    if (!grid) return;
    grid.innerHTML = wiki.index.pages.map(page => `<a class="category-card category-${page.tone}" href="#wiki/${page.slug}"><span class="category-symbol">${esc(page.symbol)}</span><span><b>${esc(page.title)}</b><small>${esc(page.blurb)}</small></span><span class="wiki-card-count">${fmt(page.entries)}</span></a>`).join('');
  }

  function updateStats() {
    const total = wiki.index.totals.entries;
    const stat = $('stat-total-links'); if (stat) stat.textContent = fmt(total);
    const pages = $('stat-total-pages'); if (pages) pages.textContent = wiki.index.pages.length;
    const sections = $('stat-total-sections'); if (sections) sections.textContent = fmt(wiki.index.totals.sections);
    const navCount = $('nav-wiki-count'); if (navCount) navCount.textContent = fmt(total);
    const generated = $('wiki-generated');
    if (generated && wiki.index.generatedAt) generated.textContent = new Date(wiki.index.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  /* ---------- page view ---------- */
  function entryId(entry) { return `wiki:${entry.url}`; }

  function isSaved(entry) {
    return window.AIOSaved ? window.AIOSaved.has(entryId(entry)) : false;
  }

  function badgeMarkup(block) {
    if (block.starred === 2) return '<span class="wiki-badge star-gold" title="Top pick">🌟</span>';
    if (block.starred === 1) return '<span class="wiki-badge star" title="Recommended">⭐</span>';
    if (block.badge) return `<span class="wiki-badge" title="Marker">${esc(block.badge)}</span>`;
    return '';
  }

  function blockMarkup(block) {
    if (block.kind === 'entry') {
      const saved = isSaved(block);
      return `<li class="wiki-entry${block.starred ? ' starred' : ''}" data-entry-title="${esc(block.title.toLowerCase())}" data-entry-text="${esc((block.title + ' ' + block.description + ' ' + block.host).toLowerCase())}" data-starred="${block.starred}">
        ${badgeMarkup(block)}
        <div class="wiki-entry-body">${block.html}</div>
        <button class="wiki-save${saved ? ' saved' : ''}" data-wiki-save="${esc(block.url)}" data-wiki-title="${esc(block.title)}" data-wiki-desc="${esc(block.description)}" aria-label="${saved ? 'Remove from' : 'Save to'} library"><span class="icon icon-bookmark"></span></button>
      </li>`;
    }
    if (block.kind === 'note') return `<li class="wiki-note">${block.html}</li>`;
    if (block.kind === 'heading') return `<li class="wiki-subheading"><h4>${block.html}</h4></li>`;
    if (block.kind === 'quote') return `<li class="wiki-quote"><blockquote>${block.html}</blockquote></li>`;
    if (block.kind === 'callout-title') return `<li class="wiki-callout callout-${esc(block.callout)} callout-title"><b>${block.html}</b></li>`;
    if (block.kind === 'paragraph') return block.callout ? `<li class="wiki-callout callout-${esc(block.callout)}">${block.html}</li>` : `<li class="wiki-paragraph">${block.html}</li>`;
    return '';
  }

  function blocksMarkup(blocks) {
    return `<ul class="wiki-list">${blocks.map(blockMarkup).join('')}</ul>`;
  }

  function sectionMarkup(section) {
    const count = countEntries(section);
    return `<section class="wiki-section" id="wiki-${esc(section.anchor)}" data-section>
      <h2 class="wiki-h2"><a href="#wiki/${wiki.current.slug}/${esc(section.anchor)}">${esc(section.title)}</a><span class="wiki-section-count">${fmt(count)}</span></h2>
      ${section.blocks.length ? blocksMarkup(section.blocks) : ''}
      ${section.subsections.map(sub => `<div class="wiki-subsection" id="wiki-${esc(sub.anchor)}" data-section><h3 class="wiki-h3"><a href="#wiki/${wiki.current.slug}/${esc(sub.anchor)}">${esc(sub.title)}</a><span class="wiki-section-count">${fmt(sub.blocks.filter(b => b.kind === 'entry').length)}</span></h3>${blocksMarkup(sub.blocks)}</div>`).join('')}
    </section>`;
  }

  function countEntries(section) {
    return section.blocks.filter(b => b.kind === 'entry').length + section.subsections.reduce((sum, sub) => sum + sub.blocks.filter(b => b.kind === 'entry').length, 0);
  }

  function tocMarkup(page) {
    return page.sections.map(section => `<div class="toc-group"><a class="toc-link" href="#wiki/${page.slug}/${esc(section.anchor)}" data-toc="${esc(section.anchor)}">${esc(section.title)}<span>${fmt(countEntries(section))}</span></a>${section.subsections.length ? `<div class="toc-children">${section.subsections.map(sub => `<a class="toc-link sub" href="#wiki/${page.slug}/${esc(sub.anchor)}" data-toc="${esc(sub.anchor)}">${esc(sub.title)}<span>${sub.blocks.filter(b => b.kind === 'entry').length}</span></a>`).join('')}</div>` : ''}</div>`).join('');
  }

  async function showPage(slug, anchor) {
    const view = $('wiki-view');
    const home = $('home-view');
    if (!view) return;
    await loadIndex();
    const meta = wiki.index.pages.find(page => page.slug === slug);
    if (!meta) { window.location.hash = ''; return; }
    home.hidden = true;
    view.hidden = false;
    document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.wikiPage === slug));
    const crumb = $('breadcrumb-current'); if (crumb) crumb.textContent = meta.title;
    document.title = `${meta.title} · AIO Hub`;
    $('wiki-title').textContent = meta.title;
    $('wiki-blurb').textContent = meta.blurb;
    $('wiki-kicker').innerHTML = `<span class="category-dot dot-${meta.tone}"></span> ${fmt(meta.entries)} links · ${fmt(meta.sections.length)} sections`;
    $('wiki-body').innerHTML = '<div class="wiki-loading"><span class="live-dot"></span> Loading page…</div>';
    $('wiki-toc').innerHTML = '';
    wiki.filter = '';
    $('wiki-filter').value = '';
    $('wiki-starred').classList.toggle('active', wiki.starredOnly);
    $('wiki-source').href = `https://github.com/fmhy/edit/blob/main/docs/${slug}.md`;
    $('wiki-original').href = `https://fmhy.net/${slug}`;

    let page;
    try { page = await loadPage(slug); } catch (error) { $('wiki-body').innerHTML = `<div class="wiki-loading">Could not load this page (${esc(error.message)}). Run <code>node scripts/build-wiki.mjs</code> to generate the dataset.</div>`; return; }
    wiki.current = page;
    $('wiki-body').innerHTML = page.sections.map(sectionMarkup).join('');
    $('wiki-toc').innerHTML = tocMarkup(page);
    applyFilter();
    window.scrollTo({ top: 0 });
    if (anchor) requestAnimationFrame(() => scrollToAnchor(anchor));
    observeSections();
  }

  function scrollToAnchor(anchor) {
    const target = document.getElementById(`wiki-${anchor}`);
    if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); target.classList.add('flash'); setTimeout(() => target.classList.remove('flash'), 1600); }
  }

  let observer;
  function observeSections() {
    if (observer) observer.disconnect();
    if (!('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      const anchor = visible.target.id.replace(/^wiki-/, '');
      document.querySelectorAll('.toc-link').forEach(link => link.classList.toggle('active', link.dataset.toc === anchor));
    }, { rootMargin: '-80px 0px -70% 0px' });
    document.querySelectorAll('[data-section]').forEach(section => observer.observe(section));
  }

  function applyFilter() {
    const query = wiki.filter.toLowerCase().trim();
    const starredOnly = wiki.starredOnly;
    let shown = 0;
    document.querySelectorAll('#wiki-body .wiki-entry').forEach(item => {
      const match = (!query || item.dataset.entryText.includes(query)) && (!starredOnly || item.dataset.starred !== '0');
      item.hidden = !match;
      if (match) shown += 1;
    });
    const filtering = query || starredOnly;
    document.querySelectorAll('#wiki-body .wiki-note, #wiki-body .wiki-paragraph, #wiki-body .wiki-quote, #wiki-body .wiki-callout, #wiki-body .wiki-subheading').forEach(item => { item.hidden = Boolean(query); });
    document.querySelectorAll('#wiki-body [data-section]').forEach(section => {
      const hasVisible = filtering ? section.querySelector('.wiki-entry:not([hidden])') : true;
      section.hidden = !hasVisible;
    });
    const status = $('wiki-filter-status');
    if (status) status.textContent = filtering ? `${fmt(shown)} matching` : '';
  }

  function showHome() {
    const view = $('wiki-view');
    const home = $('home-view');
    if (view) view.hidden = true;
    if (home) home.hidden = false;
    document.title = 'AIO Hub — the whole open web, in one calm index';
    wiki.current = null;
  }

  /* ---------- global search ---------- */
  function scoreRow(row, terms) {
    const title = row[2].toLowerCase();
    const desc = row[4].toLowerCase();
    const url = row[3].toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (title === term) score += 40;
      else if (title.startsWith(term)) score += 20;
      else if (title.includes(term)) score += 12;
      else if (url.includes(term)) score += 6;
      else if (desc.includes(term)) score += 4;
      else return 0;
    }
    return score + row[5] * 3;
  }

  async function searchEntries(query, limit = 40) {
    const rows = await loadSearch();
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    const results = [];
    for (const row of rows) {
      const score = scoreRow(row, terms);
      if (score) results.push({ row, score });
    }
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit).map(item => item.row);
  }

  function pageTitle(slug) { return wiki.index?.pages.find(page => page.slug === slug)?.title || slug; }
  function pageTone(slug) { return wiki.index?.pages.find(page => page.slug === slug)?.tone || 'blue'; }

  function resultMarkup(row, extraClass = '') {
    const [slug, anchor, title, url, description, starred] = row;
    let host = '';
    try { host = new URL(url).hostname.replace(/^www\./, ''); } catch { /* ignore */ }
    return `<a class="wiki-result ${extraClass}" href="${esc(url)}" target="_blank" rel="noopener noreferrer" data-wiki-result>
      <span class="resource-icon ${pageTone(slug)}">${starred === 2 ? '🌟' : starred === 1 ? '⭐' : esc(title.slice(0, 1).toUpperCase())}</span>
      <span class="wiki-result-copy"><b>${esc(title)}</b><small>${esc(description || host)}</small></span>
      <span class="wiki-result-meta"><a class="wiki-result-crumb" href="#wiki/${slug}/${esc(anchor)}" data-stop>${esc(pageTitle(slug))}</a><span class="icon icon-arrow-up-right"></span></span>
    </a>`;
  }

  async function renderSearchResults(query, target, limit) {
    if (!target) return 0;
    if (!query) { target.innerHTML = ''; target.hidden = true; return 0; }
    target.hidden = false;
    target.innerHTML = '<div class="quick-empty"><span class="live-dot"></span> Searching the index…</div>';
    const results = await searchEntries(query, limit);
    if (target.dataset.query !== undefined && target.dataset.query !== query) return results.length;
    target.innerHTML = results.length ? results.map(row => resultMarkup(row)).join('') : '<div class="quick-empty">No matches in the wiki for this search.</div>';
    return results.length;
  }

  /* ---------- routing & events ---------- */
  function route() {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash.startsWith('wiki/')) {
      const [, slug, anchor] = hash.split('/');
      showPage(slug, anchor);
      return true;
    }
    showHome();
    return false;
  }

  function bind() {
    window.addEventListener('hashchange', route);
    document.addEventListener('click', event => {
      const stop = event.target.closest('[data-stop]');
      if (stop) { event.preventDefault(); event.stopPropagation(); window.location.hash = stop.getAttribute('href').replace(/^#/, ''); document.dispatchEvent(new CustomEvent('aio:close-modals')); return; }
      const save = event.target.closest('[data-wiki-save]');
      if (save) {
        event.preventDefault();
        document.dispatchEvent(new CustomEvent('aio:toggle-wiki-save', { detail: { url: save.dataset.wikiSave, title: save.dataset.wikiTitle, description: save.dataset.wikiDesc, page: wiki.current?.slug } }));
        const nowSaved = window.AIOSaved?.has(`wiki:${save.dataset.wikiSave}`);
        save.classList.toggle('saved', nowSaved);
        return;
      }
      const tocLink = event.target.closest('.toc-link, .wiki-h2 a, .wiki-h3 a');
      if (tocLink && wiki.current) {
        const anchor = tocLink.getAttribute('href').split('/')[2];
        if (anchor && document.getElementById(`wiki-${anchor}`)) { event.preventDefault(); history.replaceState(null, '', tocLink.getAttribute('href')); scrollToAnchor(anchor); }
        return;
      }
      if (event.target.closest('.wiki-link')) { document.getElementById('sidebar')?.classList.remove('open'); document.querySelector('.mobile-backdrop')?.classList.remove('open'); }
      if (event.target.closest('#wiki-starred')) { wiki.starredOnly = !wiki.starredOnly; $('wiki-starred').classList.toggle('active', wiki.starredOnly); applyFilter(); }
      if (event.target.closest('#wiki-expand-toc')) { $('wiki-toc').classList.toggle('expanded'); }
    });
    $('wiki-filter')?.addEventListener('input', event => { wiki.filter = event.target.value; applyFilter(); });
    document.addEventListener('keydown', event => {
      if (event.key === '/' && wiki.current && !/input|textarea/i.test(document.activeElement?.tagName || '')) { event.preventDefault(); $('wiki-filter').focus(); }
    });
    document.addEventListener('aio:saved-changed', () => {
      document.querySelectorAll('[data-wiki-save]').forEach(button => button.classList.toggle('saved', window.AIOSaved?.has(`wiki:${button.dataset.wikiSave}`)));
    });
  }

  wiki.route = route;
  wiki.loadIndex = loadIndex;
  wiki.searchEntries = searchEntries;
  wiki.renderSearchResults = renderSearchResults;
  wiki.resultMarkup = resultMarkup;
  wiki.loadSearch = loadSearch;

  bind();
  loadIndex().then(route).catch(error => {
    console.error(error);
    const grid = $('wiki-home-grid');
    if (grid) grid.innerHTML = `<div class="wiki-loading">Wiki dataset not found. Run <code>node scripts/build-wiki.mjs</code> to generate <code>content/wiki</code>. (${esc(error.message)})</div>`;
  });
})();

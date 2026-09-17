const seedResources = [
  { id: 'raycast', name: 'Raycast', type: 'Productivity app', category: 'developer', icon: '↯', tone: 'blue', description: 'A blazingly fast launcher that puts your tools, scripts, and tiny workflows one shortcut away.', tags: ['workflow', 'macOS'], url: 'https://www.raycast.com/', addedAt: '2026-09-16', featured: true, source: 'community' },
  { id: 'n8n', name: 'n8n', type: 'Automation platform', category: 'ai', icon: 'n8n', tone: 'orange', description: 'Connect anything to everything with a visual, self-hostable workflow builder.', tags: ['open source', 'automation'], url: 'https://n8n.io/', addedAt: '2026-09-15', featured: true, source: 'community' },
  { id: 'penpot', name: 'Penpot', type: 'Design platform', category: 'design', icon: 'P', tone: 'pink', description: 'Open-source design and prototyping for teams that want their files and workflows to stay open.', tags: ['design', 'open source'], url: 'https://penpot.app/', addedAt: '2026-09-14', featured: true, source: 'community' },
  { id: 'proton-pass', name: 'Proton Pass', type: 'Privacy utility', category: 'privacy', icon: 'P', tone: 'violet', description: 'End-to-end encrypted passwords, passkeys, and aliases from a privacy-first team.', tags: ['privacy', 'security'], url: 'https://proton.me/pass', addedAt: '2026-09-12', featured: true, source: 'community' },
  { id: 'immich', name: 'Immich', type: 'Self-hosted library', category: 'media', icon: '✦', tone: 'teal', description: 'A fast, modern photo and video backup solution that keeps your memories at home.', tags: ['self-hosted', 'photos'], url: 'https://immich.app/', addedAt: '2026-09-10', featured: true, source: 'community' },
  { id: 'hoppscotch', name: 'Hoppscotch', type: 'Developer utility', category: 'developer', icon: '⚡', tone: 'green', description: 'A lightweight, open-source API development ecosystem that runs right in your browser.', tags: ['API', 'developer'], url: 'https://hoppscotch.io/', addedAt: '2026-09-08', featured: false, source: 'community' },
  { id: 'home-assistant', name: 'Home Assistant', type: 'Automation platform', category: 'ai', icon: '⌂', tone: 'orange', description: 'Local-first home automation that puts your devices and data back in your hands.', tags: ['automation', 'self-hosted'], url: 'https://www.home-assistant.io/', addedAt: '2026-09-07', featured: false, source: 'community' },
  { id: 'jellyfin', name: 'Jellyfin', type: 'Media server', category: 'media', icon: 'J', tone: 'violet', description: 'The volunteer-built media solution that puts your movies, music, and shows under your control.', tags: ['media', 'self-hosted'], url: 'https://jellyfin.org/', addedAt: '2026-09-04', featured: false, source: 'community' },
  { id: 'cal-com', name: 'Cal.com', type: 'Scheduling tool', category: 'developer', icon: 'C', tone: 'blue', description: 'Open scheduling infrastructure for teams, makers, and anyone tired of calendar ping-pong.', tags: ['open source', 'calendar'], url: 'https://cal.com/', addedAt: '2026-09-01', featured: false, source: 'community' },
  { id: 'obsidian', name: 'Obsidian', type: 'Knowledge base', category: 'design', icon: 'O', tone: 'violet', description: 'A private, flexible thinking space for connecting your notes and growing your ideas.', tags: ['notes', 'offline'], url: 'https://obsidian.md/', addedAt: '2026-08-30', featured: false, source: 'community' },
  { id: 'tailscale', name: 'Tailscale', type: 'Network utility', category: 'privacy', icon: '⌁', tone: 'green', description: 'A simpler, safer way to connect all your devices and services across the internet.', tags: ['networking', 'security'], url: 'https://tailscale.com/', addedAt: '2026-08-29', featured: false, source: 'community' },
  { id: 'mealie', name: 'Mealie', type: 'Home organizer', category: 'media', icon: 'M', tone: 'orange', description: 'A friendly, self-hosted recipe manager and meal planner for your own kitchen.', tags: ['self-hosted', 'life'], url: 'https://mealie.io/', addedAt: '2026-08-26', featured: false, source: 'community' }
];

const categoryNames = { developer: 'Developer tools', ai: 'AI & automation', design: 'Design & create', privacy: 'Privacy & security', media: 'Media & play' };
const categoryKeywords = {
  developer: ['developer', 'dev', 'code', 'api', 'cli', 'programming', 'software', 'library', 'framework', 'terminal', 'database', 'testing'],
  ai: ['ai', 'automation', 'workflow', 'machine', 'bot', 'agent', 'model', 'llm', 'prompt', 'inference'],
  design: ['design', 'creative', 'note', 'writing', 'photo', 'video', 'prototype', 'art', 'font', 'figma'],
  privacy: ['privacy', 'security', 'password', 'network', 'encrypted', 'vpn', 'auth', 'backup', 'identity'],
  media: ['media', 'music', 'movie', 'stream', 'photo', 'recipe', 'game', 'self-hosted', 'podcast', 'home']
};

const sourceCatalog = [
  { id: 'github', name: 'GitHub', description: 'Public repositories ranked by stars and activity', logo: '●', logoClass: 'source-github', coverage: 'open-source repos', api: 'github' },
  { id: 'gitlab', name: 'GitLab', description: 'Public projects ranked by community interest', logo: '◆', logoClass: 'source-gitlab', coverage: 'public projects', api: 'gitlab' },
  { id: 'npm', name: 'npm Registry', description: 'Popular JavaScript packages and developer apps', logo: 'npm', logoClass: 'source-npm', coverage: 'JS packages', api: 'npm' },
  { id: 'pypi', name: 'PyPI', description: 'Popular Python packages with release activity', logo: 'Py', logoClass: 'source-pypi', coverage: 'Python packages', api: 'pypi' },
  { id: 'docker', name: 'Docker Hub', description: 'Popular containerized tools ready to run', logo: '◇', logoClass: 'source-docker', coverage: 'container images', api: 'docker' },
  { id: 'hackernews', name: 'Hacker News', description: 'New projects surfaced by the tech community', logo: 'Y', logoClass: 'source-hn', coverage: 'Show HN launches', api: 'hackernews' },
  { id: 'producthunt', name: 'Product Hunt', description: 'New product launches and makers to watch', logo: 'P', logoClass: 'source-producthunt', coverage: 'new launches', api: 'manual' },
  { id: 'feed', name: 'JSON / RSS feed', description: 'Bring in a team-maintained public catalog', logo: '↗', logoClass: 'source-feed', coverage: 'custom feed', api: 'feed' }
];
const defaultSourceState = Object.fromEntries(sourceCatalog.map(source => [source.id, { connected: false, status: 'ready', lastSync: null, count: 0 }]));

const state = {
  resources: loadResources(),
  saved: readStorage('aio-saved', []),
  connected: readStorage('aio-connected', { github: false, gitlab: false, feed: false }),
  sourceState: { ...defaultSourceState, ...readStorage('aio-source-state', {}) },
  lastSync: readStorage('aio-last-sync', null),
  articleCount: readStorage('aio-article-count', 0),
  articleMarkdown: '',
  query: '',
  tab: 'trending',
  category: null,
  view: 'grid',
  theme: localStorage.getItem('aio-theme') || 'light'
};
let toastTimer;
let quickHighlight = 0;

function readStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function loadResources() {
  const imported = readStorage('aio-resources', []);
  return [...seedResources, ...imported.filter(item => item && item.id && item.name && item.url)];
}
function saveStorage(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function escapeHTML(value = '') {
  return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}
function iconMarkup(name, extra = '') { return `<span class="icon ${name}${extra ? ` ${extra}` : ''}"></span>`; }
function formatCategory(category) { return categoryNames[category] || 'Community pick'; }
function resourceMatches(resource, query) {
  if (!query) return true;
  const haystack = [resource.name, resource.type, resource.description, resource.category, formatCategory(resource.category), ...(resource.tags || []), resource.source].join(' ').toLowerCase();
  return haystack.includes(query.toLowerCase());
}
function currentResources() {
  let list = [...state.resources];
  if (state.category) list = list.filter(resource => resource.category === state.category);
  list = list.filter(resource => resourceMatches(resource, state.query));
  if (state.tab === 'saved') list = list.filter(resource => state.saved.includes(resource.id));
  if (state.tab === 'recent') list.sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));
  else if (state.tab === 'trending') list.sort((a, b) => Number(b.featured) - Number(a.featured));
  return list;
}

function renderResources() {
  const grid = document.getElementById('resource-grid');
  const empty = document.getElementById('empty-state');
  const resources = currentResources();
  grid.classList.toggle('list-view', state.view === 'list');
  document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.tab === state.tab));
  grid.innerHTML = resources.map(resourceCard).join('');
  empty.hidden = resources.length > 0;
  const heading = document.getElementById('resource-heading');
  if (state.category) heading.textContent = formatCategory(state.category);
  else if (state.tab === 'saved') heading.textContent = 'My library';
  else if (state.tab === 'recent') heading.textContent = 'Recently added';
  else if (state.query) heading.textContent = 'Search results';
  else heading.textContent = 'Recommended for you';
  renderLibrary();
  updateCounts();
}
function resourceCard(resource) {
  const isSaved = state.saved.includes(resource.id);
  const tags = (resource.tags || []).slice(0, 2).map(tag => `<span class="tag">${escapeHTML(tag)}</span>`).join('');
  const name = escapeHTML(resource.name);
  const description = escapeHTML(resource.description || 'A community-curated resource for your toolkit.');
  const type = escapeHTML(resource.type || formatCategory(resource.category));
  const url = escapeHTML(resource.url || '#');
  const icon = escapeHTML(resource.icon || resource.name?.slice(0, 1) || '•');
  return `<article class="resource-card${state.view === 'list' ? ' list-card' : ''}">
    <div class="resource-top"><div class="resource-ident"><span class="resource-icon ${escapeHTML(resource.tone || 'blue')}">${icon}</span><div class="resource-name-wrap"><div class="resource-name" title="${name}">${name}</div><div class="resource-type">${type}</div></div></div><button class="save-button${isSaved ? ' saved' : ''}" data-save="${escapeHTML(resource.id)}" aria-label="${isSaved ? 'Remove from' : 'Save'} ${name}">${iconMarkup('icon-bookmark')}</button></div>
    <p class="resource-description">${description}</p>
    <div class="resource-bottom"><div class="tag-list">${tags}</div><a class="resource-link" href="${url}" target="_blank" rel="noopener noreferrer">Open ${iconMarkup('icon-arrow-up-right')}</a></div>
  </article>`;
}
function renderLibrary() {
  const library = document.getElementById('library-list');
  const savedResources = state.resources.filter(resource => state.saved.includes(resource.id));
  if (!savedResources.length) {
    library.innerHTML = `<div class="library-empty">${iconMarkup('icon-bookmark')}<p>Your personal shortlist<br /><small>will show up here.</small></p></div>`;
  } else {
    library.innerHTML = savedResources.slice(0, 4).map(resource => `<div class="library-item"><span class="library-item-icon ${escapeHTML(resource.tone || 'blue')}">${escapeHTML(resource.icon || '•')}</span><b>${escapeHTML(resource.name)}</b><button data-remove-save="${escapeHTML(resource.id)}" aria-label="Remove ${escapeHTML(resource.name)}">${iconMarkup('icon-x')}</button></div>`).join('');
  }
  const progress = Math.min(100, savedResources.length * 12.5);
  document.getElementById('library-progress-fill').style.width = `${progress}%`;
}
function sourceInfo(id) { return sourceCatalog.find(source => source.id === id) || { id, name: id ? String(id).replace(/^./, value => value.toUpperCase()) : 'Community', description: 'Imported source', logo: '•', logoClass: 'source-feed', coverage: 'imported source', api: 'feed' }; }
function sourceStatusCopy(source) {
  const current = state.sourceState[source.id] || {};
  if (current.status === 'syncing') return 'Syncing now…';
  if (current.status === 'error') return 'Needs attention · try again';
  if (current.lastSync) return `${current.count || 0} collected · ${relativeTime(current.lastSync)}`;
  return `${source.coverage} · ready to sync`;
}
function relativeTime(value) {
  const elapsed = Math.max(0, Date.now() - new Date(value).getTime());
  const minutes = Math.floor(elapsed / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
function renderSourceHealth() {
  const target = document.getElementById('source-health-list');
  if (!target) return;
  const visibleSources = sourceCatalog.filter(source => ['github', 'gitlab', 'npm', 'hackernews'].includes(source.id));
  target.innerHTML = visibleSources.map(source => {
    const current = state.sourceState[source.id] || {};
    const statusClass = current.status === 'ready' && current.lastSync ? 'online' : current.status === 'syncing' ? 'syncing' : current.status === 'error' ? 'error' : '';
    return `<div class="source-row"><span class="source-logo ${source.logoClass}">${source.logo === 'feed' ? iconMarkup('icon-rss') : escapeHTML(source.logo)}</span><div><b>${escapeHTML(source.name)}</b><small>${escapeHTML(sourceStatusCopy(source))}</small></div><span class="source-status ${statusClass}">●</span></div>`;
  }).join('');
}
function renderIntegrations() {
  const target = document.getElementById('integration-list');
  if (!target) return;
  target.innerHTML = sourceCatalog.map(source => {
    const current = state.sourceState[source.id] || {};
    const isManual = source.api === 'manual' || source.api === 'feed';
    const connected = !!current.connected;
    const action = source.api === 'feed' ? 'Add feed' : source.api === 'manual' ? 'Guide' : connected ? 'Connected' : 'Connect';
    return `<div class="integration-card${connected ? ' is-connected' : ''}" data-integration="${source.id}"><span class="integration-icon source-logo ${source.logoClass} large-logo">${source.logo === 'feed' ? iconMarkup('icon-link') : escapeHTML(source.logo)}</span><div class="integration-copy"><b>${escapeHTML(source.name)}</b><span>${escapeHTML(source.description)}</span><div class="integration-meta">${connected ? '<span class="live-dot"></span> Ready for automatic collection' : isManual ? 'Optional · add a public feed or API key' : 'Public API · read-only access'}</div></div><button class="integration-action${connected ? ' connected' : ''}" data-connect="${source.id}">${action}</button></div>`;
  }).join('');
}
function updateCounts() {
  document.querySelectorAll('.saved-count').forEach(element => { element.textContent = state.saved.length; });
  const count = document.getElementById('collected-count');
  const articles = document.getElementById('article-count');
  if (count) count.textContent = state.resources.filter(resource => resource.source && resource.source !== 'community').length || state.resources.length;
  if (articles) articles.textContent = state.articleCount || 0;
  renderSourceHealth();
  renderIntegrations();
}
function renderQuickResults(query = '') {
  const results = state.resources.filter(resource => resourceMatches(resource, query)).slice(0, 7);
  const target = document.getElementById('quick-results');
  quickHighlight = 0;
  target.innerHTML = results.length ? results.map((resource, index) => `<button class="quick-result${index === 0 ? ' highlighted' : ''}" data-open-resource="${escapeHTML(resource.id)}"><span class="resource-icon ${escapeHTML(resource.tone || 'blue')}">${escapeHTML(resource.icon || '•')}</span><span><b>${escapeHTML(resource.name)}</b><small>${escapeHTML(resource.type || formatCategory(resource.category))}</small></span>${iconMarkup('icon-arrow-up-right')}</button>`).join('') : '<div class="quick-empty">No matching resources yet.<br />Try a different search term.</div>';
}
function setTheme(theme) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : '';
  localStorage.setItem('aio-theme', theme);
  document.querySelector('.theme-state').textContent = theme === 'dark' ? 'Light' : 'Dark';
  document.getElementById('theme-toggle').querySelector('.icon').className = `icon ${theme === 'dark' ? 'icon-sun' : 'icon-moon'}`;
  document.getElementById('top-theme-toggle').querySelector('.icon').className = `icon ${theme === 'dark' ? 'icon-sun' : 'icon-moon'}`;
}
function toggleTheme() { setTheme(state.theme === 'dark' ? 'light' : 'dark'); }
function showToast(message, kind = 'success') {
  const toast = document.getElementById('toast');
  document.getElementById('toast-message').textContent = message;
  toast.querySelector('.toast-icon').innerHTML = iconMarkup(kind === 'error' ? 'icon-x' : 'icon-check');
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}
function openModal(id) {
  document.getElementById('modal-backdrop').hidden = false;
  document.getElementById(id).hidden = false;
  document.body.classList.add('modal-open');
  if (id === 'sync-modal') document.getElementById('project-url').focus();
  if (id === 'search-modal') { const input = document.getElementById('quick-search-input'); input.value = state.query; renderQuickResults(input.value); input.focus(); }
}
function closeModals() {
  document.querySelectorAll('.modal').forEach(modal => { modal.hidden = true; });
  document.getElementById('modal-backdrop').hidden = true;
  document.body.classList.remove('modal-open');
}
function openSyncModal() { openModal('sync-modal'); updateCounts(); }
function setActiveNav(route) {
  document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.route === route));
  document.getElementById('breadcrumb-current').textContent = route === 'library' ? 'My library' : route === 'collections' ? 'Collections' : route === 'explore' ? 'Explore all' : 'Overview';
}
function applyHash() {
  const hash = window.location.hash.replace('#', '');
  if (hash.startsWith('category/')) {
    state.category = hash.split('/')[1]; state.tab = 'trending'; state.query = ''; setActiveNav('explore'); renderResources(); document.getElementById('explore').scrollIntoView({ behavior: 'smooth', block: 'start' }); return;
  }
  if (hash === 'library') { state.category = null; state.tab = 'saved'; state.query = ''; setActiveNav('library'); renderResources(); document.getElementById('explore').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  if (hash === 'collections') { state.category = null; setActiveNav('collections'); document.getElementById('collections').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  if (hash === 'explore') { state.category = null; state.tab = 'trending'; setActiveNav('explore'); renderResources(); document.getElementById('explore').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  state.category = null;
  state.tab = 'trending';
  state.query = '';
  const search = document.getElementById('global-search');
  if (search) search.value = '';
  renderResources();
  setActiveNav('overview');
}
function chooseCategory(category) { state.category = category; state.tab = 'trending'; state.query = ''; document.getElementById('global-search').value = ''; window.location.hash = `category/${category}`; renderResources(); document.getElementById('explore').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
function toggleSaved(id) {
  if (state.saved.includes(id)) { state.saved = state.saved.filter(savedId => savedId !== id); showToast('Removed from your library'); }
  else { state.saved.push(id); showToast('Saved to your library'); }
  saveStorage('aio-saved', state.saved); renderResources();
}
function persistSourceState() {
  saveStorage('aio-source-state', state.sourceState);
  saveStorage('aio-last-sync', state.lastSync);
}
function setSourceStatus(id, patch) {
  state.sourceState[id] = { ...(state.sourceState[id] || {}), ...patch };
  persistSourceState();
  updateCounts();
}
function sourceResource({ sourceId, id, name, type, description, tags = [], url, icon, tone, popularity = 0 }) {
  const category = inferCategory([name, type, description, ...tags]);
  const score = Math.round(Math.min(100, 34 + Math.log10(Math.max(1, popularity)) * 12 + tags.length * 3));
  return { id: `${sourceId}-${id}`, name, type: type || `${sourceInfo(sourceId).name} pick`, category, icon: icon || name.slice(0, 1), tone: tone || ['blue', 'violet', 'green', 'orange', 'pink', 'teal'][state.resources.length % 6], description: description || 'A promising project surfaced by the AIO automatic index.', tags: tags.filter(Boolean).slice(0, 4), url, addedAt: new Date().toISOString(), featured: score >= 58, source: sourceId, score };
}
async function getJSON(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeout || 14000);
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json', ...(options.headers || {}) }, signal: controller.signal });
    if (!response.ok) throw new Error(`Source returned ${response.status}`);
    return await response.json();
  } finally { clearTimeout(timer); }
}
async function collectFromSource(sourceId) {
  if (sourceId === 'github') {
    const data = await getJSON(`https://api.github.com/search/repositories?q=${encodeURIComponent('stars:>500 archived:false')}&sort=stars&order=desc&per_page=12`);
    return (data.items || []).map(item => sourceResource({ sourceId, id: item.id, name: item.full_name, type: 'GitHub repository', description: item.description, tags: [...(item.topics || []), item.language], url: item.html_url, icon: '●', tone: 'blue', popularity: item.stargazers_count }));
  }
  if (sourceId === 'gitlab') {
    const data = await getJSON('https://gitlab.com/api/v4/projects?order_by=star_count&sort=desc&per_page=12&simple=true');
    return (data || []).map(item => sourceResource({ sourceId, id: item.id, name: item.path_with_namespace, type: 'GitLab project', description: item.description, tags: [item.topics, item.namespace?.name].flat().filter(Boolean), url: item.web_url, icon: '◆', tone: 'orange', popularity: item.star_count }));
  }
  if (sourceId === 'npm') {
    const data = await getJSON('https://registry.npmjs.org/-/v1/search?text=keywords:cli&size=12&popularity=1.0');
    return (data.objects || []).map(item => { const pkg = item.package || {}; return sourceResource({ sourceId, id: pkg.name, name: pkg.name, type: 'npm package', description: pkg.description, tags: [...(pkg.keywords || []), 'JavaScript'], url: pkg.links?.npm || `https://www.npmjs.com/package/${pkg.name}`, icon: 'npm', tone: 'pink', popularity: Math.round((item.score?.detail?.popularity || 0) * 100000) }); });
  }
  if (sourceId === 'pypi') {
    const packageNames = ['uv', 'ruff', 'polars', 'streamlit', 'gradio', 'fastapi', 'pydantic', 'django'];
    const results = await Promise.allSettled(packageNames.map(name => getJSON(`https://pypi.org/pypi/${name}/json`)));
    return results.filter(result => result.status === 'fulfilled').map(result => { const info = result.value.info; return sourceResource({ sourceId, id: info.name, name: info.name, type: 'PyPI package', description: info.summary, tags: [...(info.keywords || '').split(/[, ]+/), 'Python'], url: info.project_url || `https://pypi.org/project/${info.name}/`, icon: 'Py', tone: 'green', popularity: 1000 }); });
  }
  if (sourceId === 'docker') {
    const data = await getJSON('https://hub.docker.com/v2/search/repositories/?page_size=12&ordering=-pull_count&query=developer');
    return (data.results || []).map(item => sourceResource({ sourceId, id: item.repo_name, name: item.repo_name, type: 'Docker image', description: item.short_description, tags: ['container', 'self-hosted'], url: `https://hub.docker.com/r/${item.repo_name}`, icon: '◇', tone: 'teal', popularity: item.pull_count }));
  }
  if (sourceId === 'hackernews') {
    const data = await getJSON('https://hn.algolia.com/api/v1/search_by_date?tags=show_hn&hitsPerPage=12');
    return (data.hits || []).filter(item => item.url || item.story_url).map(item => sourceResource({ sourceId, id: item.objectID, name: item.title, type: 'Show HN launch', description: `A new project shared by ${item.author || 'the community'} on Hacker News.`, tags: ['new', 'community launch'], url: item.url || item.story_url, icon: 'Y', tone: 'orange', popularity: item.points || 1 }));
  }
  throw new Error('This source needs a public feed or API key');
}
function mergeCollected(resources) {
  const existing = new Set(state.resources.map(resource => resource.url));
  const fresh = resources.filter(resource => resource.url && !existing.has(resource.url));
  state.resources.push(...fresh);
  if (fresh.length) persistImportedResources();
  return fresh;
}
async function syncSource(sourceId) {
  const source = sourceInfo(sourceId);
  if (!source || source.api === 'manual') throw new Error(`${source.name} needs an API key or public feed`);
  if (source.api === 'feed') return addFeed();
  setSourceStatus(sourceId, { status: 'syncing', connected: true });
  try {
    const resources = await collectFromSource(sourceId);
    const fresh = mergeCollected(resources);
    const now = new Date().toISOString();
    state.connected[sourceId] = true;
    state.lastSync = now;
    setSourceStatus(sourceId, { status: 'ready', connected: true, lastSync: now, count: resources.length });
    saveStorage('aio-connected', state.connected);
    renderResources();
    return fresh.length;
  } catch (error) {
    setSourceStatus(sourceId, { status: 'error', connected: state.sourceState[sourceId]?.connected || false });
    throw new Error(`${source.name}: ${error.name === 'AbortError' ? 'request timed out' : error.message}`);
  }
}
async function syncAllSources() {
  const button = document.getElementById('sync-all');
  if (button) { button.disabled = true; button.classList.add('is-loading'); button.innerHTML = `${iconMarkup('icon-refresh')} Syncing all sources…`; }
  const syncable = sourceCatalog.filter(source => !['manual', 'feed'].includes(source.api));
  const results = await Promise.allSettled(syncable.map(source => syncSource(source.id)));
  const collected = results.filter(result => result.status === 'fulfilled').reduce((sum, result) => sum + result.value, 0);
  const failed = results.filter(result => result.status === 'rejected').length;
  if (button) { button.disabled = false; button.classList.remove('is-loading'); button.innerHTML = `${iconMarkup('icon-refresh')} Sync all sources`; }
  const last = document.getElementById('automation-last');
  if (last) last.textContent = `Last run · ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} · next on the 1st`;
  showToast(failed ? `${collected} new apps collected · ${failed} sources unavailable` : `${collected} new apps collected from ${syncable.length} sources`, failed ? 'error' : 'success');
}
function parseProjectUrl(value) {
  let normalized = value.trim();
  if (!/^https?:\/\//i.test(normalized)) normalized = `https://${normalized}`;
  let parsed;
  try { parsed = new URL(normalized); } catch { return null; }
  const host = parsed.hostname.toLowerCase();
  const source = host.includes('gitlab') ? 'gitlab' : host.includes('github') ? 'github' : null;
  if (!source) return null;
  const parts = parsed.pathname.split('/').filter(Boolean).map(part => decodeURIComponent(part).replace(/\.git$/, ''));
  if (source === 'github' && parts.length >= 2) return { source, path: `${parts[0]}/${parts[1]}` };
  if (source === 'gitlab' && parts.length >= 2) return { source, path: parts.join('/') };
  return null;
}
function inferCategory(values = []) {
  const text = values.join(' ').toLowerCase();
  let best = 'developer'; let score = 0;
  Object.entries(categoryKeywords).forEach(([category, keywords]) => { const current = keywords.reduce((count, word) => count + (text.includes(word) ? 1 : 0), 0); if (current > score) { best = category; score = current; } });
  return best;
}
function importProjectForm(event) {
  event.preventDefault();
  const input = document.getElementById('project-url');
  const parsed = parseProjectUrl(input.value);
  if (!parsed) { showToast('Add a valid public GitHub or GitLab URL', 'error'); return; }
  const submit = event.submitter || event.target.querySelector('button[type="submit"]');
  submit.disabled = true; submit.textContent = 'Importing…';
  fetchProject(parsed).then(resource => {
    const existing = state.resources.find(item => item.url === resource.url || item.id === resource.id);
    if (existing) { showToast('That project is already in your index'); return; }
    state.resources.push(resource); persistImportedResources(); renderResources(); input.value = ''; closeModals(); showToast(`${resource.name} added to your index`);
  }).catch(error => { showToast(error.message || 'Could not fetch that public project', 'error'); }).finally(() => { submit.disabled = false; submit.textContent = 'Import'; });
}
async function fetchProject(parsed) {
  const endpoint = parsed.source === 'github' ? `https://api.github.com/repos/${parsed.path}` : `https://gitlab.com/api/v4/projects/${encodeURIComponent(parsed.path)}`;
  const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(response.status === 404 ? 'Project not found or not public' : `Source returned ${response.status}`);
  const data = await response.json();
  const topics = parsed.source === 'github' ? (data.topics || []) : (data.tag_list || []);
  const language = data.language || '';
  const name = data.full_name || data.path_with_namespace || data.name;
  const description = data.description || 'A community project imported from an open source client.';
  return { id: `${parsed.source}-${data.id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, name, type: parsed.source === 'github' ? 'GitHub repository' : 'GitLab project', category: inferCategory([name, description, language, ...topics]), icon: parsed.source === 'github' ? '●' : '◆', tone: parsed.source === 'github' ? 'blue' : 'orange', description, tags: [...topics.slice(0, 2), language].filter(Boolean), url: data.html_url || data.web_url, addedAt: new Date().toISOString(), featured: false, source: parsed.source };
}
function persistImportedResources() {
  const imported = state.resources.filter(resource => !seedResources.some(seed => seed.id === resource.id));
  saveStorage('aio-resources', imported);
}
function normalizeImported(row, index, source = 'import') {
  const get = (...keys) => { for (const key of keys) { const match = Object.keys(row).find(candidate => candidate.toLowerCase().replace(/[_ -]/g, '') === key.toLowerCase().replace(/[_ -]/g, '')); if (match && row[match] !== undefined) return row[match]; } return ''; };
  const name = String(get('name', 'title') || '').trim(); const url = String(get('url', 'link', 'website') || '').trim();
  if (!name || !/^https?:\/\//i.test(url)) return null;
  const tags = get('tags', 'tag') ? String(get('tags', 'tag')).split(/[|,]/).map(tag => tag.trim()).filter(Boolean).slice(0, 4) : [];
  const rawCategory = String(get('category') || '').toLowerCase();
  const category = Object.keys(categoryNames).find(key => rawCategory.includes(key) || rawCategory.includes(categoryNames[key].toLowerCase().split(' ')[0])) || inferCategory([name, get('description'), ...tags]);
  return { id: `${source}-${Date.now()}-${index}`, name, type: String(get('type') || formatCategory(category)), category, icon: String(get('icon') || name.slice(0, 1)).slice(0, 3), tone: ['blue', 'violet', 'green', 'orange', 'pink', 'teal'][index % 6], description: String(get('description') || 'A resource imported into your personal AIO index.'), tags, url, addedAt: new Date().toISOString(), featured: false, source };
}
function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim()); if (!lines.length) return [];
  const parseLine = line => { const output = []; let value = ''; let quoted = false; for (let i = 0; i < line.length; i += 1) { const char = line[i]; if (char === '"' && line[i + 1] === '"') { value += '"'; i += 1; } else if (char === '"') quoted = !quoted; else if (char === ',' && !quoted) { output.push(value); value = ''; } else value += char; } output.push(value); return output; };
  const headers = parseLine(lines[0]).map(header => header.trim()); return lines.slice(1).map(line => { const values = parseLine(line); return headers.reduce((row, header, index) => { row[header] = values[index]?.trim() || ''; return row; }, {}); });
}
async function importFile(event) {
  const file = event.target.files?.[0]; if (!file) return;
  try {
    const text = await file.text(); const raw = file.name.toLowerCase().endsWith('.json') ? JSON.parse(text) : parseCsv(text); const rows = Array.isArray(raw) ? raw : raw.resources || [];
    const imported = rows.map((row, index) => normalizeImported(row, index, 'file')).filter(Boolean);
    if (!imported.length) throw new Error('No valid rows found. Include name and URL columns.');
    const existingUrls = new Set(state.resources.map(resource => resource.url)); const fresh = imported.filter(resource => !existingUrls.has(resource.url));
    state.resources.push(...fresh); persistImportedResources(); renderResources(); closeModals(); showToast(`${fresh.length} resource${fresh.length === 1 ? '' : 's'} added from file`);
  } catch (error) { showToast(error.message || 'Could not read that file', 'error'); }
  event.target.value = '';
}
function downloadTemplate() {
  const content = 'name,url,description,category,tags,type\nExample tool,https://example.com,A useful resource,developer,open source|workflow,Community tool\n';
  const blob = new Blob([content], { type: 'text/csv' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'aio-hub-import-template.csv'; link.click(); URL.revokeObjectURL(link.href);
}
async function addFeed() {
  const url = window.prompt('Paste a public JSON feed URL'); if (!url) return;
  try {
    const response = await fetch(url); if (!response.ok) throw new Error('Feed could not be reached'); const data = await response.json(); const rows = Array.isArray(data) ? data : data.resources || data.items || [];
    const imported = rows.map((row, index) => normalizeImported(row, index, 'feed')).filter(Boolean); if (!imported.length) throw new Error('That feed has no supported resources');
    const existingUrls = new Set(state.resources.map(resource => resource.url)); const fresh = imported.filter(resource => !existingUrls.has(resource.url)); state.resources.push(...fresh); state.connected.feed = true; saveStorage('aio-connected', state.connected); persistImportedResources(); renderResources(); updateCounts(); showToast(`${fresh.length} resources synced from feed`);
  } catch (error) { showToast(error.message || 'Could not sync that feed', 'error'); }
}
function monthlyArticleData() {
  const now = new Date();
  const month = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const external = state.resources.filter(resource => resource.source && resource.source !== 'community');
  const pool = (external.length ? external : state.resources).slice().sort((a, b) => (b.score || 0) - (a.score || 0) || new Date(b.addedAt || 0) - new Date(a.addedAt || 0));
  const picks = pool.slice(0, 8);
  const categorySections = Object.keys(categoryNames).map(category => ({ category, items: pool.filter(item => item.category === category).slice(0, 2) })).filter(section => section.items.length);
  const title = `The AIO monthly: ${month}'s best new tools`;
  const intro = external.length ? `This month, AIO scanned ${new Set(external.map(item => item.source)).size} open-web sources and ranked ${external.length} new projects by community interest, freshness, and usefulness. Here are the tools worth a closer look.` : 'This month\'s index is starting with a small set of community picks. Connect a source and AIO will automatically turn the next sync into a richer monthly brief.';
  const markdown = [`# ${title}`, '', `*Generated ${now.toISOString().slice(0, 10)} by AIO Hub*`, '', intro, '', '## The shortlist', '', ...picks.map((item, index) => `${index + 1}. **${item.name}** — ${item.description} [Open project](${item.url})`), '', '## Browse by category', '', ...categorySections.flatMap(section => [`### ${formatCategory(section.category)}`, ...section.items.map(item => `- **${item.name}** · ${item.description} [${sourceInfo(item.source).name}](${item.url})`), '']), '## How this list is made', '', 'AIO collects public metadata from connected clients, scores projects using activity and popularity signals, automatically assigns a category, removes duplicate links, and keeps the final draft human-readable. Review this draft before publishing.', ''].join('\\n');
  return { title, month, intro, picks, categorySections, markdown, total: external.length };
}
function renderArticle(data) {
  const preview = document.getElementById('article-preview');
  if (!preview) return;
  preview.innerHTML = `<h1>${escapeHTML(data.title)}</h1><div class="article-byline">Generated ${escapeHTML(new Date().toLocaleDateString('en-US', { dateStyle: 'long' }))} · ${data.total} indexed source picks</div><p>${escapeHTML(data.intro)}</p><h2>The shortlist</h2>${data.picks.map((item, index) => `<div class="article-pick"><span class="article-pick-number">0${index + 1}</span><div><b>${escapeHTML(item.name)}</b><small>${escapeHTML(item.description)} · ${escapeHTML(sourceInfo(item.source).name)} · <a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">Open project ↗</a></small></div></div>`).join('')}<h2>Browse by category</h2>${data.categorySections.map(section => `<p><b>${escapeHTML(formatCategory(section.category))}</b></p><ul>${section.items.map(item => `<li><b>${escapeHTML(item.name)}</b> — ${escapeHTML(item.description)}</li>`).join('')}</ul>`).join('')}<h2>How this list is made</h2><p>AIO collects public metadata from connected clients, scores projects using activity and popularity signals, automatically assigns a category, removes duplicate links, and keeps the final draft human-readable. Review this draft before publishing.</p>`;
}
function generateMonthlyArticle() {
  const data = monthlyArticleData();
  state.articleMarkdown = data.markdown;
  state.articleCount += 1;
  saveStorage('aio-article-count', state.articleCount);
  renderArticle(data);
  document.getElementById('article-meta').textContent = `${data.total} source picks · ready to review and publish`;
  updateCounts();
  openModal('article-modal');
}
function downloadArticle() {
  const markdown = state.articleMarkdown || monthlyArticleData().markdown;
  const slug = new Date().toISOString().slice(0, 7);
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `aio-monthly-update-${slug}.md`; link.click(); URL.revokeObjectURL(link.href);
}
async function copyArticle() {
  try { await navigator.clipboard.writeText(state.articleMarkdown || monthlyArticleData().markdown); showToast('Article markdown copied'); }
  catch { showToast('Clipboard access is unavailable', 'error'); }
}
function connectSource(source) {
  const info = sourceInfo(source);
  if (!info) return;
  if (source === 'feed') { addFeed(); return; }
  if (source === 'producthunt') { showToast('Product Hunt requires an API key — use a public feed for now', 'error'); return; }
  syncSource(source).then(count => showToast(count ? `${count} new ${info.name} picks added` : `${info.name} is already up to date`)).catch(error => showToast(error.message, 'error'));
}
function openResource(id) {
  const resource = state.resources.find(item => item.id === id); if (resource?.url) window.open(resource.url, '_blank', 'noopener,noreferrer');
}
function bindEvents() {
  document.addEventListener('click', event => {
    const saveButton = event.target.closest('[data-save]'); if (saveButton) { toggleSaved(saveButton.dataset.save); return; }
    const removeButton = event.target.closest('[data-remove-save]'); if (removeButton) { toggleSaved(removeButton.dataset.removeSave); return; }
    const categoryButton = event.target.closest('[data-category]'); if (categoryButton) { chooseCategory(categoryButton.dataset.category); return; }
    const tabButton = event.target.closest('[data-tab]'); if (tabButton) { state.tab = tabButton.dataset.tab; state.category = null; document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.toggle('active', tab === tabButton)); renderResources(); return; }
    const viewButton = event.target.closest('[data-view]'); if (viewButton) { state.view = viewButton.dataset.view; document.querySelectorAll('.view-button').forEach(button => button.classList.toggle('active', button === viewButton)); renderResources(); return; }
    const searchSuggestion = event.target.closest('[data-search]'); if (searchSuggestion) { state.query = searchSuggestion.dataset.search; document.getElementById('global-search').value = state.query; state.category = null; renderResources(); document.getElementById('explore').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (event.target.closest('#sync-all')) { syncAllSources(); return; }
    if (event.target.closest('#generate-article')) { generateMonthlyArticle(); return; }
    if (event.target.closest('#download-article')) { downloadArticle(); return; }
    if (event.target.closest('#copy-article')) { copyArticle(); return; }
    if (event.target.closest('#sync-button, #sidebar-sync, #manage-sources, #empty-sync')) { openSyncModal(); return; }
    const connectButton = event.target.closest('[data-connect]'); if (connectButton) { connectSource(connectButton.dataset.connect); return; }
    const quickResource = event.target.closest('[data-open-resource]'); if (quickResource) { openResource(quickResource.dataset.openResource); closeModals(); return; }
    if (event.target.closest('[data-close-modal]') || event.target.id === 'modal-backdrop') { closeModals(); return; }
    if (event.target.closest('#theme-toggle, #top-theme-toggle')) { toggleTheme(); return; }
    if (event.target.closest('#mobile-menu')) { document.getElementById('sidebar').classList.add('open'); document.querySelector('.mobile-backdrop').classList.add('open'); return; }
    if (event.target.closest('[data-close-sidebar]')) { document.getElementById('sidebar').classList.remove('open'); document.querySelector('.mobile-backdrop').classList.remove('open'); return; }
    if (event.target.closest('#keyboard-help')) { openModal('search-modal'); return; }
    if (event.target.closest('[data-focus-search]')) { document.getElementById('global-search').focus(); return; }
    if (event.target.closest('#see-all, #all-categories')) { state.query = ''; state.category = null; state.tab = 'trending'; document.getElementById('global-search').value = ''; renderResources(); document.getElementById('explore').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (event.target.closest('#open-library')) { state.tab = 'saved'; state.category = null; renderResources(); document.getElementById('explore').scrollIntoView({ behavior: 'smooth', block: 'start' }); setActiveNav('library'); return; }
    if (event.target.closest('#library-menu, #source-options')) { showToast('More workspace controls are coming soon'); return; }
    if (event.target.closest('#download-template')) { downloadTemplate(); return; }
    if (event.target.closest('.nav-item[data-route]')) { document.getElementById('sidebar').classList.remove('open'); document.querySelector('.mobile-backdrop').classList.remove('open'); }
  });
  document.getElementById('global-search').addEventListener('input', event => { state.query = event.target.value.trim(); state.category = null; renderResources(); });
  document.getElementById('quick-search-input').addEventListener('input', event => renderQuickResults(event.target.value.trim()));
  document.getElementById('import-form').addEventListener('submit', importProjectForm);
  document.getElementById('data-file').addEventListener('change', importFile);
  window.addEventListener('hashchange', applyHash);
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openModal('search-modal'); }
    if (event.key === 'Escape') { closeModals(); document.getElementById('sidebar').classList.remove('open'); document.querySelector('.mobile-backdrop').classList.remove('open'); }
    if (document.getElementById('search-modal').hidden) return;
    const items = [...document.querySelectorAll('.quick-result')];
    if (event.key === 'ArrowDown' && items.length) { event.preventDefault(); quickHighlight = (quickHighlight + 1) % items.length; updateQuickHighlight(items); }
    if (event.key === 'ArrowUp' && items.length) { event.preventDefault(); quickHighlight = (quickHighlight - 1 + items.length) % items.length; updateQuickHighlight(items); }
    if (event.key === 'Enter' && items[quickHighlight]) { event.preventDefault(); openResource(items[quickHighlight].dataset.openResource); closeModals(); }
  });
}
function updateQuickHighlight(items) { items.forEach((item, index) => item.classList.toggle('highlighted', index === quickHighlight)); items[quickHighlight]?.scrollIntoView({ block: 'nearest' }); }

setTheme(state.theme);
renderResources();
bindEvents();
applyHash();
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('./sw.js').catch(() => {});

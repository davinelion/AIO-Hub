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
  developer: ['developer', 'dev', 'code', 'api', 'cli', 'programming', 'software', 'library', 'framework', 'terminal'],
  ai: ['ai', 'automation', 'workflow', 'machine', 'bot', 'agent', 'model'],
  design: ['design', 'creative', 'note', 'writing', 'photo', 'video', 'prototype', 'art'],
  privacy: ['privacy', 'security', 'password', 'network', 'encrypted', 'vpn', 'auth'],
  media: ['media', 'music', 'movie', 'stream', 'photo', 'recipe', 'game', 'self-hosted']
};

const state = {
  resources: loadResources(),
  saved: readStorage('aio-saved', []),
  connected: readStorage('aio-connected', { github: false, gitlab: false, feed: false }),
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
function updateCounts() {
  document.querySelectorAll('.saved-count').forEach(element => { element.textContent = state.saved.length; });
  const github = document.getElementById('github-status');
  const gitlab = document.getElementById('gitlab-status');
  const githubCopy = document.getElementById('github-source-copy');
  const gitlabCopy = document.getElementById('gitlab-source-copy');
  if (github) { github.classList.toggle('online', !!state.connected.github); githubCopy.textContent = state.connected.github ? 'Connected · public repositories' : 'Public repos · ready to connect'; }
  if (gitlab) { gitlab.classList.toggle('online', !!state.connected.gitlab); gitlabCopy.textContent = state.connected.gitlab ? 'Connected · public projects' : 'Projects · ready to connect'; }
  document.querySelectorAll('[data-connect="github"]').forEach(button => { button.textContent = state.connected.github ? 'Connected' : 'Connect'; button.classList.toggle('connected', state.connected.github); });
  document.querySelectorAll('[data-connect="gitlab"]').forEach(button => { button.textContent = state.connected.gitlab ? 'Connected' : 'Connect'; button.classList.toggle('connected', state.connected.gitlab); });
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
function connectSource(source) {
  if (source === 'feed') { addFeed(); return; }
  state.connected[source] = true; saveStorage('aio-connected', state.connected); updateCounts(); showToast(`${source === 'github' ? 'GitHub' : 'GitLab'} connected — ready to import public projects`);
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

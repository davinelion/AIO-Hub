import { mkdir, writeFile } from 'node:fs/promises';

const now = new Date();
const monthKey = now.toISOString().slice(0, 7);
const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
const keywords = {
  developer: ['developer', 'code', 'api', 'cli', 'programming', 'software', 'library', 'framework', 'terminal', 'database', 'testing'],
  ai: ['ai', 'automation', 'workflow', 'machine', 'bot', 'agent', 'model', 'llm', 'prompt', 'inference'],
  design: ['design', 'creative', 'note', 'writing', 'photo', 'video', 'prototype', 'art', 'font'],
  privacy: ['privacy', 'security', 'password', 'network', 'encrypted', 'vpn', 'auth', 'backup', 'identity'],
  media: ['media', 'music', 'movie', 'stream', 'photo', 'recipe', 'game', 'self-hosted', 'podcast']
};
const categoryLabels = { developer: 'Developer tools', ai: 'AI & automation', design: 'Design & create', privacy: 'Privacy & security', media: 'Media & play' };

async function getJSON(url, options = {}) {
  const response = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': 'AIO-Hub-monthly-index', ...(options.headers || {}) } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}
function categoryFor(item) {
  const text = [item.name, item.description, ...(item.tags || [])].join(' ').toLowerCase();
  let result = 'developer'; let score = 0;
  for (const [category, words] of Object.entries(keywords)) {
    const current = words.reduce((total, word) => total + Number(text.includes(word)), 0);
    if (current > score) { result = category; score = current; }
  }
  return result;
}
function makeItem(source, item) {
  const popularity = Math.max(1, Number(item.popularity || 1));
  const score = Math.round(Math.min(100, 38 + Math.log10(popularity) * 12 + (item.tags || []).length * 3));
  return { ...item, source, category: categoryFor(item), score };
}
function githubItems(data) {
  return (data.items || []).map(item => makeItem('GitHub', { name: item.full_name, description: item.description || 'Open-source project', tags: [...(item.topics || []), item.language].filter(Boolean), url: item.html_url, popularity: item.stargazers_count }));
}
function gitlabItems(data) {
  return (data || []).map(item => makeItem('GitLab', { name: item.path_with_namespace, description: item.description || 'Open project', tags: item.topics || [], url: item.web_url, popularity: item.star_count }));
}
function npmItems(data) {
  return (data.objects || []).map(({ package: item, score }) => makeItem('npm', { name: item.name, description: item.description || 'JavaScript package', tags: [...(item.keywords || []), 'JavaScript'], url: item.links?.npm || `https://www.npmjs.com/package/${item.name}`, popularity: (score?.detail?.popularity || 0) * 100000 }));
}
function dockerItems(data) {
  return (data.results || []).map(item => makeItem('Docker Hub', { name: item.repo_name, description: item.short_description || 'Container image', tags: ['container', 'self-hosted'], url: `https://hub.docker.com/r/${item.repo_name}`, popularity: item.pull_count }));
}
function hackerNewsItems(data) {
  return (data.hits || []).filter(item => item.url || item.story_url).map(item => makeItem('Hacker News', { name: item.title, description: `A new project shared by ${item.author || 'the community'}.`, tags: ['new', 'community launch'], url: item.url || item.story_url, popularity: item.points || 1 }));
}

async function collect() {
  const jobs = [
    ['GitHub', () => getJSON(`https://api.github.com/search/repositories?q=${encodeURIComponent('stars:>500 archived:false')}&sort=stars&order=desc&per_page=15`).then(githubItems)],
    ['GitLab', () => getJSON('https://gitlab.com/api/v4/projects?order_by=star_count&sort=desc&per_page=15&simple=true').then(gitlabItems)],
    ['npm', () => getJSON('https://registry.npmjs.org/-/v1/search?text=keywords:cli&size=15&popularity=1.0').then(npmItems)],
    ['Docker Hub', () => getJSON('https://hub.docker.com/v2/search/repositories/?page_size=15&ordering=-pull_count&query=developer').then(dockerItems)],
    ['Hacker News', () => getJSON('https://hn.algolia.com/api/v1/search_by_date?tags=show_hn&hitsPerPage=15').then(hackerNewsItems)]
  ];
  const items = [];
  const sourceNames = [];
  for (const [name, job] of jobs) {
    try { const result = await job(); items.push(...result); sourceNames.push(name); console.log(`${name}: collected`); }
    catch (error) { console.warn(`${name}: skipped (${error.message})`); }
  }
  const pypiNames = ['uv', 'ruff', 'polars', 'streamlit', 'gradio', 'fastapi', 'pydantic', 'django'];
  const pypiResults = await Promise.allSettled(pypiNames.map(name => getJSON(`https://pypi.org/pypi/${name}/json`)));
  const pypiItems = pypiResults.filter(result => result.status === 'fulfilled').map(result => {
    const info = result.value.info;
    return makeItem('PyPI', { name: info.name, description: info.summary || 'Python package', tags: [...String(info.keywords || '').split(/[, ]+/), 'Python'].filter(Boolean), url: info.project_url || `https://pypi.org/project/${info.name}/`, popularity: 1000 });
  });
  if (pypiItems.length) { items.push(...pypiItems); sourceNames.push('PyPI'); }
  if (process.env.PRODUCT_HUNT_TOKEN) console.warn('Product Hunt token detected; add its GraphQL adapter here before enabling automated collection.');
  const unique = new Map(items.filter(item => item.url).map(item => [item.url, item]));
  return { items: [...unique.values()].sort((a, b) => b.score - a.score).slice(0, 60), sourceNames };
}
function writeArticle(items, sourceNames) {
  const sections = Object.keys(categoryLabels).map(category => ({ category, items: items.filter(item => item.category === category).slice(0, 5) })).filter(section => section.items.length);
  const top = items.slice(0, 10);
  const lines = [`# The AIO monthly: ${monthName}'s best new tools`, '', `*Generated ${now.toISOString().slice(0, 10)} by the AIO Hub source automation*`, '', `This month, AIO collected ${items.length} public projects from ${sourceNames.join(', ') || 'the connected sources'}. Projects were de-duplicated, scored by activity and popularity, and automatically categorized before this draft was written.`, '', '## The shortlist', ''];
  top.forEach((item, index) => lines.push(`${index + 1}. **[${item.name}](${item.url})** — ${item.description}`));
  lines.push('', '## Browse by category', '');
  sections.forEach(section => { lines.push(`### ${categoryLabels[section.category]}`, ''); section.items.forEach(item => lines.push(`- **[${item.name}](${item.url})** — ${item.description} _(${item.source})_`)); lines.push(''); });
  lines.push('## Editorial note', '', 'This is an automatically generated first draft. Verify availability, licensing, pricing, and links before publishing. Human review keeps the index useful and trustworthy.', '');
  return lines.join('\n');
}

const { items, sourceNames } = await collect();
await mkdir('content', { recursive: true });
await writeFile(`content/monthly-update-${monthKey}.md`, writeArticle(items, sourceNames));
await writeFile('content/catalog.json', JSON.stringify({ generatedAt: now.toISOString(), sources: sourceNames, items }, null, 2));
console.log(`Wrote ${items.length} items from ${sourceNames.join(', ') || 'no sources'} to content/catalog.json and content/monthly-update-${monthKey}.md`);

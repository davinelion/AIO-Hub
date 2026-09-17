#!/usr/bin/env node
/**
 * Builds the wiki dataset from the open-source FMHY markdown (https://github.com/fmhy/edit).
 *
 * Usage:
 *   node scripts/build-wiki.mjs [path/to/fmhy-edit/docs]
 *
 * When no path is provided the script performs a shallow clone of fmhy/edit into a temp dir.
 * Output:
 *   content/wiki/index.json      – page list, section tree, counts
 *   content/wiki/<page>.json     – full page content (sections, entries, notes)
 *   content/wiki/search.json     – flat search index: [pageSlug, sectionAnchor, title, url, description, starred]
 */
import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'content', 'wiki');

const PAGES = [
  { slug: 'beginners-guide', title: 'Beginners Guide', tone: 'blue', symbol: '★', blurb: 'Start here: adblocking, safety, browsers and the basics.', prose: true },
  { slug: 'privacy', title: 'Adblocking / Privacy', tone: 'green', symbol: '⌑', blurb: 'Block ads, trackers and other nasty things.' },
  { slug: 'ai', title: 'Artificial Intelligence', tone: 'violet', symbol: '✦', blurb: 'Chatbots, image, audio and video generation, agents.' },
  { slug: 'video', title: 'Movies / TV / Anime', tone: 'orange', symbol: '▶', blurb: 'Streaming, live TV, anime, sports and more.' },
  { slug: 'audio', title: 'Music / Podcasts / Radio', tone: 'pink', symbol: '♪', blurb: 'Streaming, downloading, radio and audio tools.' },
  { slug: 'gaming', title: 'Gaming / Emulation', tone: 'blue', symbol: '⌘', blurb: 'Download games, emulators, ROMs and browser games.' },
  { slug: 'reading', title: 'Books / Comics / Manga', tone: 'orange', symbol: '▤', blurb: 'Ebooks, audiobooks, comics, manga and academic papers.' },
  { slug: 'downloading', title: 'Downloading', tone: 'green', symbol: '↓', blurb: 'Direct downloads, software, file hosts and usenet.' },
  { slug: 'torrenting', title: 'Torrenting', tone: 'blue', symbol: '⇅', blurb: 'Clients, trackers, ratio tips and safety.' },
  { slug: 'educational', title: 'Educational', tone: 'violet', symbol: '✎', blurb: 'Courses, languages, science, history and productivity.' },
  { slug: 'mobile', title: 'Android / iOS', tone: 'green', symbol: '▯', blurb: 'Apps, modding, jailbreaking and mobile tools.' },
  { slug: 'linux-macos', title: 'Linux / macOS', tone: 'orange', symbol: '⌂', blurb: 'Distros, apps, terminals and customization.' },
  { slug: 'non-english', title: 'Non-English', tone: 'pink', symbol: '◎', blurb: 'Resources in dozens of languages.' },
  { slug: 'misc', title: 'Miscellaneous', tone: 'violet', symbol: '◈', blurb: 'Everything that does not fit elsewhere.' },
  { slug: 'system-tools', title: 'System Tools', tone: 'blue', symbol: '⚙', blurb: 'Windows, optimization, drivers and recovery.' },
  { slug: 'file-tools', title: 'File Tools', tone: 'green', symbol: '▣', blurb: 'Conversion, cloud storage, archives and sharing.' },
  { slug: 'internet-tools', title: 'Internet Tools', tone: 'orange', symbol: '⌁', blurb: 'Browsers, extensions, search, bypasses and archives.' },
  { slug: 'social-media-tools', title: 'Social Media Tools', tone: 'pink', symbol: '☺', blurb: 'Reddit, YouTube, Discord, Twitter and more.' },
  { slug: 'text-tools', title: 'Text Tools', tone: 'violet', symbol: 'T', blurb: 'Writing, notes, fonts, PDFs and translation.' },
  { slug: 'video-tools', title: 'Video Tools', tone: 'orange', symbol: '✂', blurb: 'Editing, screen recording, players and downloaders.' },
  { slug: 'image-tools', title: 'Image Tools', tone: 'pink', symbol: '◐', blurb: 'Editing, wallpapers, icons, stock photos and 3D.' },
  { slug: 'gaming-tools', title: 'Gaming Tools', tone: 'blue', symbol: '⌥', blurb: 'Launchers, mods, optimization, controllers and multiplayer.' },
  { slug: 'developer-tools', title: 'Developer Tools', tone: 'green', symbol: '</>', blurb: 'IDEs, APIs, hosting, learning and open-source.' },
  { slug: 'storage', title: 'Storage', tone: 'violet', symbol: '▥', blurb: 'Big archives, mirrors and backups.' },
  { slug: 'unsafe', title: 'Unsafe Sites', tone: 'orange', symbol: '⚠', blurb: 'Sites and software to avoid, and why.' }
];

function resolveDocsDir() {
  const arg = process.argv[2];
  if (arg) return arg;
  const dir = join(tmpdir(), 'fmhy-edit-src');
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
  execSync(`git clone --depth 1 https://github.com/fmhy/edit.git "${dir}"`, { stdio: 'inherit' });
  return join(dir, 'docs');
}

const escapeHTML = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const slugify = value => value.toLowerCase().replace(/[►▷]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const cleanHeading = value => value.replace(/^[►▷]\s*/, '').replace(/[*_`]/g, '').trim();

const knownPages = new Set(PAGES.map(page => page.slug));
const redditAliases = { 'adblock-vpn-privacy': 'privacy', android: 'mobile', 'android-ios': 'mobile', 'linux-macos': 'linux-macos', edu: 'educational', 'non-english': 'non-english', 'dev-tools': 'developer-tools', 'social-media': 'social-media-tools', games: 'gaming', 'game-tools': 'gaming-tools', 'video-tools': 'video-tools', 'image-tools': 'image-tools', 'system-tools': 'system-tools', 'file-tools': 'file-tools', 'internet-tools': 'internet-tools', 'text-tools': 'text-tools', 'beginners-guide': 'beginners-guide', 'storage': 'storage', 'unsafe': 'unsafe', misc: 'misc', ai: 'ai', video: 'video', audio: 'audio', reading: 'reading', torrent: 'torrenting', torrenting: 'torrenting', download: 'downloading', downloading: 'downloading', privacy: 'privacy', gaming: 'gaming', mobile: 'mobile', educational: 'educational', 'developer-tools': 'developer-tools', 'social-media-tools': 'social-media-tools', 'gaming-tools': 'gaming-tools' };

function rewriteLink(href) {
  const reddit = href.match(/^https?:\/\/(?:www\.)?reddit\.com\/r\/FREEMEDIAHECKYEAH\/wiki\/([a-z0-9-]+)\/?(?:#wiki_(.+))?$/i);
  if (reddit) {
    const slug = redditAliases[reddit[1].toLowerCase()];
    if (slug) return `#wiki/${slug}${reddit[2] ? '/' + redditAnchor(reddit[2]) : ''}`;
  }
  const local = href.match(/^\/([a-z0-9-]+)(?:#(.+))?$/i);
  if (local && knownPages.has(local[1])) return `#wiki/${local[1]}${local[2] ? '/' + local[2] : ''}`;
  if (href.startsWith('/')) return `https://fmhy.net${href}`;
  return href;
}

function redditAnchor(anchor) {
  // Reddit anchors look like `.25BA_streaming_sites` (URL encoded prefix + underscored title)
  anchor = anchor.replace(/^\.25(?:BA|B7)_/i, '');
  try { anchor = decodeURIComponent(anchor.replace(/\.([0-9A-F]{2})/gi, '%$1')); } catch { /* ignore */ }
  return slugify(anchor.replace(/[►▷]/g, '').replace(/_/g, ' '));
}

/** Converts a line of markdown inline syntax into safe HTML. */
function inline(text) {
  const links = [];
  const withTokens = text.replace(/\[([^\]]*?)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_, label, target) => {
    const href = rewriteLink(target);
    const internal = href.startsWith('#');
    links.push(`<a href="${escapeHTML(href)}"${internal ? '' : ' target="_blank" rel="noopener noreferrer"'}>${formatText(label)}</a>`);
    return `\u0000${links.length - 1}\u0000`;
  });
  return formatText(withTokens).replace(/\u0000(\d+)\u0000/g, (_, i) => links[Number(i)]);
}

function formatText(raw) {
  let html = escapeHTML(raw);
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(^|[\s(>])\*(?!\s)(.+?)\*(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');
  html = html.replace(/(^|[\s(>])_(?!\s)(.+?)_(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');
  return html;
}

const stripMarkdown = raw => raw.replace(/\[([^\]]*?)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();

function parseEntry(line) {
  const body = line.replace(/^\*\s+/, '');
  let rest = body;
  let badge = null;
  const badgeMatch = rest.match(/^(🌟|⭐|🌐|🇺🇸|⚠️|❌|✅|🎵|🎮|📱|💻|🔒|📚)\s+/u);
  if (badgeMatch) { badge = badgeMatch[1]; rest = rest.slice(badgeMatch[0].length); }
  if (/^\*\*Note\*\*/i.test(rest) || /^\*\*Warning\*\*/i.test(rest) || /^\*\*Tip\*\*/i.test(rest)) {
    return { kind: 'note', html: inline(rest) };
  }
  const first = rest.match(/\[([^\]]+?)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
  if (!first) return { kind: 'note', html: inline(rest) };
  const title = stripMarkdown(first[1]);
  const url = first[2];
  const separator = rest.indexOf(' - ');
  const description = separator > -1 ? stripMarkdown(rest.slice(separator + 3)) : '';
  const links = [];
  const linkPattern = /\[([^\]]*?)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let match;
  while ((match = linkPattern.exec(rest))) links.push(match[2]);
  return {
    kind: 'entry',
    starred: badge === '🌟' ? 2 : badge === '⭐' ? 1 : 0,
    badge,
    title,
    url,
    host: safeHost(url),
    description,
    html: inline(rest),
    links: links.length
  };
}

function safeHost(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

function parsePage(markdown, page) {
  const lines = markdown.replace(/\r/g, '').split('\n');
  const sections = [];
  let section = null;
  let sub = null;
  let paragraph = [];
  let container = null;
  const anchors = new Map();

  const uniqueAnchor = text => {
    const base = slugify(text) || 'section';
    const count = anchors.get(base) || 0;
    anchors.set(base, count + 1);
    return count ? `${base}-${count}` : base;
  };
  const currentBlocks = () => (sub || section || (section = newSection(page.title))).blocks;
  const newSection = title => { const created = { title: cleanHeading(title), anchor: uniqueAnchor(cleanHeading(title)), blocks: [], subsections: [] }; sections.push(created); return created; };
  const flushParagraph = () => {
    if (!paragraph.length) return;
    const text = paragraph.join(' ').trim();
    paragraph = [];
    if (!text) return;
    if (/^\*\*\[◄◄ Back to Wiki Index/.test(text)) return;
    currentBlocks().push({ kind: 'paragraph', html: inline(text), callout: container });
  };

  for (let raw of lines) {
    const line = raw.trimEnd();
    if (/^---$/.test(line) && sections.length === 0 && !section && !paragraph.length) continue;
    if (/^\*\*\*+$/.test(line) || /^---+$/.test(line)) { flushParagraph(); continue; }
    if (/^:::\s*$/.test(line)) { flushParagraph(); container = null; continue; }
    const containerStart = line.match(/^:::\s*(\w+)\s*(.*)$/);
    if (containerStart) { flushParagraph(); container = containerStart[1]; if (containerStart[2]) currentBlocks().push({ kind: 'callout-title', html: escapeHTML(containerStart[2]), callout: container }); continue; }
    const note = line.match(/^!!!(\w+)\s+(.*)$/);
    if (note) { flushParagraph(); currentBlocks().push({ kind: 'paragraph', html: inline(note[2]), callout: note[1] }); continue; }
    if (/^<\/?[a-z]/i.test(line) && !/^<https?:/i.test(line)) { flushParagraph(); continue; }
    const h1 = line.match(/^#\s+(.*)$/);
    if (h1) { flushParagraph(); sub = null; section = newSection(h1[1]); continue; }
    const h2 = line.match(/^##\s+(.*)$/);
    if (h2) { flushParagraph(); if (!section) section = newSection(page.title); sub = { title: cleanHeading(h2[1]), anchor: uniqueAnchor(cleanHeading(h2[1])), blocks: [] }; section.subsections.push(sub); continue; }
    const h3 = line.match(/^###+\s+(.*)$/);
    if (h3) { flushParagraph(); currentBlocks().push({ kind: 'heading', html: inline(cleanHeading(h3[1])) }); continue; }
    const quote = line.match(/^>\s?(.*)$/);
    if (quote) { flushParagraph(); currentBlocks().push({ kind: 'quote', html: inline(quote[1]) }); continue; }
    if (/^\*\s+/.test(line) || /^-\s+/.test(line)) { flushParagraph(); currentBlocks().push(parseEntry(line.replace(/^-\s+/, '* '))); continue; }
    if (!line.trim()) { flushParagraph(); continue; }
    paragraph.push(line.trim());
  }
  flushParagraph();
  return sections.filter(item => item.blocks.length || item.subsections.length);
}

function collectEntries(sections) {
  const entries = [];
  for (const section of sections) {
    for (const block of section.blocks) if (block.kind === 'entry') entries.push(block);
    for (const sub of section.subsections) for (const block of sub.blocks) if (block.kind === 'entry') entries.push(block);
  }
  return entries;
}

function main() {
  const docsDir = resolveDocsDir();
  mkdirSync(outDir, { recursive: true });
  const index = { generatedAt: new Date().toISOString(), source: 'https://github.com/fmhy/edit', pages: [], totals: { entries: 0, sections: 0 } };
  const search = [];
  for (const page of PAGES) {
    const file = join(docsDir, `${page.slug}.md`);
    if (!existsSync(file)) { console.warn(`skip ${page.slug}: missing`); continue; }
    const sections = parsePage(readFileSync(file, 'utf8'), page);
    const entries = collectEntries(sections);
    const sectionCount = sections.reduce((sum, item) => sum + 1 + item.subsections.length, 0);
    writeFileSync(join(outDir, `${page.slug}.json`), JSON.stringify({ slug: page.slug, title: page.title, blurb: page.blurb, tone: page.tone, sections }));
    index.pages.push({
      slug: page.slug,
      title: page.title,
      tone: page.tone,
      symbol: page.symbol,
      blurb: page.blurb,
      prose: Boolean(page.prose),
      entries: entries.length,
      sections: sections.map(item => ({ title: item.title, anchor: item.anchor, count: item.blocks.filter(b => b.kind === 'entry').length + item.subsections.reduce((s, sub) => s + sub.blocks.filter(b => b.kind === 'entry').length, 0), subsections: item.subsections.map(sub => ({ title: sub.title, anchor: sub.anchor, count: sub.blocks.filter(b => b.kind === 'entry').length })) }))
    });
    index.totals.entries += entries.length;
    index.totals.sections += sectionCount;
    for (const section of sections) {
      const push = (block, sub) => { if (block.kind !== 'entry') return; search.push([page.slug, sub ? sub.anchor : section.anchor, block.title, block.url, block.description.slice(0, 90), block.starred]); };
      section.blocks.forEach(block => push(block, null));
      section.subsections.forEach(sub => sub.blocks.forEach(block => push(block, sub)));
    }
    console.log(`${page.slug.padEnd(20)} ${String(entries.length).padStart(5)} entries  ${String(sectionCount).padStart(4)} sections`);
  }
  writeFileSync(join(outDir, 'index.json'), JSON.stringify(index));
  writeFileSync(join(outDir, 'search.json'), JSON.stringify(search));
  console.log(`\nTotal: ${index.totals.entries} entries across ${index.pages.length} pages → ${outDir}`);
}

main();

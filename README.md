# AIO Hub

A calm, fast directory for discovering the open web's best apps, projects, and resources. This is a from-scratch reinterpretation of the resource-directory experience behind FMHY — with an original visual system, local-first library, quick search, and source import workflows.

## Included

- Responsive dashboard layout with dark/light mode.
- Fast client-side search across names, descriptions, categories, types, and tags.
- Trending, recently added, saved, list, and grid views.
- Personal library stored in `localStorage`.
- Multi-source collection from GitHub, GitLab, npm, PyPI, Docker Hub, Hacker News, Product Hunt guidance, and custom JSON/RSS feeds.
- Automatic ranking and categorization using public activity, popularity, freshness, tags, and keyword signals.
- GitHub and GitLab public project importer. Paste `github.com/owner/repository` or a GitLab project URL to fetch its public metadata and add it to the index.
- JSON/CSV catalog import with downloadable CSV template.
- Public JSON feed sync for teams that already maintain a resource catalog.
- One-click **Sync all sources** workflow that deduplicates new projects and adds them to the index.
- Monthly editorial draft generator that turns the ranked index into a reviewable Markdown article.
- No tracking, account, or backend required for the browser experience; all local user state remains in the current browser.

## Run locally

The site is intentionally dependency-free and can be served by any static host:

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

Then open `http://localhost:4173`.

## Deploy and connect a custom domain

### Cloudflare Pages, Netlify, or Vercel

1. Import this repository and select the repository root as the output directory.
2. No build command is needed. The deploy directory is the root of the repository.
3. Add the custom domain in the host's **Domains** settings.
4. Follow the host's DNS instructions. Usually this is a CNAME from `www` to the host's assigned domain and an A/ALIAS record for the apex domain.
5. Turn on HTTPS and update the footer domain in `index.html` from `aio.tools` to your real domain.

For GitHub Pages, add a `CNAME` file containing your domain and enable Pages from the branch in repository settings.

## Automatic source collection

The **Sync all sources** workflow uses read-only public APIs for:

- GitHub repository search, ranked by stars and activity.
- GitLab project search, ranked by star count.
- npm package search, ranked by popularity.
- PyPI's public package metadata for a curated list of high-signal packages.
- Docker Hub search, ranked by pull count.
- Hacker News `Show HN` launches.
- Public JSON feeds. Product Hunt is listed as an integration, but its API requires a token and should be enabled through a server-side adapter rather than exposing a secret in the browser.

Each result is deduplicated by URL, scored, and categorized into Developer tools, AI & automation, Design & create, Privacy & security, or Media & play. The scoring is intentionally transparent and can be replaced with a database or ML classifier later.

## Monthly articles

`scripts/monthly-digest.mjs` collects source metadata, writes `content/catalog.json`, and generates `content/monthly-update-YYYY-MM.md`. The included `.github/workflows/monthly-digest.yml` runs on the first day of each month and commits the catalog plus draft article back to the repository. It can also be run manually from GitHub Actions.

The browser's **Generate monthly article** button produces the same style of draft locally and lets an editor copy or download it. It is intentionally a draft: verify availability, pricing, licensing, and links before publishing.

The current browser flow is read-only and requires no account. For a production version, use GitHub/GitLab OAuth through a small serverless function, cache API responses, validate imported URLs server-side, and run scheduled link checks. Keep OAuth secrets and webhook signing keys out of the browser.

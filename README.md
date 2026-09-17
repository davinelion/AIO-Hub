# AIO Hub

A calm, fast directory for discovering the open web's best apps, projects, and resources. This is a from-scratch reinterpretation of the resource-directory experience behind FMHY — with an original visual system, local-first library, quick search, and source import workflows.

## Included

- Responsive dashboard layout with dark/light mode.
- Fast client-side search across names, descriptions, categories, types, and tags.
- Trending, recently added, saved, list, and grid views.
- Personal library stored in `localStorage`.
- GitHub and GitLab public project importer. Paste `github.com/owner/repository` or a GitLab project URL to fetch its public metadata and add it to the index.
- JSON/CSV catalog import with downloadable CSV template.
- Public JSON feed sync for teams that already maintain a resource catalog.
- No tracking, account, or backend required for the demo; all user state remains in the current browser.

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

## Adding an app automatically

- **One project:** open **Sync sources**, paste a public GitHub/GitLab URL, and choose **Import**.
- **Bulk catalog:** import a CSV with `name,url,description,category,tags,type` columns or a JSON array of the same shape.
- **Team feed:** add a public JSON endpoint returning either an array or `{ "resources": [] }`.

The current import flow is browser-side and read-only. For a production version, use GitHub/GitLab OAuth through a small serverless function, cache API responses, validate imported URLs server-side, and run scheduled link checks. Keep OAuth secrets and webhook signing keys out of the browser.

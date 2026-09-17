# Deploying AIO Hub

The site is static: no build step, output directory = repository root.

## Option A — Cloudflare Pages (recommended)
1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick this repo.
2. Build command: *(leave empty)*. Build output directory: `/`.
3. Deploy. `_headers` and `_redirects` in the repo are applied automatically.
4. Custom domain: Pages project → Custom domains → add your domain, follow the CNAME instructions.

## Option B — GitHub Pages (zero setup)
1. Repo Settings → Pages → Source: **GitHub Actions**.
2. The `Deploy to GitHub Pages` workflow publishes on every push to `main`.
3. For a custom domain add a `CNAME` file containing the domain and set it in Settings → Pages.

## Keeping data fresh
`Sync wiki data from FMHY` runs daily and commits `content/wiki`. Trigger it once manually from the Actions tab after enabling workflows.

## After going live
Replace `aio.tools` in the footer of `index.html` with your real domain.

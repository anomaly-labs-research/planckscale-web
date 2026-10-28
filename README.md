# PlanckScale

Single-page site for PlanckScale — quantum computing, post-quantum cryptography, blockchain systems and DeFi.
Next.js static export (`out/`) served as Cloudflare Workers static assets.

```sh
bun install
bun run dev        # http://localhost:3000
bun run preview    # build + wrangler dev against ./out
bun run deploy     # build + wrangler deploy
bunx wrangler login  # once, before the first deploy
```

Content lives in `site/lib/data.ts`. Layout: `site/` holds main-site-only code, `mev/` the handbook's,
and root `components/`, `lib/` and `styles/tokens.css` what both share (logo, theme, fonts, colours).

The Solana MEV Handbook is served at `/mev` (see `mev/README.md`). The main site and the
handbook are separate root layouts, `app/(site)` and `app/(mev)`, so moving between them is a full page load.

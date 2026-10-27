# PlanckScale

Single-page site for PlanckScale — quantum computing, post-quantum cryptography and blockchain systems.
Next.js static export (`out/`) served as Cloudflare Workers static assets.

```sh
bun install
bun run dev        # http://localhost:3000
bun run preview    # build + wrangler dev against ./out
bun run deploy     # build + wrangler deploy
bunx wrangler login  # once, before the first deploy
```

Content lives in `lib/data.ts`.

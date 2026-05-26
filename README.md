# Metamorphs

AI agent team that ships digital products with you — strategy, design, build, launch in one continuous loop.

Live: [metamorphs.xyz](https://metamorphs.xyz)

## Stack

- **Frontend**: React 18 + Vite 5, pure CSS (brutalist grid), Three.js for 3D agent badges, raw WebGL shaders for liquid halftone backgrounds, IndexedDB for client storage
- **Backend**: tiny Node.js + Express API (proxy to Anthropic Claude) on AWS Lightsail
- **Infra**: AWS Lightsail (Ubuntu) · nginx reverse proxy · Let's Encrypt SSL · Hostinger DNS

## Project layout

```
src/
  App.jsx                       hash router (Landing / Dashboard)
  pages/
    Landing.jsx                 marketing page
    Dashboard.jsx               project + tiers + auth dashboard
  components/
    Hero.jsx                    big wordmark + logo overlay
    TokenStrip.jsx              $MEMO countdown band
    BeyondHardware.jsx          Beyond Models pillar (Three.js stage)
    Incubation.jsx              Incubation pillar (Three.js sphere)
    Acceleration.jsx            Acceleration pillar (Three.js torus knot)
    Portfolio.jsx               product stage cards
    UseCases.jsx                4-cell type grid
    Team.jsx                    Meet the Agents (6 Three.js variants)
    FAQ.jsx                     7 Q&A accordion
    ByNumbers.jsx               metric cards
    Footer.jsx                  subscribe + columns + bar
    NoiseBackground.jsx         page-wide canvas noise
    LiquidHalftoneCanvas.jsx    WebGL FBM + halftone shader
    ThreeBadge.jsx              variant-driven Three.js renderer
    dashboard/
      SubmitIdea.jsx
      ProjectCard.jsx
      StageStepper.jsx
      AgentList.jsx
      StageCounters.jsx
      Tiers.jsx                 Incubator (free) + Acceleration (premium)
      LoginModal.jsx            email + Phantom wallet
  lib/
    storage.js                  window.storage polyfill (IndexedDB)
    projects.js                 CRUD on projects
    agents.js                   6 agents + 4 stages
    blueprint.js                Claude blueprint generator (server / mock)

server/                         deployed separately to Lightsail, not bundled
  server.js                     Express + Anthropic SDK + daily quota
  package.json
  .env.example
```

## Local dev

```bash
npm install
npm run dev          # http://localhost:5173
```

Without the server, `blueprint.js` falls back to a local mock — the dashboard works without an API key.

## Production build

```bash
npm run build        # → dist/
npm run preview      # preview the build locally
```

## Deploy to Lightsail

The full deploy lives in [`deploy.sh`](deploy.sh):

```bash
./deploy.sh
```

What it does:

1. `npm run build`
2. `scp dist/` → `/tmp/metamorphs-staging` on the server
3. `ssh` + install nginx if missing, copy to `/var/www/metamorphs/`
4. Write nginx config (only on first run — preserves certbot SSL edits afterward)
5. Install certbot if missing

Edit the `SERVER_IP`, `DOMAIN`, and `SSH_KEY` constants at the top of `deploy.sh` to point at your own server.

### One-time HTTPS setup

After DNS resolves, on the server:

```bash
sudo certbot --nginx -d metamorphs.xyz -d www.metamorphs.xyz \
  --non-interactive --agree-tos -m you@example.com --redirect
```

## API server (Claude blueprint proxy)

Lives under `server/`, deployed to `/srv/metamorphs-api/` on the Lightsail box.

```
GET  /api/health       → quota status + model
POST /api/blueprint    → { name, description, type } → { targetUser, features, suggestedName }
```

Run locally:

```bash
cd server
cp .env.example .env       # then fill in your key
npm install
ANTHROPIC_API_KEY=sk-ant-... npm start
```

On the server it runs as a systemd unit at `metamorphs-api.service`, fronted by nginx at `/api/`. The frontend just `fetch('/api/blueprint')` — no key ever leaves the server.

Daily quota is enforced globally (default 10/day) to cap cost. After the quota is exhausted, the API returns 429 and the frontend falls back to the local mock blueprint.

## License

MIT.

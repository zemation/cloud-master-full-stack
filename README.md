# Cloud Master

A full-stack resource hub for IT, cloud, and DevOps professionals. Browse and discover courses, books, documentation, practice exams, and certification guides across major technology domains.

🌐 **[cloud-master.io](https://cloud-master.io)**

---

## Tech Stack

**Frontend** — React, Vite, Redux Toolkit, Axios  
**Backend** — Node.js, Express, Mongoose  
**Database** — MongoDB Atlas  
**Auth** — JWT  
**CI/CD** — GitHub Actions<br>
**Metrics** — Prometheus (prom-client)

---

## Project Structure

```
cloud-master-full-stack/
├── cloud-master-io/      # React/Vite frontend
└── node-backend/         # Node/Express REST API
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB instance)

### Backend

```bash
cd node-backend
npm install
```

Create a `.env` file (never commit this):

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=24h
PORT=5500
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Optional — AI study-guide chat (`POST /chat`, any OpenAI-compatible API):

```env
CHAT_API_BASE_URL=https://your-model-provider.example/v1
CHAT_API_KEY=[SECURITY_DATA]
CHAT_MODEL=your-model-id
CHAT_RATE_MAX=30
# Hard daily ceiling on model tokens (prompt + completion, UTC day).
# The endpoint returns 429 once exceeded. 0 = unlimited (not recommended).
CHAT_DAILY_TOKEN_BUDGET=100000
# Cloudflare Turnstile bot check (free at dash.cloudflare.com → Turnstile).
# When set, the widget must pass the invisible check before each message.
TURNSTILE_SECRET_KEY=[SECURITY_DATA]
```

Frontend (optional, pairs with the backend key above):

```env
VITE_TURNSTILE_SITE_KEY=your_turnstile_site_key
```

If the `CHAT_*` variables are not set, `POST /chat` returns `503` and the
chat widget shows a "not available" notice.

### Chat abuse protection

Because every message spends model tokens, `/chat` is guarded in layers:

1. **Per-IP rate limit** (`CHAT_RATE_MAX` per 15 minutes).
2. **Cloudflare Turnstile** — invisible bot check in the widget; unverified
   requests are rejected with 403. Skipped entirely when the Turnstile keys
   aren't configured (handy for local dev).
3. **Daily token budget** (`CHAT_DAILY_TOKEN_BUDGET`) — upstream token usage
   is counted per UTC day in the `chatusages` collection; once the budget is
   hit, the endpoint returns 429 until the next day. This is the financial
   kill-switch: worst case, one day's budget is the most abuse can cost.

```bash
npm run dev
```

### Frontend

```bash
cd cloud-master-io
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5500
```

```bash
npm run dev
```

---

## Features

- Browse resources by category and topic
- Filter by type (course, book, documentation, practice exam, study guide, video, tool)
- Filter by difficulty (beginner, intermediate, advanced)
- Admin dashboard for adding, editing, and removing resources
- JWT-based authentication for admin access
- AI study-guide chat widget, grounded in the site's own curated resources

## Categories

Foundations · Operating Systems · DevOps · Cloud · Web Development · Programming · Databases

---

## Roadmap

- [ ] Expanding resource content across all categories
- [ ] User accounts and saved resources
- [ ] Community contributions and ratings
- [ ] Search functionality

---

## CI/CD

The frontend and backend have separate workflows. Pull requests run checks only for the application changed. A push to `main` runs the relevant checks and deploys only the changed application to production.

Add these encrypted repository secrets under **Settings → Secrets and variables → Actions** before enabling production deployments:

- `DEPLOY_SSH_KEY` — the private key whose public key is authorized for both deployment users
- `DEPLOY_SSH_KNOWN_HOSTS` — the verified `known_hosts` entry for `server.zemation.com` (for example, generated from a trusted machine with `ssh-keyscan server.zemation.com` and verified against the server's host-key fingerprint)
- `DEPLOY_HOST` — the SSH host, currently `server.zemation.com`
- `FRONTEND_DEPLOY_USER` — the frontend SSH user, currently `cloud-master`
- `FRONTEND_PATH` — the frontend deployment directory, currently `/home/cloud-master/htdocs/www.cloud-master.io`
- `BACKEND_DEPLOY_USER` — the backend SSH user, currently `cloud-master-api`
- `BACKEND_PATH` — the backend deployment directory, currently `/home/cloud-master-api/htdocs/api.cloud-master.io`

The production `.env` files stay on the server and are excluded from deployment.

---

## License

MIT

# Vite + Express + React

One Node.js (Express) server that handles `/api/*` and serves the Vite React frontend on the same port.

## Run

```bash
npm install
npm run dev      # http://localhost:3000 — Vite HMR + API, server restarts on server/ changes
npm run build    # builds the frontend into dist/
npm start        # production: serves dist/ + API
```

Set `PORT` to change the port.

## Layout

```
server/
  index.js        Express app; Vite middleware in dev, static dist/ in prod
  routes/api.js   API routes (/api/health, /api/hello, /api/echo)
src/              React frontend
index.html        Vite entry
vite.config.js
```

## Add an API route

Edit `server/routes/api.js`:

```js
router.get('/users', (req, res) => res.json([{ id: 1, name: 'Ada' }]));
```

It's available at `/api/users`, and the frontend can call it with `fetch('/api/users')`.

import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import apiRouter from './routes/api.js';
import { setupSocket } from './socket.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const isProd = process.argv.includes('--prod') || process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT) || 3000;

async function start() {
  const app = express();
  const server = http.createServer(app);

  // --- Socket.IO (shares the HTTP server, served at /socket.io/) ----------
  setupSocket(server);

  app.use(express.json());

  // --- API ---------------------------------------------------------------
  app.use('/api', apiRouter);
  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

  // --- Frontend ----------------------------------------------------------
  if (!isProd) {
    // Dev: Vite runs inside Express as middleware (HMR over the same port).
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root,
      appType: 'spa',
      server: { middlewareMode: true, hmr: { server } },
    });
    app.use(vite.middlewares);
  } else {
    // Prod: serve the built files from dist/ with an SPA fallback.
    const dist = path.join(root, 'dist');
    app.use(express.static(dist));
    app.use((req, res, next) => {
      if (req.method !== 'GET') return next();
      res.sendFile(path.join(dist, 'index.html'));
    });
  }

  // --- Errors ------------------------------------------------------------
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
  });

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port} (${isProd ? 'production' : 'development'})`);
  });
}

start();

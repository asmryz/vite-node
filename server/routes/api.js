import { Router } from 'express';
import { getIO } from '../socket.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

router.get('/hello', (req, res) => {
  const name = req.query.name || 'world';
  res.json({ message: `Hello, ${name}!`, time: new Date().toISOString() });
});

router.post('/echo', (req, res) => {
  res.json({ received: req.body });
});

// Broadcast a message to all connected Socket.IO clients.
router.post('/broadcast', (req, res) => {
  const text = req.body?.text;
  if (!text) return res.status(400).json({ error: 'text is required' });
  getIO().emit('message', { text, time: new Date().toISOString() });
  res.json({ sent: true });
});

export default router;

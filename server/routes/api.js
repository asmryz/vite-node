import { Router } from 'express';

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

export default router;

import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  console.log('🚀 ETOMODA Demo Mode Active: Server running with local mock database layer');

  // API Routes for Demo Mode
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', mode: 'demo' });
  });

  app.post('/api/auth/register', (req, res) => {
    const { email, fullName } = req.body;
    res.json({
      success: true,
      user: {
        id: `usr-${Date.now()}`,
        email: email || 'user@etomoda.com',
        user_metadata: { full_name: fullName || 'Demo User' }
      }
    });
  });

  app.get('/api/admin/verify', (req, res) => {
    res.json({ success: true, message: 'Admin verified in demo mode' });
  });

  app.post('/api/orders', (req, res) => {
    res.json({ success: true, message: 'Order submitted to local demo store' });
  });

  app.post('/api/upload-url', (req, res) => {
    const { fileName } = req.body || {};
    const objectKey = `demo-${Date.now()}-${fileName || 'image.jpg'}`;
    res.json({
      success: true,
      uploadUrl: '#',
      fileUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80',
      objectKey
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

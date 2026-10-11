import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { servicesRouter, contentsRouter, newsletterRouter } from './routes/public.js';
import requestsRouter from './routes/requests.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';
import { mapError } from './utils/helpers.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Digitak REST API aktif',
    service: 'PT Metanouva Informatika',
    endpoints: {
      public: ['/api/services', '/api/service-requests', '/api/contents', '/api/newsletter/subscribe'],
      admin: ['/api/admin/auth/login', '/api/admin/*'],
    },
  });
});

app.use('/api/services', servicesRouter);
app.use('/api/contents', contentsRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/service-requests', requestsRouter);
app.use('/api/admin/auth', authRouter);
app.use('/api/admin', adminRouter);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  const mapped = mapError(err);
  res.status(mapped.status).json({ success: false, message: mapped.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Digitak REST API berjalan di http://localhost:${PORT}`);
});
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import './db/init.js'; // garante que o banco existe e está com o schema aplicado

import authRoutes from './routes/auth.js';
import coursesRoutes from './routes/courses.js';
import progressRoutes from './routes/progress.js';
import notesRoutes from './routes/notes.js';
import favoritesRoutes from './routes/favorites.js';
import bibleRoutes from './routes/bible.js';
import aiRoutes from './routes/ai.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'teologia-master-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/bible', bibleRoutes);
app.use('/api/ai', aiRoutes);

// Tratamento centralizado de erros não capturados nas rotas.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

app.listen(PORT, () => {
  console.log(`[server] Teologia Master API rodando em http://localhost:${PORT}`);
});

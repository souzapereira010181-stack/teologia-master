import { Router } from 'express';
import { db } from '../db/init.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, (req, res) => {
  const rows = db
    .prepare('SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id);
  res.json({ notes: rows });
});

router.post('/', requireAuth, (req, res) => {
  const { content, reference } = req.body;
  if (!content) return res.status(400).json({ error: 'O conteúdo da anotação é obrigatório.' });

  const info = db
    .prepare('INSERT INTO notes (user_id, content, reference) VALUES (?, ?, ?)')
    .run(req.user.id, content, reference || null);

  const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ note });
});

router.delete('/:id', requireAuth, (req, res) => {
  const note = db.prepare('SELECT * FROM notes WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!note) return res.status(404).json({ error: 'Anotação não encontrada.' });

  db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

export default router;

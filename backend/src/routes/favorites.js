import { Router } from 'express';
import { db } from '../db/init.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const VALID_TYPES = ['verse', 'study', 'sermon'];

router.get('/', requireAuth, (req, res) => {
  const rows = db
    .prepare('SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id);
  res.json({ favorites: rows });
});

router.post('/', requireAuth, (req, res) => {
  const { content_id, type } = req.body;

  if (!content_id || !VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: `type deve ser um de: ${VALID_TYPES.join(', ')}` });
  }

  const info = db
    .prepare('INSERT INTO favorites (user_id, content_id, type) VALUES (?, ?, ?)')
    .run(req.user.id, content_id, type);

  const favorite = db.prepare('SELECT * FROM favorites WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ favorite });
});

router.delete('/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM favorites WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.status(204).send();
});

export default router;

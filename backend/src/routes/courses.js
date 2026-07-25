import { Router } from 'express';
import { db } from '../db/init.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { hashContent } from '../utils/contentHash.js';

const router = Router();

function parseCourse(row) {
  return { ...row, modules: JSON.parse(row.modules || '[]') };
}

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM courses ORDER BY created_at DESC').all();
  res.json({ courses: rows.map(parseCourse) });
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Curso não encontrado.' });
  res.json({ course: parseCourse(row) });
});

router.post('/', requireAuth, requireRole('admin', 'moderator'), (req, res) => {
  const { title, description, modules } = req.body;
  if (!title) return res.status(400).json({ error: 'O título do curso é obrigatório.' });

  const modulesJson = JSON.stringify(modules || []);
  const contentHash = hashContent({ title, description, modules });

  const info = db
    .prepare('INSERT INTO courses (title, description, modules, content_hash) VALUES (?, ?, ?, ?)')
    .run(title, description || '', modulesJson, contentHash);

  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ course: parseCourse(course) });
});

// Atualiza conteúdo do curso somente se o conteúdo realmente mudou (versionamento por hash),
// preservando o registro de progresso e notas já associados ao curso.
router.put('/:id', requireAuth, requireRole('admin', 'moderator'), (req, res) => {
  const existing = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Curso não encontrado.' });

  const { title, description, modules } = req.body;
  const newHash = hashContent({ title, description, modules });

  if (newHash === existing.content_hash) {
    return res.json({ course: parseCourse(existing), updated: false, message: 'Nenhuma alteração de conteúdo detectada.' });
  }

  db.prepare('UPDATE courses SET title = ?, description = ?, modules = ?, content_hash = ? WHERE id = ?')
    .run(title ?? existing.title, description ?? existing.description, JSON.stringify(modules ?? JSON.parse(existing.modules)), newHash, req.params.id);

  const updated = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
  res.json({ course: parseCourse(updated), updated: true });
});

router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  db.prepare('DELETE FROM courses WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

export default router;

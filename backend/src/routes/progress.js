import { Router } from 'express';
import { db } from '../db/init.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, (req, res) => {
  const rows = db
    .prepare(
      `SELECT p.course_id, p.completed, p.completed_at, c.title
       FROM progress p
       JOIN courses c ON c.id = p.course_id
       WHERE p.user_id = ?`
    )
    .all(req.user.id);

  res.json({ progress: rows });
});

router.post('/:courseId', requireAuth, (req, res) => {
  const { completed = true } = req.body;
  const courseId = req.params.courseId;

  const course = db.prepare('SELECT id FROM courses WHERE id = ?').get(courseId);
  if (!course) return res.status(404).json({ error: 'Curso não encontrado.' });

  db.prepare(
    `INSERT INTO progress (user_id, course_id, completed, completed_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id, course_id)
     DO UPDATE SET completed = excluded.completed, completed_at = excluded.completed_at`
  ).run(req.user.id, courseId, completed ? 1 : 0, completed ? new Date().toISOString() : null);

  res.json({ ok: true });
});

export default router;

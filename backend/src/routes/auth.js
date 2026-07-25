import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/init.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) {
    return res.status(409).json({ error: 'Este nome de usuário já está em uso.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const info = db
    .prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)')
    .run(username, passwordHash);

  const user = db.prepare('SELECT id, username, role, dark_mode FROM users WHERE id = ?').get(info.lastInsertRowid);
  const token = signToken(user);

  res.status(201).json({ user, token });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
  }

  const token = signToken(user);
  const { password_hash, ...safeUser } = user;

  res.json({ user: safeUser, token });
});

router.get('/me', requireAuth, (req, res) => {
  const user = db
    .prepare('SELECT id, username, role, dark_mode, created_at FROM users WHERE id = ?')
    .get(req.user.id);

  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
  res.json({ user });
});

router.patch('/me/preferences', requireAuth, (req, res) => {
  const { dark_mode } = req.body;
  db.prepare('UPDATE users SET dark_mode = ? WHERE id = ?').run(dark_mode ? 1 : 0, req.user.id);
  res.json({ ok: true });
});

export default router;

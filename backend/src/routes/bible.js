import { Router } from 'express';
import { db } from '../db/init.js';

const router = Router();

router.get('/translations', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT translation FROM bible_verses').all();
  res.json({ translations: rows.map((r) => r.translation) });
});

// Busca por livro/capítulo/versículo e/ou palavra-chave.
router.get('/search', (req, res) => {
  const { book, chapter, translation, q } = req.query;

  let query = 'SELECT * FROM bible_verses WHERE 1 = 1';
  const params = [];

  if (translation) {
    query += ' AND translation = ?';
    params.push(translation);
  }
  if (book) {
    query += ' AND book LIKE ?';
    params.push(`%${book}%`);
  }
  if (chapter) {
    query += ' AND chapter = ?';
    params.push(Number(chapter));
  }
  if (q) {
    query += ' AND text LIKE ?';
    params.push(`%${q}%`);
  }

  query += ' ORDER BY book, chapter, verse LIMIT 100';

  const verses = db.prepare(query).all(...params);
  res.json({ verses });
});

// Compara o mesmo versículo entre traduções diferentes.
router.get('/compare', (req, res) => {
  const { book, chapter, verse } = req.query;
  if (!book || !chapter || !verse) {
    return res.status(400).json({ error: 'book, chapter e verse são obrigatórios.' });
  }

  const rows = db
    .prepare('SELECT translation, text FROM bible_verses WHERE book = ? AND chapter = ? AND verse = ?')
    .all(book, Number(chapter), Number(verse));

  res.json({ comparisons: rows });
});

export default router;

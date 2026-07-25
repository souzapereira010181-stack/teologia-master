import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbPath = process.env.DATABASE_PATH || './data/teologia.db';
const resolvedDbPath = path.isAbsolute(dbPath)
  ? dbPath
  : path.resolve(process.cwd(), dbPath);

fs.mkdirSync(path.dirname(resolvedDbPath), { recursive: true });

const isNewDatabase = !fs.existsSync(resolvedDbPath);

export const db = new Database(resolvedDbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
const seedPath = path.resolve(__dirname, '../../../database/seed.sql');

function applySchema() {
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
}

function applySeedIfEmpty() {
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM courses').get();
  if (count === 0 && fs.existsSync(seedPath)) {
    const seed = fs.readFileSync(seedPath, 'utf-8');
    db.exec(seed);
    console.log('[db] Dados de exemplo inseridos (courses, bible_verses).');
  }
}

applySchema();
applySeedIfEmpty();

if (isNewDatabase) {
  console.log(`[db] Banco de dados criado em: ${resolvedDbPath}`);
}

// Permite rodar `npm run db:init` diretamente para (re)criar o banco.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log('[db] Banco inicializado com sucesso.');
  process.exit(0);
}

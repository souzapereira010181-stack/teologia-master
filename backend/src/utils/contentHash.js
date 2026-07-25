import crypto from 'node:crypto';

/**
 * Gera um hash SHA-256 estável para um conteúdo (usado para versionar
 * atualizações de cursos sem sobrescrever dados de usuário à toa).
 */
export function hashContent(content) {
  const normalized = typeof content === 'string' ? content : JSON.stringify(content);
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

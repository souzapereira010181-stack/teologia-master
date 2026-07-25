import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { testConnection, chat } from '../services/ollamaClient.js';

const router = Router();

const SYSTEM_PROMPT = `Você é um assistente de estudos bíblicos e teológicos. Responda de forma
clara, respeitosa e didática, indicando quando um tema é debatido entre diferentes tradições
cristãs em vez de apresentar uma única posição como consenso.`;

// Permite ao frontend verificar, a qualquer momento, se o Ollama está
// acessível e qual modelo foi detectado automaticamente.
router.get('/status', requireAuth, async (req, res) => {
  try {
    const status = await testConnection();
    res.json(status);
  } catch (err) {
    res.status(503).json({ connected: false, error: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const { query } = req.body;
  if (!query || !query.trim()) {
    return res.status(400).json({ error: 'A pergunta (query) é obrigatória.' });
  }

  // Testa a conexão com o Ollama (e detecta o modelo instalado) antes de
  // tentar gerar qualquer resposta.
  try {
    await testConnection();
  } catch (err) {
    return res.status(503).json({ error: err.message });
  }

  try {
    const { answer, model } = await chat([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: query },
    ]);

    res.json({ answer, model, configured: true });
  } catch (err) {
    console.error('[ai] Erro ao consultar o Ollama:', err.message);
    res.status(502).json({ error: err.message });
  }
});

export default router;

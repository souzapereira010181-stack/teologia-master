// Cliente para o Ollama local (http://localhost:11434).
// Responsável por: testar a conexão, detectar automaticamente o primeiro
// modelo instalado e enviar mensagens de chat. Nenhuma chave de API é usada.

const BASE_URL = (process.env.OLLAMA_URL || 'http://localhost:11434').replace(/\/+$/, '');
const TAGS_ENDPOINT = `${BASE_URL}/api/tags`;
const CHAT_ENDPOINT = `${BASE_URL}/api/chat`;

// Cache curto do modelo detectado, para não bater em /api/tags a cada pergunta.
let cachedModel = null;
let cachedAt = 0;
const CACHE_TTL_MS = 30_000;

/**
 * Testa se o Ollama está acessível e retorna a lista de modelos instalados.
 * Lança erro descritivo caso o serviço não esteja rodando.
 */
async function listInstalledModels() {
  let response;
  try {
    response = await fetch(TAGS_ENDPOINT, { method: 'GET' });
  } catch (err) {
    throw new Error(
      `Não foi possível conectar ao Ollama em ${BASE_URL}. Verifique se o serviço está em execução (comando: ollama serve).`
    );
  }

  if (!response.ok) {
    throw new Error(`Ollama respondeu com status ${response.status} ao listar modelos.`);
  }

  const data = await response.json();
  return Array.isArray(data.models) ? data.models : [];
}

/**
 * Detecta automaticamente o primeiro modelo instalado no Ollama.
 * Se OLLAMA_MODEL estiver definido no ambiente, ele tem prioridade
 * (desde que esteja de fato instalado); caso contrário, usa o primeiro
 * modelo retornado por /api/tags.
 */
export async function detectModel({ forceRefresh = false } = {}) {
  const now = Date.now();
  if (!forceRefresh && cachedModel && now - cachedAt < CACHE_TTL_MS) {
    return cachedModel;
  }

  const models = await listInstalledModels();
  if (models.length === 0) {
    throw new Error(
      'Nenhum modelo instalado foi encontrado no Ollama. Instale um modelo com: ollama pull <nome-do-modelo>.'
    );
  }

  const preferred = process.env.OLLAMA_MODEL;
  const match = preferred && models.find((m) => m.name === preferred);
  const chosen = (match || models[0]).name;

  cachedModel = chosen;
  cachedAt = now;
  return chosen;
}

/**
 * Testa a conexão com o Ollama e retorna o modelo que será usado.
 * Deve ser chamado antes de qualquer resposta de IA.
 */
export async function testConnection() {
  const model = await detectModel();
  return { connected: true, model, baseUrl: BASE_URL };
}

/**
 * Envia uma conversa de chat para o Ollama e retorna o texto da resposta.
 */
export async function chat(messages) {
  const model = await detectModel();

  const response = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, stream: false, messages }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Ollama respondeu com erro (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const answer = data?.message?.content?.trim();
  if (!answer) throw new Error('O Ollama respondeu, mas sem conteúdo de texto utilizável.');

  return { answer, model };
}

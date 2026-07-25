import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const IAAssistant = () => {
  const { token } = useAuth();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState({ checking: true, connected: false, model: null, error: null });

  const checkStatus = async () => {
    setStatus((s) => ({ ...s, checking: true }));
    try {
      const data = await api.get('/ai/status', token);
      setStatus({ checking: false, connected: true, model: data.model, error: null });
    } catch (err) {
      setStatus({ checking: false, connected: false, model: null, error: err.message });
    }
  };

  useEffect(() => {
    checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAsk = async () => {
    if (!query.trim() || !status.connected) return;
    setLoading(true);
    setError('');
    setResponse('');
    try {
      const data = await api.post('/ai', { query }, token);
      setResponse(data.answer);
      setStatus((s) => ({ ...s, model: data.model }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-parchment">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">Assistente de Estudos Bíblicos</h2>
          <button
            onClick={checkStatus}
            className="font-body text-xs text-study-500 hover:underline"
          >
            Testar conexão
          </button>
        </div>

        <div
          className={`surface mb-4 flex items-center gap-2 rounded-lg p-3 font-body text-sm ${
            status.checking
              ? 'text-ink/50'
              : status.connected
              ? 'text-study-600'
              : 'text-red-600'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              status.checking ? 'bg-ink/30' : status.connected ? 'bg-study-500' : 'bg-red-500'
            }`}
          />
          {status.checking && 'Testando conexão com o Ollama...'}
          {!status.checking && status.connected && `Conectado ao Ollama — modelo: ${status.model}`}
          {!status.checking && !status.connected && (
            <span>
              Ollama não conectado. Rode <code className="rounded bg-ink/5 px-1">ollama serve</code> e
              tenha ao menos um modelo instalado.
            </span>
          )}
        </div>

        <div className="surface mb-4 flex gap-2 rounded-lg p-4">
          <input
            type="text"
            placeholder="Faça sua pergunta..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            disabled={!status.connected}
            className="flex-1 rounded border border-study-100 p-2 font-body text-sm disabled:opacity-50"
          />
          <button
            onClick={handleAsk}
            disabled={loading || !status.connected}
            className="rounded bg-study-600 px-4 py-2 font-body text-sm text-white hover:bg-study-700 disabled:opacity-60"
          >
            {loading ? 'Pensando...' : 'Perguntar'}
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {response && (
          <div className="surface rounded-lg p-4 font-body text-sm leading-relaxed text-ink whitespace-pre-wrap">
            {response}
          </div>
        )}
      </main>
    </div>
  );
};

export default IAAssistant;

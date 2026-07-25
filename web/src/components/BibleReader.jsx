import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { api } from '../services/api';

const BibleReader = () => {
  const [translations, setTranslations] = useState([]);
  const [selectedTranslation, setSelectedTranslation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/bible/translations')
      .then(({ translations }) => {
        setTranslations(translations);
        setSelectedTranslation(translations[0] || '');
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (selectedTranslation) params.set('translation', selectedTranslation);
      if (searchTerm) params.set('q', searchTerm);
      const { verses } = await api.get(`/bible/search?${params.toString()}`);
      setVerses(verses);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTranslation) handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTranslation]);

  return (
    <div className="flex min-h-screen bg-parchment">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="mb-4 font-display text-2xl text-ink">Leitura da Bíblia</h2>

        <form onSubmit={handleSearch} className="surface mb-4 flex gap-2 rounded-lg p-4">
          <select
            value={selectedTranslation}
            onChange={(e) => setSelectedTranslation(e.target.value)}
            className="rounded border border-study-100 p-2 font-body text-sm"
          >
            {translations.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Buscar palavra-chave, livro ou versículo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 rounded border border-study-100 p-2 font-body text-sm"
          />
          <button
            type="submit"
            className="rounded bg-study-600 px-4 py-2 font-body text-sm text-white hover:bg-study-700"
          >
            Buscar
          </button>
        </form>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {loading && <p className="font-body text-sm text-ink/60">Buscando...</p>}

        <div className="space-y-2">
          {verses.map((verse) => (
            <div key={verse.id} className="surface rounded p-3">
              <p className="font-body text-xs uppercase tracking-wide text-study-500">
                {verse.book} {verse.chapter}:{verse.verse}
              </p>
              <p className="font-display text-ink">{verse.text}</p>
            </div>
          ))}
          {!loading && verses.length === 0 && (
            <p className="font-body text-sm text-ink/50">Nenhum versículo encontrado.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default BibleReader;

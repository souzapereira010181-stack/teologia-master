import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/auth';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const action = mode === 'login' ? login : register;
      const { user, token } = await action(username, password);
      signIn(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment px-4">
      <div className="w-full max-w-md surface rounded-lg p-8 shadow-sm">
        <p className="mb-1 font-body text-xs uppercase tracking-[0.2em] text-study-500">
          Teologia Master
        </p>
        <h2 className="mb-6 font-display text-3xl text-ink">
          {mode === 'login' ? 'Entrar' : 'Criar conta'}
        </h2>

        {error && (
          <p className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="font-body">
          <div className="mb-4">
            <label className="mb-2 block text-sm text-ink/70">Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded border border-study-100 px-3 py-2 outline-none focus:border-study-500"
              required
              autoComplete="username"
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm text-ink/70">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-study-100 px-3 py-2 outline-none focus:border-study-500"
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-study-600 py-2 text-white transition hover:bg-study-700 disabled:opacity-60"
          >
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError('');
          }}
          className="mt-4 w-full text-center text-sm text-study-500 hover:underline"
        >
          {mode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
        </button>
      </div>
    </div>
  );
};

export default Login;

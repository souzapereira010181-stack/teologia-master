import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Painel' },
  { to: '/biblia', label: 'Bíblia' },
  { to: '/assistente', label: 'Assistente de IA' },
  { to: '/progresso', label: 'Progresso' },
];

const Sidebar = () => {
  const { user, signOut } = useAuth();

  return (
    <aside className="surface flex w-64 flex-col justify-between">
      <div>
        <div className="p-6">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-study-500">Bem-vindo</p>
          <h1 className="font-display text-xl text-ink">{user?.username}</h1>
        </div>
        <nav className="mt-2 px-3">
          <ul className="space-y-1 font-body">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `block rounded px-3 py-2 text-sm transition ${
                      isActive
                        ? 'bg-study-500 text-white'
                        : 'text-ink/80 hover:bg-study-50 dark:hover:bg-white/5'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="p-4">
        <button
          onClick={signOut}
          className="w-full rounded border border-study-100 py-2 text-sm text-ink/70 hover:bg-study-50 dark:hover:bg-white/5"
        >
          Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

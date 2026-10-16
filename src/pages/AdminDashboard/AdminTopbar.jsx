import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminTopbar({ onMenu, menuOpen }) {
  const navigate = useNavigate();
  const user = useAuth();

  const logout = async () => {
    try {
      await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const btn =
    'inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-navy-900 hover:bg-slate-100 dark:border-white/20 dark:bg-navy-900 dark:text-white dark:hover:bg-white/10';

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-navy-900 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="admin-sidebar"
          className="rounded p-1.5 text-navy-900 hover:bg-slate-100 dark:text-white dark:hover:bg-white/10 lg:hidden"
        >
          <Menu size={22} />
        </button>
        <span className="font-semibold text-navy-900 dark:text-white">
          {user?.name ? `Welcome, ${user.name}` : 'Admin panel'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Link to="/" className={`${btn} max-sm:hidden`}>
          <ExternalLink size={16} aria-hidden="true" />
          View website
        </Link>
        <button type="button" onClick={logout} className={btn}>
          <LogOut size={16} aria-hidden="true" />
          Log out
        </button>
      </div>
    </header>
  );
}
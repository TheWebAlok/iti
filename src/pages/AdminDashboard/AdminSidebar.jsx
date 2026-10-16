import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { ADMIN_NAV } from './adminNav';

export default function AdminSidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-navy-950/60 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        id="admin-sidebar"
        aria-label="Admin menu"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy-900 text-white transition-[transform,visibility] duration-200 motion-reduce:transition-none lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full max-lg:invisible'
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
          <span className="font-bold">ITI Admin</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded p-1 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {ADMIN_NAV.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                      isActive ? 'bg-royal-600 text-white' : 'text-white/75 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <p className="border-t border-white/10 p-4 text-xs text-white/50">Admin panel</p>
      </aside>
    </>
  );
}
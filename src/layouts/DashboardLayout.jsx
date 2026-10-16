import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BookOpenCheck, CalendarCheck, FileText, IndianRupee, LayoutDashboard,
  LogOut, Megaphone, Menu, User, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Sidebar links per role. Add other roles here as their pages get built.
const NAV = {
  student: [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/student/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/student/fees', label: 'Fees', icon: IndianRupee },
    { to: '/student/results', label: 'Results', icon: BookOpenCheck },
    { to: '/student/documents', label: 'Documents', icon: FileText },
    { to: '/student/notices', label: 'Notices', icon: Megaphone },
    { to: '/student/profile', label: 'My profile', icon: User },
  ],
};

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
    isActive ? 'bg-amber-500 text-navy-900' : 'text-slate-300 hover:bg-white/10 hover:text-white'
  }`;

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const role = user?.role;
  const links = NAV[role] || [{ to: `/${role}/dashboard`, label: 'Dashboard', icon: LayoutDashboard, end: true }];

  const onLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-navy-900 px-4 py-3 text-white lg:hidden">
        <span className="font-bold">College Portal</span>
        <button onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </header>

      {/* Backdrop (mobile) */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-navy-900 text-white transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <span className="text-lg font-extrabold">College Portal</span>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass} onClick={() => setOpen(false)}>
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <p className="truncate text-sm font-semibold">{user?.name}</p>
          <p className="truncate text-xs text-slate-400">{user?.email}</p>
          <button
            onClick={onLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
          >
            <LogOut size={16} aria-hidden="true" /> Log out
          </button>
        </div>
      </aside>

      {/* Page content */}
      <main className="lg:pl-64">
        <Outlet />
      </main>
    </div>
  );
}
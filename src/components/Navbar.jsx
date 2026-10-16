import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext'; // path apne folder ke hisaab se adjust karein

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/trades', label: 'Trades' },
  { to: '/enquiry', label: 'Enquiry' },
  { to: '/services', label: 'Services' },
  { to: '/placement', label: 'Placement' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/notices', label: 'Notices' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  // role ke hisaab se: /student/dashboard, /admin/dashboard, /teacher/dashboard ...
  const dashboardPath = user ? `/${String(user.role).toLowerCase()}/dashboard` : '/login';

  const onLogout = async () => {
    setOpen(false);
    await logout();
    navigate('/', { replace: true });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const solid = scrolled || open;
  const linkBase = 'rounded-lg px-3 py-2 text-sm font-semibold transition-colors';
  const outlineBtn = `rounded-xl border px-4 py-2.5 text-sm font-semibold ${
    solid ? 'border-slate-300 dark:border-white/20' : 'border-white/30'
  }`;

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? 'border-b border-slate-200 bg-white/90 text-navy-900 backdrop-blur dark:border-white/10 dark:bg-navy-950/90 dark:text-white' : 'text-white'
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between">
        <Logo light={!solid} />

        <nav aria-label="Primary" className="hidden items-center gap-0.5 xl:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) => `${linkBase} ${isActive ? 'bg-amber-500/15 text-amber-500' : solid ? 'hover:bg-slate-500/10' : 'hover:bg-white/10'}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {!loading && (user ? (
            <>
              <Link to={dashboardPath} className={`hidden items-center gap-2 sm:inline-flex ${outlineBtn}`}>
                <LayoutDashboard size={16} aria-hidden="true" /> Dashboard
              </Link>
              <button type="button" onClick={onLogout} className={`hidden items-center gap-2 sm:inline-flex ${outlineBtn}`}>
                <LogOut size={16} aria-hidden="true" /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className={`hidden sm:inline-flex ${outlineBtn}`}>Login</Link>
          ))}

          <Link to="/admissions" className="btn-accent hidden !py-2.5 sm:inline-flex">Apply Now</Link>
          <button type="button" className="rounded-xl p-2.5 hover:bg-slate-500/15 xl:hidden" aria-expanded={open} aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav id="mobile-menu" aria-label="Mobile" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }} className="overflow-hidden xl:hidden">
            <div className="container-x flex flex-col gap-1 pb-5 pt-1">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} className={({ isActive }) => `${linkBase} !text-base ${isActive ? 'bg-amber-500/15 text-amber-500' : 'hover:bg-slate-500/10'}`}>
                  {l.label}
                </NavLink>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-3">
                {!loading && (user ? (
                  <>
                    <Link to={dashboardPath} className="btn-outline">Dashboard</Link>
                    <button type="button" onClick={onLogout} className="btn-outline">Logout</button>
                  </>
                ) : (
                  <Link to="/login" className="btn-outline">Login</Link>
                ))}
                <Link to="/admissions" className={`btn-accent ${user ? 'col-span-2' : ''}`}>Apply Now</Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
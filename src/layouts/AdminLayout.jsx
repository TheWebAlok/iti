import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../pages/AdminDashboard/AdminSidebar';
import AdminTopbar from '../pages/AdminDashboard/AdminTopbar';
import LoadingSkeleton from '../components/LoadingSkeleton';

// Layout for all /admin/* pages: sidebar + top bar. No public navbar or footer.
export default function AdminLayout() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950">
      <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-64">
        <AdminTopbar onMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />
        <main id="main" className="p-4 sm:p-6">
          <Suspense fallback={<LoadingSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
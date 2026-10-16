import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function PublicLayout() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only z-[60] rounded-lg bg-amber-500 px-4 py-2 font-semibold text-navy-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to main content
      </a>
      <Navbar />
      <motion.main
        id="main"
        key={pathname}
        className="flex-1"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.18 }}
      >
        <Suspense fallback={<LoadingSkeleton />}>
          <Outlet />
        </Suspense>
      </motion.main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
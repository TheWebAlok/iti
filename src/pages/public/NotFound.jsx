import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" />
      <section className="blueprint flex min-h-[70vh] items-center bg-navy-900 pt-24 text-white">
        <div className="container-x">
          <p className="text-7xl font-extrabold text-amber-400">404</p>
          <h1 className="mt-3 text-3xl font-extrabold !text-white sm:text-4xl">This page is not on the drawing</h1>
          <p className="mt-3 max-w-md text-slate-300">The link may be old or mistyped. Go back home or browse the trades.</p>
          <div className="mt-6 flex gap-3"><Link to="/" className="btn-accent">Go to home</Link><Link to="/trades" className="btn-light">Browse trades</Link></div>
        </div>
      </section>
    </>
  );
}

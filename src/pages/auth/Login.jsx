import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import Seo from '../../components/Seo';
import { useAuth } from '../../context/AuthContext';
const ROLES = ['student', 'teacher', 'accountant', 'placement', 'admin'];
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const initial = ROLES.includes(params.get('role')) ? params.get('role') : 'student';
  const [role, setRole] = useState(initial);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  try {
    const user = await login(form.email, form.password, role);
    navigate(`/${String(user.role).toLowerCase()}/dashboard`, { replace: true });
  } catch (err) {
    setError(err instanceof TypeError ? 'Cannot reach the server. Is the API running?' : err.message);
  } finally {
    setLoading(false);
  }
};

  const input =
    'mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white outline-none focus:border-amber-400';

  return (
    <>
      <Seo title="Login" />
      <section className="blueprint flex min-h-[80vh] items-center bg-navy-900 pt-24 text-white">
        <div className="container-x max-w-lg">
          <form onSubmit={onSubmit} className="rounded-2xl border border-white/15 bg-white/5 p-8">
            <LockKeyhole className="text-amber-400" size={32} aria-hidden="true" />
            <h1 className="mt-4 text-2xl font-extrabold !text-white">Portal login</h1>

            <label className="mt-6 block text-sm">
              Login as
              <select value={role} onChange={(e) => setRole(e.target.value)} className={input}>
                {ROLES.map((r) => (
                  <option key={r} value={r} className="text-black">
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-4 block text-sm">
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="username"
                value={form.email}
                onChange={onChange}
                className={input}
              />
            </label>
            <label className="mt-4 block text-sm">
              Password
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={onChange}
                className={input}
              />
            </label>

            {error && (
              <p role="alert" className="mt-4 text-sm text-red-300">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-accent mt-6 w-full disabled:opacity-60">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
            <Link to="/" className="mt-4 block text-center text-sm text-slate-300 hover:text-white">
              Back to home
            </Link>
          </form>
        </div>
      </section>
    </>
  );
}
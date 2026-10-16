import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenCheck, CalendarCheck, FileText, IndianRupee, Megaphone, User } from 'lucide-react';
import Seo from '../../components/Seo';
import { api, useAuth } from '../../context/AuthContext';

const SECTIONS = [
  { to: '/student/attendance', icon: CalendarCheck, title: 'Attendance', text: 'Subject-wise attendance will appear here.' },
  { to: '/student/fees', icon: IndianRupee, title: 'Fees', text: 'Fee status, dues and receipts will appear here.' },
  { to: '/student/results', icon: BookOpenCheck, title: 'Results', text: 'Semester marks and grades will appear here.' },
  { to: '/student/documents', icon: FileText, title: 'Documents', text: 'Certificates and downloads will appear here.' },
  { to: '/student/notices', icon: Megaphone, title: 'Notices', text: 'Latest notices from the college will appear here.' },
  { to: '/student/profile', icon: User, title: 'My profile', text: 'Your personal and course details will appear here.' },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api('/student/dashboard')
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.message || 'Could not load dashboard');
        setMessage(d.message);
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <Seo title="Student dashboard" />
      <section className="blueprint bg-navy-900 pb-10 pt-10 text-white">
        <div className="container-x">
          <p className="text-sm text-amber-400">Student portal</p>
          <h1 className="mt-1 text-3xl font-extrabold !text-white">Hello, {user?.name}</h1>
          <p className="mt-2 text-sm text-slate-300">{user?.email}</p>
        </div>
      </section>

      <section className="container-x py-10">
        {error && <p role="alert" className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {message && <p className="mb-6 text-sm text-slate-600">Server says: {message}</p>}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {SECTIONS.map(({ to, icon: Icon, title, text }) => (
            <Link key={title} to={to} className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-amber-400 hover:shadow-sm">
              <Icon className="text-amber-500" size={26} aria-hidden="true" />
              <h2 className="mt-3 text-lg font-bold">{title}</h2>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <p className="p-8 text-slate-600 dark:text-white/70" role="status">
        Checking your session…
      </p>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  const role = String(user.role || '').toLowerCase();
  if (roles && !roles.includes(role)) {
    // Logged in, but this page is for another role: send them to their own dashboard.
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return children;
}
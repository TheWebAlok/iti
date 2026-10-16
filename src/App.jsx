import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Trades from './pages/public/Trades';
import TradeDetail from './pages/public/TradeDetail';
import Admissions from './pages/public/Admissions';
import Enquiry from './pages/public/Enquiry';
import Services from './pages/public/Services';
import Placement from './pages/public/Placement';
import Gallery from './pages/public/Gallery';
import Notices from './pages/public/Notices';
import Contact from './pages/public/Contact';
import Legal from './pages/public/Legal';
import NotFound from './pages/public/NotFound';
import Login from './pages/auth/Login';

import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AdminAdmission from './pages/admin/AdminAdmission';
import AdminEnquiries from './pages/admin/Enquiries';
import AdminNotices from './pages/admin/Notices';
import AdminGallery from './pages/admin/Gallery';
import AdminPlacements from './pages/admin/Placements';

import StudentDashboard from './pages/StudentDashboard/StudentDashboard';
import StudentProfile from './pages/StudentDashboard/StudentProfile';
import StudentNotices from './pages/StudentDashboard/StudentNotices';
import ComingSoon from './pages/ComingSoon';

// Roles that can log in but do not have a real dashboard yet.
const OTHER_ROLES = ['teacher', 'accountant', 'placement'];

export default function App() {
  return (
    <Routes>
      {/* Public site: navbar + footer */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="trades" element={<Trades />} />
        <Route path="trades/:slug" element={<TradeDetail />} />
        <Route path="admissions" element={<Admissions />} />
        <Route path="Enquiry" element={<Enquiry />} />
        <Route path="services" element={<Services />} />
        <Route path="placement" element={<Placement />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="notices" element={<Notices />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy-policy" element={<Legal kind="privacy" />} />
        <Route path="terms-and-conditions" element={<Legal kind="terms" />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin: sidebar + top bar. One ProtectedRoute guards every /admin page. */}
      <Route
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="admin/admission" element={<AdminAdmission />} />
        <Route path="admin/enquiries" element={<AdminEnquiries />} />
        <Route path="admin/notices" element={<AdminNotices />} />
        <Route path="admin/gallery" element={<AdminGallery />} />
        <Route path="admin/placements" element={<AdminPlacements />} />
      </Route>

      {/* Other logged-in roles: sidebar layout, no public navbar or footer */}
      <Route element={<DashboardLayout />}>
        <Route
          path="student/dashboard"
          element={
            <ProtectedRoute roles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/profile"
          element={
            <ProtectedRoute roles={['student']}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/notices"
          element={
            <ProtectedRoute roles={['student']}>
              <StudentNotices />
            </ProtectedRoute>
          }
        />
        {['attendance', 'fees', 'results', 'documents'].map((p) => (
          <Route
            key={p}
            path={`student/${p}`}
            element={
              <ProtectedRoute roles={['student']}>
                <div className="p-6">
                  <ComingSoon title={p} backTo="/student/dashboard" />
                </div>
              </ProtectedRoute>
            }
          />
        ))}

        {OTHER_ROLES.map((r) => (
          <Route
            key={r}
            path={`${r}/dashboard`}
            element={
              <ProtectedRoute roles={[r]}>
                <div className="p-6">
                  <ComingSoon title={`${r} dashboard`} backTo="/" />
                </div>
              </ProtectedRoute>
            }
          />
        ))}
      </Route>
    </Routes>
  );
}
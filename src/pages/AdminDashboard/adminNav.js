import { Bell, BriefcaseBusiness, Images, Inbox, LayoutDashboard } from 'lucide-react';

// Sidebar menu. To add a page: add one line here and one route in App.jsx.
export const ADMIN_NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/admission', label: 'Admission', icon:  Inbox},
  { to: '/admin/enquiries', label: 'View enquiries', icon: Inbox },
  { to: '/admin/notices', label: 'Post a notice', icon: Bell },
  { to: '/admin/gallery', label: 'Upload photos', icon: Images },
  { to: '/admin/placements', label: 'Add placement', icon: BriefcaseBusiness },
];
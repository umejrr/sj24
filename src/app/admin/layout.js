import './admin.css';

export const metadata = {
  title: { default: 'CMS', template: '%s · CMS · SJ24' },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="cms-root">{children}</div>;
}

import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext.jsx';

const ICONS = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  ),
  requests: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
    </svg>
  ),
  content: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16M4 12h16M4 19h16" />
      <path d="m8 8 2-2-2-2M8 15l2-2-2-2M8 22l2-2-2-2" />
    </svg>
  ),
  history: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 8v4l3 2" />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.82-.33 1.7 1.7 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.51 1.7 1.7 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .33-1.82 1.7 1.7 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.51-1 1.7 1.7 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.82.33h.03a1.7 1.7 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.51 1.7 1.7 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.33 1.82v.03a1.7 1.7 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z" />
    </svg>
  ),
  service: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a4.5 4.5 0 0 0-6.4 6.4L3 18v3h3l5.3-5.3a4.5 4.5 0 0 0 6.4-6.4L14 12.7 11.3 10z" />
    </svg>
  ),
  subscriber: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v16H4z" />
      <path d="m4 6 8 6 8-6" />
    </svg>
  ),
};

const MENU = [
  { key: 'admin.nav.home', to: '/admin', icon: ICONS.home, end: true },
  { key: 'admin.nav.requests', to: '/admin/permintaan', icon: ICONS.requests },
  { key: 'admin.nav.content', to: '/admin/konten', icon: ICONS.content },
  { key: 'admin.nav.history', to: '/admin/riwayat', icon: ICONS.history },
  { key: 'admin.nav.settings', to: '/admin/pengaturan', icon: ICONS.settings },
];

const SECONDARY = [
  { key: 'services', to: '/admin/layanan', icon: ICONS.service, labelKey: 'admin.nav.manageServices' },
  { key: 'subscriber', to: '/admin/subscriber', icon: ICONS.subscriber, labelKey: 'admin.nav.subscribers' },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
      isActive ? 'bg-brand text-white shadow-md shadow-brand/30' : 'text-[#564336] hover:bg-brand-light hover:text-dark-brown'
    }`;

  return (
    <aside className="w-[280px] shrink-0 bg-[#FDFBF9] text-body border-r border-[#C1C7D1] flex flex-col min-h-screen">
      <div className="px-6 py-6 border-b border-[#EADFD7]">
        <span className="flex flex-col items-start select-none">
          <span className="flex items-end gap-2.5">
            <img src="/logo-primary.png" className="w-full max-w-[220px] h-auto object-contain" />
          </span>
        </span>
      </div>

      <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        {MENU.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
            <span className="shrink-0">{item.icon}</span>
            {t(item.key)}
          </NavLink>
        ))}

        <div className="pt-5 mt-2 border-t border-[#EADFD7] space-y-1">
          <p className="px-3 pb-2 font-mono text-[10px] font-bold tracking-widest text-muted uppercase">{t('admin.nav.more')}</p>
          {SECONDARY.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              <span className="shrink-0">{item.icon}</span>
              {t(item.labelKey)}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-[#EADFD7]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-extrabold shrink-0">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-dark-brown truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-muted truncate">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            aria-label={t('admin.nav.logout')}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:bg-brand-light hover:text-brand transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="m16 17 5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar.jsx';
import { LanguageSwitch } from '../PortalLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLayout() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q') || '';
    setSearchQ(q);
  }, [location.search]);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = searchQ.trim();
    navigate(q ? `/admin/permintaan?q=${encodeURIComponent(q)}` : '/admin/permintaan');
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex font-admin">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute left-0 top-0 h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <Sidebar />
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="absolute -right-10 top-4 text-white bg-brand rounded-full w-8 h-8"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 h-16 bg-white border-b border-[#EADFD7] flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 text-body rounded-lg hover:bg-brand-light"
              aria-label={t('admin.layout.openMenu')}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <form onSubmit={submitSearch} className="relative w-full max-w-md">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3-3" />
              </svg>
              <input
                type="text"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder={t('admin.layout.searchPlaceholder')}
                className="w-full pl-9 pr-9 py-2 rounded-lg bg-[#F5F6FA] text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
              {searchQ && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQ('');
                    navigate('/admin/permintaan');
                  }}
                  aria-label={t('admin.layout.clearSearch')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </form>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex">
              <LanguageSwitch />
            </span>
            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-muted hover:text-brand transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="hidden xl:inline">{t('admin.layout.viewSite')}</span>
            </Link>

            <Link
              to="/admin/permintaan?status=Menunggu+Ditinjau"
              aria-label={t('admin.layout.notifications')}
              className="relative w-10 h-10 flex items-center justify-center rounded-lg text-muted hover:bg-brand-light hover:text-brand transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a2 2 0 0 0 3.4 0" />
              </svg>
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => setHelpOpen((v) => !v)}
                aria-label={t('admin.layout.help')}
                aria-expanded={helpOpen}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-muted hover:bg-brand-light hover:text-brand transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9.5 9a2.5 2.5 0 1 1 3.8 2.1c-.8.5-1.3 1-1.3 1.9v1M12 17.5h.01" />
                </svg>
              </button>
              {helpOpen && (
                <>
                  <button
                    type="button"
                    aria-label={t('admin.layout.closeMenu')}
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setHelpOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-lg z-50 py-2">
                    <Link
                      to="/"
                      onClick={() => setHelpOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-body hover:bg-brand-light hover:text-dark-brown"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {t('admin.layout.viewSite')}
                    </Link>
                    <Link
                      to="/kontak"
                      onClick={() => setHelpOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-body hover:bg-brand-light hover:text-dark-brown"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m22 2-7 20-4-9-9-4z" />
                        <path d="M22 2 11 13" />
                      </svg>
                      {t('admin.layout.helpContact')}
                    </Link>
                  </div>
                </>
              )}
            </div>

            <span className="mx-2 h-6 w-px bg-[#EADFD7]" />

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white font-extrabold text-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-dark-brown leading-tight">{user?.name || 'Admin'}</p>
                <p className="text-xs text-muted">{user?.role === 'admin' ? 'Administrator' : user?.role || ''}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
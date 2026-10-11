import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Footer from './Footer.jsx';
import EmailLink from './EmailLink.jsx';

export const LOGO_SRC = '/LOGO%20REAL.png';

export function BrandLogo({ dark = false, compact = false, size = 36 }) {
  if (compact) {
    return (
      <Link to="/" aria-label="Digitak" className="block select-none">
        <img
          src={LOGO_SRC}
          alt="Digitak"
          width={size}
          height={size}
          className="object-contain"
          style={{ maxWidth: size, maxHeight: size }}
        />
      </Link>
    );
  }
  return (
    <Link to="/" className="block select-none">
      <img src={LOGO_SRC} className="w-40 sm:w-44 lg:w-48 h-auto object-contain" />
    </Link>
  );
}

export function LanguageSwitch() {
  const { i18n } = useTranslation();
  const active = 'bg-brand text-white';
  const idle = 'text-muted hover:text-brand';
  return (
    <div className="inline-flex items-center rounded-full border border-[#DDC1B0] bg-white p-0.5 text-xs font-bold">
      {['ID', 'EN'].map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={i18n.language === code.toLowerCase()}
          onClick={() => i18n.changeLanguage(code.toLowerCase())}
          className={`px-3 py-1 rounded-full transition-colors ${
            i18n.language === code.toLowerCase() ? active : idle
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

export default function PortalLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children ?? <Outlet />}</main>
      <Footer />
    </div>
  );
}

const NAV_KEYS = [
  { key: 'nav.home', to: '/', end: true },
  { key: 'nav.products', to: '/produk' },
  { key: 'nav.services', to: '/layanan' },
  { key: 'nav.portfolio', to: '/portofolio' },
  { key: 'nav.company', to: '/perusahaan' },
  { key: 'nav.contact', to: '/kontak' },
];

const SERVICE_LINK_KEYS = [
  { key: 'services.itConsulting', slug: 'it-consulting' },
  { key: 'services.softwareDevelopment', slug: 'software-development' },
  { key: 'services.erp', slug: 'erp-solution' },
  { key: 'services.systemIntegration', slug: 'system-integration' },
  { key: 'services.training', slug: 'training-maintenance' },
  { key: 'services.itInfrastructure', slug: 'it-infrastructure' },
];

function Navbar() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const servicesDropdownRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!desktopServicesOpen) return;
    const onPointerDown = (e) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(e.target)) {
        setDesktopServicesOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [desktopServicesOpen]);

  const linkClass = () => ({ isActive }) => {
    return `relative text-sm font-medium flex items-center transition-colors ${
      isActive ? 'text-dark-brown font-bold' : 'text-body hover:text-brand'
    }`;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#DDC1B0]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 h-[76px] flex items-center justify-between gap-8">
        <div className="flex items-center">
          <Link to="/" className="flex flex-col items-start select-none" aria-label={t('brand.alt')}>
            <img src={LOGO_SRC} alt="Digitak" className="w-40 sm:w-44 lg:w-48 h-auto object-contain" />
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_KEYS.map((item) =>
            item.key === 'nav.services' ? (
              <div
                key={item.to}
                ref={servicesDropdownRef}
                className="relative"
                onMouseEnter={() => setDesktopServicesOpen(true)}
              >
                <NavLink to="/layanan" className={linkClass(item.to)}>
                  {({ isActive }) => (
                    <>
                      {t('nav.services')}
                      <button
                        type="button"
                        aria-label="Toggle"
                        className={`ml-1 text-brand hover:text-brand-dark transition-transform ${desktopServicesOpen ? 'rotate-180' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setDesktopServicesOpen((v) => !v);
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                      {isActive && <span className="absolute -bottom-[28px] left-0 right-0 h-[3px] bg-brand" />}
                    </>
                  )}
                </NavLink>
                {desktopServicesOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-72 rounded-xl bg-white border border-[#EADFD7] shadow-xl p-2 text-left">
                  <p className="px-3 pt-2 pb-1 font-mono text-[10px] font-bold tracking-widest text-muted uppercase">
                    {t('nav.services')}
                  </p>
                  {[...SERVICE_LINK_KEYS]
                    .sort((a, b) => t(a.key).localeCompare(t(b.key), i18n.language))
                    .map((s) => (
                    <Link
                      key={s.slug}
                      to={`/layanan/${s.slug}`}
                      onClick={() => setDesktopServicesOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-body hover:bg-brand-light hover:text-brand"
                    >
                      {t(s.key)}
                    </Link>
                  ))}
                </div>
                )}
              </div>
            ) : (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass(item.to)}>
              {({ isActive }) => (
                <>
                  {t(item.key)}
                  {isActive && (
                    <span className="absolute -bottom-[28px] left-0 right-0 h-[3px] bg-brand" />
                  )}
                </>
              )}
            </NavLink>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex">
            <LanguageSwitch />
          </span>
          <Link
            to="/form-pengajuan"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white text-sm font-bold rounded-lg hover:bg-brand-dark transition-colors shadow-sm"
          >
            {t('nav.submitNow')}
          </Link>
          <button
            type="button"
            aria-label={t('nav.openMenu')}
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 text-dark-brown rounded-lg hover:bg-brand-light"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      <MobileDrawer
        open={open}
        onClose={() => setOpen(false)}
        servicesOpen={servicesOpen}
        onToggleServices={() => setServicesOpen((v) => !v)}
        onNavigate={() => setOpen(false)}
      />
    </header>
  );
}

function MobileDrawer({ open, onClose, servicesOpen, onToggleServices, onNavigate }) {
  const { t, i18n } = useTranslation();
  const close = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className={`lg:hidden fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      <div
        onClick={close}
        className={`absolute inset-0 bg-dark/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-[320px] max-w-[90vw] bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EADFD7]">
          <Link to="/" onClick={onClose} className="block select-none" aria-label={t('brand.alt')}>
            <img src={LOGO_SRC} className="w-40 h-auto object-contain" />
          </Link>
          <button
            type="button"
            aria-label={t('nav.closeMenu')}
            onClick={close}
            className="p-2 rounded-lg text-muted hover:bg-brand-light"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_KEYS.filter((n) => n.key !== 'nav.services').map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm ${
                  isActive ? 'bg-brand-light text-brand font-bold' : 'text-body hover:bg-brand-light'
                }`
              }
            >
              {t(item.key)} <span className="text-border">›</span>
            </NavLink>
          ))}

          <div>
            <button
              type="button"
              onClick={onToggleServices}
              className="flex w-full items-center justify-between px-3 py-2.5 rounded-lg text-sm text-body hover:bg-brand-light"
            >
              <span className="flex items-center gap-2">
                {t('nav.services')}
                {servicesOpen && <span className="w-1.5 h-1.5 rounded-full bg-brand" />}
              </span>
              <span className={`text-border transition-transform ${servicesOpen ? 'rotate-180' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </button>
            {servicesOpen && (
              <div className="ml-3 mt-1 space-y-1 rounded-xl border border-[#EADFD7] bg-cream p-2">
                {[...SERVICE_LINK_KEYS]
                  .sort((a, b) => t(a.key).localeCompare(t(b.key), i18n.language))
                  .map((s) => (
                  <Link
                    key={s.slug}
                    to={`/layanan/${s.slug}`}
                    onClick={onNavigate}
                    className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-white hover:text-brand"
                  >
                    {t(s.key)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="border-t border-[#EADFD7] px-5 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">{t('nav.language')}</span>
            <LanguageSwitch />
          </div>
          <Link
            to="/form-pengajuan"
            onClick={onNavigate}
            className="block w-full px-5 py-3 bg-brand text-white text-sm font-bold text-center rounded-lg hover:bg-brand-dark transition-colors"
          >
            {t('nav.submitNow')}
          </Link>
          <div className="rounded-xl bg-cream border border-[#EADFD7] p-3 text-xs text-muted">
            <p className="font-bold text-dark-brown"><EmailLink /></p>
            <p className="mt-1">{t('nav.address')}</p>
          </div>
          <p className="text-[10px] text-muted text-center">
            © {new Date().getFullYear()} {t('nav.companyName')}
          </p>
        </div>
      </aside>
    </div>
  );
}

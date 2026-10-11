import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import client, { getErrorMessage } from '../api/client.js';
import EmailLink from './EmailLink.jsx';

const SOCIALS = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/digitak-studio-54ba211a9',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.98 3.5A2.49 2.49 0 0 0 2.5 6a2.49 2.49 0 0 0 2.49 2.5A2.49 2.49 0 0 0 7.5 6a2.49 2.49 0 0 0-2.52-2.5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.15c0-1.23-.02-2.8-1.72-2.8-1.72 0-1.98 1.33-1.98 2.71V21H9z" />
      </svg>
    ),
  },
  {
    name: 'X',
    href: '#',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.24 2.25h3.31l-7.23 8.26L22.75 21.75h-6.66l-5.22-6.82-5.97 6.82H1.59l7.73-8.84L1.25 2.25h6.83l4.72 6.24zm-1.16 17.52h1.83L7.08 4.13H5.12z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: '#',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.58 7.19a2.5 2.5 0 0 0-1.77-1.78C18.25 5 12 5 12 5s-6.25 0-7.81.41A2.5 2.5 0 0 0 2.42 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.77 1.78C5.75 19 12 19 12 19s6.25 0 7.81-.41a2.5 2.5 0 0 0 1.77-1.78A26 26 0 0 0 22 12a26 26 0 0 0-.42-4.81zM10 15.2V8.8L15.5 12z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const { t, i18n } = useTranslation();

  const serviceLinks = [
    { key: 'softwareDevelopment', slug: 'software-development' },
    { key: 'itConsulting', slug: 'it-consulting' },
    { key: 'systemIntegration', slug: 'system-integration' },
    { key: 'erp', slug: 'erp-solution' },
    { key: 'itInfrastructure', slug: 'it-infrastructure' },
    { key: 'training', slug: 'training-maintenance' },
  ].sort((a, b) => t(`services.${a.key}`).localeCompare(t(`services.${b.key}`), i18n.language));

  const companyLinks = [
    { label: 'footer.aboutUs', to: '/perusahaan' },
    { label: 'footer.portfolio', to: '/portofolio' },
    { label: 'footer.products', to: '/produk' },
    { label: 'footer.contactUs', to: '/kontak' },
    { label: 'footer.trackRequest', to: '/cek-status' },
  ].sort((a, b) => t(a.label).localeCompare(t(b.label), i18n.language));

  return (
    <footer className="bg-footer text-footer-text">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="block select-none" aria-label={t('brand.alt')}>
            <img src="/logo-primary.png" className="w-full max-w-[260px] h-auto object-contain" />
          </Link>
          <p className="mt-5 text-sm text-[#a97f63] leading-relaxed">{t('footer.aboutText')}</p>
          <div className="mt-6 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="w-9 h-9 rounded-full border border-[#7a4a2d] flex items-center justify-center text-footer-text/80 hover:border-brand hover:bg-brand hover:text-white transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-white/90">{t('footer.servicesTitle')}</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {serviceLinks.map((s) => (
              <li key={s.key}>
                <Link
                  to={`/layanan/${s.slug}`}
                  className="text-footer-text/70 hover:text-brand transition-colors"
                >
                  {t(`services.${s.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-white/90">{t('footer.companyTitle')}</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {companyLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-footer-text/70 hover:text-brand transition-colors">
                  {t(l.label)}
                </Link>
              </li>
            ))}
          </ul>
          <h4 className="mt-8 text-sm font-bold uppercase tracking-widest text-white/90">{t('footer.contactTitle')}</h4>
          <ul className="mt-4 space-y-2 text-sm text-footer-text/70">
            <li className="leading-relaxed">{t('footer.address')}</li>
            <li>
              <EmailLink email={t('footer.email')} className="hover:text-brand transition-colors" />
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-white/90">{t('footer.stayTuned')}</h4>
          <p className="mt-4 text-sm text-footer-text/70">{t('footer.newsletterText')}</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-[#7a4a2d]/40">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-footer-text/60">
          <p>
            © {new Date().getFullYear()} {t('footer.copyright')}
          </p>
          <div className="flex gap-6">
            <Link to="/kebijakan-privasi" className="hover:text-brand transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link to="/syarat-ketentuan" className="hover:text-brand transition-colors">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function NewsletterForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage(null);
    setLoading(true);
    try {
      const { data } = await client.post('/newsletter/subscribe', { email });
      setMessage(data.message || t('footer.subscribeSuccess'));
      setEmail('');
    } catch (err) {
      setError(getErrorMessage(err, t('footer.subscribeError')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-5">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('footer.newsletterPlaceholder')}
          required
          className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-[#7a4a2d] text-sm text-white placeholder:text-footer-text/40 focus:outline-none focus:border-brand"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-brand text-white text-sm font-bold rounded-lg hover:bg-brand-dark disabled:opacity-60 transition-colors"
        >
          {loading ? '...' : t('footer.subscribe')}
        </button>
      </div>
      {message && <p className="mt-2 text-sm text-emerald-400">{message}</p>}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </form>
  );
}

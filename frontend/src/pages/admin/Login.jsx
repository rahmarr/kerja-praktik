import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext.jsx';
import { LanguageSwitch } from '../../components/PortalLayout.jsx';

export default function Login() {
  const { t } = useTranslation();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/admin', { replace: true });
  }, [isAuthenticated, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.ok) navigate('/admin', { replace: true });
    else setError(result.message);
  };

  const inputClass =
    'w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 font-admin focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand bg-white transition-colors';

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center px-4 py-10 font-admin">
      <div className="w-full max-w-[480px]">
        <div className="flex justify-end mb-4">
          <LanguageSwitch />
        </div>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="h-2 bg-gradient-to-r from-brand via-brand to-brand-dark" />
          <div className="px-8 lg:px-12 py-10">
            <div className="text-center">
              <span className="inline-flex flex-col items-center select-none">
                <img src="/logo-primary.png" alt="Digitak" className="h-16 lg:h-20 w-auto object-contain" />
              </span>
              <h1 className="mt-6 text-2xl font-extrabold text-slate-900">{t('admin.login.title')}</h1>
              <p className="mt-1 text-sm text-slate-500">{t('admin.login.subtitle')}</p>
            </div>

            <form onSubmit={submit} className="mt-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700">{t('admin.login.emailLabel')}</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('admin.login.emailPlaceholder')}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">{t('admin.login.passwordLabel')}</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="4" y="10" width="16" height="10" rx="2" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 hover:text-brand"
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 3l18 18M10.6 10.6a2.5 2.5 0 0 0 3.5 3.5M9.9 5.2A9.7 9.7 0 0 1 12 5c7 0 10 7 10 7a17 17 0 0 1-4.9 5.3M14.1 18.8A9.7 9.7 0 0 1 12 19c-7 0-10-7-10-7a17 17 0 0 1 4.9-5.3" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="mt-1 flex justify-end">
                  <button type="button" className="text-xs text-brand font-semibold hover:underline">
                    {t('admin.login.forgot')}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                />
                {t('admin.login.remember')}
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                className="w-full px-6 py-3 bg-brand text-white font-bold text-base rounded-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/30"
              >
                {t('admin.login.submit')}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-sm font-admin">
          <Link to="/" className="text-brand font-semibold hover:underline">
            {t('admin.login.back')}
          </Link>
        </p>
      </div>
    </div>
  );
}

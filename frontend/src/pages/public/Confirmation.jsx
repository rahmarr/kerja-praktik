import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Confirmation() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const requestCode = searchParams.get('code') || 'REQ-2026-000';
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(requestCode);
      setCopied(true);
      setToast(true);
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setToast(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-light via-cream to-cream min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-brand/10 blur-3xl" />

      <div className="relative max-w-xl w-full bg-white/80 backdrop-blur-xl rounded-2xl border border-[#EADFD7] shadow-2xl p-8 lg:p-12 text-center animate-fade-up">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <span className="mt-6 inline-block px-4 py-1 rounded font-mono text-xs font-bold tracking-widest text-emerald-700 bg-emerald-100">
          {t('confirm.badgeLabel')}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold text-dark-brown">{t('confirm.title')}</h1>
        <p className="mt-3 text-body leading-relaxed">{t('confirm.subtitle')}</p>

        <div className="mt-8 flex items-center justify-between gap-4 rounded-xl bg-brand-light border border-[#F5C9A1] p-5">
          <div className="text-left">
            <p className="font-mono text-[10px] font-bold tracking-widest text-muted uppercase">
              {t('confirm.requestId')}
            </p>
            <p className="mt-1 text-lg font-extrabold text-dark-brown tracking-wide">{requestCode}</p>
          </div>
          <button
            type="button"
            onClick={copy}
            className="px-4 py-2 whitespace-nowrap rounded-lg bg-white border border-[#EADFD7] text-sm font-bold hover:border-brand hover:text-brand transition-colors"
          >
            {copied ? t('confirm.copied') : t('confirm.copy')}
          </button>
        </div>

        <p className="mt-4 text-sm text-muted">{t('confirm.note')}</p>

        <div className="mt-8 space-y-3">
          <Link
            to={`/cek-status?code=${requestCode}`}
            className="block w-full px-6 py-3.5 bg-brand text-white font-extrabold rounded-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/30"
          >
            {t('confirm.cta')}
          </Link>
          <Link
            to="/"
            className="block w-full px-6 py-3.5 border-2 border-[#EADFD7] text-dark-brown font-bold rounded-lg hover:border-brand hover:text-brand transition-colors"
          >
            {t('confirm.back')}
          </Link>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-dark text-white text-sm font-bold px-5 py-3 shadow-xl animate-fade-up">
          <span className="text-emerald-400">✓</span> {t('confirm.toast')}
        </div>
      )}
    </section>
  );
}
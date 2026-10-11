import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const DIGITAK_EMAIL = 'info@digitak.id';

export default function EmailLink({ email = DIGITAK_EMAIL, className = '' }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  return (
    <span ref={rootRef} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 font-bold text-dark-brown hover:text-brand transition-colors"
      >
        {email}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <span className="absolute left-0 top-full mt-1 z-50 min-w-[190px] bg-white rounded-xl border border-[#EADFD7] shadow-xl overflow-hidden">
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-dark-brown hover:bg-brand-light transition-colors"
          >
            <span aria-hidden>✉️</span>
            {t('emailLink.gmail')}
          </a>
          <a
            href={`mailto:${email}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-dark-brown hover:bg-brand-light transition-colors"
          >
            <span aria-hidden>📧</span>
            {t('emailLink.app')}
          </a>
        </span>
      )}
    </span>
  );
}
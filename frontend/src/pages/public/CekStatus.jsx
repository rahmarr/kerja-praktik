import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import client, { getErrorMessage } from '../../api/client.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import RequestTimeline from '../../components/RequestTimeline.jsx';
import { CTADarkSection, VisitSection } from '../../components/CTAVisitSection.jsx';

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CekStatus() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [code, setCode] = useState(searchParams.get('code') || searchParams.get('id') || '');
  const [checked, setChecked] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initial = searchParams.get('code') || searchParams.get('id');
    if (initial) setChecked(initial);
  }, [searchParams]);

  const check = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    if (!code.trim()) {
      setError(t('cek.errorEmpty', { defaultValue: 'Silakan masukkan Request ID.' }));
      return;
    }
    setLoading(true);
    const target = code.trim();
    setChecked(target);
    setSearchParams({ code: target }, { replace: true });
    try {
      const { data } = await client.get(`/service-requests/${encodeURIComponent(target)}`);
      setResult(data.data);
    } catch (err) {
      setResult(null);
      setError(getErrorMessage(err, t('cek.errorNotFound', { defaultValue: 'Request ID tidak ditemukan.' })));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="max-w-4xl mx-auto px-6 lg:px-12 py-14">
      <nav className="flex items-center gap-2 text-sm text-muted">
        <Link to="/" className="hover:text-brand transition-colors">
          {t('cek.home')}
        </Link>
        <span>/</span>
        <span className="text-dark-brown font-bold">{t('cek.tracking')}</span>
      </nav>

      <div className="mt-8 rounded-2xl bg-gradient-to-b from-brand-light to-cream border border-[#EADFD7] p-8 lg:p-12 text-center">
        <span className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-[0.2em] uppercase text-brand">
          <span className="w-1.5 h-1.5 rounded-full bg-brand" />
          {t('cek.tracking')}
        </span>
        <h1 className="mt-4 text-4xl font-extrabold text-dark-brown">{t('cek.title')}</h1>
        <p className="mt-3 text-body">{t('cek.subtitle')}</p>

        <form onSubmit={check} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t('cek.placeholder')}
            className="flex-1 px-5 py-3 rounded-lg border border-[#EADFD7] bg-white text-sm text-dark-brown focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-60 shadow-lg shadow-brand/30 whitespace-nowrap"
          >
            {loading ? t('cek.checking') : t('cek.button')}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {checked && !result && !loading && !error && (
        <p className="mt-6 text-center font-mono text-sm text-muted">{checked}</p>
      )}

      {result ? (
        <div className="mt-10 bg-white rounded-2xl border border-[#EADFD7] shadow-xl p-6 lg:p-10 animate-fade-up">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EADFD7] pb-6">
            <div>
              <p className="font-mono text-[10px] font-bold tracking-widest text-muted uppercase">{t('cek.requestId')}</p>
              <p className="mt-1 text-xl font-extrabold text-dark-brown">{result.request_code}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] font-bold tracking-widest text-muted uppercase">{t('cek.currentStatus')}</p>
              <div className="mt-1">
                <StatusBadge status={result.status} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 py-6 text-sm">
            <div>
              <p className="font-mono text-[10px] font-bold tracking-widest text-muted uppercase">{t('cek.service')}</p>
              <p className="mt-1 font-bold text-dark-brown">{result.service.name}</p>
            </div>
            {result.created_at && (
              <div>
                <p className="font-mono text-[10px] font-bold tracking-widest text-muted uppercase">{t('cek.created')}</p>
                <p className="mt-1 font-bold text-dark-brown">{formatDate(result.created_at)}</p>
              </div>
            )}
          </div>

          <div className="border-t border-[#EADFD7] pt-8">
            <p className="text-sm font-extrabold text-dark-brown mb-6">{t('cek.progress')}</p>
            <RequestTimeline currentStatus={result.status} />
          </div>

          {result.admin_response && (
            <div className="mt-8 rounded-xl bg-brand-light border border-[#F5C9A1] p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white text-sm font-extrabold">
                  D
                </div>
                <div>
                  <p className="text-sm font-extrabold text-dark-brown">{t('cek.noteTitle')}</p>
                  <p className="font-mono text-[10px] font-bold tracking-widest text-muted uppercase">{t('cek.noteRole')}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-body leading-relaxed whitespace-pre-line">{result.admin_response}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-[#EADFD7] bg-white/60 p-10 text-center text-muted">
          {t('cek.emptyState')}
        </div>
      )}
      </section>

      <CTADarkSection />
      <VisitSection />
    </>
  );
}
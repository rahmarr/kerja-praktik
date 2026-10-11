import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import client, { getErrorMessage } from '../../api/client.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import { formatDateTime } from '../../api/format.js';

export const STATUSES = ['Menunggu Ditinjau', 'Sedang Diproses', 'Menunggu Informasi', 'Selesai'];

const STATUS_KEY = {
  'Menunggu Ditinjau': 'status.waiting',
  'Sedang Diproses': 'status.processing',
  'Menunggu Informasi': 'status.info',
  'Selesai': 'status.done',
};

export default function Permintaan() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQ = searchParams.get('q') || '';
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ page: 1, total: 0, totalPages: 1 });
  const [status, setStatus] = useState('');
  const [searchInput, setSearchInput] = useState(urlQ);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchList = useCallback(
    (page = 1, query = urlQ) => {
      setLoading(true);
      setError('');
      const params = { page, pageSize: 10 };
      if (status) params.status = status;
      if (query.trim()) params.q = query.trim();
      client
        .get('/admin/service-requests', { params })
        .then((res) => {
          setData(res.data.data);
          setMeta(res.data.meta);
        })
        .catch((err) => setError(getErrorMessage(err)))
        .finally(() => setLoading(false));
    },
    [status, urlQ]
  );

  useEffect(() => {
    setSearchInput(urlQ);
    fetchList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchList, urlQ]);

  const applySearch = (e) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (q) setSearchParams({ q });
    else setSearchParams({});
  };

  const goPage = (page) => {
    if (page < 1 || page > meta.totalPages) return;
    fetchList(page);
  };

  const thClass = 'px-6 py-3 font-semibold text-left whitespace-nowrap';

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-dark-brown">{t('admin.permintaan.title')}</h1>
      <p className="mt-1 text-sm text-muted">{t('admin.permintaan.subtitle')}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <form onSubmit={applySearch} className="flex gap-2">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('admin.permintaan.searchPlaceholder')}
            className="w-72 px-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 bg-white"
          />
          <button type="submit" className="px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark">
            {t('admin.permintaan.searchBtn')}
          </button>
        </form>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none bg-white"
        >
          <option value="">{t('admin.permintaan.allStatus')}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{t(STATUS_KEY[s])}</option>
          ))}
        </select>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-slate-100">
                <th className={thClass}>{t('admin.permintaan.colRequest')}</th>
                <th className={thClass}>{t('admin.permintaan.colName')}</th>
                <th className={thClass}>{t('admin.permintaan.colOrg')}</th>
                <th className={thClass}>{t('admin.permintaan.colService')}</th>
                <th className={thClass}>{t('admin.permintaan.colDate')}</th>
                <th className={thClass}>{t('admin.permintaan.colStatus')}</th>
                <th className={thClass}>{t('admin.permintaan.colAction')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-muted">{t('admin.permintaan.loading')}</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-muted">{t('admin.permintaan.empty')}</td>
                </tr>
              ) : (
                data.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-[#FDFBF9]">
                    <td className="px-6 py-3 font-semibold text-dark-brown">{r.request_code}</td>
                    <td className="px-6 py-3">{r.customer_name}</td>
                    <td className="px-6 py-3 text-muted">{r.organization_name || '-'}</td>
                    <td className="px-6 py-3">{r.service_name}</td>
                    <td className="px-6 py-3 text-muted">{formatDateTime(r.created_at)}</td>
                    <td className="px-6 py-3"><StatusBadge status={r.status} small /></td>
                    <td className="px-6 py-3">
                      <Link
                        to={`/admin/permintaan/${r.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-light text-brand text-sm font-bold hover:bg-brand hover:text-white transition-colors"
                      >
                        {t('admin.permintaan.colActionBtn')}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && meta.total > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-3 border-t border-slate-100 text-sm">
            <span className="text-muted">
              {t('admin.permintaan.total', { total: meta.total, page: meta.page, pages: meta.totalPages })}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goPage(meta.page - 1)}
                disabled={meta.page <= 1}
                className="px-3 py-1.5 rounded-lg border border-slate-300 disabled:opacity-40 hover:text-brand hover:border-brand transition-colors"
              >
                {t('admin.permintaan.prev')}
              </button>
              <button
                type="button"
                onClick={() => goPage(meta.page + 1)}
                disabled={meta.page >= meta.totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-300 disabled:opacity-40 hover:text-brand hover:border-brand transition-colors"
              >
                {t('admin.permintaan.next')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
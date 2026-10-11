import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import client, { getErrorMessage } from '../../api/client.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import { formatDateTime } from '../../api/format.js';

const FILTERS = ['today', 'week', 'month', 'all'];

export default function Riwayat() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const q = (searchParams.get('q') || '').toLowerCase();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    client
      .get('/admin/service-requests', { params: { page: 1, pageSize: 100 } })
      .then(async (res) => {
        const rows = res.data.data || [];
        const perRequest = await Promise.all(
          rows.map((r) =>
            client
              .get(`/admin/service-requests/${r.id}/history`)
              .then((h) => h.data.data || [])
              .catch(() => [])
          )
        );
        const rowsById = new Map(rows.map((r) => [r.id, r]));
        const flat = [];
        perRequest.forEach((hist, idx) => {
          hist.forEach((h) => {
            flat.push({ ...h, request: rowsById.get(rows[idx].id) });
          });
        });
        flat.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
        setEvents(flat);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    let list = events;
    if (filter !== 'all') {
      const now = Date.now();
      const ms = filter === 'today' ? 24 * 60 * 60 * 1000 : filter === 'week' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
      list = events.filter((e) => now - new Date(e.created_at).getTime() <= ms);
    }
    if (q) {
      list = list.filter((e) =>
        [
          e.request?.request_code,
          e.changed_by_name,
          e.old_status,
          e.new_status,
          e.admin_response,
        ].some((v) => v && v.toLowerCase().includes(q))
      );
    }
    return list;
  }, [events, filter, q]);

  const stats = useMemo(() => {
    const statusChanges = filtered.filter((e) => e.old_status && e.new_status && e.old_status !== e.new_status).length;
    const responses = filtered.filter((e) => e.admin_response && e.admin_response.trim()).length;
    return { total: filtered.length, statusChanges, responses };
  }, [filtered]);

  const chips = [
    { key: 'today', label: t('admin.riwayat.today') },
    { key: 'week', label: t('admin.riwayat.week') },
    { key: 'month', label: t('admin.riwayat.month') },
    { key: 'all', label: t('admin.riwayat.all') },
  ];

  const statCards = [
    { key: 'total', label: t('admin.riwayat.cardTotal'), value: stats.total, cls: 'bg-brand-light text-brand' },
    { key: 'status', label: t('admin.riwayat.cardStatus'), value: stats.statusChanges, cls: 'bg-amber-100 text-amber-700' },
    { key: 'responses', label: t('admin.riwayat.cardResponses'), value: stats.responses, cls: 'bg-emerald-100 text-emerald-700' },
  ];

  const thClass = 'px-6 py-3 font-semibold text-left whitespace-nowrap';

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-dark-brown">{t('admin.riwayat.title')}</h1>
      <p className="mt-1 text-sm text-muted">{t('admin.riwayat.subtitle')}</p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        {statCards.map((c) => (
          <div key={c.key} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-extrabold ${c.cls}`}>
              {loading ? '...' : c.value}
            </div>
            <p className="mt-3 text-sm text-muted">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {chips.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setFilter(c.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              filter === c.key
                ? 'bg-brand text-white border-brand shadow-md shadow-brand/30'
                : 'bg-white text-muted border-slate-300 hover:border-brand hover:text-brand'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-slate-100">
                <th className={thClass}>{t('admin.riwayat.colRequest')}</th>
                <th className={thClass}>{t('admin.riwayat.colFrom')}</th>
                <th className={thClass}>{t('admin.riwayat.colTo')}</th>
                <th className={thClass}>{t('admin.riwayat.colBy')}</th>
                <th className={thClass}>{t('admin.riwayat.colDate')}</th>
                <th className={thClass}>{t('admin.riwayat.colNote')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-muted">{t('admin.riwayat.loading')}</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-muted">{t('admin.riwayat.empty')}</td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} className="border-b border-slate-50 hover:bg-[#FDFBF9]">
                    <td className="px-6 py-3">
                      <Link to={`/admin/permintaan/${e.request?.id}`} className="font-semibold text-brand hover:underline">
                        {e.request?.request_code}
                      </Link>
                    </td>
                    <td className="px-6 py-3">
                      {e.old_status ? (
                        <StatusBadge status={e.old_status} small />
                      ) : (
                        <span className="text-muted">{t('admin.detail.created')}</span>
                      )}
                    </td>
                    <td className="px-6 py-3"><StatusBadge status={e.new_status} small /></td>
                    <td className="px-6 py-3">{e.changed_by_name || t('admin.detail.system')}</td>
                    <td className="px-6 py-3 text-muted whitespace-nowrap">{formatDateTime(e.created_at)}</td>
                    <td className="px-6 py-3 text-muted max-w-xs">
                      {e.admin_response ? (
                        <span className="line-clamp-2">{e.admin_response}</span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
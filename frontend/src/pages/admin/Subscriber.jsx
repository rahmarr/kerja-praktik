import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import client, { getErrorMessage } from '../../api/client.js';
import { formatDateTime } from '../../api/format.js';

export default function Subscriber() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const q = (searchParams.get('q') || '').toLowerCase();
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ page: 1, total: 0, totalPages: 1 });
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(
    (page = 1) => {
      setLoading(true);
      setError('');
      const params = { page, pageSize: 10 };
      if (filter) params.status = filter;
      client
        .get('/admin/newsletter-subscribers', { params })
        .then((res) => {
          setData(res.data.data);
          setMeta(res.data.meta);
        })
        .catch((err) => setError(getErrorMessage(err)))
        .finally(() => setLoading(false));
    },
    [filter]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const changeStatus = async (id, status) => {
    try {
      await client.patch(`/admin/newsletter-subscribers/${id}`, { status });
      const label = status === 'subscribed'
        ? t('admin.subscriber.statusSubscribed')
        : t('admin.subscriber.statusUnsubscribed');
      setNotice(t('admin.subscriber.statusChangedNotice', { status: label }));
      load(meta.page);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const remove = async (id) => {
    if (!window.confirm(t('admin.subscriber.deleteConfirm'))) return;
    try {
      await client.delete(`/admin/newsletter-subscribers/${id}`);
      setNotice(t('admin.subscriber.deletedNotice'));
      load(meta.page);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const statusLabel = (status) =>
    status === 'subscribed' ? t('admin.subscriber.statusSubscribed') : t('admin.subscriber.statusUnsubscribed');

  const visible = q
    ? data.filter((s) => s.email.toLowerCase().includes(q) || statusLabel(s.status).toLowerCase().includes(q))
    : data;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-dark-brown">{t('admin.subscriber.title')}</h1>
      <p className="mt-1 text-sm text-muted">{t('admin.subscriber.subtitle')}</p>

      {notice && <p className="mt-4 text-sm text-emerald-600">{notice}</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex items-center gap-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none"
        >
          <option value="">{t('admin.subscriber.allStatus')}</option>
          <option value="subscribed">{t('admin.subscriber.statusSubscribed')}</option>
          <option value="unsubscribed">{t('admin.subscriber.statusUnsubscribed')}</option>
        </select>
      </div>

      <div className="mt-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-slate-100">
                <th className="px-6 py-3 font-semibold">{t('admin.subscriber.colEmail')}</th>
                <th className="px-6 py-3 font-semibold">{t('admin.subscriber.colStatus')}</th>
                <th className="px-6 py-3 font-semibold">{t('admin.subscriber.colSubscribed')}</th>
                <th className="px-6 py-3 font-semibold">{t('admin.subscriber.colAction')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-muted">{t('admin.subscriber.loading')}</td></tr>
              ) : visible.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-muted">{t('admin.subscriber.empty')}</td></tr>
              ) : (
                visible.map((s) => (
                  <tr key={s.id} className="border-b border-slate-50 hover:bg-[#FDFBF9]">
                    <td className="px-6 py-3 font-medium text-dark-brown">{s.email}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          s.status === 'subscribed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-neutral-100 text-muted'
                        }`}
                      >
                        {statusLabel(s.status)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-muted">{formatDateTime(s.subscribed_at)}</td>
                    <td className="px-6 py-3">
                      <div className="flex gap-3 text-sm font-semibold">
                        <select
                          value={s.status}
                          onChange={(e) => changeStatus(s.id, e.target.value)}
                          className="px-2 py-1 rounded-lg border border-slate-300 text-xs"
                        >
                          <option value="subscribed">{t('admin.subscriber.statusSubscribed')}</option>
                          <option value="unsubscribed">{t('admin.subscriber.statusUnsubscribed')}</option>
                        </select>
                        <button type="button" onClick={() => remove(s.id)} className="text-red-600 hover:underline">
                          {t('admin.subscriber.deleteAction')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && meta.total > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 text-sm">
            <span className="text-muted">
              {t('admin.subscriber.total', { total: meta.total, page: meta.page, pages: meta.totalPages })}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={meta.page <= 1}
                onClick={() => load(meta.page - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 disabled:opacity-40 hover:text-brand"
              >
                {t('admin.subscriber.prev')}
              </button>
              <button
                type="button"
                disabled={meta.page >= meta.totalPages}
                onClick={() => load(meta.page + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 disabled:opacity-40 hover:text-brand"
              >
                {t('admin.subscriber.next')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
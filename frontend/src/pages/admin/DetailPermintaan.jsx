import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import client, { getErrorMessage } from '../../api/client.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import { capitalize, formatDateTime } from '../../api/format.js';

const STATUSES = ['Menunggu Ditinjau', 'Sedang Diproses', 'Menunggu Informasi', 'Selesai'];

const STATUS_KEY = {
  'Menunggu Ditinjau': 'status.waiting',
  'Sedang Diproses': 'status.processing',
  'Menunggu Informasi': 'status.info',
  'Selesai': 'status.done',
};

export default function DetailPermintaan() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [status, setStatus] = useState('');
  const [response, setResponse] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    Promise.all([
      client.get(`/admin/service-requests/${id}`),
      client.get(`/admin/service-requests/${id}/history`),
    ])
      .then(([rRes, hRes]) => {
        setRequest(rRes.data.data);
        setHistory(hRes.data.data);
        setStatus(rRes.data.data.status);
        setResponse(rRes.data.data.admin_response || '');
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    try {
      await client.patch(`/admin/service-requests/${id}`, {
        status,
        admin_response: response,
      });
      setSaveMessage({ type: 'success', text: t('admin.detail.saved') });
      load();
    } catch (err) {
      setSaveMessage({ type: 'error', text: getErrorMessage(err, t('admin.detail.saveError')) });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-center text-muted py-10">{t('admin.detail.loading')}</p>;
  }

  if (error || !request) {
    return (
      <div>
        <p className="text-red-600">{error || t('admin.detail.notFound')}</p>
        <Link to="/admin/permintaan" className="mt-4 inline-block text-brand font-semibold hover:underline">
          {t('admin.detail.back')}
        </Link>
      </div>
    );
  }

  const labelClass = 'text-xs text-muted';
  const valueClass = 'mt-0.5 font-medium text-dark-brown';

  return (
    <div>
      <Link to="/admin/permintaan" className="text-sm text-brand font-semibold hover:underline">
        {t('admin.detail.back')}
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-extrabold text-dark-brown">{request.request_code}</h1>
        <StatusBadge status={request.status} />
        <span className="text-xs text-muted">{formatDateTime(request.created_at)}</span>
      </div>
      <p className="mt-2 text-sm text-muted">{request.description?.slice(0, 140)}...</p>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-dark-brown">{t('admin.detail.customerInfo')}</h2>
            <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className={labelClass}>{t('admin.detail.name')}</p>
                <p className={valueClass}>{request.customer_name}</p>
              </div>
              <div>
                <p className={labelClass}>{t('admin.detail.customerType')}</p>
                <p className={valueClass}>{capitalize(request.customer_type)}</p>
              </div>
              <div>
                <p className={labelClass}>{t('admin.detail.org')}</p>
                <p className={valueClass}>{request.organization_name || '-'}</p>
              </div>
              <div>
                <p className={labelClass}>{t('admin.detail.service')}</p>
                <p className={valueClass}>{request.service_name}</p>
              </div>
              <div>
                <p className={labelClass}>{t('admin.detail.email')}</p>
                <p className={valueClass}>{request.email}</p>
              </div>
              <div>
                <p className={labelClass}>{t('admin.detail.phone')}</p>
                <p className={valueClass}>{request.phone || '-'}</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-dark-brown">{t('admin.detail.description')}</h2>
            <p className="mt-4 text-muted leading-relaxed whitespace-pre-line">{request.description}</p>

            {request.admin_response && (
              <div className="mt-6 rounded-2xl bg-brand-light border border-brand/20 p-5">
                <p className="text-xs font-semibold text-brand uppercase">{t('admin.detail.currentResponse')}</p>
                <p className="mt-2 text-sm text-dark-brown whitespace-pre-line">{request.admin_response}</p>
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-bold text-dark-brown">{t('admin.detail.history')}</h2>
            {history.length === 0 ? (
              <p className="mt-4 text-sm text-muted">{t('admin.detail.noHistory')}</p>
            ) : (
              <ol className="mt-4 space-y-4">
                {history.map((h) => (
                  <li key={h.id} className="flex gap-4">
                    <div className="w-3 h-3 mt-1.5 rounded-full bg-brand shrink-0" />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-sm">{h.old_status || t('admin.detail.created')}</span>
                        <span className="text-muted">→</span>
                        <StatusBadge status={h.new_status} small />
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        {formatDateTime(h.created_at)} • {h.changed_by_name || t('admin.detail.system')}
                      </p>
                      {h.admin_response && (
                        <p className="mt-1 text-sm text-muted whitespace-pre-line">{h.admin_response}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-fit">
          <h2 className="font-bold text-dark-brown">{t('admin.detail.adminActivity')}</h2>
          <form onSubmit={save} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark-brown">{t('admin.detail.updateStatus')}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 bg-white"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{t(STATUS_KEY[s])}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center justify-between text-sm font-semibold text-dark-brown">
                {t('admin.detail.noteLabel')}
                <span className="text-xs font-normal text-muted">{response.length}/500</span>
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value.slice(0, 500))}
                rows={5}
                placeholder={t('admin.detail.notePlaceholder')}
                className="mt-1 w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full px-6 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-60"
            >
              {saving ? t('admin.detail.saving') : t('admin.detail.save')}
            </button>
            {saveMessage && (
              <p className={`text-sm ${saveMessage.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                {saveMessage.text}
              </p>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}
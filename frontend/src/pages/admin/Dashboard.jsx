import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import client, { getErrorMessage } from '../../api/client.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import { formatDateTime } from '../../api/format.js';

const EMPTY_STATS = {
  total: 0,
  menunggu: 0,
  diproses: 0,
  menunggu_informasi: 0,
  selesai: 0,
  layanan_terpakai: 0,
};

const KPI_ICONS = {
  total: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M3 12h18M3 18h18" />
      <path d="M7 3v3M7 9v3M7 15v3" />
    </svg>
  ),
  menunggu: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v16H4z" />
      <path d="M9 8v8M15 8v8" />
    </svg>
  ),
  diproses: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-2.6-6.3" />
      <path d="M21 3v6h-6" />
      <path d="M12 8v4l3 2" />
    </svg>
  ),
  selesai: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.1V12a10 10 0 1 1-5.9-9.1" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
};

const KPI_COLORS = {
  total: 'bg-brand-light text-brand',
  menunggu: 'bg-amber-100 text-amber-700',
  diproses: 'bg-blue-50 text-blue-700',
  selesai: 'bg-emerald-100 text-emerald-700',
};

export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(EMPTY_STATS);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      client.get('/admin/stats'),
      client.get('/admin/service-requests', { params: { pageSize: 8 } }),
    ])
      .then(([statsRes, recentRes]) => {
        setStats(statsRes.data.data);
        setRecent(recentRes.data.data);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const kpis = [
    { key: 'total', label: t('admin.dashboard.total'), value: stats.total },
    { key: 'menunggu', label: t('admin.dashboard.menunggu'), value: stats.menunggu },
    { key: 'diproses', label: t('admin.dashboard.diproses'), value: stats.diproses },
    { key: 'selesai', label: t('admin.dashboard.selesai'), value: stats.selesai },
  ];

  const thClass = 'px-6 py-3 font-semibold text-left';

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-dark-brown">{t('admin.dashboard.title')}</h1>
          <p className="mt-1 text-sm text-muted">{t('admin.dashboard.subtitle')}</p>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.key} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${KPI_COLORS[kpi.key]}`}>
              {KPI_ICONS[kpi.key]}
            </div>
            <p className="mt-3 text-3xl font-extrabold text-dark-brown">{loading ? '...' : kpi.value}</p>
            <p className="text-sm text-muted">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-dark-brown">{t('admin.dashboard.recentTitle')}</h2>
          <Link to="/admin/permintaan" className="text-sm text-brand font-semibold hover:underline">
            {t('admin.dashboard.viewAll')}
          </Link>
        </div>

        {loading ? (
          <p className="px-6 py-8 text-center text-sm text-muted">{t('admin.dashboard.loading')}</p>
        ) : recent.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-muted">{t('admin.dashboard.empty')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-slate-100">
                  <th className={thClass}>{t('admin.dashboard.colRequest')}</th>
                  <th className={thClass}>{t('admin.dashboard.colCustomer')}</th>
                  <th className={thClass}>{t('admin.dashboard.colService')}</th>
                  <th className={thClass}>{t('admin.dashboard.colDate')}</th>
                  <th className={thClass}>{t('admin.dashboard.colStatus')}</th>
                  <th className={thClass}>{t('admin.dashboard.colAction')}</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-[#FDFBF9]">
                    <td className="px-6 py-3 font-semibold text-dark-brown">{r.request_code}</td>
                    <td className="px-6 py-3">
                      <p className="font-medium">{r.customer_name}</p>
                      <p className="text-xs text-muted">{r.organization_name || '-'}</p>
                    </td>
                    <td className="px-6 py-3">{r.service_name}</td>
                    <td className="px-6 py-3 text-muted">{formatDateTime(r.created_at)}</td>
                    <td className="px-6 py-3"><StatusBadge status={r.status} small /></td>
                    <td className="px-6 py-3">
                      <Link
                        to={`/admin/permintaan/${r.id}`}
                        className="inline-flex items-center gap-1 text-brand font-semibold hover:underline"
                      >
                        {t('admin.dashboard.colActionBtn')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext.jsx';

const inputClass =
  'mt-1 w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand bg-white';

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? 'bg-brand' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function Pengaturan() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '0812-3456-7890',
    role: user?.role === 'admin' ? 'Administrator' : user?.role || 'Administrator',
  });

  const [notif, setNotif] = useState({ emailNotif: true, statusChange: true, newRequest: true, weekly: false });

  const [users] = useState([
    { id: 1, name: 'Admin Utama', email: 'admin@digitak.id', role: 'Administrator', active: true },
    { id: 2, name: 'Doni Saputra', email: 'doni@digitak.id', role: 'Admin Konten', active: true },
    { id: 3, name: 'Sari Wulandari', email: 'sari@digitak.id', role: 'Admin Support', active: false },
  ]);

  const [config, setConfig] = useState({
    siteName: 'Digitak — PT Metanouva Informatika',
    siteDesc: 'Digital technology partner for your business.',
    contactEmail: 'halo@digitak.id',
    contactPhone: '+62 812-3456-7890',
    address: 'Jakarta, Indonesia',
    maxRequest: '100',
    maintenance: false,
  });

  const update = (setter) => (field) => (e) => {
    setter((s) => ({ ...s, [field]: e.target.value }));
    setSaved(false);
  };

  const notifySaved = (e) => {
    e.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { key: 'profile', label: t('admin.pengaturan.tabs.profile') },
    { key: 'notification', label: t('admin.pengaturan.tabs.notification') },
    { key: 'users', label: t('admin.pengaturan.tabs.users') },
    { key: 'config', label: t('admin.pengaturan.tabs.config') },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-dark-brown">{t('admin.pengaturan.title')}</h1>
      <p className="mt-1 text-sm text-muted">{t('admin.pengaturan.subtitle')}</p>

      {saved && <p className="mt-4 text-sm text-emerald-600">{t('admin.detail.saved')}</p>}

      <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-0">
        {tabs.map((tb) => (
          <button
            key={tb.key}
            type="button"
            onClick={() => setTab(tb.key)}
            className={`px-4 py-2.5 text-sm font-bold rounded-t-lg border-b-2 transition-colors ${
              tab === tb.key
                ? 'text-brand border-brand bg-brand-light/50'
                : 'text-muted border-transparent hover:text-dark-brown'
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <form onSubmit={notifySaved} className="mt-6 max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-brand flex items-center justify-center text-3xl text-white font-extrabold">
              {profile.fullName.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm text-muted">{t('admin.pengaturan.profile.photoLabel')}</p>
              <div className="mt-2 flex gap-3">
                <button type="button" className="px-3 py-1.5 rounded-lg bg-brand-light text-brand text-sm font-semibold hover:bg-brand hover:text-white">
                  {t('admin.pengaturan.profile.changePhoto')}
                </button>
                <button type="button" className="px-3 py-1.5 rounded-lg text-red-600 text-sm font-semibold hover:underline">
                  {t('admin.pengaturan.profile.removePhoto')}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-dark-brown">{t('admin.pengaturan.profile.fullName')}</label>
              <input value={profile.fullName} onChange={update(setProfile)('fullName')} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-brown">{t('admin.pengaturan.profile.email')}</label>
              <input type="email" value={profile.email} onChange={update(setProfile)('email')} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-brown">{t('admin.pengaturan.profile.phone')}</label>
              <input value={profile.phone} onChange={update(setProfile)('phone')} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-brown">{t('admin.pengaturan.profile.role')}</label>
              <input value={profile.role} readOnly className={`${inputClass} bg-slate-100 text-muted cursor-not-allowed`} />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button type="submit" className="px-5 py-2.5 bg-brand text-white text-sm font-bold rounded-lg hover:bg-brand-dark">
              {t('admin.pengaturan.profile.save')}
            </button>
            <button type="button" className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold hover:border-brand hover:text-brand">
              {t('admin.pengaturan.profile.cancel')}
            </button>
          </div>
        </form>
      )}

      {tab === 'notification' && (
        <div className="mt-6 max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-dark-brown">{t('admin.pengaturan.notification.title')}</p>
              <p className="text-sm text-muted">{t('admin.pengaturan.notification.subtitle')}</p>
            </div>
          </div>
          <div className="mt-5 divide-y divide-slate-100">
            <Row title={t('admin.pengaturan.notification.emailNotif')} desc={t('admin.pengaturan.notification.emailNotifDesc')}>
              <Toggle checked={notif.emailNotif} onChange={(v) => setNotif((s) => ({ ...s, emailNotif: v }))} />
            </Row>
            <Row title={t('admin.pengaturan.notification.statusChange')} desc={t('admin.pengaturan.notification.statusChangeDesc')}>
              <Toggle checked={notif.statusChange} onChange={(v) => setNotif((s) => ({ ...s, statusChange: v }))} />
            </Row>
            <Row title={t('admin.pengaturan.notification.newRequest')} desc={t('admin.pengaturan.notification.newRequestDesc')}>
              <Toggle checked={notif.newRequest} onChange={(v) => setNotif((s) => ({ ...s, newRequest: v }))} />
            </Row>
            <Row title={t('admin.pengaturan.notification.weekly')} desc={t('admin.pengaturan.notification.weeklyDesc')}>
              <Toggle checked={notif.weekly} onChange={(v) => setNotif((s) => ({ ...s, weekly: v }))} />
            </Row>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <p className="font-bold text-dark-brown">{t('admin.pengaturan.users.title')}</p>
              <p className="text-sm text-muted">{t('admin.pengaturan.users.subtitle')}</p>
            </div>
            <button type="button" className="px-4 py-2.5 bg-brand text-white text-sm font-bold rounded-lg hover:bg-brand-dark">
              {t('admin.pengaturan.users.addUser')}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-slate-100">
                  <th className="px-6 py-3 font-semibold">{t('admin.pengaturan.users.colName')}</th>
                  <th className="px-6 py-3 font-semibold">{t('admin.pengaturan.users.colEmail')}</th>
                  <th className="px-6 py-3 font-semibold">{t('admin.pengaturan.users.colRole')}</th>
                  <th className="px-6 py-3 font-semibold">{t('admin.pengaturan.users.colStatus')}</th>
                  <th className="px-6 py-3 font-semibold">{t('admin.pengaturan.users.colAction')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-[#FDFBF9]">
                    <td className="px-6 py-3 font-medium text-dark-brown">{u.name}</td>
                    <td className="px-6 py-3">{u.email}</td>
                    <td className="px-6 py-3">{u.role}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          u.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-muted'
                        }`}
                      >
                        {u.active ? t('admin.pengaturan.users.active') : t('admin.pengaturan.users.inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <button type="button" className="text-sm text-brand font-semibold hover:underline">{t('admin.pengaturan.profile.edit')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'config' && (
        <form onSubmit={notifySaved} className="mt-6 max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-dark-brown">{t('admin.pengaturan.config.siteName')}</label>
              <input value={config.siteName} onChange={update(setConfig)('siteName')} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-brown">{t('admin.pengaturan.config.contactEmail')}</label>
              <input value={config.contactEmail} onChange={update(setConfig)('contactEmail')} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-brown">{t('admin.pengaturan.config.siteDesc')}</label>
              <input value={config.siteDesc} onChange={update(setConfig)('siteDesc')} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-brown">{t('admin.pengaturan.config.contactPhone')}</label>
              <input value={config.contactPhone} onChange={update(setConfig)('contactPhone')} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-brown">{t('admin.pengaturan.config.address')}</label>
              <input value={config.address} onChange={update(setConfig)('address')} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-brown">{t('admin.pengaturan.config.maxRequest')}</label>
              <input type="number" value={config.maxRequest} onChange={update(setConfig)('maxRequest')} className={inputClass} />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl bg-brand-light p-4">
            <div>
              <p className="text-sm font-bold text-dark-brown">{t('admin.pengaturan.config.maintenance')}</p>
              <p className="text-xs text-muted">{t('admin.pengaturan.config.maintenanceDesc')}</p>
            </div>
            <Toggle checked={config.maintenance} onChange={(v) => setConfig((s) => ({ ...s, maintenance: v }))} />
          </div>

          <button type="submit" className="mt-6 px-5 py-2.5 bg-brand text-white text-sm font-bold rounded-lg hover:bg-brand-dark">
            {t('admin.pengaturan.config.saveConfig')}
          </button>
        </form>
      )}
    </div>
  );
}

function Row({ title, desc, children }) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="pr-4">
        <p className="font-semibold text-dark-brown">{title}</p>
        <p className="text-sm text-muted">{desc}</p>
      </div>
      {children}
    </div>
  );
}
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import client, { getErrorMessage } from '../../api/client.js';
import { formatDateTime } from '../../api/format.js';

const EMPTY_FORM = { name: '', slug: '', description: '', is_active: true };

export default function KelolaLayanan() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const q = (searchParams.get('q') || '').toLowerCase();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    client
      .get('/admin/services')
      .then((res) => setServices(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError('');
  };

  const startEdit = (service) => {
    setForm({
      name: service.name,
      slug: service.slug,
      description: service.description || '',
      is_active: service.is_active,
    });
    setEditingId(service.id);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    setNotice('');
    try {
      if (editingId) {
        await client.patch(`/admin/services/${editingId}`, form);
        setNotice(t('admin.kelolaLayanan.updatedNotice'));
      } else {
        await client.post('/admin/services', form);
        setNotice(t('admin.kelolaLayanan.addedNotice'));
        resetForm();
      }
      load();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const softDelete = async (id) => {
    if (!window.confirm(t('admin.kelolaLayanan.deleteConfirm'))) return;
    try {
      await client.delete(`/admin/services/${id}`);
      setNotice(t('admin.kelolaLayanan.softDeletedNotice'));
      load();
    } catch (err) {
      setFormError(getErrorMessage(err));
    }
  };

  const restore = async (id) => {
    try {
      await client.post(`/admin/services/${id}/restore`);
      setNotice(t('admin.kelolaLayanan.restoredNotice'));
      load();
    } catch (err) {
      setFormError(getErrorMessage(err));
    }
  };

  const visible = q
    ? services.filter((s) =>
        [s.name, s.slug, s.description].some((v) => v && v.toLowerCase().includes(q))
      )
    : services;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-dark-brown">{t('admin.kelolaLayanan.title')}</h1>
      <p className="mt-1 text-sm text-muted">{t('admin.kelolaLayanan.subtitle')}</p>

      {notice && <p className="mt-4 text-sm text-emerald-600">{notice}</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-fit">
          <h2 className="font-bold text-dark-brown">{editingId ? t('admin.kelolaLayanan.edit') : t('admin.kelolaLayanan.addNew')}</h2>
          <form onSubmit={submit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark-brown">{t('admin.kelolaLayanan.nameLabel')}</label>
              <input
                value={form.name}
                onChange={update('name')}
                required
                placeholder={t('admin.kelolaLayanan.namePlaceholder')}
                className="mt-1 w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-brown">
                {t('admin.kelolaLayanan.slugLabel')} <span className="font-normal text-muted">{t('admin.kelolaLayanan.slugHint')}</span>
              </label>
              <input
                value={form.slug}
                onChange={update('slug')}
                placeholder="iot-solution"
                className="mt-1 w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-brown">{t('admin.kelolaLayanan.descriptionLabel')}</label>
              <textarea
                value={form.description}
                onChange={update('description')}
                rows={4}
                className="mt-1 w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-dark-brown">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
              />
              {t('admin.kelolaLayanan.activeLabel')}
            </label>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-brand text-white text-sm font-bold rounded-lg hover:bg-brand-dark disabled:opacity-60"
              >
                {saving ? t('admin.kelolaLayanan.saving') : editingId ? t('admin.kelolaLayanan.saveChanges') : t('admin.kelolaLayanan.addService')}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 border border-slate-300 text-sm font-semibold rounded-lg hover:border-brand hover:text-brand"
                >
                  {t('admin.kelolaLayanan.cancel')}
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 font-bold text-dark-brown">{t('admin.kelolaLayanan.listTitle')}</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-slate-100">
                  <th className="px-6 py-3 font-semibold">{t('admin.kelolaLayanan.colName')}</th>
                  <th className="px-6 py-3 font-semibold">{t('admin.kelolaLayanan.colStatus')}</th>
                  <th className="px-6 py-3 font-semibold">{t('admin.kelolaLayanan.colCreated')}</th>
                  <th className="px-6 py-3 font-semibold">{t('admin.kelolaLayanan.colAction')}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="px-6 py-8 text-center text-muted">{t('admin.kelolaLayanan.loading')}</td></tr>
                ) : visible.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-8 text-center text-muted">{t('admin.kelolaLayanan.empty')}</td></tr>
                ) : (
                  visible.map((s) => (
                    <tr key={s.id} className={`border-b border-slate-50 hover:bg-[#FDFBF9] ${s.deleted_at ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-3">
                        <p className="font-semibold text-dark-brown">{s.name}</p>
                        <p className="text-xs text-muted">/{s.slug}</p>
                      </td>
                      <td className="px-6 py-3">
                        {s.deleted_at ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">{t('admin.kelolaLayanan.statusSoftDeleted')}</span>
                        ) : s.is_active ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">{t('admin.kelolaLayanan.statusActive')}</span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-muted text-xs font-semibold">{t('admin.kelolaLayanan.statusInactive')}</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-muted">{formatDateTime(s.created_at)}</td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(s)}
                            className="text-sm text-brand font-semibold hover:underline"
                          >
                            {t('admin.kelolaLayanan.editAction')}
                          </button>
                          {s.deleted_at ? (
                            <button
                              type="button"
                              onClick={() => restore(s.id)}
                              className="text-sm text-emerald-600 font-semibold hover:underline"
                            >
                              {t('admin.kelolaLayanan.restoreAction')}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => softDelete(s.id)}
                              className="text-sm text-red-600 font-semibold hover:underline"
                            >
                              {t('admin.kelolaLayanan.deleteAction')}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
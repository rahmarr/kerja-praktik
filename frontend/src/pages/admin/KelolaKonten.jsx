import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import client, { getErrorMessage } from '../../api/client.js';
import { formatDateTime } from '../../api/format.js';

const CATEGORIES = ['portfolio', 'article', 'product', 'hero_section', 'page'];

const EMPTY_FORM = {
  title: '',
  slug: '',
  category: 'article',
  body: '',
  image_url: '',
  is_published: false,
};

export default function KelolaKonten() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const q = (searchParams.get('q') || '').toLowerCase();
  const [contents, setContents] = useState([]);
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
      .get('/admin/contents')
      .then((res) => setContents(res.data.data))
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

  const startEdit = (content) => {
    setForm({
      title: content.title,
      slug: content.slug,
      category: content.category,
      body: content.body,
      image_url: content.image_url || '',
      is_published: content.is_published,
    });
    setEditingId(content.id);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    setNotice('');
    try {
      if (editingId) {
        await client.patch(`/admin/contents/${editingId}`, form);
        setNotice(t('admin.kelolaKonten.updatedNotice'));
      } else {
        await client.post('/admin/contents', form);
        setNotice(t('admin.kelolaKonten.createdNotice'));
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
    if (!window.confirm(t('admin.kelolaKonten.deleteConfirm'))) return;
    try {
      await client.delete(`/admin/contents/${id}`);
      setNotice(t('admin.kelolaKonten.softDeletedNotice'));
      load();
    } catch (err) {
      setFormError(getErrorMessage(err));
    }
  };

  const restore = async (id) => {
    try {
      await client.post(`/admin/contents/${id}/restore`);
      setNotice(t('admin.kelolaKonten.restoredNotice'));
      load();
    } catch (err) {
      setFormError(getErrorMessage(err));
    }
  };

  const visible = q
    ? contents.filter((c) =>
        [c.title, c.slug].some((v) => v && v.toLowerCase().includes(q))
      )
    : contents;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-dark-brown">{t('admin.kelolaKonten.title')}</h1>
      <p className="mt-1 text-sm text-muted">{t('admin.kelolaKonten.subtitle')}</p>

      {notice && <p className="mt-4 text-sm text-emerald-600">{notice}</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-fit">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-dark-brown">{editingId ? t('admin.kelolaKonten.edit') : t('admin.kelolaKonten.addNew')}</h2>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-sm text-brand font-semibold hover:underline">
                {t('admin.kelolaKonten.cancel')}
              </button>
            )}
          </div>

          <form onSubmit={submit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark-brown">{t('admin.kelolaKonten.titleLabel')}</label>
              <input
                value={form.title}
                onChange={update('title')}
                required
                placeholder={t('admin.kelolaKonten.titlePlaceholder')}
                className="mt-1 w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-dark-brown">{t('admin.kelolaKonten.slugLabel')}</label>
                <input
                  value={form.slug}
                  onChange={update('slug')}
                  placeholder={t('admin.kelolaKonten.slugHint')}
                  className="mt-1 w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-brown">{t('admin.kelolaKonten.categoryLabel')}</label>
                <select
                  value={form.category}
                  onChange={update('category')}
                  className="mt-1 w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{t(`admin.kelolaKonten.categories.${c}`)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-brown">{t('admin.kelolaKonten.descriptionLabel')}</label>
              <textarea
                value={form.body}
                onChange={update('body')}
                required
                rows={6}
                placeholder={t('admin.kelolaKonten.descriptionPlaceholder')}
                className="mt-1 w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-brown">
                {t('admin.kelolaKonten.imageLabel')} <span className="font-normal text-muted">{t('admin.kelolaKonten.imageHint')}</span>
              </label>
              <input
                value={form.image_url}
                onChange={update('image_url')}
                placeholder={t('admin.kelolaKonten.imagePlaceholder')}
                className="mt-1 w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-dark-brown">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
              />
              {t('admin.kelolaKonten.publishLabel')}
            </label>

            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full px-4 py-2.5 bg-brand text-white text-sm font-bold rounded-lg hover:bg-brand-dark disabled:opacity-60"
            >
              {saving ? t('admin.kelolaKonten.saving') : editingId ? t('admin.kelolaKonten.saveChanges') : t('admin.kelolaKonten.addContent')}
            </button>
          </form>
        </section>

        <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 font-bold text-dark-brown">{t('admin.kelolaKonten.listTitle')}</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-slate-100">
                  <th className="px-6 py-3 font-semibold">{t('admin.kelolaKonten.colTitle')}</th>
                  <th className="px-6 py-3 font-semibold">{t('admin.kelolaKonten.colCategory')}</th>
                  <th className="px-6 py-3 font-semibold">{t('admin.kelolaKonten.colVisibility')}</th>
                  <th className="px-6 py-3 font-semibold">{t('admin.kelolaKonten.colUpdated')}</th>
                  <th className="px-6 py-3 font-semibold">{t('admin.kelolaKonten.colAction')}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-muted">{t('admin.kelolaKonten.loading')}</td></tr>
                ) : visible.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-muted">{t('admin.kelolaKonten.empty')}</td></tr>
                ) : (
                  visible.map((c) => (
                    <tr key={c.id} className={`border-b border-slate-50 hover:bg-[#FDFBF9] ${c.deleted_at ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-3">
                        <p className="font-semibold text-dark-brown">{c.title}</p>
                        <p className="text-xs text-muted">/{c.slug}</p>
                      </td>
                      <td className="px-6 py-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-dark-brown text-xs font-semibold">
                          {t(`admin.kelolaKonten.categories.${c.category}`, { defaultValue: c.category })}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        {c.deleted_at ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">{t('admin.kelolaKonten.visSoftDeleted')}</span>
                        ) : c.is_published ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">{t('admin.kelolaKonten.visPublished')}</span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">{t('admin.kelolaKonten.visDraft')}</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-muted">{formatDateTime(c.updated_at)}</td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => startEdit(c)} className="text-sm text-brand font-semibold hover:underline">
                            {t('admin.kelolaKonten.editAction')}
                          </button>
                          {c.deleted_at ? (
                            <button type="button" onClick={() => restore(c.id)} className="text-sm text-emerald-600 font-semibold hover:underline">
                              {t('admin.kelolaKonten.restoreAction')}
                            </button>
                          ) : (
                            <button type="button" onClick={() => softDelete(c.id)} className="text-sm text-red-600 font-semibold hover:underline">
                              {t('admin.kelolaKonten.deleteAction')}
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
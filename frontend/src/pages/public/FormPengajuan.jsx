import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import client, { getErrorMessage, getFieldErrors } from '../../api/client.js';
import { serviceIcon, serviceName, sortServices } from '../../components/ServiceCard.jsx';
import { CTADarkSection, VisitSection } from '../../components/CTAVisitSection.jsx';

const CUSTOMER_TYPE_VALUES = ['individu', 'perusahaan', 'umkm', 'startup', 'organisasi'];

const INITIAL_FORM = {
  customer_name: '',
  customer_type: 'perusahaan',
  organization_name: '',
  email: '',
  phone: '',
  description: '',
};

export default function FormPengajuan() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const serviceSlug = searchParams.get('service') || '';
  const serviceIdParam = searchParams.get('service_id');
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const [form, setForm] = useState(() => ({
    ...INITIAL_FORM,
    customer_name: searchParams.get('name') || '',
    email: searchParams.get('email') || '',
  }));
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    client
      .get('/services')
      .then((res) => {
        setServices(res.data.data);
        const found =
          res.data.data.find((s) => s.slug === serviceSlug) ||
          (serviceIdParam ? res.data.data.find((s) => s.id === Number(serviceIdParam)) : null);
        setSelectedService(found || null);
      })
      .catch((err) => setGeneralError(getErrorMessage(err, t('form.errors.load'))));
  }, [serviceSlug, serviceIdParam, t]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    if (!agree) {
      setErrors((er) => ({ ...er, agree: t('form.errors.agree') }));
      return;
    }
    if (!selectedService) {
      setErrors((er) => ({ ...er, service_id: t('form.errors.service') }));
      return;
    }
    setLoading(true);
    try {
      const { data } = await client.post('/service-requests', {
        ...form,
        service_id: selectedService.id,
      });
      navigate(`/konfirmasi?code=${data.data.request_code}`);
    } catch (err) {
      setErrors(getFieldErrors(err));
      setGeneralError(getErrorMessage(err, t('form.errors.general')));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `mt-1.5 w-full px-4 py-2.5 rounded-lg border text-sm text-dark-brown bg-cream focus:outline-none focus:ring-2 focus:ring-brand/50 focus:bg-white transition-colors ${
      hasError ? 'border-red-400' : 'border-[#EADFD7]'
    }`;
  const labelClass = 'block text-sm font-bold text-dark-brown';

  return (
    <>
      <section className="max-w-[1184px] mx-auto px-6 lg:px-12 py-16 grid lg:grid-cols-2 gap-14">
        <div>
        <span className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-[0.2em] uppercase text-brand">
          <span className="w-1.5 h-1.5 rounded-full bg-brand" />
          {t('form.kicker')}
        </span>
        <h1 className="mt-4 text-4xl lg:text-[40px] font-extrabold text-dark-brown leading-tight">
          {t('form.title')}
        </h1>
        <p className="mt-5 text-body leading-relaxed">{t('form.subtitle')}</p>
        <div className="mt-9 rounded-2xl bg-white border border-[#EADFD7] min-h-64 flex items-center justify-center p-8">
          <img src="/logo-primary.png" alt="Digitak" className="w-full max-w-[280px] h-auto" />
        </div>
        <p className="mt-7 text-sm text-muted">
          {t('form.haveId')}{' '}
          <Link to="/cek-status" className="text-brand font-bold hover:underline">
            {t('form.checkStatus')}
          </Link>
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#EADFD7] shadow-xl p-6 lg:p-9 h-fit">
        <h2 className="text-xl font-extrabold text-dark-brown">{t('form.cardTitle')}</h2>

        {serviceSlug && selectedService && (
          <div className="mt-5 flex items-center gap-3 rounded-xl bg-brand-light border border-[#F5C9A1] p-4">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-2xl">
              {serviceIcon(selectedService.slug)}
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold tracking-widest text-muted uppercase">
                {t('form.selectedService')}
              </p>
              <p className="font-bold text-dark-brown">{serviceName(selectedService, t)}</p>
            </div>
          </div>
        )}

        {serviceSlug && !selectedService && (
          <p className="mt-4 text-sm text-red-600">{t('form.invalidService')}</p>
        )}

        <form onSubmit={submit} className="mt-7 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                {t('form.nameLabel')} <span className="text-red-500">*</span>
              </label>
              <input
                value={form.customer_name}
                onChange={update('customer_name')}
                placeholder={t('form.namePlaceholder')}
                className={inputClass(errors.customer_name)}
              />
              {errors.customer_name && <p className="mt-1 text-xs text-red-600">{errors.customer_name}</p>}
            </div>
            <div>
              <label className={labelClass}>
                {t('form.customerTypeLabel')} <span className="text-red-500">*</span>
              </label>
              <select value={form.customer_type} onChange={update('customer_type')} className={inputClass(errors.customer_type)}>
                {CUSTOMER_TYPE_VALUES.map((v, i) => (
                  <option key={v} value={v}>
                    {t(`form.customerTypes.${i}`)}
                  </option>
                ))}
              </select>
              {errors.customer_type && <p className="mt-1 text-xs text-red-600">{errors.customer_type}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>
              {t('form.orgLabel')}{' '}
              <span className="font-normal text-muted">{t('form.orgOptional')}</span>
            </label>
            <input
              value={form.organization_name}
              onChange={update('organization_name')}
              placeholder={t('form.orgPlaceholder')}
              className={inputClass(false)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                {t('form.emailLabel')} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder={t('form.emailPlaceholder')}
                className={inputClass(errors.email)}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label className={labelClass}>
                {t('form.phoneLabel')} <span className="text-red-500">*</span>
              </label>
              <input
                value={form.phone}
                onChange={update('phone')}
                inputMode="tel"
                autoComplete="tel"
                placeholder={t('form.phonePlaceholder')}
                className={inputClass(errors.phone)}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>{t('form.serviceLabel')}</label>
            {selectedService ? (
              <input value={serviceName(selectedService, t)} disabled className={`${inputClass(false)} bg-[#F6EFE9] text-muted`} />
            ) : (
              <select
                value=""
                onChange={(e) => {
                  const found = services.find((s) => s.id === Number(e.target.value));
                  setSelectedService(found || null);
                }}
                className={inputClass(errors.service_id)}
              >
                <option value="">{t('form.servicePlaceholder')}</option>
                {sortServices(services, t, i18n.language).map((s) => (
                  <option key={s.id} value={s.id}>
                    {serviceName(s, t)}
                  </option>
                ))}
              </select>
            )}
            {errors.service_id && <p className="mt-1 text-xs text-red-600">{errors.service_id}</p>}
          </div>

          <div>
            <label className={labelClass}>
              {t('form.descLabel')} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={update('description')}
              rows={5}
              maxLength={2000}
              placeholder={t('form.descPlaceholder')}
              className={`${inputClass(errors.description)} resize-none`}
            />
            <div className="mt-1 flex justify-between">
              {errors.description ? (
                <p className="text-xs text-red-600">{errors.description}</p>
              ) : (
                <span />
              )}
              <span className="font-mono text-xs text-muted">{form.description.length}/2000</span>
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm text-body">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#EADFD7] text-brand focus:ring-brand"
            />
            <span>
              {t('form.privacyPrefix')}{' '}
              <Link to="/kebijakan-privasi" className="text-brand font-bold hover:underline">
                {t('form.privacyLink')}
              </Link>{' '}
              {t('form.privacySuffix')}
            </span>
          </label>
          {errors.agree && <p className="text-xs text-red-600 -mt-3">{errors.agree}</p>}
          {generalError && <p className="text-sm text-red-600">{generalError}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3.5 bg-brand text-white font-extrabold text-lg rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-60 shadow-lg shadow-brand/30"
          >
            {loading ? t('form.submitting') : t('form.submit')}
          </button>
        </form>
        </div>
      </section>

      <CTADarkSection />
      <VisitSection />
    </>
  );
}
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CTAVisitSection from '../../components/CTAVisitSection.jsx';
import EmailLink from '../../components/EmailLink.jsx';

export default function Kontak() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    navigate(`/form-pengajuan?name=${encodeURIComponent(form.name)}&email=${encodeURIComponent(form.email)}`);
  };

  const inputClass =
    'mt-1 w-full px-4 py-2.5 rounded-lg border border-[#EADFD7] text-sm text-dark-brown bg-cream focus:outline-none focus:ring-2 focus:ring-brand/50 focus:bg-white transition-colors';

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-light to-cream">
        <div className="max-w-[1184px] mx-auto px-6 lg:px-12 py-20 text-center">
          <span className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-[0.2em] uppercase text-brand">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            {t('kontak.kicker')}
          </span>
          <h1 className="mt-4 text-4xl lg:text-5xl font-extrabold text-dark-brown">{t('kontak.title')}</h1>
          <p className="mt-5 text-body max-w-2xl mx-auto leading-relaxed">{t('kontak.subtitle')}</p>
        </div>
      </section>

      <section className="max-w-[1184px] mx-auto px-6 lg:px-12 pb-12">
        <div className="rounded-2xl overflow-hidden border border-[#EADFD7] bg-[#EADFD7] min-h-72 relative">
          <iframe
            title={t('kontak.mapTitle')}
            src="https://www.google.com/maps?q=PT+Metanouva+Informatika,+Jl.+Gn.+Batu+Dalam+Komplek+Citra+Asri+Permai+No.C-26,+Pasirkaliki,+Cimahi+Utara,+Kota+Cimahi,+Jawa+Barat+40514&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 320 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
          <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-2xl border border-[#EADFD7] px-6 py-4 max-w-xs">
            <p className="text-sm font-extrabold text-dark-brown">{t('kontak.companyName')}</p>
            <p className="text-xs text-brand mt-0.5">{t('kontak.rating')}</p>
            <p className="text-xs text-muted mt-1">{t('kontak.mapAddress')}</p>
          </div>
        </div>
      </section>

      <section className="max-w-[1184px] mx-auto px-6 lg:px-12 pb-20 grid lg:grid-cols-2 gap-12">
        <div>
          <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-brand">
            {t('kontak.infoKicker')}
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-dark-brown">{t('kontak.infoTitle')}</h2>
          <div className="mt-7 space-y-4">
            <InfoCard icon="📍" title={t('kontak.locationTitle')} value={t('kontak.locationValue')} />
            <InfoCard icon="✉️" title={t('kontak.emailTitle')} value={<EmailLink email={t('kontak.emailValue')} className="font-bold text-dark-brown" />} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#EADFD7] shadow-lg p-8">
          <h2 className="text-xl font-extrabold text-dark-brown">{t('kontak.formTitle')}</h2>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-dark-brown">{t('kontak.nameLabel')}</label>
                <input value={form.name} onChange={update('name')} required placeholder={t('kontak.namePlaceholder')} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-bold text-dark-brown">{t('kontak.emailLabel')}</label>
                <input type="email" value={form.email} onChange={update('email')} required placeholder={t('kontak.emailPlaceholder')} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-dark-brown">{t('kontak.subjectLabel')}</label>
              <input value={form.subject} onChange={update('subject')} required placeholder={t('kontak.subjectPlaceholder')} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-bold text-dark-brown">{t('kontak.messageLabel')}</label>
              <textarea value={form.message} onChange={update('message')} required rows={5} placeholder={t('kontak.messagePlaceholder')} className={`${inputClass} resize-none`} />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full px-6 py-3.5 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {sending && <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
              {sending ? t('kontak.sending') : t('kontak.send')}
            </button>
            <p className="text-xs text-muted">
              {t('kontak.note')}{' '}
              <Link to="/form-pengajuan" className="text-brand font-bold hover:underline">
                {t('kontak.formLink')}
              </Link>.
            </p>
          </form>
        </div>
      </section>

      <CTAVisitSection hideSecondaryCta />
    </div>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="flex items-start gap-4 bg-white rounded-2xl border border-[#EADFD7] p-5 shadow-sm">
      <div className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center text-xl">{icon}</div>
      <div>
        <p className="text-sm font-bold text-muted">{title}</p>
        <p className="mt-0.5 font-bold text-dark-brown">{value}</p>
      </div>
    </div>
  );
}
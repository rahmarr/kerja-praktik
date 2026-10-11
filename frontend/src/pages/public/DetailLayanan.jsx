import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import client, { getErrorMessage } from '../../api/client.js';
import { serviceIcon } from '../../components/ServiceCard.jsx';
import CTAVisitSection from '../../components/CTAVisitSection.jsx';

const DEFAULT_REASONS = [
  { title: 'One-Stop Solution', desc: 'Dari konsultasi, pengembangan, hingga pemeliharaan dalam satu tim.' },
  { title: 'Fokus pada Pelanggan', desc: 'Setiap solusi dimulai dari kebutuhan dan tujuan bisnis Anda.' },
  { title: 'Komitmen', desc: 'Konsisten menjaga kualitas, waktu, dan hubungan jangka panjang.' },
  { title: 'Dukungan Berkelanjutan', desc: 'Pelatihan dan pemeliharaan menjaga solusi tetap sehat.' },
];

export default function DetailLayanan() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const locale = t(`serviceContent.${slug}`, { returnObjects: true });
  const hasLocale = slug && Array.isArray(locale) === false && locale && locale.name;

  useEffect(() => {
    client
      .get('/services')
      .then((res) => {
        const found = res.data.data.find((s) => s.slug === slug);
        if (found) setService(found);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-24 text-center text-muted">
        {t('detail.loading')}
      </section>
    );
  }

  if (notFound || !service) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-extrabold text-dark-brown">{t('detail.notFound')}</h1>
        <Link to="/layanan" className="mt-6 inline-block text-brand font-bold underline underline-offset-4">
          {t('detail.back')}
        </Link>
      </section>
    );
  }

  const displayName = hasLocale ? locale.name : service.name;
  const displayDesc = hasLocale ? locale.description : service.description;
  const reasons = hasLocale ? locale.reasons : DEFAULT_REASONS;

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-light to-cream">
        <div className="max-w-[1184px] mx-auto px-6 lg:px-12 py-16 grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative grid grid-cols-5 gap-4">
            <div className="col-span-3 rounded-2xl bg-white border border-[#EADFD7] min-h-[260px] flex items-center justify-center text-6xl text-body shadow-sm">
              {serviceIcon(service.slug)}
            </div>
            <div className="col-span-2 grid grid-rows-2 gap-4">
              <div className="rounded-2xl bg-white border border-[#EADFD7] min-h-[122px] flex items-center justify-center text-4xl text-body shadow-sm">
                🚀
              </div>
              <div className="rounded-2xl bg-[#2A1506]/[0.06] min-h-[122px] flex items-center justify-center font-mono text-xs font-bold text-brand tracking-widest p-3 text-center">
                {hasLocale ? locale.tagline : t('services').toUpperCase()}
              </div>
            </div>
          </div>
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-[0.2em] uppercase text-brand">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              {t('detail.kicker')}
            </span>
            <h1 className="mt-4 text-4xl lg:text-5xl font-extrabold text-dark-brown leading-tight">{displayName}</h1>
            <p className="mt-5 text-body leading-relaxed">{displayDesc}</p>
            {hasLocale && locale.bullets && (
              <ul className="mt-6 space-y-2">
                {locale.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-body">
                    <span className="mt-0.5 text-brand">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to={`/form-pengajuan?service=${service.slug}`}
                className="px-7 py-3.5 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/30"
              >
                {t('detail.submitThis')}
              </Link>
              <Link
                to="/kontak"
                className="px-7 py-3.5 border-2 border-dark-brown text-dark-brown font-bold rounded-lg hover:border-brand hover:text-brand transition-colors"
              >
                {t('detail.contact')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1184px] mx-auto px-6 lg:px-12 py-16 grid lg:grid-cols-2 gap-12">
        <div>
          <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-brand">
            {t('detail.advantages')}
          </span>
          <h2 className="mt-3 text-3xl lg:text-[36px] font-extrabold text-dark-brown">
            {t('detail.whyTitle')}
          </h2>
          <p className="mt-4 text-body leading-relaxed">{t('detail.whyText')}</p>
        </div>
        <div className="space-y-5">
          {reasons.map((r) => (
            <div key={r.title} className="flex gap-4 rounded-2xl bg-white border border-[#EADFD7] p-5">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-brand-light flex items-center justify-center text-2xl">
                🎯
              </div>
              <div>
                <h3 className="font-extrabold text-dark-brown">{r.title}</h3>
                <p className="mt-1 text-sm text-muted">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTAVisitSection />
    </div>
  );
}
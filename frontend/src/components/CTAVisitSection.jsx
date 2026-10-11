import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EmailLink from './EmailLink.jsx';

const MAP_SRC =
  'https://www.google.com/maps?q=PT+Metanouva+Informatika,+Jl.+Gn.+Batu+Dalam+Komplek+Citra+Asri+Permai+No.C-26,+Pasirkaliki,+Cimahi+Utara,+Kota+Cimahi,+Jawa+Barat+40514&output=embed';

export function CTADarkSection({ hideSecondaryCta = false }) {
  const { t } = useTranslation();
  return (
    <section className="bg-[#120804] text-white mt-8">
      <div className="max-w-[1184px] mx-auto px-6 lg:px-12 py-20 text-center">
        <h2 className="text-3xl lg:text-5xl font-extrabold leading-tight text-white">
          {t('home.ctaTitle1')}
          <br />
          {t('home.ctaTitle2')}
        </h2>
        <p className="mt-4 text-footer-text/70 max-w-xl mx-auto">{t('home.ctaSubtitle')}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            to="/form-pengajuan"
            className="px-7 py-3.5 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20"
          >
            {t('home.ctaPrimary')}
          </Link>
          {!hideSecondaryCta && (
          <Link
            to="/kontak"
            className="px-7 py-3.5 border-2 border-[#7a4a2d] text-footer-text font-bold rounded-lg hover:border-brand hover:text-brand transition-colors"
          >
            {t('home.ctaSecondary')}
          </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export function VisitSection() {
  const { t } = useTranslation();
  return (
    <section className="max-w-[1184px] mx-auto px-6 lg:px-12 py-16 grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-brand">
          {t('home.visitTitle')}
        </span>
        <h2 className="mt-3 text-3xl lg:text-[40px] font-extrabold text-dark-brown">{t('home.visitTitle')}</h2>
        <div className="mt-7 space-y-5 text-body">
          <p className="flex items-start gap-4">
            <span className="w-11 h-11 shrink-0 rounded-xl bg-brand-light flex items-center justify-center text-xl">📍</span>
            {t('home.visitAddress')}
          </p>
          <p className="flex items-start gap-4">
            <span className="w-11 h-11 shrink-0 rounded-xl bg-brand-light flex items-center justify-center text-xl">✉️</span>
            <EmailLink email={t('home.visitEmail')} />
          </p>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden border border-[#EADFD7] bg-[#EADFD7] min-h-72 flex items-center justify-center text-muted">
        <iframe
          title={t('kontak.mapTitle')}
          src={MAP_SRC}
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: 300 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full"
        />
      </div>
    </section>
  );
}

export default function CTAVisitSection({ hideSecondaryCta = false }) {
  return (
    <>
      <CTADarkSection hideSecondaryCta={hideSecondaryCta} />
      <VisitSection />
    </>
  );
}

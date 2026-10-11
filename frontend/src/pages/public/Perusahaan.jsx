import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { VisitSection } from '../../components/CTAVisitSection.jsx';

function Counter({ stat }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const num = stat.num;
            const duration = 1200;
            const start = performance.now();
            const tick = (now) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setValue(stat.display && eased >= 1 ? num : Math.round(num * eased));
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [stat.num, stat.display]);

  return (
    <div ref={ref}>
      <p className="text-5xl font-extrabold text-brand">
        {stat.display && value >= stat.num ? stat.display : `${value}${stat.suffix}`}
      </p>
      <p className="mt-2 text-sm text-footer-text/60">{stat.label}</p>
    </div>
  );
}

function toStat({ value, label }) {
  const raw = String(value);
  if (raw.includes('k')) {
    return { label, num: 1000, suffix: raw.includes('+') ? '+' : '', display: raw, suffixHidden: true };
  }
  const num = Number(raw.replace(/\D/g, '')) || 0;
  const suffix = raw.includes('%') ? '%' : raw.includes('+') ? '+' : '';
  return { label, num, suffix };
}

export default function Perusahaan() {
  const { t } = useTranslation();
  const stats = t('perusahaan.stats', { returnObjects: true });
  const values = t('perusahaan.values', { returnObjects: true });
  const reasons = t('perusahaan.reasons', { returnObjects: true });

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-light to-cream">
        <div className="max-w-[1184px] mx-auto px-6 lg:px-12 py-20 text-center">
          <span className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-[0.2em] uppercase text-brand">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            {t('perusahaan.kicker')}
          </span>
          <h1 className="mt-6 text-4xl lg:text-5xl font-extrabold text-dark-brown leading-tight max-w-4xl mx-auto">
            {t('perusahaan.title')}
          </h1>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              to="/layanan"
              className="px-7 py-3.5 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/30"
            >
              {t('perusahaan.servicesCta')}
            </Link>
            <Link
              to="/kontak"
              className="px-7 py-3.5 border-2 border-dark-brown text-dark-brown font-bold rounded-lg hover:border-brand hover:text-brand transition-colors"
            >
              {t('perusahaan.contactCta')}
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-[1184px] mx-auto px-6 lg:px-12 py-16 grid lg:grid-cols-2 gap-14 items-center">
        <div className="order-2 lg:order-1">
          <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-brand">
            {t('perusahaan.who')}
          </span>
          <h2 className="mt-3 text-3xl lg:text-[36px] font-extrabold text-dark-brown leading-tight">
            {t('perusahaan.aboutTitle')}
          </h2>
          <p className="mt-5 text-body leading-relaxed">{t('perusahaan.aboutText1')}</p>
          <p className="mt-4 text-body leading-relaxed">{t('perusahaan.aboutText2')}</p>
          <p className="mt-4 text-body leading-relaxed">{t('perusahaan.aboutText3')}</p>
          <p className="mt-4 text-body leading-relaxed">{t('perusahaan.aboutText4')}</p>
        </div>
        <div className="order-1 lg:order-2 rounded-2xl bg-white border border-[#EADFD7] h-72 p-8 flex items-center justify-center">
          <img src="/logo-primary.png" alt="Digitak" className="w-full max-w-[360px] h-auto" />
        </div>
      </section>

      <section className="bg-[#120804] text-white">
        <div className="max-w-[1184px] mx-auto px-6 lg:px-12 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <Counter key={i} stat={toStat(s)} />
          ))}
        </div>
      </section>

      <section className="max-w-[1184px] mx-auto px-6 lg:px-12 py-16 text-center">
        <h2 className="text-3xl font-extrabold text-dark-brown">{t('perusahaan.valuesTitle')}</h2>
        <p className="mt-4 max-w-3xl mx-auto text-body leading-relaxed">{t('perusahaan.valuesDesc')}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {values.map((v) => (
            <div key={v.name} className="w-36 py-6 rounded-2xl bg-brand-light text-center hover:bg-brand hover:text-white transition-colors">
              <div className="text-3xl">{v.icon}</div>
              <p className="mt-2 font-extrabold text-dark-brown">{v.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-[#EADFD7]">
        <div className="max-w-[1184px] mx-auto px-6 lg:px-12 py-16">
          <h2 className="text-3xl font-extrabold text-dark-brown text-center">{t('perusahaan.reasonsTitle')}</h2>
          <p className="mt-4 max-w-3xl mx-auto text-center text-body leading-relaxed">{t('perusahaan.reasonsDesc')}</p>
          <div className="mt-10 grid md:grid-cols-3 gap-8">
            {reasons.map((r) => (
              <div key={r.title} className="bg-cream rounded-2xl border border-[#EADFD7] p-8 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-light flex items-center justify-center text-3xl">
                  {r.icon}
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-dark-brown">{r.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#120804] text-white">
        <div className="max-w-[1184px] mx-auto px-6 lg:px-12 py-16 text-center">
          <h2 className="text-3xl lg:text-[36px] font-extrabold max-w-3xl mx-auto leading-tight">
            {t('perusahaan.ctaTitle')}
          </h2>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              to="/kontak"
              className="px-7 py-3.5 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/30"
            >
              {t('perusahaan.ctaContact')}
            </Link>
            <Link
              to="/form-pengajuan"
              className="px-7 py-3.5 border-2 border-white/70 text-white font-bold rounded-lg hover:border-brand hover:text-brand transition-colors"
            >
              {t('perusahaan.ctaSubmit')}
            </Link>
          </div>
        </div>
      </section>

      <VisitSection />
    </div>
  );
}
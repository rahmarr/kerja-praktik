import { useTranslation } from 'react-i18next';

export default function LegalPage({ kicker, title, subtitle, sectionsKey }) {
  const { t, i18n } = useTranslation();
  const sections = t(sectionsKey, { returnObjects: true, defaultValue: [] });
  const lang = i18n.resolvedLanguage || i18n.language || 'id';
  const updated = new Date().toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-light to-cream">
        <div className="max-w-[1184px] mx-auto px-6 lg:px-12 py-20 text-center">
          <span className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-[0.2em] uppercase text-brand">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            {t(kicker)}
          </span>
          <h1 className="mt-4 text-4xl lg:text-5xl font-extrabold text-dark-brown">{t(title)}</h1>
          <p className="mt-5 text-body max-w-3xl mx-auto leading-relaxed">{t(subtitle)}</p>
        </div>
      </section>

      <section className="max-w-[1184px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="max-w-3xl mx-auto space-y-10">
          {sections.length === 0
            ? null
            : sections.map((sec, i) => (
                <div key={i}>
                  <h2 className="text-xl lg:text-2xl font-extrabold text-dark-brown flex items-center gap-3">
                    <span className="text-brand">{String(i + 1).padStart(2, '0')}.</span>
                    {sec.title}
                  </h2>
                  <p className="mt-3 text-body leading-relaxed">{sec.body}</p>
                </div>
              ))}
          <p className="text-sm text-muted border-t border-[#EADFD7] pt-6">
            {t('legal.lastUpdated', { date: updated })}
          </p>
        </div>
      </section>
    </div>
  );
}
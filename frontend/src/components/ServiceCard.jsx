import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ICONS = {
  it: '🖥️',
  training: '🎓',
  integration: '🔗',
  erp: '📦',
  software: '💻',
  consulting: '🧠',
  default: '🛠️',
};

const SLUG_TO_KEY = {
  'it-consulting': 'itConsulting',
  'software-development': 'softwareDevelopment',
  'erp-solution': 'erpSolution',
  'system-integration': 'systemIntegration',
  'it-infrastructure': 'itInfrastructure',
  'training-maintenance': 'trainingMaintenance',
};

export function serviceIcon(slug) {
  if (!slug) return ICONS.default;
  if (slug.includes('it-infrastr')) return ICONS.it;
  if (slug.includes('training')) return ICONS.training;
  if (slug.includes('integrat')) return ICONS.integration;
  if (slug.includes('erp')) return ICONS.erp;
  if (slug.includes('software')) return ICONS.software;
  if (slug.includes('consult')) return ICONS.consulting;
  return ICONS.default;
}

export function serviceName(service, t) {
  const key = SLUG_TO_KEY[service.slug];
  if (key) {
    const locale = t(`serviceContent.${key}`, { returnObjects: true });
    if (locale && locale.name) return locale.name;
  }
  return service.name;
}

export function sortServices(list, t, lang) {
  return [...list].sort((a, b) => serviceName(a, t).localeCompare(serviceName(b, t), lang));
}

export default function ServiceCard({ service }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-2xl border border-[#EADFD7] p-6 flex flex-col shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
      <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center text-2xl">
        {serviceIcon(service.slug)}
      </div>
      <h3 className="mt-4 font-extrabold text-lg text-dark-brown">{serviceName(service, t)}</h3>
      <p className="mt-2 text-sm text-muted leading-relaxed flex-1">{service.description}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          to={`/form-pengajuan?service=${service.slug}`}
          className="px-4 py-2 text-brand text-sm font-bold rounded-lg bg-brand-light hover:bg-brand hover:text-white transition-colors"
        >
          {t('serviceCard.submit')}
        </Link>
        <Link
          to={`/layanan/${service.slug}`}
          className="px-4 py-2 text-sm font-bold text-dark-brown rounded-lg border border-[#EADFD7] hover:border-brand hover:text-brand transition-colors"
        >
          {t('serviceCard.details')}
        </Link>
      </div>
    </div>
  );
}
import { useTranslation } from 'react-i18next';

export default function PortfolioCard({ project, index, onOpen }) {
  const { t } = useTranslation();
  const year = project.created_at ? new Date(project.created_at).getFullYear() : '';
  return (
    <div className="group bg-white rounded-2xl border border-[#EADFD7] p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
      <div className="flex items-start justify-between gap-4">
        <span className="text-3xl font-extrabold text-[#EADFD7] group-hover:text-brand transition-colors">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center text-brand">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H9M17 7v8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      <h3 className="mt-4 font-extrabold text-lg leading-snug text-dark-brown">{project.title}</h3>
      <p className="mt-1 font-mono text-xs text-muted">{year}</p>
      {project.body && (
        <p className="mt-2 text-sm text-muted line-clamp-2">{project.body}</p>
      )}
      {onOpen ? (
        <button
          type="button"
          onClick={() => onOpen(project.slug)}
          className="mt-4 inline-block text-sm font-bold text-brand hover:underline"
        >
          {t('portofolio.details')} →
        </button>
      ) : (
        <span className="mt-4 inline-block text-sm font-bold text-brand">
          {t('portofolio.details')} →
        </span>
      )}
    </div>
  );
}
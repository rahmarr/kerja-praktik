import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import client, { getErrorMessage } from '../../api/client.js';
import PortfolioCard from '../../components/PortfolioCard.jsx';
import CTAVisitSection from '../../components/CTAVisitSection.jsx';
import { CLIENT_LOGOS } from '../../data/clientLogos.js';

const PAGE_LIMIT = 10;

const TRUST_LOGOS = Object.values(CLIENT_LOGOS);

export default function Portofolio() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const slug = searchParams.get('slug') || '';
  const portfolioRef = useRef(null);

  const scrollToPortfolio = () => {
    portfolioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeYear, setActiveYear] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    client
      .get('/contents', { params: { category: 'portfolio' } })
      .then((res) =>
        setProjects(
          [...res.data.data].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at) || a.id - b.id
          )
        )
      )
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const years = useMemo(() => {
    const set = new Set(projects.map((p) => (p.created_at ? new Date(p.created_at).getFullYear() : null)));
    return [...set].filter((y) => y !== null).sort((a, b) => b - a);
  }, [projects]);

  const visible = useMemo(() => {
    if (!activeYear) return projects;
    return projects.filter((p) => new Date(p.created_at).getFullYear() === activeYear);
  }, [projects, activeYear]);

  const selected = useMemo(() => projects.find((p) => p.slug === slug) || null, [projects, slug]);

  const visibleCount = showAll ? visible : visible.slice(0, PAGE_LIMIT);

  const openDetail = (projectSlug) => setSearchParams({ slug: projectSlug });

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-light to-cream">
        <div className="max-w-[1184px] mx-auto px-6 lg:px-12 py-20 text-center">
          <span className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-[0.2em] uppercase text-brand">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            {t('portofolio.kicker')}
          </span>
          <h1 className="mt-4 text-4xl lg:text-5xl font-extrabold text-dark-brown leading-tight">
            {t('portofolio.title1')}
            <br />
            {t('portofolio.title2')}
          </h1>
          <p className="mt-5 text-body max-w-2xl mx-auto leading-relaxed">{t('portofolio.subtitle')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={scrollToPortfolio}
              className="px-7 py-3.5 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/30"
            >
              {t('portofolio.cta')}
            </button>
            <Link
              to="/perusahaan"
              className="px-7 py-3.5 border-2 border-dark-brown text-dark-brown font-bold rounded-lg hover:border-brand hover:text-brand transition-colors"
            >
              {t('portofolio.about')}
            </Link>
          </div>
        </div>
      </section>

      <section ref={portfolioRef} className="max-w-[1184px] mx-auto px-6 lg:px-12 py-16 grid lg:grid-cols-4 gap-10">
        <aside className="lg:col-span-1">
          <h2 className="font-extrabold text-lg text-dark-brown">{t('portofolio.aside')}</h2>
          <div className="mt-4 flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-1 [-webkit-overflow-scrolling:touch]">
            <button
              type="button"
              onClick={() => {
                setActiveYear(null);
                setShowAll(false);
                if (slug) setSearchParams({});
              }}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-colors lg:text-left ${
                activeYear === null ? 'bg-brand text-white' : 'text-body hover:bg-brand-light'
              }`}
            >
              {t('portofolio.allYears')}
            </button>
            {years.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => {
                  setActiveYear(y);
                  setShowAll(false);
                }}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-colors lg:text-left ${
                  activeYear === y ? 'bg-brand text-white' : 'text-body hover:bg-brand-light'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </aside>

        <div className="lg:col-span-3">
          <h3 className="text-xl font-extrabold text-dark-brown">
            {selected
              ? t('portofolio.heading', { name: selected.title })
              : activeYear
                ? t('portofolio.yearHeading', { year: activeYear })
                : t('portofolio.heading', { name: t('portofolio.allYears') })}
          </h3>

          {loading ? (
            <p className="mt-6 text-muted">{t('portofolio.loading')}</p>
          ) : error ? (
            <p className="mt-6 text-red-600">{error}</p>
          ) : selected ? (
            <SingleProject project={selected} onClose={() => setSearchParams({})} />
          ) : (
            <>
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                {visibleCount.map((project) => (
                  <PortfolioCard
                    key={project.id}
                    project={project}
                    index={visibleCount.indexOf(project)}
                    onOpen={openDetail}
                  />
                ))}
                {visible.length === 0 && <p className="text-muted">{t('portofolio.empty')}</p>}
              </div>
              {!showAll && visible.length > PAGE_LIMIT && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAll(true)}
                    className="px-7 py-3.5 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/30"
                  >
                    {t('portofolio.showAll')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="bg-white border-y border-[#EADFD7]">
        <div className="max-w-[1184px] mx-auto px-6 lg:px-12 py-14 text-center">
          <h2 className="text-2xl lg:text-3xl font-extrabold leading-tight text-dark-brown">
            {t('portofolio.trustTitle')}
          </h2>
          <div className="mt-10 whitespace-nowrap overflow-hidden">
            <div className="inline-flex animate-marquee items-center gap-14">
              {[...TRUST_LOGOS, ...TRUST_LOGOS].map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt=""
                  className="h-10 lg:h-12 w-auto object-contain"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTAVisitSection />
    </div>
  );
}

function SingleProject({ project, onClose }) {
  const { t } = useTranslation();
  return (
    <div className="mt-6 bg-white rounded-2xl border border-[#EADFD7] p-8 shadow-sm">
      <p className="font-mono text-xs font-bold text-brand uppercase tracking-widest">
        {t('portofolio.kicker')} {new Date(project.created_at).getFullYear()}
      </p>
      <h3 className="mt-2 text-2xl font-extrabold text-dark-brown">{project.title}</h3>
      <p className="mt-4 text-body leading-relaxed whitespace-pre-line">{project.body}</p>
      <button
        type="button"
        onClick={onClose}
        className="mt-7 inline-flex items-center gap-2 text-brand font-bold hover:text-brand-dark transition-colors"
      >
        {t('portofolio.back')}
      </button>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import client, { getErrorMessage } from '../../api/client.js';
import ServiceCard, { sortServices } from '../../components/ServiceCard.jsx';
import { CTADarkSection, VisitSection } from '../../components/CTAVisitSection.jsx';
import { CLIENT_LOGOS } from '../../data/clientLogos.js';

const TECH_STACK = ['Java', 'Rails', 'React', '.NET', 'C#', 'Android', 'Vue.js', 'Go', 'Python'];
const INDUSTRIES = ['Sektor Publik', 'Keuangan', 'Pendidikan', 'Kesehatan', 'Utilitas'];
const CLIENTS = [
  'Dinas Pengelolaan Keuangan dan Asset Daerah Kota Bandung',
  'RSUD Kota Cilegon',
  'Kementerian Perencanaan Pembangunan Nasional (BAPPENAS)',
  'Badan Narkotika Nasional',
  'Direktorat Jenderal Pengelolaan Utang, Kementerian Keuangan',
  'PT. Metra Digital Media, Jakarta',
  'PT. Infomedia Nusantara',
  'Politeknik Manufaktur Bandung',
  'Kementerian Perhubungan',
  'Direktorat Transportasi Sungai, Danau dan Penyeberangan, Kementerian Perhubungan Republik Indonesia',
  'Direktorat Jenderal Perkeretaapian, Kementerian Perhubungan Republik Indonesia',
  'Direktorat Jenderal Kekayaan Intelektual, Kementerian Hukum dan Hak Asasi Manusia Republik Indonesia',
  'Sekretariat Badan Standardisasi dan Kebijakan Jasa Industri, Kementerian Perindustrian Republik Indonesia',
  'Radio Republik Indonesia',
  'Universitas Pendidikan Indonesia, Bandung',
  'PT PLN - Jakarta',
  'Badan Koordinasi Penanaman Modal',
  'Direktorat Pengembangan Investasi Ekonomi Desa Daerah Tertinggal dan Transmigrasi, Kementerian Desa, Pembangunan Daerah Tertinggal Republik Indonesia',
  'PT. Bank Pembangunan Daerah Jawa Barat dan Banten, Tbk',
  'PT. Patra Drilling Contractor, Jakarta',
  'Kementerian Komunikasi dan Informatika Republik Indonesia',
  'Kementerian Pekerjaan Umum dan Perumahan Rakyat Republik Indonesia',
  'Perumda Pasar Jaya Provinsi DKI Jakarta',
  'REMITPRO DIGITAL',
  'PT. Ziebar Indonesia, Bandung',
  'Direktorat Jenderal Pendidikan Tinggi, Riset, dan Teknologi (Ditjen Dikti), Kementerian Pendidikan dan Kebudayaan',
  'PT Semesta Hukum Nusantara, Jakarta',
  'Dinas Pendidikan Kota Bandung',
  'Otoritas Jasa Keuangan Indonesia',
  'Komisi Pemilihan Umum Jawa Barat',
  'TRON PT. Teknologi Rancang Olah Nusantara',
  'PDI Perjuangan Bidang Seni Budaya Partai Demokrasi Perjuangan Jawa Barat',
  'Badan Perencanaan Pembangunan Daerah Kab. Pegunungan Bintan Provinsi Papua',
  'PT. Sparta Guna Sentosa',
  'Dinas Pekerjaan Umum Prov. Gorontalo',
  'PT. Kyowa Tangguh Mandiri Indonesia',
  'Sawangan Golf Hotel And Resort PT. Pakuan Tbk',
  'Badan Informasi Geospasial',
  'Kementerian Koordinator Bidang Pembangunan Manusia dan Kebudayaan',
  'Dinas Bina Marga dan Pengairan Kota Bandung',
  'PT. Pindad (Persero)',
  'Dinas Kearsipan dan Perpustakaan Kabupaten Bandung Barat',
  'Jawa Barat',
  'Badan Kepegawaian Daerah Kota Bandung',
  'Dapen Telkom',
  'Setda Kota Bandung',
  'SKK MIGAS',
].sort((a, b) => a.localeCompare(b));

const CLIENT_LOGO_SRCS = CLIENTS.filter((c) => CLIENT_LOGOS[c]).map((c) => CLIENT_LOGOS[c]);

export default function Home() {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    client
      .get('/services')
      .then((res) => setServices(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <HeroSection />
      <AskitSection />
      <AboutSection />
      <ServicesSection services={services} loading={loading} error={error} t={t} lang={i18n.language} />
      <TechStackSection />
      <ClientTrustSection />
      <ValuesSection />
      <IndustriesSection />
      <CTADarkSection />
      <VisitSection />
      {error && <p className="text-center text-sm text-red-600 pb-8">{error}</p>}
    </div>
  );
}

function HeroSection() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blush via-cream to-brand-light">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-brand/10 blur-3xl" />
      <div className="max-w-[1184px] mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-[0.2em] uppercase text-brand">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            {t('home.heroKicker')}
          </span>
          <h1 className="mt-5 text-4xl lg:text-[56px] lg:leading-[1.08] font-extrabold text-dark-brown text-center">
            {t('home.heroTitle1')}
            <br />
            {t('home.heroTitle2')} <span className="text-brand">{t('home.heroDigi')}</span>
          </h1>
          <p className="mt-6 text-lg text-body leading-relaxed max-w-xl text-center mx-auto">{t('home.heroSubtitle')}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              to="/form-pengajuan"
              className="px-7 py-3.5 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/30"
            >
              {t('home.heroCta1')}
            </Link>
            <Link
              to="/perusahaan"
              className="px-7 py-3.5 border-2 border-dark-brown text-dark-brown font-bold rounded-lg hover:border-brand hover:text-brand transition-colors"
            >
              {t('home.heroCta2')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function AskitSection() {
  const { t } = useTranslation();
  const values = t('home.askit', { returnObjects: true });
  const slides = Array.isArray(values) ? values : [];
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (count < 2 || paused) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(timer);
  }, [count, paused]);

  const go = (next) => setIndex(((next % count) + count) % count);

  if (count === 0) return null;

  return (
    <section className="bg-white border-b border-[#EADFD7]">
      <div className="max-w-[1184px] mx-auto px-6 lg:px-12 py-16 text-center">
        <h2 className="text-3xl lg:text-[40px] font-extrabold text-dark-brown">{t('home.askitTitle')}</h2>
        <p className="mt-3 font-mono text-xs font-bold tracking-[0.2em] uppercase text-brand">ASK IT</p>

        <div
          className="relative mt-10 mx-auto max-w-3xl overflow-hidden rounded-2xl border border-[#EADFD7] bg-cream"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((v) => (
              <div key={v.name} className="w-full shrink-0 px-8 py-12 sm:px-14">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-light flex items-center justify-center text-4xl">
                  {v.icon}
                </div>
                <h3 className="mt-5 text-2xl font-extrabold text-dark-brown">{v.name}</h3>
                <p className="mt-3 text-body leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous"
                onClick={() => go(index - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#EADFD7] text-dark-brown font-bold hover:bg-brand hover:text-white transition-colors shadow-sm"
              >
                ◀
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => go(index + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#EADFD7] text-dark-brown font-bold hover:bg-brand hover:text-white transition-colors shadow-sm"
              >
                ▶
              </button>
              <div className="flex justify-center gap-2 pb-6">
                {slides.map((v, i) => (
                  <button
                    key={v.name}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-2.5 rounded-full transition-all ${
                      i === index ? 'w-7 bg-brand' : 'w-2.5 bg-[#EADFD7] hover:bg-brand-light'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const { t } = useTranslation();
  return (
    <section className="max-w-[1184px] mx-auto px-6 lg:px-12 py-20">
      <div>
        <h2 className="mt-3 text-3xl lg:text-[40px] lg:leading-tight font-extrabold text-dark-brown">
          {t('home.aboutTitle')}
        </h2>
        <p className="mt-5 text-body leading-relaxed">{t('home.aboutText')}</p>
        <Link
          to="/perusahaan"
          className="mt-7 inline-flex items-center gap-2 text-brand font-bold hover:text-brand-dark transition-colors"
        >
          {t('home.aboutLink')}
        </Link>
      </div>
    </section>
  );
}

function ServicesSection({ services, loading, error, t, lang }) {
  return (
    <section className="bg-white border-y border-[#EADFD7]">
      <div className="max-w-[1184px] mx-auto px-6 lg:px-12 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-brand">
              {t('home.servicesKicker')}
            </span>
            <h2 className="mt-2 text-3xl lg:text-[40px] font-extrabold text-dark-brown">
              {t('home.servicesTitle')}
            </h2>
          </div>
          <Link to="/layanan" className="text-brand font-bold hover:text-brand-dark transition-colors">
            {t('nav.services')} →
          </Link>
        </div>
        {loading ? (
          <p className="mt-10 text-muted">{t('home.servicesLoading')}</p>
        ) : error ? (
          <p className="mt-10 text-red-600">{error}</p>
        ) : (
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortServices(services, t, lang).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TechStackSection() {
  const { t } = useTranslation();
  const items = [...TECH_STACK, ...TECH_STACK];
  return (
    <section className="bg-footer text-white overflow-hidden">
      <div className="max-w-[1184px] mx-auto px-6 lg:px-12 py-16">
        <p className="text-center font-mono text-xs font-bold tracking-[0.2em] uppercase text-footer-text/70">
          {t('home.techTitle')}
        </p>
        <div className="mt-10 overflow-hidden whitespace-nowrap">
          <div className="inline-flex animate-marquee items-center gap-14">
            {items.map((tech, i) => (
              <span
                key={`${tech}-${i}`}
                className="text-3xl lg:text-5xl font-extrabold text-[#4d2410] hover:text-brand transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ClientTrustSection() {
  const { t } = useTranslation();
  return (
    <section className="bg-white border-b border-[#EADFD7]">
      <div className="max-w-[1184px] mx-auto py-16">
        <h2 className="text-3xl lg:text-[40px] font-extrabold text-center text-dark-brown">{t('home.clientsTitle')}</h2>
        <p className="mt-3 text-body/70 text-center px-6">{t('home.clientsSubtitle')}</p>
        <div className="mt-10 whitespace-nowrap overflow-hidden">
          <div className="inline-flex animate-marquee items-center gap-14">
            {[...CLIENT_LOGO_SRCS, ...CLIENT_LOGO_SRCS].map((src, i) => (
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
  );
}

function ValuesSection() {
  const { t } = useTranslation();
  const values = [
    { icon: '🧩', title: t('home.valueOneTitle'), desc: t('home.valueOneDesc') },
    { icon: '🤝', title: t('home.valueTwoTitle'), desc: t('home.valueTwoDesc') },
    { icon: '✅', title: t('home.valueThreeTitle'), desc: t('home.valueThreeDesc') },
  ];
  return (
    <section className="max-w-[1184px] mx-auto px-6 lg:px-12 py-16">
      <h2 className="text-3xl lg:text-[40px] font-extrabold text-dark-brown text-center">
        {t('home.valuesTitle')}
      </h2>
      <div className="mt-12 grid md:grid-cols-3 gap-8">
        {values.map((v) => (
          <div key={v.title} className="text-center rounded-2xl bg-white border border-[#EADFD7] p-8 hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-light flex items-center justify-center text-3xl">
              {v.icon}
            </div>
            <h3 className="mt-5 text-lg font-extrabold text-dark-brown">{v.title}</h3>
            <p className="mt-2 text-sm text-muted">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function IndustriesSection() {
  const { t } = useTranslation();
  return (
    <section className="max-w-[1184px] mx-auto px-6 lg:px-12 py-16">
      <h2 className="text-2xl lg:text-3xl font-extrabold text-dark-brown text-center">
        {t('home.industriesTitle')}
      </h2>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {INDUSTRIES.map((i) => (
          <span
            key={i}
            className="px-5 py-2 rounded bg-brand-light border border-[#F5C9A1] text-sm font-bold text-brand-deep"
          >
            {i}
          </span>
        ))}
      </div>
    </section>
  );
}
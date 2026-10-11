import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import client, { getErrorMessage } from '../../api/client.js';
import ServiceCard, { sortServices } from '../../components/ServiceCard.jsx';
import CTAVisitSection from '../../components/CTAVisitSection.jsx';
import { CLIENT_LOGOS } from '../../data/clientLogos.js';

const TECH = ['Java', 'Rails', 'React', '.NET', 'C#', 'Android', 'Vue.js', 'Go', 'Python'];
const CLIENT_INSTITUTIONS = [
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

const CLIENT_LOGO_SRCS = CLIENT_INSTITUTIONS.filter((c) => CLIENT_LOGOS[c]).map((c) => CLIENT_LOGOS[c]);

export default function Layanan() {
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
      <section className="bg-gradient-to-b from-brand-light to-cream">
        <div className="max-w-[1184px] mx-auto px-6 lg:px-12 py-20 text-center">
          <span className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-[0.2em] uppercase text-brand">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            {t('layanan.kicker')}
          </span>
          <h1 className="mt-4 text-4xl lg:text-5xl font-extrabold text-dark-brown">{t('layanan.title')}</h1>
          <p className="mt-5 text-body max-w-2xl mx-auto leading-relaxed">{t('layanan.subtitle')}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              to="/form-pengajuan"
              className="px-7 py-3.5 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/30"
            >
              {t('layanan.ctaPrimary')}
            </Link>
            <Link
              to="/perusahaan"
              className="px-7 py-3.5 border-2 border-dark-brown text-dark-brown font-bold rounded-lg hover:border-brand hover:text-brand transition-colors"
            >
              {t('layanan.ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-[1184px] mx-auto px-6 lg:px-12 py-16">
        <p className="text-lg text-body leading-relaxed">{t('layanan.aboutText')}</p>
      </section>

      <section className="bg-white border-y border-[#EADFD7]">
        <div className="max-w-[1184px] mx-auto px-6 lg:px-12 py-16">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-dark-brown text-center">
            {t('layanan.listTitle')}
          </h2>
          {loading ? (
            <p className="mt-8 text-center text-muted">{t('layanan.loading')}</p>
          ) : error ? (
            <p className="mt-8 text-center text-red-600">{error}</p>
          ) : (
            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortServices(services, t, i18n.language).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white border-y border-[#EADFD7] overflow-hidden">
        <div className="max-w-[1184px] mx-auto px-6 lg:px-12 py-14 text-center">
          <p className="font-mono text-xs font-bold tracking-widest text-brand uppercase">
            {t('layanan.techTitle')}
          </p>
          <div className="mt-8 whitespace-nowrap overflow-hidden">
            <div className="inline-flex animate-marquee items-center gap-10">
              {[...TECH, ...TECH].map((t2, i) => (
                <span
                  key={`${t2}-${i}`}
                  className="text-3xl lg:text-5xl font-extrabold text-[#4d2410] hover:text-brand transition-colors"
                >
                  {t2}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-[#EADFD7]">
        <div className="max-w-[1184px] mx-auto py-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-dark-brown">{t('layanan.clientsTitle')}</h2>
          <p className="mt-3 text-body/70 text-center px-6">{t('layanan.clientsSubtitle')}</p>
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

      <CTAVisitSection />
    </div>
  );
}
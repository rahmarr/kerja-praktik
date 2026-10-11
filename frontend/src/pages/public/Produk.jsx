import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import client, { getErrorMessage } from '../../api/client.js';
import { CTADarkSection, VisitSection } from '../../components/CTAVisitSection.jsx';
import { CLIENT_LOGOS } from '../../data/clientLogos.js';

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
];

function productExcerpt(body) {
  if (!body) return '';
  const first = body.split('\n\n')[0].trim();
  return first.length < body.length ? first : body;
}

export default function Produk() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    client
      .get('/contents', { params: { category: 'product' } })
      .then((res) => setProducts(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.body.style.overflow = detail ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [detail]);

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-light to-cream">
        <div className="max-w-[1184px] mx-auto px-6 lg:px-12 py-20 text-center">
          <span className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-[0.2em] uppercase text-brand">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            {t('produk.kicker')}
          </span>
          <h1 className="mt-4 text-4xl lg:text-5xl font-extrabold text-dark-brown">{t('produk.title')}</h1>
          <p className="mt-5 text-body max-w-2xl mx-auto leading-relaxed">{t('produk.subtitle')}</p>
        </div>
      </section>

      <section className="max-w-[1184px] mx-auto px-6 lg:px-12 py-8 pb-16">
        <div className="flex flex-wrap gap-2">
          <span className="px-4 py-1.5 rounded font-mono text-xs font-bold tracking-widest text-brand bg-brand-light">
            {t('produk.tag')}
          </span>
        </div>

        {loading ? (
          <p className="text-center text-muted py-10">{t('produk.loading')}</p>
        ) : error ? (
          <p className="text-center text-red-600 py-10">{error}</p>
        ) : products.length === 0 ? (
          <FallbackProduct onReadMore={() => setDetail({ title: t('produk.fallbackTitle'), body: t('produk.fallbackDesc') })} />
        ) : (
          <div className="space-y-10">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-[#EADFD7] shadow-sm overflow-hidden md:grid md:grid-cols-5"
              >
                <div className="md:col-span-5 p-8">
                  <span className="inline-block px-3 py-1 rounded font-mono text-xs font-bold tracking-widest text-brand bg-brand-light">
                    {t('produk.appBadge')}
                  </span>
                  <h2 className="mt-3 text-2xl font-extrabold text-dark-brown">{product.title}</h2>
                  <p className="mt-3 text-body leading-relaxed whitespace-pre-line">{productExcerpt(product.body)}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <Link
                      to="/kontak"
                      className="px-5 py-2.5 bg-brand text-white text-sm font-bold rounded-lg hover:bg-brand-dark transition-colors"
                    >
                      {t('produk.contactNow')}
                    </Link>
                    <Link
                      to="/form-pengajuan"
                      className="text-sm font-bold text-dark-brown underline underline-offset-4 hover:text-brand transition-colors"
                    >
                      {t('produk.submitProject')}
                    </Link>
                    <span className="text-border">•</span>
                    <button
                      type="button"
                      onClick={() => setDetail(product)}
                      className="text-sm font-bold text-brand cursor-pointer hover:underline underline-offset-4"
                    >
                      {t('produk.readMore')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {detail && <ProductModal product={detail} onClose={() => setDetail(null)} />}

      <TrustBand />
      <CTADarkSection />
      <VisitSection />
    </div>
  );
}

function FallbackProduct({ onReadMore }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-2xl border border-[#EADFD7] shadow-sm overflow-hidden md:grid md:grid-cols-5">
      <div className="md:col-span-5 p-8">
        <span className="inline-block px-3 py-1 rounded font-mono text-xs font-bold tracking-widest text-brand bg-brand-light">
          {t('produk.appBadge')}
        </span>
        <h2 className="mt-3 text-2xl font-extrabold text-dark-brown">{t('produk.fallbackTitle')}</h2>
        <p className="mt-3 text-body leading-relaxed">{t('produk.fallbackDesc')}</p>
        <ul className="mt-4 space-y-2 text-sm text-body">
          {[0, 1, 2].map((i) => (
            <li key={i}>• {t(`produk.features.${i}`)}</li>
          ))}
        </ul>
        <span className="mt-5 inline-block px-4 py-1.5 rounded font-mono text-xs font-bold text-brand bg-brand-light">
          {t('produk.multiPlatform')}
        </span>
        <div className="mt-6 flex gap-4">
          <Link
            to="/kontak"
            className="px-5 py-2.5 bg-brand text-white text-sm font-bold rounded-lg hover:bg-brand-dark transition-colors"
          >
            {t('produk.contactNow')}
          </Link>
          <button
            type="button"
            onClick={onReadMore}
            className="text-sm font-bold text-brand hover:underline underline-offset-4"
          >
            {t('produk.readMore')}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductModal({ product, onClose }) {
  const { t } = useTranslation();
  const close = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={close} className="absolute inset-0 bg-dark/60" />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-7">
          <span className="inline-block px-3 py-1 rounded font-mono text-xs font-bold tracking-widest text-brand bg-brand-light">
            {t('produk.appBadge')}
          </span>
          <h3 className="mt-3 text-2xl font-extrabold text-dark-brown">{product.title}</h3>
          <p className="mt-4 text-sm text-body leading-relaxed whitespace-pre-line">{product.body}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/kontak"
              className="px-5 py-2.5 bg-brand text-white text-sm font-bold rounded-lg hover:bg-brand-dark transition-colors"
            >
              {t('produk.contactNow')}
            </Link>
            <Link
              to="/form-pengajuan"
              className="px-5 py-2.5 text-sm font-bold text-dark-brown rounded-lg border border-[#EADFD7] hover:border-brand hover:text-brand transition-colors"
            >
              {t('produk.submitProject')}
            </Link>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full text-sm font-bold text-brand underline underline-offset-4 hover:text-brand-dark"
          >
            {t('produk.close')}
          </button>
        </div>
      </div>
    </div>
  );
}

function TrustBand() {
  const { t } = useTranslation();
  return (
    <section className="bg-gradient-to-b from-brand-light to-cream">
      <div className="max-w-[1184px] mx-auto px-6 lg:px-12 py-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex px-4 py-1.5 rounded font-mono text-xs font-bold tracking-widest text-brand bg-brand-light border border-[#EADFD7]">
            {t('produk.trustBadge')}
          </span>
          <h2 className="mt-5 text-3xl lg:text-4xl font-extrabold leading-tight text-dark-brown">
            {t('produk.trustTitle')}
          </h2>
          <p className="mt-4 text-body leading-relaxed">{t('produk.trustText')}</p>
          <Link
            to="/kontak"
            className="mt-7 inline-flex items-center gap-2 px-7 py-3.5 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors"
          >
            {t('produk.trustCta')}
          </Link>
        </div>
        <div>
          <p className="font-mono text-xs text-muted tracking-widest uppercase">{t('produk.partnerTitle')}</p>
          <div className="mt-6 overflow-hidden">
            <div className="inline-flex animate-marquee-slow items-center gap-14">
              {[...CLIENTS.filter((c) => CLIENT_LOGOS[c]), ...CLIENTS.filter((c) => CLIENT_LOGOS[c])].map(
                (c, i) => (
                  <img
                    key={`${c}-${i}`}
                    src={CLIENT_LOGOS[c]}
                    alt=""
                    className="h-10 lg:h-12 w-auto object-contain"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
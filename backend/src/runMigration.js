import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';
import db from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SERVICES = [
  {
    name: 'IT Infrastructure',
    slug: 'it-infrastructure',
    description:
      'Menyediakan layanan pengelolaan dan penyediaan infrastruktur IT perusahaan yang meliputi hosting, manajemen server, manajemen jaringan, penyimpanan data, dan penyediaan server serta perangkat infrastruktur IT lainnya.',
  },
  {
    name: 'Training & Maintenance',
    slug: 'training-maintenance',
    description:
      'Menyediakan pelatihan bagi pengguna atau personel IT perusahaan untuk meningkatkan kemampuan dan kapasitas digital Perusahaan. Kami juga menyediakan layanan pemeliharaan rutin, pembaruan perangkat lunak, peningkatan sistem, dan dukungan teknis IT bagi Perusahaan.',
  },
  {
    name: 'System Integration',
    slug: 'system-integration',
    description:
      'Menyediakan layanan untuk mengintegrasikan berbagai sistem TI yang ada di perusahaan agar dapat beroperasi secara bersamaan, bersinergi, dan berbagi data yang diperlukan untuk memberikan manfaat optimal bagi perusahaan.',
  },
  {
    name: 'Enterprise Resources Planning Solution',
    slug: 'erp-solution',
    description:
      'Memberikan layanan implementasi dan pengembangan Enterprise Resource Planning (ERP) untuk mengoptimalkan operasi bisnis. Kami mengintegrasikan solusi ERP yang dapat menyelaraskan proses bisnis dengan teknologi untuk memberikan nilai tambah yang signifikan bagi perusahaan.',
  },
  {
    name: 'Software Application Development',
    slug: 'software-development',
    description:
      'Membuat solusi perangkat lunak kustom untuk meningkatkan efisiensi bisnis Anda. Dari aplikasi web hingga sistem basis data, kami mengurus segalanya: dari analisis hingga pemeliharaan. Tujuan kami adalah memberikan solusi yang berkualitas, efisien, dan mudah digunakan untuk meningkatkan produktivitas Anda.',
  },
  {
    name: 'IT Consulting',
    slug: 'it-consulting',
    description:
      'Menyediakan saran dan rekomendasi teknologi unggul untuk memenuhi kebutuhan bisnis Anda. Dari analisis sistem hingga strategi pengembangan, kami hadir untuk meningkatkan efisiensi dan produktivitas sistem TI Anda.',
  },
];

const GALILEO_BODY = [
  'Galileo adalah aplikasi e-learning berbasis mobile dan web yang dirancang untuk memfasilitasi proses pembelajaran online. Aplikasi ini menyediakan berbagai fitur untuk mendukung pembelajaran yang interaktif, kolaboratif, dan efektif, baik untuk siswa maupun pengajar.',
  '',
  'Fitur Utama:',
  '1. Kursus dan Materi Pembelajaran',
  '- Pengguna dapat mengakses berbagai kursus yang terdiri dari materi pembelajaran dalam bentuk video, teks, dan audio.',
  '- Materi dapat diunduh untuk akses offline.',
  '',
  '2. Tugas dan Evaluasi',
  '- Pengajar dapat memberikan tugas dan kuis kepada siswa.',
  '- Siswa dapat mengumpulkan tugas secara online dan mendapatkan feedback dari pengajar.',
  '- Sistem penilaian otomatis untuk kuis dengan soal pilihan ganda atau benar/salah.',
  '',
  '3. Forum Diskusi',
  '- Forum untuk diskusi antara siswa dan pengajar.',
  '- Siswa dapat mengajukan pertanyaan, berbagi pengetahuan, dan berdiskusi tentang materi pembelajaran.',
  '',
  '4. Notifikasi dan Pengingat',
  '- Notifikasi untuk jadwal kelas, pengumpulan tugas, hasil evaluasi, dan pengumuman penting lainnya.',
  '',
  'Keunggulan Galileo:',
  '- Aksesibilitas: Dapat diakses melalui perangkat mobile dan web, memastikan fleksibilitas bagi siswa untuk belajar kapan saja dan di mana saja.',
  '- Pembelajaran Interaktif: Fitur interaktif seperti kelas virtual dan forum diskusi meningkatkan keterlibatan siswa dalam proses pembelajaran.',
  '- Pengelolaan yang Mudah: Pengajar dapat dengan mudah mengelola kursus, memberikan tugas, dan memantau kemajuan belajar siswa melalui dashboard yang user-friendly.',
  '- Komprehensif: Menyediakan berbagai format materi pembelajaran dan metode evaluasi yang komprehensif.',
  '',
  'Teknologi yang Digunakan:',
  '- Backend: Node.js, Express.js',
  '- Database: MongoDB',
  '- Frontend: Svelte (mobile), Yii2 (web)',
  '- Video Conference: WebRTC, Zoom API',
  '- Authentication: OAuth, JWT',
  '',
  'Galileo menyediakan platform e-learning yang komprehensif dan mudah digunakan, mendukung pembelajaran yang lebih interaktif dan efisien bagi siswa dan pengajar.',
].join('\n');

const PORTFOLIO = [
  { year: 2023, title: 'Pengembangan Website Direktorat Jenderal Perkeretaapian', client: 'Direktorat Jenderal Perkeretaapian, Kementerian Perhubungan' },
  { year: 2023, title: 'Perawatan Aplikasi Angkutan Informasi Dan Registrasi Sungai Danau Dan Penyeberangan (AIR-SDP)', client: 'Direktorat Transportasi Sungai, Danau dan Penyeberangan, Kementerian Perhubungan' },
  { year: 2023, title: 'Pekerjaan Operasional dan Pemeliharaan Aplikasi SIWASOP', client: 'Direktorat Transportasi Sungai, Danau dan Penyeberangan, Kementerian Perhubungan' },
  { year: 2023, title: 'Pekerjaan Pengadaan Pengembangan Aplikasi Desain Industri', client: 'Direktorat Jenderal Kekayaan Intelektual, Kementerian Hukum dan Hak Asasi Manusia' },
  { year: 2023, title: 'Pengadaan Pemeliharaan Aplikasi Sistem Informasi Pelayanan Publik Terpadu BSKJI', client: 'Sekretariat Badan Standardisasi dan Kebijakan Jasa Industri, Kementerian Perindustrian' },
  { year: 2023, title: 'Pekerjaan Jasa Sewa Kanal Spesial RRI: Komunitas pada Kantor Pusat LPP Radio Republik Indonesia', client: 'Kantor LPP Radio Republik Indonesia' },
  { year: 2022, title: 'Pengadaan Pengembangan Aplikasi Sistem Informasi Sarana dan Prasarana (SIMSAPRAS) untuk Keperluan Universitas Pendidikan Indonesia Tahun Anggaran 2022', client: 'Universitas Pendidikan Indonesia, Bandung' },
  { year: 2022, title: 'Belanja Jasa Konsultan Penyusunan Pengukuran Perkembangan Investasi Desa', client: 'Direktorat Pengembangan Investasi Ekonomi Desa Daerah Tertinggal dan Transmigrasi, Kementerian Desa, Pembangunan Daerah Tertinggal' },
  { year: 2022, title: 'Pengadaan Pengembangan Aplikasi Biaya Kuliah Tunggal (BKT) untuk Keperluan UPI Tahun Anggaran 2022', client: 'Universitas Pendidikan Indonesia, Bandung' },
  { year: 2022, title: 'Pemeliharaan Sistem Aplikasi e-Office Tahun Anggaran 2022', client: 'Badan Koordinasi Penanaman Modal' },
  { year: 2022, title: 'Pengembangan Digitalisasi Pengawasan Operasional Transportasi Sungai, Danau dan Penyeberangan', client: 'Direktorat Transportasi Sungai, Danau dan Penyeberangan, Kementerian Perhubungan' },
  { year: 2022, title: 'Pengadaan Jasa Pengelolaan Website Direktorat Jenderal Perkeretaapian', client: 'Direktorat Jenderal Perkeretaapian, Kementerian Perhubungan' },
  { year: 2022, title: 'Pengadaan Jasa Pengelolaan Portal Aplikasi Direktorat Jenderal Perkeretaapian', client: 'Direktorat Jenderal Perkeretaapian, Kementerian Perhubungan' },
  { year: 2021, title: 'Pengadaan Barang Teknologi Informasi (IT) dan Instalasi Jaringan Intranet', client: 'PT Selim Elektro, Brebes, Jawa Tengah' },
  { year: 2021, title: 'Pengembangan Aplikasi DISENTRA Tahap 2', client: 'BJB (PT. Bank Pembangunan Daerah Jawa Barat dan Banten, Tbk)' },
  { year: 2021, title: 'Pengembangan Mobile Apps PT PDC', client: 'PT Patra Drilling Contractor, Jakarta' },
  { year: 2021, title: 'Sistem Pelaporan Kinerja DJKA', client: 'Direktorat Jenderal Perkeretaapian, Kementerian Perhubungan' },
  { year: 2021, title: 'Animasi e-Hubdat', client: 'Direktorat Jenderal Perhubungan Darat, Kementerian Perhubungan' },
  { year: 2021, title: 'Proyek Pembuatan Video Layanan Masyarakat', client: 'Badan Aksesibilitas Telekomunikasi dan Informasi (BAKTI), Kementerian Komunikasi dan Informatika' },
  { year: 2021, title: 'Digitalisasi Pengawasan Operasional Transportasi Sungai Danau dan Penyeberangan', client: 'Direktorat Transportasi Sungai, Danau, dan Penyeberangan (TSDP), Kementerian Perhubungan' },
  { year: 2021, title: 'Pembuatan Alternatif 1 Logo Baru Literasi Digital Siberkreasi', client: 'Dinas Pemakaman Kabupaten Belitung' },
  { year: 2021, title: 'Pembuatan Alternatif 1 Logo Baru Literasi Digital Siberkreasi', client: 'Badan Aksesibilitas Telekomunikasi dan Informasi (BAKTI), Kementerian Komunikasi dan Informatika' },
  { year: 2021, title: 'Produksi Video Semi Dokumenter Pembangunan Infrastruktur PUPR Papua', client: 'Sekretariat Jenderal Kementerian Pekerjaan Umum dan Perumahan Rakyat' },
  { year: 2021, title: 'Pengembangan Sistem Aplikasi BSC & HRIS', client: 'Pasar Jaya (Perumda Pasar Jaya) Provinsi DKI Jakarta' },
  { year: 2021, title: 'Pemetaan Budaya Organisasi Perguruan Tinggi Vokasi', client: 'Direktorat Jenderal Pendidikan Tinggi, Riset, dan Teknologi (Ditjen Dikti), Kementerian Pendidikan dan Kebudayaan' },
  { year: 2021, title: 'STARTLEGAL 3.0', client: 'PT Semesta Hukum Nusantara, Jakarta' },
  { year: 2020, title: 'Pengadaan Infrastruktur Penunjang Teknologi Informasi (Server) Dinas Pendidikan Kota Bandung', client: 'Anima Karya' },
  { year: 2020, title: 'Website PDI Perjuangan Bidang Seni Budaya', client: 'Partai Demokrasi Perjuangan Jawa Barat' },
  { year: 2020, title: 'Sistem Informasi Pegawai & Absensi Berbasis Mobile', client: 'Ziebar Indonesia, Bandung' },
  { year: 2019, title: 'Pengadaan Server dan Rackmount UP 1 Pusat Komputer', client: 'Badan Perencanaan Pembangunan Daerah Kab. Pegunungan Bintan Provinsi Papua' },
  { year: 2019, title: 'Aplikasi Wahana Tata Nugraha 2019', client: 'Kementerian Perhubungan Indonesia' },
  { year: 2019, title: 'Sistem Informasi Database Kearsipan', client: 'Pusat Penanggulangan Lumpur PPLS' },
  { year: 2019, title: 'Official Website TRON', client: 'Teknologi Rancang Olah Nusantara' },
  { year: 2019, title: 'Corporate Website Video Safety', client: 'Gemilang Multimedia' },
  { year: 2019, title: 'Website Compro PT SPARTA', client: 'Sparta Guna Sentosa' },
  { year: 2019, title: 'Website Satu Indonesia', client: 'Organisasi Satu Indonesia' },
  { year: 2018, title: 'Pengadaan Server Dan Penunjang Lainnya', client: 'Dinas Pekerjaan Umum Prov. Gorontalo' },
  { year: 2018, title: 'Human Resource Information System (HRIS)', client: 'Perusahaan Daerah Pasar Jaya, DKI Jakarta' },
  { year: 2018, title: 'Aplikasi Mobile Konsultasi Pencinta Hewan & Dokter Hewan (VETZ)', client: 'Vetzapp' },
  { year: 2018, title: 'Company Profile Kyowa Security', client: 'Kyowa Tangguh Mandiri Indonesia' },
  { year: 2017, title: 'Website Rental Mobil Ambon', client: 'Go Moluccas Transport (GMT), Ambon' },
  { year: 2017, title: 'Official Website Sawangan Golf Hotel And Resort', client: 'Pakuan Tbk' },
  { year: 2017, title: 'Aplikasi Golf Service Sawangan Golf', client: 'Pakuan Tbk' },
  { year: 2017, title: 'Dashboard Executive Sawangan Golf Hotel & Resort', client: 'Pakuan Tbk' },
  { year: 2017, title: 'Aplikasi Ticketing Kolam Renang Sawangan Resort', client: 'Pakuan Tbk' },
  { year: 2017, title: 'Official Website Horison Group', client: 'PT Metropolitan Golden Management (MGM)' },
  { year: 2016, title: 'Pekerjaan Sistem Pelayanan Perkantoran Penyusunan Anggaran', client: 'Badan Informasi Geospasial' },
  { year: 2016, title: 'Pengadaan Sistem Forum Komunikasi Data Pilar Sosial Budaya ASEAN', client: 'Kementerian Koordinator Bidang Pembangunan Manusia dan Kebudayaan' },
  { year: 2016, title: 'Penyusunan Data Base Pengairan', client: 'Dinas Bina Marga dan Pengairan Kota Bandung' },
  { year: 2016, title: 'Pengadaan Pengembangan Sistem Penatausahaan Aset', client: 'Otoritas Jasa Keuangan Indonesia' },
  { year: 2016, title: 'Jasa Konsultansi Pembangunan Aplikasi Online Pengelolaan Data Digital KPU', client: 'KPU Provinsi Jawa Barat' },
  { year: 2016, title: 'Jasa Migrasi Telepon Pindad PABX Ke IP PBX', client: 'Pindad (Persero)' },
  { year: 2016, title: 'Sistem Informasi Pembuatan Sim Kearsipan', client: 'Dinas Kearsipan dan Perpustakaan Kabupaten Bandung Barat' },
  { year: 2015, title: 'Pengadaan Aplikasi Manajemen Dokumen Elektronik Untuk Pengarsipan Dokumen Gubernur Jawa Barat', client: 'Sekretariat Daerah Provinsi Jawa Barat' },
  { year: 2015, title: 'Kajian Penelitian Tentang Standar Pemberian Penilaian Perilaku PNS Berdasarkan Perka Kepala BKN No. 1 Tahun 2013 Tentang Ketentuan Pelaksanaan PP 46 Tahun 2011 Tentang Penilaian Prestasi Kerja', client: 'Badan Kepegawaian Daerah Kota Bandung' },
  { year: 2015, title: 'Pembuatan Video Sosialisasi Dapen Telkom kepada PMP dan Video Sosialisasi PKS Dapen Telkom 2015', client: 'Kantor Dana Pensiun Telkom' },
  { year: 2015, title: 'Pembangunan Sistem Aplikasi Pencatatan Aset Otoritas Jasa Keuangan', client: 'Otoritas Jasa Keuangan Indonesia' },
  { year: 2015, title: 'Belanja Modal Peralatan dan Mesin (Pengadaan Smart Desk) Bagian Hukum dan HAM', client: 'Setda Kota Bandung' },
  { year: 2015, title: 'Migrasi Data Persetujuan AFE Phase 2', client: 'Satuan Kerja Khusus Pelaksana Kegiatan Usaha Hulu Minyak Gas Bumi (SKK MIGAS)' },
  { year: 2015, title: 'Belanja Jasa Konsultansi Pengembangan', client: 'Dinas Pengelolaan Keuangan dan Asset Daerah Kota Bandung' },
  { year: 2015, title: 'Pengadaan Penyediaan Jasa Pembangunan Mobile Dashboard', client: 'Satuan Kerja Khusus Pelaksana Kegiatan Usaha Hulu Minyak Gas Bumi (SKK MIGAS)' },
  { year: 2015, title: 'Jasa Konsultansi Pengkajian Sewa Beli Laboratory Information System (LIS)', client: 'RSUD Cilegon' },
  { year: 2015, title: 'Jasa Konsultasi Pengembangan Sistem Aplikasi Uji Kompetensi PNS Berbasis Komputer', client: 'Badan Kepegawaian Daerah Kota Bandung' },
  { year: 2015, title: 'Pengadaan Portable Touch Screen KIOSK', client: 'Dinas Pariwisata dan Kebudayaan Provinsi Jawa Barat' },
  { year: 2014, title: 'Pengadaan Jasa Konsultansi Pembangunan Sistem Informasi Penyusunan Anggaran', client: 'Otoritas Jasa Keuangan Kementerian Keuangan RI' },
  { year: 2014, title: 'Pekerjaan Penyusunan Blue Print', client: 'Badan Kepegawaian Daerah Kota Bandung' },
  { year: 2014, title: 'Software Aplikasi Sistem Informasi Rumah Sakit (SIRS)', client: 'Provinsi Banten — Dinas Kesehatan Provinsi Banten' },
  { year: 2014, title: 'Jasa Konsultansi Pembuatan Naskah Akademis Pola Tarif Labkesda', client: 'Dinas Kesehatan Provinsi Banten' },
  { year: 2013, title: 'Perencanaan Peta Wisata Kabupaten Bandung Barat', client: 'Dinas Kebudayaan dan Pariwisata Kabupaten Bandung Barat' },
  { year: 2013, title: 'Pengembangan Integrasi Aplikasi Tahun Anggaran 2013', client: 'Kementerian Perencanaan Pembangunan Nasional (BAPPENAS)' },
  { year: 2013, title: 'Software Aplikasi Sistem Informasi Rumah Sakit (SIRS) Provinsi Banten', client: 'Dinas Kesehatan Provinsi Banten' },
  { year: 2013, title: 'Sistem Informasi Pembangunan Desa', client: 'Badan Perencanaan dan Pembangunan Daerah (Bappeda) Kabupaten Bandung Barat' },
  { year: 2013, title: 'Pengelolaan Aplikasi Webstore', client: 'Metra Digital Media, Jakarta' },
  { year: 2013, title: 'e-Catalog Online & Offline Produk Filter Kendaraan Berat (Heavy Duty Vehicle)', client: 'Metra Digital Media, Jakarta' },
  { year: 2012, title: 'Pengembangan Portal Kementerian Perhubungan Pusat Data dan Informasi', client: 'Kementerian Perhubungan' },
  { year: 2012, title: 'Pengelolaan Perangkat BNN, BNPP dan UPT T&R Lido', client: 'Badan Narkotika Nasional' },
  { year: 2012, title: 'Pengembangan Digitalisasi Arsip DIPA dan POK Biro Keuangan', client: 'Kementerian Perhubungan' },
  { year: 2012, title: 'Pengembangan Website Direktorat Jenderal Hak Kekayaan Intelektual', client: 'Direktorat Jenderal Hak Kekayaan Intelektual, Kementerian Hukum dan HAM RI' },
  { year: 2012, title: 'Pengembangan Aplikasi Elektronik Reporting Pelaksanaan Kegiatan Kementerian Perhubungan', client: 'Pusat Data dan Informasi, Kementerian Perhubungan' },
  { year: 2012, title: 'Pembangunan Aplikasi Indikasi Geografis (GI)', client: 'Direktorat Jenderal Hak Kekayaan Intelektual, Kementerian Hukum dan HAM RI' },
  { year: 2012, title: 'Pekerjaan Sistem Pengelolaan Monitoring Kegiatan Dan Proyek', client: 'Pusat Sistem Jaringan dan Standardisasi Data Spasial, Badan Koordinasi Survei dan Pemetaan Nasional' },
  { year: 2012, title: 'Website Lenan Pearl Of Silk', client: 'Perusahaan Batik Lenan Pearl Of Silk, Jogjakarta' },
  { year: 2012, title: 'Website holding perusahaan manufaktur filter automotive', client: 'PT. Infomedia Nusantara' },
  { year: 2012, title: 'Instalasi & Operasionalisasi Wifi Hotspot dan CCTV di seluruh venue PON XVIII di Pekanbaru Riau 2012', client: 'Panitia PON XVIII Tahun 2012' },
  { year: 2012, title: 'Instalasi & Operasionalisasi Wifi Hotspot di Gedung Kemendagri (12 lantai)', client: 'Kementerian Dalam Negeri' },
  { year: 2011, title: 'Penyediaan Aplikasi Sistem Manajemen Dokumen Elektronik', client: 'Lintas Data Piranti' },
  { year: 2011, title: 'Pengembangan Aplikasi Sistem e-Pengadaan Pemerintah Interaktif Versi Desktop', client: 'Direktorat e-Business Kementerian Komunikasi dan Informatika RI' },
  { year: 2011, title: 'Pengadaan Aplikasi Integrasi Sistem Monitoring Kontrak Strategis dengan Aplikasi e-Monitoring dan Reporting', client: 'Biro Keuangan dan Perlengkapan Sekretariat Jenderal Kementerian Perhubungan' },
  { year: 2011, title: 'Pengembangan Aplikasi Kepegawaian Kementerian Perhubungan', client: 'Pusat Data dan Informasi Sekretariat Jenderal Kementerian Perhubungan' },
  { year: 2011, title: 'Pengembangan Website Direktorat Jenderal Pengelolaan Utang', client: 'Direktorat Jenderal Pengelolaan Utang, Kementerian Keuangan' },
  { year: 2011, title: 'Pengadaan Sistem Informasi Kepegawaian', client: 'Biro Kepegawaian dan Organisasi Settama Badan Narkotika Nasional' },
  { year: 2011, title: 'Staff Expertise and Quality Management Software Development', client: 'Politeknik Manufaktur Bandung' },
  { year: 2011, title: 'Aplikasi Touchscreen pada Kegiatan Diseminasi Informasi Pembangunan Pemerintah Provinsi Jawa Barat Tahun Anggaran 2011', client: 'Dinas Komunikasi dan Informatika Pemerintah Provinsi Jawa Barat' },
  { year: 2011, title: 'Pengadaan Jasa Konsultan Peningkatan Keamanan Layanan Economic Executive Dashboard Tahun 2011', client: 'Pusat Kebijakan Ekonomi Makro, Badan Kebijakan Fiskal Kementerian Keuangan' },
  { year: 2011, title: 'Pengadaan Pengembangan dan Pembuatan Tambahan Sistem Aplikasi DIPA (Program Features)', client: 'Kantor Otoritas Bandar Udara Wilayah' },
  { year: 2011, title: 'Pembuatan Tata Kelola Teknologi Informasi', client: 'Dinas Pendapatan Provinsi Jawa Barat' },
  { year: 2011, title: 'e-Catalog Produk Filter Automotive', client: 'Infomedia Nusantara' },
  { year: 2011, title: 'Online Agreement Webstore', client: 'Infomedia Nusantara' },
  { year: 2011, title: 'Order Management SHM', client: 'Infomedia Nusantara' },
  { year: 2011, title: 'Sakai Project', client: 'Blue Power Energy' },
  { year: 2010, title: 'Pembuatan website perusahaan labcal-indonesia.com', client: 'Labcal Indonesia' },
  { year: 2010, title: 'Pengembangan aplikasi pelayanan pembuatan perizinan di lingkungan Kabupaten Lampung Timur', client: 'Kantor Pelayanan Perizinan Terpadu Kabupaten Lampung Timur' },
  { year: 2010, title: 'Pemeliharaan aplikasi-aplikasi dan Geographical Information System (GIS) di lingkungan Biro Perencanaan Kementerian Sosial Republik Indonesia', client: 'Biro Perencanaan Kementerian Sosial Republik Indonesia' },
  { year: 2010, title: 'Studi Kelayakan (Feasibility Study) Pengembangan Sistem Informasi di Lingkungan Dinas Kesehatan Kabupaten Bandung Barat', client: 'Dinas Kesehatan Kabupaten Bandung Barat' },
  { year: 2010, title: 'Pembuatan aplikasi Sistem Informasi Puskesmas untuk digunakan di lingkungan Pemerintah Daerah Kabupaten Bandung Barat', client: 'Dinas Kesehatan Kabupaten Bandung Barat' },
  { year: 2010, title: 'Pembuatan aplikasi Sistem Informasi Peternakan untuk lingkungan Dinas Peternakan dan Perikanan Kabupaten Bandung Barat', client: 'Dinas Peternakan Kabupaten Bandung Barat' },
  { year: 2010, title: 'Pembuatan aplikasi Sistem Informasi Penyimpanan Barang di lingkungan Pemerintah Provinsi DKI Jakarta', client: 'Unit Pelayanan Teknis Pusat Penyimpanan Barang Daerah Provinsi DKI Jakarta' },
  { year: 2009, title: 'Pemeliharaan (Maintenance) Aplikasi Sistem Pengelolaan Pendapatan Ciamis', client: 'Dinas Pengelola Pendapatan Keuangan dan Aset Daerah Kabupaten' },
  { year: 2009, title: 'Pemeliharaan Website Dinas PPKAD Kab. Ciamis', client: 'Dinas Pengelolaan Pendapatan, Keuangan dan Aset Daerah (DPPKAD) Kabupaten Ciamis' },
  { year: 2009, title: 'Pembuatan aplikasi layanan informasi pengaduan masyarakat melalui SMS (SMS Gateway)', client: 'Kantor Perpustakaan dan Arsip Daerah Kabupaten Bandung Barat' },
  { year: 2009, title: 'Pengembangan Aplikasi Sistem Informasi Puskesmas', client: 'Dinas Kesehatan Kota Cirebon' },
  { year: 2009, title: 'Pelatihan Pengaman Database di Lingkungan Direktorat Jenderal Administrasi Kependudukan Departemen Dalam Negeri', client: 'Direktorat Jenderal Administrasi Kependudukan Departemen Dalam Negeri' },
  { year: 2008, title: 'Pengembangan Sistem Pengelolaan Pendapatan Kabupaten Ciamis', client: 'Dinas Pengelolaan Pendapatan, Keuangan dan Aset Daerah (DPPKAD) Kabupaten Ciamis' },
  { year: 2008, title: 'Pengembangan e-Government (Sistem Informasi Manajemen Kesehatan, Sistem Informasi Manajemen Pengawasan Daerah, Sistem Informasi Manajemen Pertanian, Portal Daerah Kabupaten Tulang Bawang)', client: 'Sekretariat Daerah Kabupaten Tulang Bawang' },
  { year: 2007, title: 'Pengembangan Portal indonesia.go.id', client: 'Biro Dukungan Informatika, Sekretariat Negara RI' },
  { year: 2007, title: 'Pembuatan Aplikasi Berbasis Web (Web Based Application) Sistem Informasi Puskesmas', client: 'Dinas Kesehatan, Kabupaten Cirebon' },
  { year: 2007, title: 'Website SAUNDERS REVIEW', client: 'SAUNDERS REVIEW' },
  { year: 2007, title: 'Pengembangan Sistem Informasi Keuangan', client: 'Biro Keuangan dan Perlengkapan, Departemen Perhubungan RI' },
  { year: 2007, title: 'Pemeliharaan Sistem Informasi Alokasi Dana Desa, Sistem Informasi Pelaporan Pajak Bumi & Bangunan, Sistem Pelaporan Pendapatan, Manual Pendapatan Daerah', client: 'Dinas Keuangan, Kabupaten Ciamis' },
  { year: 2007, title: 'Pembuatan aplikasi Sistem Informasi Bagi Hasil Pajak dan Retribusi Daerah', client: 'Dinas Keuangan, Kabupaten Ciamis' },
  { year: 2006, title: 'Pengembangan Aplikasi Sistem Informasi Keuangan menjadi aplikasi perangkat lunak berbasis web', client: 'Dinas Kesehatan, Kota Cirebon' },
  { year: 2006, title: 'Pembuatan aplikasi Sistem Integrasi Puskesmas', client: 'Dinas Kesehatan Kota Cirebon' },
  { year: 2006, title: 'Pembuatan aplikasi Sistem Informasi Manajemen Pengawasan Daerah (SIMWASDA)', client: 'Badan Pengawasan Daerah, Kabupaten Bandung' },
  { year: 2006, title: 'Unit Pelayanan Terpadu, Kabupaten Lampung Timur', client: 'Sekretariat Daerah, Kabupaten Tulang Bawang' },
  { year: 2006, title: 'eGovernment Tahap II (Sistem Informasi Manajemen Kepegawaian, Sistem Informasi Pelaporan Pendapatan, Sistem Informasi Manajemen Aset dan Barang Daerah (SIMBADA))', client: 'Pemerintah Daerah Kabupaten Tulang Bawang' },
  { year: 2006, title: 'Sistem Informasi Manajemen Kepegawaian (SIMPEG) Daerah', client: 'Badan Kepegawaian Daerah, Kabupaten Bandung' },
  { year: 2006, title: 'Optimalisasi dan Visualisasi Potensi Daerah dan Website Kabupaten Bandung (bandungkab.go.id)', client: 'Kantor Pengolahan Data Elektronik, Kabupaten Bandung' },
  { year: 2006, title: 'Pembangunan Aplikasi Portal Dinas Kesehatan Kabupaten Cirebon', client: 'Dinas Kesehatan, Kabupaten Cirebon' },
  { year: 2006, title: 'Pembuatan aplikasi antarmuka perangkat kontrol akses dengan teknologi biometrik berbasis fingerprint dan smartcard', client: 'Labcal Indonesia' },
  { year: 2006, title: 'Task Management System — aplikasi pengelolaan tugas dalam sebuah organisasi agar proses pemberian, pelaksanaan, pengendalian, dan evaluasi tugas/pekerjaan berjalan terukur', client: 'BNI Multifinance' },
  { year: 2006, title: 'Situs web perusahaan manufaktur produk karet (inkaba-rubber.com)', client: 'PT Agronesia' },
  { year: 2006, title: 'Situs web Dinas Keuangan Kabupaten Ciamis', client: 'Dinas Keuangan, Kabupaten Ciamis' },
  { year: 2005, title: 'Sistem Informasi Keuangan', client: 'Biro Keuangan, Departemen Perhubungan RI' },
  { year: 2005, title: 'Conference Convention Management', client: 'MediMark (Australia)' },
  { year: 2005, title: 'Pembuatan Aplikasi untuk peramalan dan simulasi pasar dengan metode regresi multi variat dan analisa deret waktu', client: 'RisTI (Riset Teknologi dan Informasi)' },
  { year: 2005, title: 'Pembuatan aplikasi Sistem Informasi Akademik (SIKAD) Universitas Padjadjaran', client: 'Biro Administrasi Akademik Universitas Padjadjaran' },
  { year: 2005, title: 'Pembuatan Situs Web Regional Education Development and Improvement Program (REDIP) Jakarta', client: 'Japan International Cooperation Agency' },
  { year: 2005, title: 'Website dan aplikasi untuk memonitor kegiatan kesehatan', client: 'MediMark (Australia)' },
  { year: 2005, title: 'Aplikasi untuk menjalankan test secara online (teks, gambar, atau movie)', client: 'MediMark (Australia)' },
  { year: 2005, title: 'Aplikasi komponen mesin pencari dengan fitur pencarian bersyarat dan fuzzy', client: 'MediaTrac' },
  { year: 2005, title: 'Maintenance Sistem Pelaporan Pendapatan untuk Dinas Pendapatan Daerah Kabupaten Ciamis', client: 'Dinas Pendapatan Daerah, Kabupaten Ciamis' },
  { year: 2005, title: 'Maintenance Sistem Pelaporan Pajak Bumi dan Bangunan untuk DIPENDA Kabupaten Ciamis', client: 'Dinas Pendapatan Daerah, Kabupaten Ciamis' },
  { year: 2004, title: 'Sistem Pelaporan Pajak Bumi dan Bangunan untuk Dinas Pendapatan Daerah (DIPENDA) Kabupaten Ciamis', client: 'Dinas Pendapatan Daerah, Kabupaten Ciamis' },
  { year: 2004, title: 'Sistem Informasi Keuangan Daerah dengan tambahan Modul untuk Pemerintah', client: 'Badan Pengelola Keuangan dan Aset Daerah (BPKAD), Kabupaten Sukabumi' },
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildContents() {
  const contents = [
    {
      title: 'Galileo (E-Learning)',
      slug: 'galileo-elearning',
      category: 'product',
      body: GALILEO_BODY,
      image_url: '',
      is_published: true,
    },
  ];
  const slugCount = {};
  for (const p of PORTFOLIO) {
    const base = slugify(`${p.title}-${p.year}`);
    slugCount[base] = (slugCount[base] || 0) + 1;
    const slug = slugCount[base] === 1 ? base : `${base}-${slugCount[base]}`;
    contents.push({
      title: p.title,
      slug,
      category: 'portfolio',
      body: p.client,
      image_url: '',
      is_published: true,
      year: p.year,
    });
  }
  return contents;
}

const SEED_CONTENTS = buildContents();

function seedServices(adminId) {
  const upsert = db.prepare(
    `INSERT INTO services (name, slug, description, is_active, created_by, updated_by)
     VALUES (?, ?, ?, 1, ?, ?)
     ON CONFLICT(slug) DO UPDATE SET
       name = excluded.name,
       description = excluded.description,
       is_active = 1,
       updated_by = excluded.updated_by,
       updated_at = datetime('now'),
       deleted_at = NULL`
  );
  for (const s of SERVICES) upsert.run(s.name, s.slug, s.description, adminId, adminId);
  console.log(`Seed: ${SERVICES.length} layanan disinkronkan.`);
}

function seedContents(adminId) {
  db.prepare(`DELETE FROM contents WHERE category IN ('product', 'portfolio')`).run();
  const insert = db.prepare(
    `INSERT INTO contents (title, slug, category, body, image_url, is_published, created_by, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  for (const c of SEED_CONTENTS) {
    const created = c.year ? `${c.year}-01-01T00:00:00Z` : new Date().toISOString();
    insert.run(c.title, c.slug, c.category, c.body, c.image_url, c.is_published ? 1 : 0, adminId, created);
  }
  const portfolioCount = SEED_CONTENTS.filter((c) => c.category === 'portfolio').length;
  console.log(`Seed: ${portfolioCount} portofolio + ${SEED_CONTENTS.length - portfolioCount} produk siap.`);
}

function run() {
  db.exec(readFileSync(join(__dirname, 'migration.sql'), 'utf8'));
  console.log('Skema database berhasil dibuat.');

  const email = 'admin@digitak.id';
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  let adminId;
  if (existing) {
    adminId = existing.id;
    console.log('Admin sudah ada, dilewati.');
  } else {
    const hash = bcrypt.hashSync('admin123', 10);
    const result = db
      .prepare(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ('Administrator Digitak', ?, ?, 'admin')`
      )
      .run(email, hash);
    adminId = Number(result.lastInsertRowid);
    console.log('Admin default dibuat: admin@digitak.id / admin123');
  }

  seedServices(adminId);
  seedContents(adminId);

  console.log('Setup database selesai.');
  db.close();
}

try {
  run();
} catch (err) {
  console.error('Setup gagal:', err);
  process.exit(1);
}
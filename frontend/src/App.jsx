import { Route, Routes, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider, ProtectedRoute } from './context/AuthContext.jsx';

import PortalLayout from './components/PortalLayout.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';

import Home from './pages/public/Home.jsx';
import Produk from './pages/public/Produk.jsx';
import Layanan from './pages/public/Layanan.jsx';
import DetailLayanan from './pages/public/DetailLayanan.jsx';
import Portofolio from './pages/public/Portofolio.jsx';
import Perusahaan from './pages/public/Perusahaan.jsx';
import Kontak from './pages/public/Kontak.jsx';
import FormPengajuan from './pages/public/FormPengajuan.jsx';
import Confirmation from './pages/public/Confirmation.jsx';
import CekStatus from './pages/public/CekStatus.jsx';
import KebijakanPrivasi from './pages/public/KebijakanPrivasi.jsx';
import SyaratKetentuan from './pages/public/SyaratKetentuan.jsx';

import Login from './pages/admin/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Permintaan from './pages/admin/Permintaan.jsx';
import DetailPermintaan from './pages/admin/DetailPermintaan.jsx';
import KelolaLayanan from './pages/admin/KelolaLayanan.jsx';
import KelolaKonten from './pages/admin/KelolaKonten.jsx';
import Riwayat from './pages/admin/Riwayat.jsx';
import Pengaturan from './pages/admin/Pengaturan.jsx';
import Subscriber from './pages/admin/Subscriber.jsx';

function NotFound() {
  const { t } = useTranslation();
  return (
    <PortalLayout>
      <section className="max-w-3xl mx-auto py-24 px-6 text-center">
        <h1 className="text-6xl font-extrabold text-brand">404</h1>
        <p className="mt-4 text-lg text-body">{t('notFound.title')}</p>
        <Link
          to="/"
          className="inline-block mt-8 px-7 py-3 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors"
        >
          {t('notFound.back')}
        </Link>
      </section>
    </PortalLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PortalLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/produk" element={<Produk />} />
          <Route path="/layanan" element={<Layanan />} />
          <Route path="/layanan/:slug" element={<DetailLayanan />} />
          <Route path="/portofolio" element={<Portofolio />} />
          <Route path="/perusahaan" element={<Perusahaan />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="/form-pengajuan" element={<FormPengajuan />} />
          <Route path="/ajukan-proyek" element={<FormPengajuan />} />
          <Route path="/konfirmasi" element={<Confirmation />} />
          <Route path="/cek-status" element={<CekStatus />} />
          <Route path="/kebijakan-privasi" element={<KebijakanPrivasi />} />
          <Route path="/syarat-ketentuan" element={<SyaratKetentuan />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="permintaan" element={<Permintaan />} />
          <Route path="permintaan/:id" element={<DetailPermintaan />} />
          <Route path="layanan" element={<KelolaLayanan />} />
          <Route path="konten" element={<KelolaKonten />} />
          <Route path="riwayat" element={<Riwayat />} />
          <Route path="pengaturan" element={<Pengaturan />} />
          <Route path="subscriber" element={<Subscriber />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
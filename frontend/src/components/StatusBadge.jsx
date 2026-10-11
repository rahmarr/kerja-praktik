import { useTranslation } from 'react-i18next';

const STYLES = {
  'Menunggu Ditinjau': 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]',
  'Sedang Diproses': 'bg-[#ffedd5] text-[#c2410c] border-[#fdba74]',
  'Menunggu Informasi': 'bg-[#fff7ed] text-[#b45309] border-[#fed7aa]',
  'Selesai': 'bg-[#d1fae5] text-[#065f46] border-[#6ee7b7]',
};

const KEY_MAP = {
  'Menunggu Ditinjau': 'waiting',
  'Sedang Diproses': 'processing',
  'Menunggu Informasi': 'info',
  'Selesai': 'done',
};

export default function StatusBadge({ status, small = false }) {
  const { t } = useTranslation();
  const classes = STYLES[status] || 'bg-neutral-100 text-neutral-700 border-neutral-200';
  const key = KEY_MAP[status] || 'waiting';
  return (
    <span
      className={`inline-flex items-center rounded-full border font-bold whitespace-nowrap ${
        small ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      } ${classes}`}
    >
      {t(`status.${key}`)}
    </span>
  );
}
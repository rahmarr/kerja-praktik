import { useTranslation } from 'react-i18next';

const STEP_ICONS = {
  'Menunggu Ditinjau': '⏳',
  'Sedang Diproses': '🔄',
  'Menunggu Informasi': '💬',
  'Selesai': '🏁',
};

const STATUS_STEPS = ['Menunggu Ditinjau', 'Sedang Diproses', 'Menunggu Informasi', 'Selesai'];

const KEY_MAP = {
  'Menunggu Ditinjau': 'waiting',
  'Sedang Diproses': 'processing',
  'Menunggu Informasi': 'info',
  'Selesai': 'done',
};

function stepState(step, currentIndex) {
  const idx = STATUS_STEPS.indexOf(step);
  if (idx < currentIndex) return 'done';
  if (idx === currentIndex) return 'active';
  return 'todo';
}

export default function RequestTimeline({ currentStatus }) {
  const { t } = useTranslation();
  const currentIndex = STATUS_STEPS.indexOf(currentStatus);
  const realtiveIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <ol className="flex flex-col md:flex-row gap-0 md:gap-2">
      {STATUS_STEPS.map((step, i) => {
        const state = stepState(step, realtiveIndex);
        const isLast = i === STATUS_STEPS.length - 1;
        return (
          <li key={step} className="flex md:flex-1 md:items-stretch">
            <div className="flex flex-col items-start md:items-center flex-1">
              <div className="flex items-center w-full">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
                    state === 'done'
                      ? 'bg-emerald-500 text-white'
                      : state === 'active'
                        ? 'bg-brand text-white'
                        : 'bg-[#F6EFE9] text-muted'
                  }`}
                >
                  {state === 'done' ? '✓' : state === 'active' ? STEP_ICONS[step] : i + 1}
                </div>
                {!isLast && (
                  <div
                    className={`h-1 flex-1 mx-1 md:my-0 ${
                      state === 'done'
                        ? 'bg-emerald-500'
                        : state === 'active'
                          ? 'bg-brand'
                          : 'bg-[#F6EFE9]'
                    }`}
                  />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-bold md:text-center ${
                  state === 'todo' ? 'text-muted' : 'text-dark-brown'
                }`}
              >
                {t(`status.${KEY_MAP[step]}`)}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import id from './id.json';
import en from './en.json';

const STORAGE_KEY = 'digitak_lang';

function loadLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'id' || saved === 'en') return saved;
  } catch {
    /* ignore */
  }
  return 'id';
}

i18n.use(initReactI18next).init({
  resources: {
    id: { translation: id },
    en: { translation: en },
  },
  lng: loadLang(),
  fallbackLng: 'id',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lang) => {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
});

export default i18n;
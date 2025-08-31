import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// استيراد ملفات الترجمة الثلاثة
import translationEN from './locales/en/translation.json';
import translationRU from './locales/ru/translation.json';
import translationAR from './locales/ar/translation.json'; // <-- السطر الجديد

const resources = {
  en: {
    translation: translationEN
  },
  ru: {
    translation: translationRU
  },
  ar: { // <-- القسم الجديد بالكامل
    translation: translationAR
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', 
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

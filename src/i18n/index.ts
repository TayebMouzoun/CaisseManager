import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import frTranslations from './locales/fr.json';

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        translation: frTranslations,
      },
    },
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 
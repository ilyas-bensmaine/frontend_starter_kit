// ** I18n Imports
import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// ** Languages Imports
const fr = new URL('../../assets/data/locales/fr.json', import.meta.url).href
const ar = new URL('../../assets/data/locales/ar.json', import.meta.url).href

const languages = {
  fr,
  ar
}

export const getUserLanguage = () => {
  JSON.parse(localStorage.getItem("userData")).language
  console.log('LAnguage', JSON.parse(localStorage.getItem("userData")).language)
} 

i18n
  // Enables the i18next backend
  .use(Backend)
  // Enable automatic language detection
  .use(LanguageDetector)
  // Enables the hook initialization module
  .use(initReactI18next)
  .init({
    lng: getUserLanguage(),
    backend: {
      /* translation file path */
      loadPath: lng => languages[lng]
    },
    fallbackLng: 'fr',
    debug: false,
    keySeparator: false,
    react: {
      useSuspense: false
    },
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    }
  })

export default i18n


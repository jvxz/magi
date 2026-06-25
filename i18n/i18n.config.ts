export default defineI18nConfig(() => ({
  fallbackLocale: 'en',
  legacy: false,
  locale: 'en',
  numberFormats: {
    en: {
      currency: { currency: 'USD', style: 'currency' },
      decimal: { maximumFractionDigits: 2, minimumFractionDigits: 2, style: 'decimal' },
      percent: { minimumFractionDigits: 0, style: 'percent' },
    },
  },
}))

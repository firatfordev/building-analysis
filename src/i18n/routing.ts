import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // All supported locales
  locales: ['en', 'tr'],

  // Default locale used when no locale prefix is detected
  defaultLocale: 'tr',
});

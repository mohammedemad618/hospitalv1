/**
 * Sentry Server Configuration
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 0.1,
  debug: process.env.NODE_ENV === 'development',
  beforeSend(event, hint) {
    // Filter sensitive data
    if (event.request) {
      delete event.request.cookies;
      if (event.request.headers) {
        delete event.request.headers.Authorization;
      }
    }
    return event;
  },
});


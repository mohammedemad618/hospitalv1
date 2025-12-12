/**
 * Sentry Client Configuration
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0,
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


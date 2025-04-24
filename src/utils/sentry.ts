import * as Sentry from '@sentry/react'

const sentryDsn = import.meta.env.VITE_SENTRY_DSN

Sentry.init({
  dsn: sentryDsn,

  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],

  tracesSampleRate: 1.0,

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  beforeSend(event) {
    if (event.tags && event.tags['error.title']) {
      const customTitle = String(event.tags['error.title'])

      if (event.exception && event.exception.values && event.exception.values[0]) {
        const originalMessage = String(event.exception.values[0].value || '')
        event.exception.values[0].value = `${customTitle}: ${originalMessage}`
      }
    }
    return event
  },
})

export default Sentry

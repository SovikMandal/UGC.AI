import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://547aa24063c210224bc592f5e6845ad0@o4510952864415744.ingest.us.sentry.io/4510952893972480",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
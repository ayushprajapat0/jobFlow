// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
//const Sentry = require("@sentry/node");
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://90f9f0bacf61608d7c5987265039df72@o4509553804902400.ingest.us.sentry.io/4509553809358848",
  integrations : [
    Sentry.mongooseIntegration()
  ],

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
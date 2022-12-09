import Sentry from '@sentry/node';
import Tracing from '@sentry/tracing';
import { ApmHelper } from '../../libraries/ApmHelper';

// const mockApm = Object.freeze({
//   startTransaction() {
//     return {
//       end: () => {},
//     };
//   },
// });

export default function (app: any) {
  const sentryAPMClient = (() => {
    const apm = Sentry;
    apm?.init({
      // TODO move to ENV
      dsn: 'https://f6a0bfa8dd75472d941432b0ca28f34d@o110716.ingest.sentry.io/4504113588404224',
      enabled: process.env.NODE_ENV !== 'development',
      tracesSampleRate: 1.0,
      integrations: [new Tracing.Integrations.Mongo()],
    });
    // apm.addSpanFilter(function (payload) {
    //   if (payload && payload.context) {
    //     if (!payload.context.service) {
    //       payload.context.service = {};
    //     }
    //     payload.context.service.agent = {
    //       name: 'my-film-list-backend',
    //     };
    //   }
    //   return payload;
    // });

    if (apm) {
      ApmHelper.setApm(apm, { track: process.env.TRACK });
    }
    return apm;
  })();

  if (typeof sentryAPMClient !== 'undefined') {
    app.set('sentryAPMClient', sentryAPMClient);
    app.use(Sentry.Handlers.requestHandler());
  }
}

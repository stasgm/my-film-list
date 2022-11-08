export default function ({ sentryAPMClient }) {
  return function (error, req, res, next) {
    if (sentryAPMClient) {
      sentryAPMClient.Handlers.errorHandler();
    }

    // if (!error.traceId) {
    //   error.traceId = domainUtils.generateTraceId();
    // }

    const errorCode = error.errorCode || 'TechnicalBackendError';

    const httpStatusCode = error.httpStatusCode ? error.httpStatusCode : 500;
    // const context = HttpContextHelper.extractContext(req);

    // log.logError(error, error.message, context);

    const message = (() => {
      if (error.data && error.data.message) {
        return error.data.message;
      } else if (error.message) {
        return error.message;
      } else {
        return '';
      }
    })();

    // const formatStack = (stack) => {
    //   if (typeof stack === 'string') {
    //     return stack.split('\n');
    //   } else {
    //     return undefined;
    //   }
    // };
    // const isProductionEnv = true;

    res.status(httpStatusCode).json({
      errorCode,
      message,
      // stack: isProductionEnv ? 'Stack for production not available' : formatStack(error.stack),
      // errorTextUserFriendly: error.data && error.data.errorTextUserFriendly ? error.data.errorTextUserFriendly : '',
      traceId: error.traceId,
      // suppressUserWarning: error.data && error.data.suppressUserWarning ? error.data.suppressUserWarning : false,
      data: error.responseData || {},
      sentry: res.sentry,
    });
  };
}

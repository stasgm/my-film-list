import { Request, Response, NextFunction } from 'express';

export class CustomError extends TypeError {
  data: Record<string, any>;
  code: string;
  errorCode: string;
  statusCode: number;
  httpStatusCode: number;

  constructor(data = {}, code: string, errorCode: string, statusCode: number, httpStatusCode: number) {
    super("Custom error")
    this.data = data;
    this.code = code;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.httpStatusCode = httpStatusCode;
  }
}

export default function ({ sentryAPMClient }: any) {
  return function (error: TypeError | CustomError, req: Request, res: Response, next: NextFunction) {
    if (sentryAPMClient) {
      sentryAPMClient.Handlers.errorHandler();
    }
    // if (!error.traceId) {
    //   error.traceId = domainUtils.generateTraceId();
    // }

    const errorCode = (() => {
      if ((error instanceof CustomError)) {
        return error.code || error.errorCode;
      }
      return 'TechnicalBackendError';
    })();

    const httpStatusCode = (() => {
      if ((error instanceof CustomError)) {
        return error.statusCode || error.httpStatusCode || 500;
      }
      return 500;
    })();

    // log.logError(error, error.message, context);

    const message = (() => {
      if ((error instanceof CustomError)) {
        if (error.data && error.data.message) {
          return error.data.message;
        }
      }
      return error.message;
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
      // traceId: error.traceId,
      // suppressUserWarning: error.data && error.data.suppressUserWarning ? error.data.suppressUserWarning : false,
      // data: error.responseData || {},
      // sentry: res.sentry,
    });
  };
}

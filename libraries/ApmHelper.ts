
let apm: any;

export const ApmSpanType = {
  UNKNOWN: 'UNKNOWN',
  PURE_FUNCTION: 'pureFunction',
  API_REQUEST: 'apiRequest',
  SYSTEM: 'system',
  BACKEND: 'backend',
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
}

function normalizeError(error: any) {
  if (error.errorCode) return error.errorCode;

  let errorMessage = undefined;

  switch (error.name) {
    case 'TypeError':
    case 'ReferenceError': {
      const messages = ['Cannot read property', 'is not a function', 'is not defined', 'null is not an object'];

      for (const message of messages) {
        const re = new RegExp(message, 'ig');
        const normilizedMessage = error.message.trim().match(re);

        if (normilizedMessage) {
          errorMessage = normilizedMessage[0];
          break;
        }
      }

      break;
    }
    case 'Error': {
      errorMessage = error.message;

      break;
    }
  }

  return errorMessage ? capitalizeFirstLetter(errorMessage) : errorMessage;
}

const fallbackRetObj = {
  end: () => {},
};

export const ApmHelper = {
  setApm(apmInstance: any, { channel, track }: any = {}) {
    if (!apmInstance) throw new Error('Apm has not been defined.');

    apm = apmInstance;

    channel && apm.addLabels('channel', channel);
    track && apm.addLabels('track', track);
  },
  addTag(name: string, value: string) {
    if (this.isEnabled()) {
      apm.setTag(name, value);
    }
  },
  captureError(error: any) {
    if (this.isEnabled()) {
      const errorMessage = normalizeError(error);

      // const errorLabels = {
      //   ...(error.errorCode ? { errorCode: error.errorCode } : {}),
      //   ...(error.name ? { errorName: error.name } : {}),
      //   ...(errorMessage ? { errorMessage: errorMessage } : {}),
      // };
      // apm.getCurrentTransaction().addLabels(errorLabels);
      // const customContext = {
      //   ...(error.message ? { errorMessage: error.message } : {}),
      //   ...(error.type ? { errorType: error.type } : {}),
      //   ...(error.errorData ? { errorData: error.errorData } : {}),
      // };
      // apm.setCustomContext(customContext);
      apm.captureError(error);
    }
  },
  addCustomContext(name: string, value: string) {
    if (this.isEnabled()) {
      apm.setContext(name, value);
    }
  },
  isEnabled() {
    return apm;
    // apm rum isEnabled, apm agent isStarted()
    // return apm ? (apm.isEnabled !== undefined ? apm.isEnabled : apm.isStarted()) : false;
  },
  startSpan(name: string, type = ApmSpanType.UNKNOWN, { transaction, data = {} }: any = {}) {
    if (this.isEnabled()) {
      if (transaction && transaction.endTimestamp) {
        return fallbackRetObj;
      }

      const span = transaction
        ? transaction.startChild({ description: name, op: type, data })
        : this.startTransaction(name, type);

      return span ? span : fallbackRetObj;
    }
    return fallbackRetObj;
  },
  finishSpan(span: any) {
    if (this.isEnabled()) {
      if (span && span.endTimestamp) {
        return fallbackRetObj;
      }
      return span ? span.finish() : fallbackRetObj;
    }
    return fallbackRetObj;
  },
  getCurrentTransaction() {
    if (this.isEnabled()) {
      return apm.getCurrentHub().getScope().getTransaction();
    }
    return undefined;
  },
  getCurrentTraceIds() {
    if (this.isEnabled()) {
      return apm.currentTraceIds;
    }
    return undefined;
  },
  startTransaction(name: string, type: string = ApmSpanType.UNKNOWN) {
    if (apm && this.isEnabled()) {
      const tr = apm.startTransaction({ name, op: type });
      return tr ? tr : fallbackRetObj;
    }

    return fallbackRetObj;
  },
  finishTransaction(transaction: any) {
    if (apm && this.isEnabled()) {
      if (transaction && transaction.endTimestamp) {
        return fallbackRetObj;
      }
      return transaction ? transaction.finish() : fallbackRetObj;
    }
    return fallbackRetObj;
  },
  apmDecorator(fn: () => void, { apmLabel, apmType, loggingEnabled = true, transaction }: any = {}) {
    const wrapper = function (origin: any) {
      return function (...args: any[]) {
        // Extend it to use apm or whatever you want
        const span = ApmHelper.startSpan(apmLabel, apmType, { transaction }); // you can use label if you need some extra meta
        try {
          return origin(...args);
        } finally {
          ApmHelper.finishSpan(span);
        }
      };
    };

    if (loggingEnabled) {
      return wrapper(fn);
    } else {
      return fn;
    }
  },
};

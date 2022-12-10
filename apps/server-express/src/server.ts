import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import { auth } from 'express-oauth2-jwt-bearer';
import 'dotenv/config';
import { MongoClient } from 'mongodb';

import { ApmHelper, ApmSpanType } from '@libs/apm';
import errorHandler from './middleware/global-error-handler';
import sentryAPM from './libraries/sentryApm';
import filmRoutes from './routes/films';

const { DOMAIN, AUDIENCE, PORT = 3030 } = process.env;

const app = express();

if (!DOMAIN || !AUDIENCE) {
  throw new Error('Please make sure that DOMAIN and AUDIENCE is set in your ENV');
}
// Set up sentry APM
sentryAPM(app);
// add port
app.set('port', PORT);
// Enable CORS, security, compression, favicon and body parsing
app.use(
  cors(process.env.NODE_ENV === 'development' ? {} : {
    origin: 'https://my-film-list.netlify.app',
    optionsSuccessStatus: 200,
  }),
);

app.use(bodyParser.json());
app.use(compression());
app.use(
  bodyParser.json({
    limit: '1mb',
  }),
);
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
  }),
);

const checkJwt = auth({
  issuerBaseURL: `https://${DOMAIN}/`,
  audience: AUDIENCE,
});


// const jsonParser = express.json();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017';

const mongoClient = new MongoClient(mongoURI);

(async () => {
  const transaction = ApmHelper.startTransaction('Start application', ApmSpanType.SYSTEM);

  let span;
  try {
    span = ApmHelper.startSpan('Mongo connection', ApmSpanType.SYSTEM, { transaction });
    await mongoClient.connect();
    app.locals.collection = mongoClient.db('films').collection('list');
    ApmHelper.finishSpan(span);

    ApmHelper.apmDecorator(
      () => {
        app.listen(app.get('port'));
        console.info(`Server has been started on http://localhost:${PORT}`);
        console.log(` * MODE: ${process.env.NODE_ENV === 'development' ? 'development' : 'production'}`);
        console.log(` * PORT: ${app.get('port')}`);
        console.log(` * DB: ${mongoURI ? mongoURI : 'is not connected'}`);
      },
      {
        apmLabel: 'Run server',
        apmType: ApmSpanType.SYSTEM,
        transaction,
      },
    )();
  } catch (err) {
    throw new Error(`Server start error: ${err ? err : 'unknown error'}`);
  } finally {
    ApmHelper.finishSpan(span);
    ApmHelper.finishTransaction(transaction);
  }
})();

// API Routes
app.use('/api/films', checkJwt, filmRoutes);

// Handle GET requests to /api route
app.get('/api', (_, res) => {
  res.json({ message: 'My film list server' });
});

app.get('/debug-sentry', () => {
  throw new Error('Test Sentry error!');
});

app.get('/health', (_, res) => res.send({ status: 'ok' }));

app.use(
  errorHandler({
    sentryAPMClient: app.get('sentryAPMClient'),
  }),
);

process.on('SIGINT', async () => {
  await mongoClient.close();
  ApmHelper.getCurrentTransaction()?.finish();
  console.log('Application is closed');
  process.exit();
});

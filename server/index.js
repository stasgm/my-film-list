'use strict';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import 'dotenv/config';
import { MongoClient, ObjectId } from 'mongodb';

import errorHandler from './middleware/global-error-handler.js';
import sentryAPM from './libraries/sentryApm.js';
import { ApmHelper, ApmSpanType } from '../libraries/ApmHelper.js';
import { auth } from 'express-oauth2-jwt-bearer';

const { DOMAIN, AUDIENCE, PORT = 3030 } = process.env;

const app = express();

if (!DOMAIN || !AUDIENCE) {
  throw new Error('Please make sure that DOMAIN and AUDIENCE is set in your ENV');
}
// Set up sentry APM
sentryAPM(app);
// add port
app.set('port', process.env.PORT);
// Enable CORS, security, compression, favicon and body parsing
app.use(
  cors({
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

app.use(
  auth({
    issuerBaseURL: `https://${DOMAIN}/`,
    audience: AUDIENCE,
  }),
);

const jsonParser = express.json();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017';

const mongoClient = new MongoClient(mongoURI, {
  useNewUrlParser: true,
});

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
        console.info('Server has been started');
        console.log(` * MODE: ${process.env.NODE_ENV === 'development' ? 'development' : 'production'}`);
        console.log(` * PORT: ${app.get('port')}`);
        console.log(` * DB: ${mongoURI ? `${mongoURI}` : 'is not connected'}`);
      },
      {
        apmLabel: 'Run server',
        apmType: ApmSpanType.SYSTEM,
        transaction,
      },
    )();
  } catch (err) {
    throw new Error('Server start error: ', err ? err : 'unknown error');
  } finally {
    ApmHelper.finishSpan(span);
    ApmHelper.finishTransaction(transaction);
  }
})();

const mapFilm = (film) => {
  return {
    id: film._id,
    name: film.name,
    url: film.url,
    seen: film.seen,
    type: film.type,
  };
};

// API
app.get('/api/films', async (req, res) => {
  // req.auth.payload.sub;
  // req.user
  const transaction = ApmHelper.startTransaction('Get films', ApmSpanType.API_REQUEST);
  const span = ApmHelper.startSpan('/api/films', ApmSpanType.API_REQUEST, { transaction });

  const collection = req.app.locals.collection;

  const films = await collection.find({}).toArray();
  const list = films.map((i) => mapFilm(i));

  res.send(list);

  ApmHelper.finishSpan(span);
  ApmHelper.finishTransaction(transaction);
});

app.get('/api/films/:id', async (req, res) => {
  const transaction = ApmHelper.startTransaction('Get film by id', ApmSpanType.API_REQUEST);
  const span = ApmHelper.startSpan('/api/films/:id', ApmSpanType.API_REQUEST, { transaction });
  //   data: {
  //   id: req.params.id,
  // },
  const id = ObjectId(req.params.id);

  const collection = req.app.locals.collection;
  const film = await collection.findOne({ _id: id });

  res.send(mapFilm(film));

  ApmHelper.finishSpan(span);
  ApmHelper.finishTransaction(transaction);
});

app.post('/api/films', jsonParser, async (req, res) => {
  const transaction = ApmHelper.startTransaction('Add a new film', ApmSpanType.API_REQUEST);
  const span = ApmHelper.startSpan('/api/films', ApmSpanType.API_REQUEST, { transaction });

  const newFilm = req.body
    ? {
        name: req.body.name,
        url: req.body.url,
        seen: req.body.seen || false,
        type: req.body.type || 0,
      }
    : {
        error: 'body is empty',
      };

  if (!req.body) {
    ApmHelper.finishSpan(span);
    ApmHelper.finishTransaction(transaction);
    return res.sendStatus(400);
  }

  const collection = req.app.locals.collection;

  const result = await collection.insertOne(newFilm);

  res.send({
    id: result.insertedId,
    ...newFilm,
  });

  ApmHelper.finishSpan(span);
  ApmHelper.finishTransaction(transaction);
});

app.delete('/api/films/:id', async (req, res) => {
  const transaction = ApmHelper.startTransaction('Delete film', ApmSpanType.API_REQUEST);
  const span = ApmHelper.startSpan('/api/films', ApmSpanType.API_REQUEST, { transaction });

  const id = ObjectId(req.params.id);

  const collection = req.app.locals.collection;

  const result = await collection.findOneAndDelete({ _id: id });
  const film = result.value;
  res.send(mapFilm(film));
  ApmHelper.finishSpan(span);
  ApmHelper.finishTransaction(transaction);
});

app.put('/api/films/:id', jsonParser, async (req, res) => {
  const transaction = ApmHelper.startTransaction('Update film', ApmSpanType.API_REQUEST);
  const span = ApmHelper.startSpan('/api/films/:id', ApmSpanType.API_REQUEST, { transaction });

  const filmData = req.body
    ? {
        name: req.body.name,
        url: req.body.url,
        seen: req.body.seen || false,
        type: req.body.type || 0,
      }
    : {
        error: 'body is empty',
      };

  if (!req.body) {
    ApmHelper.finishSpan(span);
    ApmHelper.finishTransaction(transaction);

    return res.sendStatus(400);
  }

  const id = ObjectId(req.params.id);

  const collection = req.app.locals.collection;

  const result = await collection.findOneAndUpdate({ _id: id }, { $set: filmData }, { returnDocument: 'after' });
  const film = result.value;
  res.send(mapFilm(film));

  ApmHelper.finishSpan(span);
  ApmHelper.finishTransaction(transaction);
});

app.patch('/api/films/:id', jsonParser, async (req, res) => {
  const transaction = ApmHelper.startTransaction('Update film', ApmSpanType.API_REQUEST);
  const span = ApmHelper.startSpan('/api/films/:id', ApmSpanType.API_REQUEST, { transaction });

  const filmData = req.body
    ? {
        ...req.body,
      }
    : {
        error: 'body is empty',
      };

  if (!req.body) {
    ApmHelper.finishSpan(span);
    ApmHelper.finishTransaction(transaction);

    return res.sendStatus(400);
  }

  const id = ObjectId(req.params.id);

  const collection = req.app.locals.collection;

  const result = await collection.findOneAndUpdate({ _id: id }, { $set: filmData }, { returnDocument: 'after' });
  const film = result.value;

  res.send(mapFilm(film));

  ApmHelper.finishSpan(span);
  ApmHelper.finishTransaction(transaction);
});

// Handle GET requests to /api route
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('Test Sentry error!');
});

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });

// error handling
// add global error handler

app.use(
  errorHandler({
    sentryAPMClient: app.get('sentryAPMClient'),
  }),
);

// app.use(function (err, req, res, next) {
//   console.error(err.stack);
//   const errorObj = {
//     error: err.message,
//     sentry: res.sentry,
//   };
//   res.status(500).json(errorObj);
// });

process.on('SIGINT', async () => {
  await mongoClient.close();
  ApmHelper.getCurrentTransaction()?.finish();
  console.log('Application is closed');
  process.exit();
});

'use strict';
// import path from 'path';
// import { fileURLToPath } from 'url';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import 'dotenv/config';
import { MongoClient, ObjectId } from 'mongodb';

import errorHandler from './middleware/global-error-handler.js';
import sentryAPM from './libraries/sentryApm.js';
import { ApmHelper, ApmSpanType } from '../libraries/ApmHelper.js';

const app = express();
// Set up sentry APM
sentryAPM(app);
// add port
app.set('port', process.env.PORT || 3030);
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

    // span = ApmHelper.startSpan('Run server', ApmSpanType.SYSTEM, { transaction });

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

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Serve static assets
// app.use(express.static(path.resolve(__dirname, '../client/build')));

// API
app.get('/api/films', async (req, res) => {
  // const transaction = Sentry.startTransaction({
  //   name: '/api/films',
  //   op: 'Get films list',
  // });

  const collection = req.app.locals.collection;

  const films = await collection.find({}).toArray();
  const list = films.map((i) => mapFilm(i));

  res.send(list);
});

app.get('/api/films/:id', async (req, res) => {
  const transaction = Sentry.startTransaction({
    name: '/api/films/:id',
    op: 'Get film by id',
    data: {
      id: req.params.id,
    },
  });

  const id = ObjectId(req.params.id);

  const collection = req.app.locals.collection;
  try {
    const film = await collection.findOne({ _id: id });
    res.send(mapFilm(film));
  } catch (err) {
    // console.error(err);
    // res.send({ error: err.message });
  } finally {
    transaction && transaction.finish();
  }
});

app.post('/api/films', jsonParser, async (req, res) => {
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

  const transaction = Sentry.startTransaction({
    name: '/api/films',
    op: 'Add a new film',
    data: newFilm,
  });

  if (!req.body) {
    transaction && transaction.finish();
    return res.sendStatus(400);
  }

  const collection = req.app.locals.collection;

  try {
    const result = await collection.insertOne(newFilm);
    res.send({
      id: result.insertedId,
      ...newFilm,
    });
  } catch (err) {
    // console.error(err);
    // res.send({ error: err.message });
  } finally {
    transaction && transaction.finish();
  }
});

app.delete('/api/films/:id', async (req, res) => {
  const transaction = Sentry.startTransaction({
    name: '/api/films',
    op: 'Delete film',
    data: {
      id: req.params.id,
    },
  });

  const id = ObjectId(req.params.id);

  const collection = req.app.locals.collection;

  try {
    const result = await collection.findOneAndDelete({ _id: id });
    const film = result.value;
    res.send(mapFilm(film));
  } catch (err) {
    // console.error(err);
    // res.send({ error: err });
  } finally {
    transaction && transaction.finish();
  }
});

app.put('/api/films/:id', jsonParser, async (req, res) => {
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

  const transaction = Sentry.startTransaction({
    name: '/api/films/:id',
    op: 'Update film',
    data: { id: req.params.id, ...filmData },
  });

  if (!req.body) {
    transaction && transaction.finish();
    return res.sendStatus(400);
  }

  const id = ObjectId(req.params.id);

  const collection = req.app.locals.collection;

  try {
    const result = await collection.findOneAndUpdate({ _id: id }, { $set: filmData }, { returnDocument: 'after' });
    const film = result.value;
    res.send(mapFilm(film));
  } catch (err) {
    // console.error(err);
    // res.send({ error: err });
  } finally {
    transaction && transaction.finish();
  }
});

app.patch('/api/films/:id', jsonParser, async (req, res) => {
  const filmData = req.body
    ? {
        ...req.body,
      }
    : {
        error: 'body is empty',
      };

  const transaction = Sentry.startTransaction({
    name: '/api/films/:id',
    op: 'Update film',
    data: { id: req.params.id, ...filmData },
  });

  if (!req.body) {
    transaction && transaction.finish();
    return res.sendStatus(400);
  }

  const id = ObjectId(req.params.id);

  const collection = req.app.locals.collection;

  try {
    const result = await collection.findOneAndUpdate({ _id: id }, { $set: filmData }, { returnDocument: 'after' });
    const film = result.value;
    res.send(mapFilm(film));
  } catch (err) {
    // console.error(err);
    // res.send({ error: err });
  } finally {
    transaction && transaction.finish();
  }
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

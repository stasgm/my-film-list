import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import { auth } from 'express-oauth2-jwt-bearer';
import 'dotenv/config';
import { MongoClient, ObjectId } from 'mongodb';

import errorHandler from './middleware/global-error-handler';
import sentryAPM from './libraries/sentryApm';
import { ApmHelper, ApmSpanType } from '@libs/apm';

export enum IResourceType {
  'film' = 0,
  'serial' = 1
}

interface IDBFilm {
  _id: ObjectId;
  name: string;
  url: string;
  seen: boolean;
  type: IResourceType;
}

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

app.use(
  auth({
    issuerBaseURL: `https://${DOMAIN}/`,
    audience: AUDIENCE,
  }),
);

const jsonParser = express.json();

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

const mapFilm = (film: IDBFilm) => {
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
  const userId = req.auth?.payload.sub;
  const transaction = ApmHelper.startTransaction('Get films', ApmSpanType.API_REQUEST);
  const span = ApmHelper.startSpan('/api/films', ApmSpanType.API_REQUEST, {
    transaction,
    data: {
      userId,
    },
  });

  const collection = req.app.locals.collection;

  const films = await collection.find({ userId }).toArray();
  const list = films.map((i: IDBFilm) => mapFilm(i));

  res.send(list);

  ApmHelper.finishSpan(span);
  ApmHelper.finishTransaction(transaction);
});

app.get('/api/films/:id', async (req, res) => {
  const userId = req.auth?.payload.sub;
  const transaction = ApmHelper.startTransaction('Get film by id', ApmSpanType.API_REQUEST);
  const span = ApmHelper.startSpan('/api/films/:id', ApmSpanType.API_REQUEST, {
    transaction,
    data: {
      userId,
    },
  });

  const id = new ObjectId(req.params.id);

  const collection = req.app.locals.collection;
  const film = await collection.findOne({ _id: id, userId });

  res.send(mapFilm(film));

  ApmHelper.finishSpan(span);
  ApmHelper.finishTransaction(transaction);
});

app.post('/api/films', jsonParser, async (req, res) => {
  const userId = req.auth?.payload.sub;
  const transaction = ApmHelper.startTransaction('Add a new film', ApmSpanType.API_REQUEST);
  const span = ApmHelper.startSpan('/api/films', ApmSpanType.API_REQUEST, { transaction });

  const newFilm = req.body
    ? {
      name: req.body.name,
      url: req.body.url,
      seen: req.body.seen || false,
      type: req.body.type || 0,
      userId,
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

  ApmHelper.finishSpan(span);
  ApmHelper.finishTransaction(transaction);

  return res.send({
    id: result.insertedId,
    ...newFilm,
  });
});

app.delete('/api/films/:id', async (req, res) => {
  const userId = req.auth?.payload.sub;
  const transaction = ApmHelper.startTransaction('Delete film', ApmSpanType.API_REQUEST);
  const span = ApmHelper.startSpan('/api/films', ApmSpanType.API_REQUEST, { transaction });

  const id = new ObjectId(req.params.id);

  const collection = req.app.locals.collection;

  const result = await collection.findOneAndDelete({ _id: id, userId });
  const film = result.value;

  res.send(mapFilm(film));

  ApmHelper.finishSpan(span);
  ApmHelper.finishTransaction(transaction);
});

app.put('/api/films/:id', jsonParser, async (req, res) => {
  const userId = req.auth?.payload.sub;
  const transaction = ApmHelper.startTransaction('Update film', ApmSpanType.API_REQUEST);
  const span = ApmHelper.startSpan('/api/films/:id', ApmSpanType.API_REQUEST, { transaction });

  const filmData = req.body
    ? {
      name: req.body.name,
      url: req.body.url,
      seen: req.body.seen || false,
      type: req.body.type || 0,
      userId,
    }
    : {
      error: 'body is empty',
    };

  if (!req.body) {
    ApmHelper.finishSpan(span);
    ApmHelper.finishTransaction(transaction);

    return res.sendStatus(400);
  }

  const id = new ObjectId(req.params.id);

  const collection = req.app.locals.collection;

  const result = await collection.findOneAndUpdate(
    { _id: id, userId },
    { $set: filmData },
    { returnDocument: 'after' },
  );

  const film = result.value;

  ApmHelper.finishSpan(span);
  ApmHelper.finishTransaction(transaction);

  return res.send(mapFilm(film));
});

app.patch('/api/films/:id', jsonParser, async (req, res) => {
  const userId = req.auth?.payload.sub;
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

  const id = new ObjectId(req.params.id);

  const collection = req.app.locals.collection;

  const result = await collection.findOneAndUpdate(
    { _id: id, userId },
    { $set: filmData },
    { returnDocument: 'after' },
  );

  const film = result.value;

  ApmHelper.finishSpan(span);
  ApmHelper.finishTransaction(transaction);

  return res.send(mapFilm(film));
});

// Handle GET requests to /api route
app.get('/api', (req, res) => {
  res.json({ message: 'My film list server' });
});

app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('Test Sentry error!');
});

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

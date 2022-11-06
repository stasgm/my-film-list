'use strict';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import 'dotenv/config';
import pkg from 'mongodb';

const { MongoClient, ObjectId } = pkg;

const app = express();

const whitelist = ['https://my-film-list.netlify.app', 'https://my-film-list.netlify.app/'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) === -1) {
      const errorMessage = 'The CORS policy for this site does not allow access from the specified Origin.';
      callback(new Error(errorMessage), false);
    }
    callback(null, true);
  },
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.set('port', process.env.PORT || 3030);
app.set(cors(corsOptions));
app.use(bodyParser.json());
app.use(compression());

const jsonParser = express.json();

const mongoClient = new MongoClient(process.env.MONGO_URI || 'mongodb://localhost:27017', {
  useNewUrlParser: true,
});

(async () => {
  try {
    await mongoClient.connect();
    app.locals.collection = mongoClient.db('films').collection('list');
    console.log(`DB is connected: ${process.env.MONGO_URI}`);

    app.listen(app.get('port'));
    console.log(`Server is listening on ${app.get('port')}`);
  } catch (err) {
    if (err) return console.log(err);
  }
})();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mapFilm = (film) => {
  return {
    id: film._id,
    name: film.name,
    url: film.url,
    seen: film.seen,
    type: film.type,
  };
};

// Serve static assets
app.use(express.static(path.resolve(__dirname, '../client/build')));

// API
app.options('/api/films/:id', cors(corsOptions));

app.get('/api/films', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const collection = req.app.locals.collection;

  try {
    const films = await collection.find({}).toArray();
    const list = films.map((i) => mapFilm(i));
    res.send(list);
  } catch (err) {
    console.err(err);
    res.send({ error: err.message });
  }
});

app.get('/api/films/:id', async (req, res) => {
  // res.setHeader('Access-Control-Allow-Origin', '*');

  const collection = req.app.locals.collection;
  try {
    const id = ObjectId(req.params.id);
    const film = await collection.findOne({ _id: id });
    res.send(mapFilm(film));
  } catch (err) {
    console.err(err);
    res.send({ error: err.message });
  }
});

app.post('/api/films', jsonParser, async (req, res) => {
  // res.setHeader('Access-Control-Allow-Origin', '*');

  if (!req.body) return res.sendStatus(400);

  const collection = req.app.locals.collection;
  const newFilm = {
    name: req.body.name,
    url: req.body.url,
    seen: req.body.seen || false,
    type: req.body.type || 0,
  };

  try {
    const result = await collection.insertOne(newFilm);
    res.send({
      id: result.insertedId,
      ...newFilm,
    });
  } catch (err) {
    console.err(err);
    res.send({ error: err.message });
  }
});

app.delete('/api/films/:id', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const collection = req.app.locals.collection;
  try {
    const id = ObjectId(req.params.id);
    const result = await collection.findOneAndDelete({ _id: id });
    const film = result.value;
    res.send(mapFilm(film));
  } catch (err) {
    console.err(err);
    res.send({ error: err });
  }
});

app.put('/api/films/:id', jsonParser, async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!req.body) return res.sendStatus(400);

  const collection = req.app.locals.collection;
  try {
    const id = ObjectId(req.params.id);
    const result = await collection.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name: req.body.name,
          url: req.body.url,
          seen: req.body.seen,
          type: req.body.type,
        },
      },
      { returnDocument: 'after' },
    );
    const film = result.value;
    res.send(mapFilm(film));
  } catch (err) {
    console.err(err);
    res.send({ error: err });
  }
});

app.patch('/api/films/:id', jsonParser, async (req, res) => {
  if (!req.body) return res.sendStatus(400);

  res.setHeader('Access-Control-Allow-Origin', '*');

  const collection = req.app.locals.collection;
  try {
    const id = ObjectId(req.params.id);
    const result = await collection.findOneAndUpdate(
      { _id: id },
      { $set: { ...req.body } },
      { returnDocument: 'after' },
    );
    const film = result.value;
    res.send(mapFilm(film));
  } catch (err) {
    console.err(err);
    res.send({ error: err });
  }
});

// Handle GET requests to /api route
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// error handling
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err);
});

process.on('SIGINT', async () => {
  await mongoClient.close();
  console.log('Application is closed');
  process.exit();
});

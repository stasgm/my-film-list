'use strict';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import 'dotenv/config';
import pkg from 'mongodb';
const { MongoClient, ObjectId } = pkg;

const app = express();

app.set('port', process.env.PORT || 3001);
app.use(bodyParser.json());
app.use(compression());

const jsonParser = express.json();

const mongoClient = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true });

let db;

(async () => {
  try {
    await mongoClient.connect();
    app.locals.collection = mongoClient.db('films').collection('list');
    console.log('db is connected!');

    app.listen(3001);
    console.log(`server is listening on ${app.get('port')}`);
  } catch (err) {
    if (err) return console.log(err);
  }
})();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static assets
app.use(express.static(path.resolve(__dirname, '../client/build')));

// API
app.get('/api/films', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const collection = req.app.locals.collection;

  try {
    const films = await collection.find({}).toArray();
    const list = films.map((i) => {
      return {
        id: i._id,
        name: i.name,
        url: i.url,
        seen: i.seen,
      };
    });
    res.send(list);
  } catch (err) {
    return console.log(err);
  }
});

app.get('/api/films/:id', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const collection = req.app.locals.collection;
  try {
    const id = ObjectId(req.params.id);
    const film = await collection.findOne({ _id: id });
    res.send({
      id: film._id,
      name: film.name,
      url: film.url,
      seen: film.seen,
    });
  } catch (err) {
    console.log(err);
    res.send({ error: err.message });
  }
});

app.post('/api/films', jsonParser, async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!req.body) return res.sendStatus(400);

  const film = { name: req.body.name, url: req.body.url, seen: req.body.seen || false };
  const collection = req.app.locals.collection;

  try {
    const res = await collection.insertOne(film);
    const film = result.value;
    res.send({
      id: film._id,
      name: film.name,
      url: film.url,
      seen: film.seen,
    });
  } catch (err) {
    console.log(err);
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
    res.send({
      id: film._id,
      name: film.name,
      url: film.url,
      seen: film.seen,
    });
  } catch (err) {
    console.log(err);
    res.send({ error: err });
  }
});

app.put('/api/films/:id', jsonParser, async (req, res) => {
  if (!req.body) return res.sendStatus(400);

  res.setHeader('Access-Control-Allow-Origin', '*');

  const collection = req.app.locals.collection;
  try {
    const id = ObjectId(req.params.id);
    const result = await collection.findOneAndUpdate(
      { _id: id },
      { $set: { name: req.body.name, url: req.body.url, seen: req.body.seen } },
      { returnDocument: 'after' },
    );
    const film = result.value;
    res.send({
      id: film._id,
      name: film.name,
      url: film.url,
      seen: film.seen,
    });
  } catch (err) {
    console.log(err);
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
    res.send({
      id: film._id,
      name: film.name,
      url: film.url,
      seen: film.seen,
    });
  } catch (err) {
    console.log(err);
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

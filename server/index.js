'use strict';
// Перечисление зависимостей:
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import 'dotenv/config';
import { MongoClient } from 'mongodb';
// import db from "./db.json";

const app = express();

app.set('port', process.env.PORT || 3001);
app.use(bodyParser.json());
app.use(compression());

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true });

let db;

client.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    db = client.db('films');
    console.log('connected!');
  }
});

function isConnected() {
  return !!client && !!client.topology && client.topology.isConnected();
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static assets
app.use(express.static(path.resolve(__dirname, '../client/build')));

// API
app.get('/api/list', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // perform actions on the collection object
  (async () => {
    const listCollection = await db.collection('list');

    const films = await listCollection.find({}).toArray();
    // const allValues = await cursor.toArray();
    const list = films.map((i) => {
      return { name: i.name, url: i.url };
    });
    res.send(list);
  })();
});

// Handle GET requests to /api route
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "public", "index.html"));
// });

// error handling
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err);
});

app.listen(app.get('port'), (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${app.get('port')}`);
});

function scrapeSelectBy() {
  /*
  return new Promise((resolve, reject) => {
    let list = [];
    const osmosis = require("osmosis");

    osmosis.config(
      "user_agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
    );
    osmosis.config("tries", 1);
    osmosis.config("concurrency", 2);

    osmosis
      .get("https://select.by/kurs/")
      .find(".module-kurs_nbrb:first tr:gt(1)")
      .set({
        currency: "td[1]",
        rate: "td[2]"
      })
      .data(data => {
        if (data.currency > "" && data.rate > "") {
          list.push(data);
        }
      })
      .error(err => reject(err))
      .done(() => resolve(list));
  });
  */
}

scrapeSelectBy();

/* scrapeSelectBy().then(list => {
  console.log('done!');
  console.log(list);
//  saveToJson(list);
});
 */
// function saveToJson(data) {
//   var fs = require("fs");
//   var json = JSON.stringify(data, null, 4);
//   fs.writeFile("myjsonfile.json", json, "utf8", function(err) {
//     if (err) throw err;
//     console.log("complete");
//   });
// }

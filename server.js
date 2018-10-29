"use strict";
// Перечисление зависимостей:
const path = require("path");
const express = require("express"),
  app = express();
const bodyParser = require("body-parser");
const compression = require("compression");
const db = require('./db.json');

// const scrape = require("website-scraper");

const { URL, URLSearchParams } = require("url");

app.set("port", process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(compression());

// Serve static assets
app.use(express.static(path.resolve(__dirname, "public")));


// API
app.get("/test", (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.write(JSON.stringify(db));
  res.end();
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err);
});

app.listen(app.get("port"), err => {
  if (err) {
    return console.log("something bad happened", err);
  }
  console.log(`server is listening on ${app.get("port")}`);
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
function saveToJson(data) {
  var fs = require("fs");
  var json = JSON.stringify(data, null, 4);
  fs.writeFile("myjsonfile.json", json, "utf8", function(err) {
    if (err) throw err;
    console.log("complete");
  });
}

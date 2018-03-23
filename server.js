"use strict";
// Перечисление зависимостей:
const path = require('path');
const express = require('express'), app = express();
const bodyParser = require('body-parser');
const compression = require('compression');

const { URL, URLSearchParams } = require('url');

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(compression());

// Serve static assets
app.use(express.static(path.resolve(__dirname, 'public')));

// API
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err);
});

app.listen(app.get('port'), (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${app.get('port')}`);
});

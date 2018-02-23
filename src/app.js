'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./route.js');

var app = express();

app.use(bodyParser.urlencoded({extended: false, limit: '*'}));
app.use(bodyParser.json({limit:'*'}));
routes.registerRoutes(app);

app.listen(3000, function () {
    console.log('Listening on port 3000...');
});

app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500).send(err);
});

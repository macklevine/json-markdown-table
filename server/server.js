'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var router = require('./routeconfigurators/routes');
var config = require('../config').settings;

var app = express();
app.use(bodyParser.json());
console.log(__dirname);

app.use(express.static(__dirname + "/../client/js/"));
//configure routes
router.configureRoutes(app);

app.listen(config.port, function(){
	console.log("listening on port " + config.port);
});
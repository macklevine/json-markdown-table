'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var router = require('./routeconfigurators/routes');

var app = express();
app.use(bodyParser.json());

app.use(express.static(__dirname + "/js/"));
//configure routes
router.configureRoutes(app);

app.listen(8123, function(){
	console.log("listening on port 8123");
});
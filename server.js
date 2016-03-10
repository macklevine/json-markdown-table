'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.use('/input', express.static(__dirname + "/js/index.html"));

app.listen(4015, function(){

});
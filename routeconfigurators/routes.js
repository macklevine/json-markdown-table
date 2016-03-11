'use strict';

var RouteConfigurator = function RouteConfigurator(){};
var JSONMarkdownService = require('../jsonmarkdownservice.js');

RouteConfigurator.prototype.configureRoutes = function configureRoutes(app){
	app.post('/sendFields', function(req, res){
		JSONMarkdownService.createJSONMarkdownTable(req.body)
			.then(function(markdownTableString){
				//maybe write a saved markdown to a database.
				res.status(200).send(markdownTableString);
			})
			.catch(function(error){
				res.status(200).send(error);
			});
	});
};

module.exports = new RouteConfigurator();
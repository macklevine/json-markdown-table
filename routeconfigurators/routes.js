'use strict';

var RouteConfigurator = function RouteConfigurator(){};
var JSONMarkdownService = require('../jsonmarkdownservice.js');

RouteConfigurator.prototype.configureRoutes = function configureRoutes(app){
	app.post('/sendFields', function(req, res){
		JSONMarkdownService.createJSONMarkdownTable(req)
			.then(function(markdownTableString){
				//maybe write a saved markdown to a database.
				res.send(200, markdownTableString)
			})
			.catch(function(error){
				res.send(500, error);
			});
	});
};

module.exports = new RouteConfigurator();
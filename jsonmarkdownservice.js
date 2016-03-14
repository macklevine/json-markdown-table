'use strict';

var _ = require('underscore');
var Promise = require('bluebird');

var test1 = require('./test1.json');
test1 = JSON.stringify
// console.log(test1);

var _isJSON = function _isJSON(string){
	try {
		return JSON.parse(str);
	} catch (e) {
		return false
	}
};

var JSONMarkdownService = function JSONMarkdownService(){};

JSONMarkdownService.prototype.createJSONMarkdownTable = function createJSONMarkdownTable(cells){
	console.log(cells);
	return this.validateHeaders(cells[0])
		.then(function(response){
			return response;
		})
		.catch(function(err){
			console.log("error caught...");
			return err;
		});
};

JSONMarkdownService.prototype.validateHeaders = function validateHeaders(headerCells){
	return new Promise(function(resolve, reject){
		_.each(headerCells, function(cell){
			console.log(cell.value);
			//find a way to determine if a string is a valid variable name.
			if(_isJSON(cell.value) || typeof cell.value !== 'string' || cell.value === ""){
				reject('The headers must all be non-JSON, non-empty strings');
			}
		});
		resolve("the headers look good.");
	});
};

JSONMarkdownService.prototype.findColumnWidth = function findColumnWidth(fieldArray, columnIndex){
	var maxWidth = 0;
	var columnValues = [];

	for (var i = 0; i < fieldArray.length; i++){
		var element = fieldArray[i][columnIndex];
		var parsed = _isJSON(element);
		if (!parsed){
			columnValues.push(element);
			maxWidth = _.max([maxWidth, element.length]);
		} else {
			var JSONstring = JSON.stringify(element, " ", 2).split("\n");
			columnValues.push(JSONstring);
			// console.log("logging JSON string...");
			// console.log(JSONstring);
			maxWidth = _.max([
					maxWidth, 
					_.max(JSONstring, function(JSONStringLine){
							return JSONStringLine.length;
						})
					]);
		}
	}

	return {
		maxWidth: maxWidth,
		columnValues: columnValues
	};
};

JSONMarkdownService.prototype.constructColumns = function constructColumns(columnObject){
	var cells = [];
	for (var i = 0; i < columnObject.columnValues.length; i++){
		cells[i] = "";
		//first element in the column requires top and bottom lines.
		if (i === 0){
			cells[i] = '|';
			for (var j = 0; j < maxWidth.length; j++){
				cells[i] += '-';
			}
			cells[i] += '|\n';
		}
		if (typeof columnObject.columnValues[i] === 'string'){
			cells[i] += ('|' + columnObject.columnValues[i] + '|\n');
		} else if (typeof columnObject.columnValues[i] === 'object'){

		}
	}
};

module.exports = new JSONMarkdownService();


'use strict';

var _ = require('underscore');
var Promise = require('bluebird');

//TODO: see if there is an easy way to replace for/in loops with _.each.

var _isJSON = function _isJSON(string){
	try {
		return JSON.parse(string);
	} catch (e) {
		return false
	}
};

var columnObjects = [];
var rowHeights = [];

var JSONMarkdownService = function JSONMarkdownService(){};

JSONMarkdownService.prototype.createJSONMarkdownTable = function createJSONMarkdownTable(fieldArray){
	var self = this;
	return this.validateHeaders(fieldArray[0])
		.then(function(response){
			//construct the markdown table string only if the headers are valid.
			for (var i = 0; i < fieldArray[0].length; i++){
				columnObjects.push(self.findColumnWidth(fieldArray, i));
			}

			for (var j = 0; j < fieldArray.length; j++){
				rowHeights.push(self.findRowHeight(fieldArray, j));
			}
			//add 

			return {
				reponse : response,
				columnObjects : columnObjects,
				rowHeights : rowHeights
			};
		})
		.catch(function(err){
			return err;
		});

	//Currently: just valdiating headers.
};

JSONMarkdownService.prototype.validateHeaders = function validateHeaders(headerCells){
	return new Promise(function(resolve, reject){
		_.each(headerCells, function(cell){
			// console.log(cell.value);
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
	var parsed, JSONstring;

	for (var i = 0; i < fieldArray.length; i++){
		var element = fieldArray[i][columnIndex].value;
		parsed = _isJSON(element);
		if (!parsed){
			columnValues.push(element);
			maxWidth = _.max([maxWidth, element.length]);
		} else {
			JSONstring = JSON.stringify(parsed, " ", 2).split("\n");
			columnValues.push(JSONstring);

			var largestSubString = _.max(JSONstring, function(JSONStringLine){
				// console.log(JSONStringLine.length);
				return JSONStringLine.length;
			});
			maxWidth = _.max([maxWidth, largestSubString.length]);
		}
	}
	//
	return {
		maxWidth: maxWidth,
		columnValues: columnValues
	};
};

JSONMarkdownService.prototype.findRowHeight = function findRowHeight(fieldArray, rowIndex){
	var maxHeight = 1; //the line height of a string.
	var parsed, JSONstring;
	for (var i = 0; i < fieldArray[0].length; i++){
		var element = fieldArray[rowIndex][i].value;
		parsed = _isJSON(element);
		if (parsed){
			JSONstring = JSON.stringify(parsed, " ", 2).split("\n");
			maxHeight = _.max([maxHeight, JSONstring.length]);
		}
	}
	return maxHeight; //return the max height for the row.
};

JSONMarkdownService.prototype.renderColumn = function renderColumn(columnObject){
	//for simplicity, render each column individually.
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


'use strict';

var _ = require('underscore');

//TODO: see if there is an easy way to replace for/in loops with _.each.

var JSONMarkdownTable = function JSONMarkdownTable(){};

JSONMarkdownTable.prototype.createJSONMarkdownTable = function createJSONMarkdownTable(fieldArray, callback){
	var self = this;
	if(callback){

	}
	//construct the markdown table string only if the headers are valid.
	if (!this.validateHeaders(fieldArray[0])){
		if(callback){
			callback(new Error("The headers must be non-JSON, non-empty strings."));
		} else {
			return "The headers must be non-JSON, non-empty strings.";
		}
	}
	var columns = [];
	var splitColumns = [];
	var tableMap = self.createTableMap(fieldArray);
	for (var i = 0; i < tableMap.columnObjects.length; i++){
		columns.push(self.renderColumn(tableMap.columnObjects[i], tableMap.rowHeights));
		splitColumns.push(columns[i].split('\n'));
	}
	if(callback){
		callback(null, {
			columns : columns,
			tableString : self.appendColumns(splitColumns)
		});
	} else {
		return {
			columns : columns,
			tableString : self.appendColumns(splitColumns)
		};
	}
};

JSONMarkdownTable.prototype.createTableMap = function createTableMap(fieldArray){
	var self = this;

	var columnObjects = [];
	var rowHeights = [];

	for (var i = 0; i < fieldArray[0].length; i++){
		columnObjects.push(self.findColumnWidth(fieldArray, i));
	}

	for (var j = 0; j < fieldArray.length; j++){
		rowHeights.push(self.findRowHeight(fieldArray, j));
	}
	return {
		columnObjects : columnObjects,
		rowHeights : rowHeights
	};
};

var _isJSON = function _isJSON(string){
	try {
		return JSON.parse(string);
	} catch (e) {
		return false;
	}
};

JSONMarkdownTable.prototype.validateHeaders = function validateHeaders(headerCells){
	var headersAreValid = true;
	_.each(headerCells, function(cell){
		//TODO: find a way to determine if a string is a valid variable name.
		if(_isJSON(cell.value) || typeof cell.value !== 'string' || cell.value === ""){
			headersAreValid = false;
			return false; //TODO: this is how you break out of a loop in lodash _.each.
			//check to see if this is the case for underscore as well.
		}
	});
	return headersAreValid;
};

JSONMarkdownTable.prototype.findColumnWidth = function findColumnWidth(fieldArray, columnIndex){
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

JSONMarkdownTable.prototype.findRowHeight = function findRowHeight(fieldArray, rowIndex){
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

/*
adds horizontal lines that look like this: |--------|
*/
var _addHorizontalLine = function _addHorizontalLine(cell, maxWidth){
	cell += '|';
	for (var j = 0; j < maxWidth; j++){
		cell += '-';
	}
	cell += '|\n';
	return cell;
};

var _addCellValueAndWhiteSpace = function _addCellValueAndWhiteSpace(cell, whiteSpaceToAdd, cellValue){
	cell += ('|' + cellValue);
	while (whiteSpaceToAdd){
		cell += " ";
		whiteSpaceToAdd--;
	}
	cell += "|\n";
	return cell;
};

/*
renders each column individually for simplicity.
*/
JSONMarkdownTable.prototype.renderColumn = function renderColumn(columnObject, rowHeights){
	//TODO: add white space based on row height.
	var cells = [];
	var whiteSpaceToAdd, currentCellHeight;
	for (var i = 0; i < columnObject.columnValues.length; i++){
		whiteSpaceToAdd = 0;
		currentCellHeight = 0;
		cells[i] = "";
		//first cell in the column gets both top and bottom lines.
		if (i === 0){
			cells[i] = _addHorizontalLine(cells[i], columnObject.maxWidth);
		}
		if (typeof columnObject.columnValues[i] === 'string'){
			whiteSpaceToAdd = columnObject.maxWidth - columnObject.columnValues[i].length;
			cells[i] = _addCellValueAndWhiteSpace(cells[i], whiteSpaceToAdd, columnObject.columnValues[i]);
			currentCellHeight++;

			//now handle adjusting row height.			
			whiteSpaceToAdd = columnObject.maxWidth;
			while (currentCellHeight < rowHeights[i]){
				cells[i] = _addCellValueAndWhiteSpace(cells[i], whiteSpaceToAdd, "");
				currentCellHeight++;
			}
		} else if (typeof columnObject.columnValues[i] === 'object'){
			for (var j = 0; j < columnObject.columnValues[i].length; j++){
				whiteSpaceToAdd = columnObject.maxWidth - columnObject.columnValues[i][j].length;
				cells[i] = _addCellValueAndWhiteSpace(cells[i], whiteSpaceToAdd, columnObject.columnValues[i][j]);
				currentCellHeight++; //add one for each iteration.
			}

			whiteSpaceToAdd = columnObject.maxWidth;
			while (currentCellHeight < rowHeights[i]){
				cells[i] = _addCellValueAndWhiteSpace(cells[i], whiteSpaceToAdd, "");
				currentCellHeight++;
			}
		}
		cells[i] = _addHorizontalLine(cells[i], columnObject.maxWidth);
	}
	return _.reduce(cells, function(memo, item){
		return memo + item;
	});
};

JSONMarkdownTable.prototype.appendColumns = function(splitColumns){
	//TODO: list and declare these variables using commas.
	var lines = [];
	var line = [];
	var subLine = "";
	var chopLength;
	for (var i = 0; i < splitColumns[0].length; i++){
		for (var j = 0; j < splitColumns.length; j++){
			subLine = splitColumns[j][i];
			chopLength = subLine.length - 1;
			if (j < (splitColumns.length - 1)){
				line.push(subLine.slice(0, chopLength));
			} 
			else {
				line.push(subLine);
			}
		}
		line = line.join('');
		lines.push(line);
		line = [];
	}
	return lines.join('\n');
	//write a couple of nested for loops down here.
};

module.exports = new JSONMarkdownTable();


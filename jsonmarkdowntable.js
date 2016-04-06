'use strict';

var _;

//TODO: modularize this factory.

try{
	_ = require('underscore');
} catch(e){
	try {
		_ = require('lodash');
	} catch(e){
		var UnderscoreFactory = require('./util/underscoresurrogates');
		_ = new UnderscoreFactory();
	}
}

//TODO: write a CLI https://developer.atlassian.com/blog/2015/11/scripting-with-node/

//TODO: continue replacing for/in loops with _.each.

var JSONMarkdownTable = function JSONMarkdownTable(){};

JSONMarkdownTable.prototype.createJSONMarkdownTable = function createJSONMarkdownTable(fieldArray, callback){
	var self = this;
	//construct the markdown table string only if the headers are valid.
	if (!this.validateHeaders(fieldArray[0])){
		if(callback){
			return callback(new Error("The headers must be non-JSON, non-empty strings."));
		} else {
			return "The headers must be non-JSON, non-empty strings.";
		}
	}
	var columns = [];
	var splitColumns = [];
	var tableMap = self.createTableMap(fieldArray);
	_.each(tableMap.columnObjects, function(columnObject, index, columnObjects){
		columns.push(self.renderColumn(columnObject, tableMap.rowHeights));
		splitColumns.push(columns[index].split('\n'));
	});
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

	_.each(fieldArray[0], function(item, index){
		columnObjects.push(self.findColumnWidth(fieldArray, index));
	});
	_.each(fieldArray, function(item, index){
		rowHeights.push(self.findRowHeight(fieldArray, index));
	});

	return {
		columnObjects : columnObjects,
		rowHeights : rowHeights
	};
};

/*
determines whether an input is a JSON string, a regular string, or an object.
returns an object with two properties: value and type.
*/
var _isJSONStringOrObject = function _isJSONStringOrObject(stringOrObject){
	if(typeof stringOrObject === 'object'){
		return {
			value: stringOrObject,
			type: "JSON"
		}
	} else {
		try {
			return {
				value: JSON.parse(stringOrObject),
				type: "JSON"
			}
		} catch (e) {
			return {
				value: stringOrObject,
				type: "String"
			};
		}
	}
};


/*
Validates the headers of a provided input (the zeroeth element.)
 */
JSONMarkdownTable.prototype.validateHeaders = function validateHeaders(headerCells){
	var headersAreValid = true;
	_.each(headerCells, function(cell){
		//TODO: find a way to determine if a string is a valid variable name.
		//Make this a configurable option.
		if(_isJSONStringOrObject(cell.value).type === 'JSON' || typeof cell.value !== 'string' || cell.value === ""){
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

	_.each(fieldArray, function(row){
		var cell = row[columnIndex].value;
		parsed = _isJSONStringOrObject(cell);
		if (parsed.type === "String"){
			columnValues.push(cell);
			maxWidth = _.max([maxWidth, cell.length]);
		} else {
			JSONstring = JSON.stringify(parsed.value, " ", 2).split("\n");
			columnValues.push(JSONstring);

			var largestSubString = _.max(JSONstring, function(JSONStringLine){
				return JSONStringLine.length;
			});
			maxWidth = _.max([maxWidth, largestSubString.length]);
		}
	});
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
		parsed = _isJSONStringOrObject(element);
		if (parsed.type === "JSON"){
			JSONstring = JSON.stringify(parsed.value, " ", 2).split("\n");
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


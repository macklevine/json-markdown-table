'use strict';

var chai = require('chai');
var expect = chai.expect;

var dummyInput1 = require('./dummyinputs/dummyinput1.json');
var dummyInput2 = require('./dummyinputs/dummyinput2.json');
var dummyInput3 = require('./dummyinputs/dummyinput3.json');

var jsonMarkdownService = require('../index');

describe('jsonMarkdownService', function(){
	describe('.validateHeaders() method', function(){
		it('should validate ensure that the headers of a given input are all strings', function(){
			var response = jsonMarkdownService.validateHeaders(dummyInput1[0])
			expect(response).to.be.ok;
		});
		it('should reject any set of headers where any of the cells do have JSON data', function(){
			var response = jsonMarkdownService.validateHeaders(dummyInput2[0])
			expect(response).to.equal(false);
		});
		it('should reject any set of headers where any of the cells contains an empty string', function(){
			var response = jsonMarkdownService.validateHeaders(dummyInput3[0]);
			expect(response).to.equal(false);
		});
	});
	describe('.findColumnWidth() method', function(){
		it('should find the widest cell in the column and send this value back as the column\'s max width', function(){
			var columnObj = jsonMarkdownService.findColumnWidth(dummyInput3, 2);
			expect(columnObj.maxWidth).to.equal(19);
			expect(columnObj.columnValues.length).to.equal(2);
			
		});
	});
	describe('.findRowHeight() method', function(){
		it('should find the tallest row in the fieldArray', function(){
			var maxHeight = jsonMarkdownService.findRowHeight(dummyInput3, 1);
			expect(maxHeight).to.equal(4);
			
		});
	});
	describe('.createTableMap() method', function(){
		it('should create a map of values we can use to construct columns', function(){
			var tableMap = jsonMarkdownService.createTableMap(dummyInput1);
			expect(tableMap.columnObjects).to.be.ok;
			var verdict;
			for (var i = 0; i < tableMap.columnObjects.length; i++){
				verdict = !!tableMap.columnObjects[i].maxWidth;
				expect(verdict).to.be.ok;
			}
		});
	});
	describe('.renderColumn() method', function(){
		it('should give us a column rendered from the table map', function(){
			//TODO: add the expected object here.
			var expectedColumnObject1 = '|-------------------|\n' +
																	'|header3            |\n' +
																	'|-------------------|\n' +
																	'|{                  |\n' +
																	'|  "mack": "levine",|\n' +
																	'|  "sara": "fraley" |\n' +
																	'|}                  |\n' +
																	'|-------------------|\n';

			var tableMap = jsonMarkdownService.createTableMap(dummyInput1);
			var generatedColumnObject = jsonMarkdownService.renderColumn(tableMap.columnObjects[2], tableMap.rowHeights);
			expect(generatedColumnObject).to.equal(expectedColumnObject1);
			console.log(generatedColumnObject);
		});
		it('should give us a column with cells that correctly scale to height of cells in adjacent rows', function(){
			var expectedColumnObject2 = '|-------|\n'+
							                    '|header1|\n'+
							                    '|-------|\n'+
							                    '|value1 |\n'+
							                    '|       |\n'+
							                    '|       |\n'+
							                    '|       |\n'+
							                    '|-------|\n';

			var tableMap = jsonMarkdownService.createTableMap(dummyInput1);
			var generatedColumnObject = jsonMarkdownService.renderColumn(tableMap.columnObjects[0], tableMap.rowHeights);
			expect(generatedColumnObject).to.equal(expectedColumnObject2);
			console.log(generatedColumnObject);
		});
	});
	describe('.createJSONMarkdownTable() method', function(){
		it('should give us a complete JSON markdown table when invoked with workable data', function(){
			var expectedTableObject =  '|-------|-------|-------------------|\n'+
																 '|header1|header2|header3            |\n'+
																 '|-------|-------|-------------------|\n'+
																 '|value1 |value2 |{                  |\n'+
																 '|       |       |  "mack": "levine",|\n'+
																 '|       |       |  "sara": "fraley" |\n'+
																 '|       |       |}                  |\n'+
																 '|-------|-------|-------------------|\n';
			var response = jsonMarkdownService.createJSONMarkdownTable(dummyInput1);
			expect(response.tableString).to.equal(expectedTableObject);
		});
		it('should work OK when invoked with data that has a non-stringified JavaScript object as the value of one of the cells', function(){
			dummyInput1[1][2] = {
				value: {
					mack: "levine",
					sara: "fraley"
				}
			};
			var response = jsonMarkdownService.createJSONMarkdownTable(dummyInput1);
			for(var i = 0; i < response.columns.length; i++){
				console.log(response.columns[i]);
			}
		});
	});
});
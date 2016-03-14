'use strict';

var chai = require('chai');
var expect = chai.expect;

var dummyInput1 = require('./dummyinputs/dummyinput1.json');
var dummyInput2 = require('./dummyinputs/dummyinput2.json');
var dummyInput3 = require('./dummyinputs/dummyinput3.json');

var jsonMarkdownService = require('../server/jsonmarkdownservice');

describe('jsonMarkdownService', function(){
	describe('.validateHeaders() method', function(){
		it('should validate ensure that the headers of a given input are all strings', function(done){
			jsonMarkdownService.validateHeaders(dummyInput1[0])
				.then(function(response){
					expect(response).to.equal("the headers look good.");
					done();
				});
		});
		it('should reject any set of headers where any of the cells do have JSON data', function(done){
			jsonMarkdownService.validateHeaders(dummyInput2[0])
				.catch(function(response){
					expect(response).to.equal('The headers must all be non-JSON, non-empty strings');
					done();
				});
		});
		it('should reject any set of headers where any of the cells contains an empty string', function(done){
			jsonMarkdownService.validateHeaders(dummyInput3[0])
				.catch(function(response){
					expect(response).to.equal('The headers must all be non-JSON, non-empty strings');
					done();
				});
		});
	});
	describe('.findColumnWidth() method', function(done){
		it('should find the widest cell in the column and send this value back as the column\'s max width', function(done){
			var columnObj = jsonMarkdownService.findColumnWidth(dummyInput3, 2);
			expect(columnObj.maxWidth).to.equal(19);
			expect(columnObj.columnValues.length).to.equal(2);
			done();
		});
	});
	describe('.findRowHeight() method', function(done){
		it('should find the tallest row in the fieldArray', function(done){
			var maxHeight = jsonMarkdownService.findRowHeight(dummyInput3, 1);
			expect(maxHeight).to.equal(4);
			done();
		});
	});
	describe('.createJSONMarkdownTable() method', function(done){
		it('should create a map of values we can use to construct columns', function(done){
			jsonMarkdownService.createJSONMarkdownTable(dummyInput1)
				.then(function(response){
					console.log(response);
					done();
				});
		});
	});
});
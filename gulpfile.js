'use strict';

var gulp = require('gulp');
var less = require('less');
var fs = require('fs');

gulp.task('default', function(){
	fs.readFile('./less/main.less', 'utf-8', function (e, contents){
		less.render(contents, function (e, output){
			fs.writeFile('./less/main.css', output.css);
		});
	});
});
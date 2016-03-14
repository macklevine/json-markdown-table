'use strict';

var gulp = require('gulp');
var less = require('less');
var fs = require('fs');
var server = require('gulp-develop-server');

gulp.task('default', ['compile-less', 'start-server']);

gulp.task('compile-less', function(){
	fs.readFile('./less/main.less', 'utf-8', function (e, contents){
		less.render(contents, function (e, output){
			fs.writeFile('./less/main.css', output.css);
			fs.writeFile('./js/main.css', output.css);
		});
	});
});

gulp.task( 'start-server', function() {
    server.listen( { path: './server.js' } );
});

var watcher = gulp.watch(['./js/*','./less/*'])
 
// gulp.task( 'restart-server', function() {
//     gulp.watch( [ './app.js' ], server.restart );
// });
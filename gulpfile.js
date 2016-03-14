'use strict';

var gulp = require('gulp');
var less = require('less');
var fs = require('fs');
var server = require('gulp-develop-server');

//set up the watchers only once.
gulp.task('default', ['compile-less', 'start-server', 'watch-for-changes']);

gulp.task('compile-less', function(){
	fs.readFile('./client/less/main.less', 'utf-8', function (e, contents){
		less.render(contents, function (e, output){
			fs.writeFile('./client/less/main.css', output.css);
			fs.writeFile('./client/js/main.css', output.css);
		});
	});
});

gulp.task( 'start-server', function() {
    server.listen( { path: './server/server.js' } );
});

gulp.task('watch-for-changes', function(){
	gulp.watch(['./client/js/*.js','./client/js/*.html','./server/*'], server.restart); //change to watch only for html and js files.
	gulp.watch('./client/less/*', ['compile-less', server.restart]);
});

 
gulp.task('restart-server', server.restart);
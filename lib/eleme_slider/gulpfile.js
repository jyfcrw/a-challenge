'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence').use(gulp);

// Watch Task
gulp.task('watch', function() {
	gulp.watch(["*.html",
				"lib/**/*",
				"css/**/*",
				"uploads/**/*",
				"!node_modules/**/*"], ['rebuild']);
});

// BrowserSync Task
gulp.task('sync', function() {
	browserSync({
		server: {
			baseDir: "."
		}
	});
});

// Development Rebuild.
gulp.task('rebuild', function() {
	browserSync.reload();
});

// Server Tasks
gulp.task('server', function(callback) {
	return runSequence(['sync', 'watch'], callback);
});

gulp.task('serve', ['server']);

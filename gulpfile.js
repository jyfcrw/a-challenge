'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var compass = require('gulp-compass');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var cp = require('child_process');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence').use(gulp);

// Image Task
gulp.task('images', function() {
	return gulp.src("_images/**/*")
		.pipe(plugins.changed("assets/images"))
		.pipe(plugins.imagemin({optimizationLevel: 5}))
		.pipe(gulp.dest("assets/images"));
});

// Sass Task
gulp.task('sass', function() {
  gulp.src('_scss/**/*.scss', { base: 'assets/css' })
    .pipe(compass({
      sass: '_scss',
      css: 'assets/css',
      image: 'assets/images',
      // style: "compressed",
      bundle_exec: true
    }))
    .pipe(gulp.dest("app/assets/css"))
    .pipe(browserSync.reload({stream:true}));
});

// Watch Task
gulp.task('watch', function() {
	gulp.watch("_images/**/*", function() {
		runSequence(['images'], ['rebuild'])
	});
	gulp.watch('_scss/**/*.scss', ['sass']);
	gulp.watch(["**/*.html",
				"uploads/**/*",
				"!app/**/*",
				"!node_modules/**/*"], ['rebuild']);
});

// BrowserSync Task
gulp.task('sync', function() {
	browserSync({
		server: {
			baseDir: "app"
		}
	});
});

// Jekyll Development Build.
gulp.task('jekyll', function (done) {
	return cp.spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: 'inherit'})
		.on('close', done);
});

// Development Rebuild.
gulp.task('rebuild', function() {
	return runSequence(['jekyll'], function () {
		browserSync.reload();
	});
});

// Server Tasks
gulp.task('server', function(callback) {
	return runSequence([ 'images', 'sass'],
		'jekyll',
		['sync', 'watch'],
		callback
	);
});

gulp.task('serve', ['server']);

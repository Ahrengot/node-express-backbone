var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var coffee = require('gulp-coffee')

var paths = {
	sass: './public/styles/**/*.scss',
	css: './public/styles/css',
	coffee: './public/js/coffee/**/*.coffee',
	js: './public/js'
}

/**
 * Compile sass and add vendor prefixes
 */
gulp.task('sass', function() {
	return gulp.src(paths.sass)
		.pipe(sass())
		.pipe(prefix("last 2 versions"))
		.pipe(gulp.dest(paths.css));
});

/**
 * Compile CoffeeScript
 */
gulp.task('coffee', function() {
	return gulp.src(paths.coffee)
		.pipe(
			coffee({
				bare: false
			})
			.on('error', console.log)
		)
		.pipe(gulp.dest(paths.js))
});

/**
 * Keep an eye on modyfied files and automatically run associated tasks
 */
gulp.task('watch', function() {
	gulp.watch([paths.sass], ['sass']);
	gulp.watch([paths.coffee], ['coffee']);
});

/**
 * Default gulp task
 */
gulp.task('default', ['coffee', 'sass', 'watch']);
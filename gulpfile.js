var gulp = require('gulp'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel');

gulp.task('react',  function () {
	return gulp.src(['components/*.js','app.js'])
    .pipe(concat('build.js'))
		.pipe(babel({
			presets: ['es2015', 'react']
		}))

    .on('error', console.error.bind(console))

		.pipe(gulp.dest('build/'));
});


gulp.task('watch', function() {
    gulp.watch(['components/*.js','app.js'], ['react']);
});

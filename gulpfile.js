var gulp = require('gulp'),
    babel = require('gulp-babel');

gulp.task('react',  function () {
	return gulp.src('app.js')
		.pipe(babel({
			presets: ['es2015', 'react']
		}))
    .on('error', console.error.bind(console))
		.pipe(gulp.dest('build/'));
});


gulp.task('watch', function() {
    gulp.watch('app.js', ['react']);
});

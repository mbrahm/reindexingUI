var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    runSequence = require('run-sequence');

gulp.task('copy-angular', function() {
    return gulp.src([
        './bower_components/angular/angular.min.js',
        './bower_components/angular-route/angular-route.min.js',
        './bower_components/angular-resource/angular-resource.min.js',
    ]).pipe(gulp.dest('_site/angular/'));
});

gulp.task('copy-bootstrap', function() {
    return gulp.src([
        './bower_components/bootstrap/dist/**',
    ]).pipe(gulp.dest('_site/bootstrap/'));
});

// create a default task and just log a message
gulp.task('default', function() {runSequence(
    'copy-angular'
);
});
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    runSequence = require('run-sequence'),
    clean = require('gulp-clean');

gulp.task('copy-angular', function() {
    return gulp.src([
        './bower_components/angular/angular.min.js',
        './bower_components/angular-route/angular-route.min.js',
        './bower_components/angular-resource/angular-resource.min.js',
        './bower_components/angular-local-storage/dist/angular-local-storage.min.js'
    ]).pipe(gulp.dest('_site/angular/'));
});

gulp.task('copy-bootstrap', function() {
    return gulp.src([
        './bower_components/bootstrap/dist/**/*',
    ]).pipe(gulp.dest('_site/bootstrap/'));
});

gulp.task('copy-jquery', function() {
    return gulp.src([
        './bower_components/jquery/dist/**/*',
    ]).pipe(gulp.dest('_site/jquery/'));
});

gulp.task('cleanup', function(){
    return gulp.src(['_site/angular/', '_site/bootstrap/', '_site/jquery/'], {read: false}).pipe(clean())
});

// create a default task and just log a message
gulp.task('default', function() {runSequence(
    'cleanup',
    'copy-angular',
    'copy-bootstrap',
    'copy-jquery'
);
});
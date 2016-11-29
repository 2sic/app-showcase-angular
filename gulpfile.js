var gulp = require('gulp'),
    concat = require("gulp-concat");

var owlCarouselBase = "bower_components/owlcarousel/owl-carousel/";

var librariesJs = [
    "bower_components/angular-update-meta/dist/update-meta.min.js",
    "bower_components/angular-route/angular-route.min.js",
    owlCarouselBase + "owl.carousel.min.js"
];

var librariesCss = [
    owlCarouselBase + "owl.carousel.css"
];

gulp.task("import-library", function () {

    gulp.src(librariesJs) 
        .pipe(concat('libraries-set.js'))
        .pipe(gulp.dest("dist/js/"));

    gulp.src(librariesCss)
        .pipe(concat('libraries-set.css')) 
        .pipe(gulp.dest("dist/css/"));

    // images / icons
    gulp.src([owlCarouselBase + "*.gif", owlCarouselBase + "*.png"])
        .pipe(gulp.dest("dist/css/"));

});

gulp.task("build-css", function() {
    gulp.src("src/*.css")
        .pipe(concat('references-set.css')) 
        .pipe(gulp.dest("dist/css"));
});

gulp.task("build-js", function() {
    gulp.src(["src/_*.js", "src/**/[^_]*.js"])
        .pipe(concat('references-set.js')) 
        .pipe(gulp.dest("dist/js"));
});

gulp.task("default", function() {
    gulp.watch("src/*.*", ["build-css", "build-js"]);
});

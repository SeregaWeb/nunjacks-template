// gulpfile.js
const gulp  = require('gulp'),
    browserSync = require('browser-sync').create(),
    htmlmin = require('gulp-htmlmin'),
    del = require('del'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'), // Чтоб при ошибке не падал сервер
    nunjucksRender = require('gulp-nunjucks-render'); // importing the plugin
    sourcemaps = require('gulp-sourcemaps'); //Что б в режиме разработчика показывало норм стили
    autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов

const PATHS = {
    output: './dist',
    templates: './src/templates',
    pages: './src/pages',
}

// writing up the gulp nunjucks task
gulp.task('nunjucks', function() {
    console.log('Rendering nunjucks files..');
    return gulp.src(PATHS.pages + '/**/*.+(html|js|css)')
        .pipe(plumber())
        .pipe(nunjucksRender({
          path: [PATHS.templates],
          watch: true,
        }))
        .pipe(gulp.dest(PATHS.output));
});

gulp.task('sass', function () { // Создаем таск Sass
    return gulp.src(PATHS.templates + '/assets/scss/**/*.scss') // Берем источник
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass({ outputStyle: 'compact' }).on('error', sass.logError)) // Преобразуем Sass в CSS посредством gulp-sass				
        .pipe(autoprefixer(['last 10 versions', '> 1%', 'ie 9', 'ie 10'], { cascade: true })) // Создаем префиксы
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(PATHS.output + '/assets/css/')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({ stream: true })) // Обновляем CSS на странице при изменении
});
gulp.task('js', function () { // Создаем таск Sass
    return gulp.src(PATHS.templates + '/assets/js/**/*.js') // Берем источник
        .pipe(plumber())
        .pipe(gulp.dest(PATHS.output + '/assets/js/')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({ stream: true })) // Обновляем CSS на странице при изменении
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: PATHS.output
        },
    });
});

gulp.task('watch', function() {
    // trigger Nunjucks render when pages or templates changes
    gulp.watch([PATHS.pages + '/**/*.+(html|js|css|scss)', PATHS.templates + '/**/*.+(html|js|css|scss)'], ['nunjucks', 'sass'])
  
    gulp.watch(PATHS.output + '/*').on('change', browserSync.reload);
});

gulp.task('minify', function() {
  return gulp.src(PATHS.output + '/*.html')
    .pipe(htmlmin({
        collapseWhitespace: true,
        cssmin: true,
        jsmin: true,
        removeOptionalTags: true,
        removeComments: false
    }))
    .pipe(gulp.dest(PATHS.output));
});

// run browserSync auto-reload together with nunjucks auto-render
gulp.task('auto', ['browserSync', 'watch', 'js']);

//default task to be run with gulp
gulp.task('default', ['nunjucks', 'sass'], function () {
 
    var buildscss = gulp.src(PATHS.templates + '/assets/scss/**/*.scss') // Переносим scss в продакшен
        .pipe(gulp.dest(PATHS.output + '/assets/scss'))

    var buildFonts = gulp.src(PATHS.templates + '/assets/fonts/**/*.*') // Переносим шрифты в продакшен
        .pipe(gulp.dest(PATHS.output + '/assets/fonts/'))

    var buildJs = gulp.src(PATHS.templates + '/assets/js/**/*.js') // Переносим скрипты в продакшен
        .pipe(gulp.dest(PATHS.output + '/assets/js/'))

    var buildImg = gulp.src(PATHS.templates +'/assets/img/**/*.+(png|jpg|jpeg|svg|ico)') // Переносим скрипты в продакшен
        .pipe(gulp.dest(PATHS.output + '/assets/img/'))

});
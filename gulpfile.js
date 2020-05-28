
/*Присвоение установленным пакетам переменных*/
const gulp        = require('gulp');
const browserSync = require('browser-sync');
const sass        = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");


/*функция подключения пакета сервера browseSync */
gulp.task('server', function() {

    browserSync({
        server: {
            baseDir: "src"
        }
    });
    /*следит за изменениями html файла и при случаи измений перезагружает страницу */
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

/*функция компиляций sass/scss фала в css */
gulp.task('styles', function() {
    /*говорим откуда берется sass/scss файл для компиляции */
    return gulp.src("src/sass/**/*.+(scss|sass)")
        /*настройки копиляций - compressed для вида сжатия и записывания логов в случае ошибки компиляции */
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        /*использование пакета rename для того что-бы переименовывать преобразованный после компиляций 
        sass/scss файл*/
        .pipe(rename({suffix: '.min', prefix: ''}))
        /*плагин автопрефикс сканирует css файлы и раставлет перефиксы - нужны для совместимости в 
        определенных браузерах -в данном случае используются последние 2 версий*/
        .pipe(autoprefixer({
            browsers: ['last 2 version'],
            cascade: false
        }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        /*указываем папку в которой будут лежать преобразованные стили css */
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});

/*функция чтобы следить за изменениями и при наличий их вносить эти изменения */
gulp.task('watch', function() {
    /*следит за изменениями sass/scss */
    gulp.watch("src/sass/**/*.+(scss|sass)", gulp.parallel('styles'));
    /* следит за изменениями html */
    gulp.watch("src/*.html").on("change", browserSync.reload);
});

/*запуск описанных функций */
gulp.task('default', gulp.parallel('watch', 'server', 'styles'));
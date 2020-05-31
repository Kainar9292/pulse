
/*Присвоение установленным пакетам переменных*/
const gulp        = require('gulp');
const browserSync = require('browser-sync');
const sass        = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');


/*функция подключения пакета сервера browseSync */
gulp.task('server', function() {

    browserSync({
        server: {
            baseDir: "dist"
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
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

/*функция чтобы следить за изменениями и при наличий их вносить эти изменения */
gulp.task('watch', function() {
    /*следит за изменениями sass/scss */
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel('styles'));
    /* следит за изменениями html */
    gulp.watch("src/*.html").on("change", gulp.parallel('html')); /*Если файл в src/*html будет изменяться то будет запускаться задача html(указана в константе) */
});

gulp.task('html', function() {  /*функция запуска плагина сжатия для html файлов */
    return gulp.src("src/*.html") /* получает файл html по указанному пути */
    .pipe(htmlmin({ collapseWhitespace: true })) /*файл html который лежит в папке src/*html обработается плагином htmlmin */
    .pipe(gulp.dest("dist/"))   /*обработанный и сжатый файл с помощью плагина htmlmin помещается в папку dist */
});


/*ПЕРЕМЕЩЕНИЯ ФАЙЛОВ В ПАПКУ DIST */

gulp.task('scripts', function() {  /*функция для перемещения скриптов в папку dist*/
    return gulp.src("src/js/**/*.js") /* получает файлы js из всех папок внутри js */
    .pipe(gulp.dest("dist/js")) /*выбранные файлы js копируем в папку dist/js*/
});


gulp.task('fonts', function() {  /*функция для перемещения шрифтов в папку dist*/
    return gulp.src("src/fonts/**/*") /* получает файлы шрифтов из всех папок внутри fonts */
    .pipe(gulp.dest("dist/fonts")) /*выбранные шрифты копируем в папку dist/fonts*/
});


gulp.task('icons', function() {  /*функция для перемещения icons в папку dist*/
    return gulp.src("src/icons/**/*") /* получает файлы из всех папок внутри icons */
    .pipe(gulp.dest("dist/icons")) /*выбранные файлы копируем в папку dist/icons*/
});


gulp.task('mailer', function() {  /*функция для перемещения mailer в папку dist*/
    return gulp.src("src/mailer/**/*") /* получает файлы из всех папок внутри mailer */
    .pipe(gulp.dest("dist/mailer")) /*выбранные файлы копируем в папку mailer*/
});


/*СЖАТИЕ КАРТИНОК И ПЕРЕМЕЩЕНИЕ В ПАПАКУ DIST */
gulp.task('images', function() {  /*функция для перемещения и сжатия картинок в папку dist*/
    return gulp.src("src/img/**/*") /* получает картинки из всех папок внутри img */
        .pipe(imagemin())               /*команда сжатия картинок с помощью плагина gulp=imagemin */
        .pipe(gulp.dest("dist/img")) /*выбранные файлы копируем в папку dist/img*/
});



/*запуск описанных функций */
gulp.task('default', gulp.parallel('watch', 'server', 'styles', 'scripts', 'fonts', 'icons', 'mailer', 'html', 'images'));
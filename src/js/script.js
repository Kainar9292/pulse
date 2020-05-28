$(document).ready(function () {
    $('.carousel__inner').slick({
        speed: 800,
        adaptiveHeight: true,
        prevArrow: '<button type="button" class="slick-prev"><img src="icons/prevArrow.svg"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="icons/nextArrow.svg"></button>',
        responsive:[
            {
                breakpoint: 767,
                    settings: {
                        dots: true,
                        arrows: false, 
                        adaptiveWidth: true,
                        infinite: true
                    }
            }
        ]
    });


    // скрипт переключения табов на сайте - переключение вкладок
        $('ul.catalog__tabs').on('click', 'li:not(.catalog__tab_active)', function () {
            $(this)
                .addClass('catalog__tab_active').siblings().removeClass('catalog__tab_active')
                .closest('div.container').find('div.catalog__content').removeClass('catalog__content_active').eq($(this).index()).addClass('catalog__content_active');
        });


    // функция(скрипт) отображения информаций в карточке (массив отслеживает все ссылки "подробнее" и убирает классы active для основной карточки и добавляет active для карточки описания)
    // функция(скрипт) который возвращает значения карточки active (для кнопки назад)

        function togglelass(item) {
            $(item).each(function (i) {
                $(this).on('click', function (e) {
                    e.preventDefault();
                    $('.catalog-item__content').eq(i).toggleClass('catalog-item__content_active');
                    $('.catalog-item__list').eq(i).toggleClass('catalog-item__list_active');
                })
            })        
        };

    //вызываем функцию для добавления и удаления класса active и указываем в каком классе нужно произвести эти операции
        togglelass('.catalog-item__link');
        togglelass('.catalog-item__back');


    //modal windows

        //вывод модального окна для кнопки заказать звонок и получить консультацию
        $('[data-modal=consultation]').on('click', function() {
            $('.overlay, #consultation').fadeIn('slow');
        });

        //закрытие модального окна через крестик
        $('.modal__close').on('click', function() {
            $('.overlay, #consultation, #thanks, #order').fadeOut('slow');
        });

        //вывод модального окна для кнопки купить (цикл который перебирает все кнопки с классом button_mini присваивает им i и при выводе модального окна беред i того элемента кнопка которой была активирована)

        $('.button_mini').each(function (i) {
            $(this).on('click', function() {
                $('#order .modal__descr').text($('.catalog-item__subtitle').eq(i).text());
                $('.overlay, #order').fadeIn('slow');
            });
        });

    //form validation

        function valideForms(form) {
            $(form).validate({
                rules: {
                    name: "required",
                    phone: "required",
                    email: {
                        required: true,
                        email: true
                    }
                },
                messages: {
                    name: "Пожалуйста введите свое имя",
                    phone: "Пожалуйста введите свой номер телефона",
                    email: {
                        required: "Пожалуйста введите свою почту",
                        email: "Неправильно введен адрес почты"
                    }
                }
            });
        };

        valideForms('#consultation-form');
        valideForms('#order form');
        valideForms('#consultation form');

    //mask to phone
        $('input[name=phone]').mask("+7 (999) 999-99-99");



    //отправка данных с форм на почту, настройка ajax

    $('form').submit(function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",                   //указываем метод POST - отправка данных на сервер
            url: "mailer/smart.php",        //обращаемся к обработчику формы
            data: $(this).serialize()
        }).done(function() {                //после успешной отправки данных на сервер
            $(this).find("input").val("");  //очищаем формы "" заполнения данных
            $('#consultation, #order').fadeOut();
            $('.overlay, #thanks').fadeIn('slow');

            $('form').trigger('reset'); //все формы на сайте должны очистится
        });
        return false;
    });


    //Smoth scroll and pageup

    $(window).scroll(function() {
        if ($(this).scrollTop() > 1100 ) {
            $('.pageup').fadeIn();
        } else {
            $('.pageup').fadeOut();
        }
    });

    // плавный скролл страницы
    $("a[href^=#up], a[href^=#tabs]").click(function () {
        const _href = $(this).attr("href");
        $("html, body").animate({ scrollTop: $(_href).offset().top + "px" });
        return false;
    });

    new WOW().init();
});

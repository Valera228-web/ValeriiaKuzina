// ========== ПРОСТОЙ JAVASCRIPT ДЛЯ СЛАЙД-ШОУ ==========

// Находим все элементы
var slides = document.querySelectorAll('.slide');
var dots = document.querySelectorAll('.dot');
var thumbnails = document.querySelectorAll('.thumbnail');
var prevBtn = document.getElementById('prevBtn');
var nextBtn = document.getElementById('nextBtn');
var playPauseBtn = document.getElementById('playPauseBtn');
var lightbox = document.getElementById('lightbox');
var lightboxImg = document.getElementById('lightboxImg');
var lightboxCaption = document.getElementById('lightboxCaption');
var closeBtn = document.querySelector('.close');

var currentIndex = 0;      // Какой слайд сейчас показываем
var slideInterval = null;   // Таймер
var isPlaying = true;       // Идёт ли слайд-шоу

// Функция показать слайд по номеру
function showSlide(index) {
    // Если номер меньше 0 - показываем последний
    if (index < 0) {
        index = slides.length - 1;
    }
    // Если номер больше последнего - показываем первый
    if (index >= slides.length) {
        index = 0;
    }
    
    // Скрываем все слайды
    for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    // Показываем нужный слайд
    slides[index].style.display = 'block';
    
    // Убираем активный класс у всех точек
    for (var j = 0; j < dots.length; j++) {
        dots[j].className = 'dot';
    }
    // Добавляем активный класс нужной точке
    dots[index].className = 'dot active';
    
    // Убираем активный класс у всех миниатюр
    for (var k = 0; k < thumbnails.length; k++) {
        thumbnails[k].className = 'thumbnail';
    }
    // Добавляем активный класс нужной миниатюре
    thumbnails[index].className = 'thumbnail active-thumb';
    
    // Запоминаем текущий индекс
    currentIndex = index;
}

// Функция следующий слайд
function nextSlide() {
    showSlide(currentIndex + 1);
}

// Функция предыдущий слайд
function prevSlide() {
    showSlide(currentIndex - 1);
}

// Функция перехода к конкретному слайду
function goToSlide(index) {
    showSlide(index);
    // Если слайд-шоу играет - перезапускаем таймер
    if (isPlaying) {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 4000);
    }
}

// Функция запустить автопрокрутку
function startAutoPlay() {
    if (slideInterval != null) {
        clearInterval(slideInterval);
    }
    slideInterval = setInterval(nextSlide, 4000);
    isPlaying = true;
    playPauseBtn.innerHTML = '⏸ Пауза';
}

// Функция остановить автопрокрутку
function stopAutoPlay() {
    if (slideInterval != null) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
    isPlaying = false;
    playPauseBtn.innerHTML = '▶️ Запустить';
}

// Функция пауза/запуск
function togglePlayPause() {
    if (isPlaying) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
}

// Функция открыть увеличенное фото
function openLightbox(index) {
    var imgSrc = slides[index].getElementsByTagName('img')[0].src;
    var imgCaption = slides[index].getElementsByClassName('slide-caption')[0].innerHTML;
    
    lightboxImg.src = imgSrc;
    lightboxCaption.innerHTML = imgCaption;
    lightbox.style.display = 'flex';
    
    // Ставим слайд-шоу на паузу
    if (isPlaying) {
        stopAutoPlay();
        lightbox.playingWas = true;
    } else {
        lightbox.playingWas = false;
    }
}

// Функция закрыть увеличенное фото
function closeLightbox() {
    lightbox.style.display = 'none';
    // Если до открытия слайд-шоу играло - запускаем снова
    if (lightbox.playingWas == true) {
        startAutoPlay();
    }
}

// ========== НАЗНАЧАЕМ ОБРАБОТЧИКИ ==========

// Кнопка "Назад"
prevBtn.onclick = function() {
    prevSlide();
    if (isPlaying) {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 4000);
    }
};

// Кнопка "Вперёд"
nextBtn.onclick = function() {
    nextSlide();
    if (isPlaying) {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 4000);
    }
};

// Кнопка Play/Pause
playPauseBtn.onclick = function() {
    togglePlayPause();
};

// Точки навигации
for (var d = 0; d < dots.length; d++) {
    dots[d].onclick = function() {
        var index = this.getAttribute('data-dot');
        goToSlide(parseInt(index));
    };
}

// Миниатюры
for (var t = 0; t < thumbnails.length; t++) {
    thumbnails[t].onclick = function() {
        var index = this.getAttribute('data-thumb');
        goToSlide(parseInt(index));
    };
}

// Клик по фото для увеличения
for (var s = 0; s < slides.length; s++) {
    slides[s].getElementsByTagName('img')[0].onclick = function() {
        for (var i = 0; i < slides.length; i++) {
            if (slides[i].style.display == 'block') {
                openLightbox(i);
                break;
            }
        }
    };
}

// Крестик закрытия
closeBtn.onclick = function() {
    closeLightbox();
};

// Клик на фон (тоже закрывает)
lightbox.onclick = function(e) {
    if (e.target == lightbox) {
        closeLightbox();
    }
};

// Управление с клавиатуры
document.onkeydown = function(e) {
    // Если открыто увеличенное фото
    if (lightbox.style.display == 'flex') {
        if (e.key == 'Escape') {
            closeLightbox();
        }
    } else {
        // Стрелка влево
        if (e.key == 'ArrowLeft') {
            prevSlide();
            if (isPlaying) {
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 4000);
            }
        }
        // Стрелка вправо
        else if (e.key == 'ArrowRight') {
            nextSlide();
            if (isPlaying) {
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 4000);
            }
        }
        // Пробел - пауза/запуск
        else if (e.key == ' ' || e.key == 'Space') {
            e.preventDefault();
            togglePlayPause();
        }
    }
};

// ========== ЗАПУСК ==========
// Скрываем все слайды, показываем первый
for (var i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
}
slides[0].style.display = 'block';

// Запускаем автопрокрутку
startAutoPlay();
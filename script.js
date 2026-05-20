// ===========================
// ХЕДЕР: Фіксація при скролі
// ===========================
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    // Підсвічування активного пункту меню
    highlightActiveNav();
    // Кнопка "Нагору"
    const scrollTop = document.getElementById('scrollTop');
    scrollTop.classList.toggle('visible', window.scrollY > 300);
});

// ===========================
// БУРГЕР-МЕНЮ
// ===========================
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    nav.classList.toggle('open');
});

// Закрити меню при кліку на пункт
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('open');
        nav.classList.remove('open');
    });
});

// ===========================
// АКТИВНЕ МЕНЮ ПРИ СКРОЛІ
// ===========================
function highlightActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 100) {
            current = section.id;
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// ===========================
// СЛАЙДЕР
// ===========================
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('sliderDots');
let currentSlide = 0;
let sliderInterval;

// Створення крапок
slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
});

function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    document.querySelectorAll('.dot')[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    document.querySelectorAll('.dot')[currentSlide].classList.add('active');
}

document.getElementById('prevSlide').addEventListener('click', () => {
    goToSlide(currentSlide - 1);
    resetInterval();
});
document.getElementById('nextSlide').addEventListener('click', () => {
    goToSlide(currentSlide + 1);
    resetInterval();
});

function startInterval() {
    sliderInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
}
function resetInterval() {
    clearInterval(sliderInterval);
    startInterval();
}
startInterval();

// ===========================
// ЛІЧИЛЬНИКИ СТАТИСТИКИ
// ===========================
function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current).toLocaleString('uk-UA');
    }, 16);
}

// Запуск лічильників коли секція потрапляє у видиму зону
const statsSection = document.querySelector('.stats');
let countersStarted = false;

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        document.querySelectorAll('.stat-number').forEach(animateCounter);
    }
}, { threshold: 0.3 });

observer.observe(statsSection);

// ===========================
// ФІЛЬТР КАТАЛОГУ
// ===========================
const tabs = document.querySelectorAll('.tab');
const products = document.querySelectorAll('.product-card');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Активна вкладка
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;

        // Фільтрація карток
        products.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
                // Анімація появи
                card.style.animation = 'fadeIn 0.4s ease';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ===========================
// МОДАЛЬНЕ ВІКНО
// ===========================
function openModal(title, price, desc) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalPrice').textContent = price;
    document.getElementById('modalDesc').textContent = desc;
    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

// Закриття по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ===========================
// ВАЛІДАЦІЯ ФОРМИ
// ===========================
const contactForm = document.getElementById('contactForm');

function validateName(value) {
    if (!value.trim()) return "Ім'я є обов'язковим полем";
    if (value.trim().length < 2) return "Ім'я повинно містити мінімум 2 символи";
    if (!/^[а-яА-ЯіІїЇєЄa-zA-Z\s'-]+$/.test(value)) return "Ім'я містить недопустимі символи";
    return '';
}

function validatePhone(value) {
    const cleaned = value.replace(/[\s\-\(\)]/g, '');
    if (!cleaned) return "Телефон є обов'язковим полем";
    if (!/^(\+380|380|0)\d{9}$/.test(cleaned)) return "Введіть коректний номер (напр. +380671234567)";
    return '';
}

function validateEmail(value) {
    if (!value) return '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Введіть коректну email адресу";
    return '';
}

function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (message) {
        input.classList.add('error');
        error.textContent = message;
    } else {
        input.classList.remove('error');
        error.textContent = '';
    }
    return !message;
}

// Валідація в реальному часі
document.getElementById('name').addEventListener('input', function() {
    showError('name', 'nameError', validateName(this.value));
});

document.getElementById('phone').addEventListener('input', function() {
    showError('phone', 'phoneError', validatePhone(this.value));
});

document.getElementById('email').addEventListener('input', function() {
    showError('email', 'emailError', validateEmail(this.value));
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameVal = document.getElementById('name').value;
    const phoneVal = document.getElementById('phone').value;
    const emailVal = document.getElementById('email').value;

    const isNameOk = showError('name', 'nameError', validateName(nameVal));
    const isPhoneOk = showError('phone', 'phoneError', validatePhone(phoneVal));
    const isEmailOk = showError('email', 'emailError', validateEmail(emailVal));

    if (isNameOk && isPhoneOk && isEmailOk) {
        // Успішне надсилання
        const success = document.getElementById('formSuccess');
        success.style.display = 'block';
        contactForm.reset();
        setTimeout(() => { success.style.display = 'none'; }, 5000);
    }
});

// ===========================
// КНОПКА "НАГОРУ"
// ===========================
document.getElementById('scrollTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===========================
// АНІМАЦІЯ ПОЯВИ ЕЛЕМЕНТІВ
// ===========================
const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.product-card, .stat-item, .gallery-item, .about-grid').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    animObserver.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {

    // --- Hero Slider --- 
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.nav-dot');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0 && dots.length > 0) {
        const showSlide = (n) => {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            slides[n].classList.add('active');
            dots[n].classList.add('active');
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        };

        const startSlider = () => {
            slideInterval = setInterval(nextSlide, 5000); // 5 seconds
        };

        const stopSlider = () => {
            clearInterval(slideInterval);
        };

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopSlider();
                currentSlide = index;
                showSlide(currentSlide);
                startSlider();
            });
        });

        if(prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                stopSlider();
                prevSlide();
                startSlider();
            });

            nextBtn.addEventListener('click', () => {
                stopSlider();
                nextSlide();
                startSlider();
            });
        }

        startSlider();
    }

    // --- Header Scroll Effect ---
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Animate counters on scroll ---
    const animateCounters = () => {
        const counters = [
            { id: 'current-users', endValue: 1345, duration: 2000 },
            { id: 'total-users', endValue: 87654, duration: 2500 },
            { id: 'countries', endValue: 25, duration: 1500 }
        ];

        counters.forEach(counter => {
            const el = document.getElementById(counter.id);
            if (el) {
                let start = 0;
                const end = counter.endValue;
                const duration = counter.duration;
                const range = end - start;
                let current = start;
                const increment = end > start ? 1 : -1;
                
                const timer = setInterval(() => {
                    const step = Math.ceil(range / (duration / 16));
                    current += increment * step;
                    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                        current = end;
                        clearInterval(timer);
                    }
                    el.textContent = current.toLocaleString();
                }, 16);
            }
        });
    };

    // --- Intersection Observer for animations ---
    const sections = document.querySelectorAll('.content-section');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                if (entry.target.id === 'stats') {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.2 });

    if (sections.length > 0) {
        sections.forEach(section => {
            observer.observe(section);
        });
    }

});
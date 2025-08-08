document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('interactive-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouse = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };

    let food = [];

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('click', (event) => {
        food.push({ x: event.x, y: event.y, radiusX: 5, radiusY: 3, vy: 1 });
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    class Fish {
        constructor(x, y, radius, color) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.velocity = { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 };
            this.speed = 1.5;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }

        update() {
            let target = mouse;

            if (food.length > 0) {
                let closestFood = null;
                let closestDist = Infinity;

                food.forEach(f => {
                    let dx = f.x - this.x;
                    let dy = f.y - this.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < closestDist) {
                        closestDist = dist;
                        closestFood = f;
                    }
                });

                if (closestFood) {
                    target = closestFood;
                    if (closestDist < this.radius) {
                        food.splice(food.indexOf(closestFood), 1);
                    }
                }
            }

            let dx = target.x - this.x;
            let dy = target.y - this.y;
            let angle = Math.atan2(dy, dx);

            this.x += Math.cos(angle) * this.speed;
            this.y += Math.sin(angle) * this.speed;

            this.draw();
        }
    }

    let fishArray = [];

    function init() {
        fishArray = [];
        for (let i = 0; i < 10; i++) {
            const radius = 10;
            const x = Math.random() * (canvas.width - radius * 2) + radius;
            const y = Math.random() * (canvas.height - radius * 2) + radius;
            fishArray.push(new Fish(x, y, radius, 'rgba(0, 100, 200, 0.7)'));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        food.forEach((f, index) => {
            f.y += f.vy;
            if (f.y > canvas.height) {
                food.splice(index, 1);
            }

            ctx.beginPath();
            ctx.ellipse(f.x, f.y, f.radiusX, f.radiusY, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#A0522D'; // Brown color
            ctx.fill();
            ctx.closePath();
        });

        fishArray.forEach(fish => {
            fish.update();
        });
    }

    init();
    animate();

    // User stats animation
    const animateUserStats = () => {
        const counters = [
            { id: 'current-users', endValue: 1345, duration: 2000 },
            { id: 'total-users', endValue: 87654, duration: 2500 }
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
                const stepTime = Math.abs(Math.floor(duration / range));
                
                const timer = setInterval(() => {
                    current += increment * Math.ceil(range / (duration / 16));
                    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                        current = end;
                        clearInterval(timer);
                    }
                    el.textContent = current.toLocaleString();
                }, 16);
            }
        });
    };

    // Intersection Observer for animations
    const sections = document.querySelectorAll('.content-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.id === 'map-section') {
                    animateUserStats();
                }
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });
});
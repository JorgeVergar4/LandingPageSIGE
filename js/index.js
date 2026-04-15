// Lógica general para todas las vistas (SIGE)

document.addEventListener('DOMContentLoaded', () => {
    // 1. Marcar automáticamente el enlace del nav como activo
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('header nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // 2. Animación suave al cargar las secciones principales (estilo F1)
    const fadeElements = document.querySelectorAll('section, main, article');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

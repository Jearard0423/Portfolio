// Ensure header sizing and scroll effects run after DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const setHeaderHeight = () => {
        const h = header ? header.offsetHeight : 80;
        document.documentElement.style.setProperty('--header-height', `${h}px`);
    };
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);

    // Scroll effect for sections
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });
});
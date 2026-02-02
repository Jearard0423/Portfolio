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

    // Lightbox / project modal functionality
    const lightbox = document.getElementById('lightbox');
    const lbImage = lightbox ? lightbox.querySelector('.lb-media img') : null;
    const thumbs = document.querySelectorAll('.project-thumb');
    const viewButtons = document.querySelectorAll('.view-project');

    let currentImages = [];
    let currentIndex = 0;

    if (thumbs.length && lightbox) {
        thumbs.forEach(t => currentImages.push({src: t.src, alt: t.alt}));

        const openAt = (index) => {
            currentIndex = index;
            lbImage.src = currentImages[currentIndex].src;
            lbImage.alt = currentImages[currentIndex].alt;
            // open modal
            document.body.style.overflow = 'hidden';
            lbImage.focus?.();
        };

        thumbs.forEach(t => {
            t.addEventListener('click', (e) => {
                const i = Number(t.getAttribute('data-index')) || 0;
                openAt(i);
            });
        });

        // prev / next buttons
        const btnPrev = document.querySelector('.lb-prev');
        const btnNext = document.querySelector('.lb-next');
        const btnClose = document.querySelector('.lb-close');

        const showNext = () => {
            currentIndex = (currentIndex + 1) % currentImages.length;
            openAt(currentIndex);
        };
        const showPrev = () => {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            openAt(currentIndex);
        };

        btnNext?.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
        btnPrev?.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
        btnClose?.addEventListener('click', (e) => { lightbox.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; });

        // Close when clicking outside media
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) { lightbox.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.getAttribute('aria-hidden') === 'false') {
                if (e.key === 'Escape') { lightbox.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
                if (e.key === 'ArrowRight') showNext();
                if (e.key === 'ArrowLeft') showPrev();
            }
        });

        // 'View project' buttons open the modal at the first image
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // find the project card the button belongs to and set details dynamically
                const card = btn.closest('.project-card');
                if (card) {
                    const title = card.dataset.title || '';
                    const desc = card.dataset.desc || '';
                    const note = card.dataset.note || '';
                    const titleEl = lightbox.querySelector('.lb-details h3');
                    const pEls = lightbox.querySelectorAll('.lb-details p');
                    if (titleEl) titleEl.textContent = title;
                    if (pEls && pEls[0]) pEls[0].textContent = desc;
                    if (pEls && pEls[1]) pEls[1].innerHTML = note ? `<strong>Note:</strong> ${note.replace(/^Note:\s*/i, '')}` : '';
                }
                openAt(0);
            });
        });

        // details-area next button (replaces 'View project' CTA)
        const btnNextDetails = document.querySelector('.lb-next-details');
        btnNextDetails?.addEventListener('click', (e) => {
            e.preventDefault();
            showNext();
        });
    }
});
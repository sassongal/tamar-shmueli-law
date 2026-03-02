async function submitForm(event) {
    event.preventDefault();
    const form = event.target;
    const btn = document.getElementById('submit-btn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');
    const successMsg = document.getElementById('form-success-msg');
    const errorMsg = document.getElementById('form-error-msg');
    const fieldsWrapper = document.getElementById('form-fields-wrapper');

    errorMsg.style.display = 'none';
    form.classList.remove('show-errors');

    if (!form.checkValidity()) {
        form.classList.add('show-errors');
        errorMsg.style.display = 'block';
        return;
    }

    btn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    try {
        const formData = new FormData(form);
        const response = await fetch("https://formsubmit.co/ajax/tamars@tamsh-law.co.il", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            fieldsWrapper.style.opacity = '0';
            setTimeout(() => {
                fieldsWrapper.style.display = 'none';
                successMsg.style.display = 'block';
            }, 300);
        } else { throw new Error('Failed'); }
    } catch (err) {
        errorMsg.style.display = 'block';
        btn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

// Tracking
function trackClick(label) { console.log('Click:', label); }

window.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu - Bottom Sheet
    const toggle = document.querySelector('.menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    if (toggle && mobileNav) {
        toggle.addEventListener('click', () => {
            const isOpened = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !isOpened);
            mobileNav.classList.toggle('is-active');
            mobileNav.setAttribute('aria-hidden', isOpened ? 'true' : 'false');
            mobileNav.hidden = isOpened;
            mobileNav.inert = isOpened;
            document.body.style.overflow = isOpened ? '' : 'hidden';
        });

        // Close on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('is-active');
                mobileNav.setAttribute('aria-hidden', 'true');
                mobileNav.hidden = true;
                mobileNav.inert = true;
                document.body.style.overflow = '';
            });
        });
    }

    // Enhanced Animations with Stagger - Layered Experience
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    // Service Cards - Stagger animation
    const serviceCards = document.querySelectorAll('.service-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('in-view');
                }, index * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    serviceCards.forEach(card => cardObserver.observe(card));

    // Typography - Gradient reveal on scroll
    const headings = document.querySelectorAll('h2');
    const headingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                headingObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    headings.forEach(h => headingObserver.observe(h));

    // Text Reveal - Staggered paragraphs
    const textReveals = document.querySelectorAll('.text-reveal');
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                textObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    textReveals.forEach(el => textObserver.observe(el));

    // Original stagger animation for other elements
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = index * 100;
                setTimeout(() => {
                    entry.target.classList.add('in-view');
                }, delay);
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-up, .fade-in-right, .stagger-item').forEach(el => {
        animationObserver.observe(el);
    });

    // Parallax Effect on Hero
    const heroBackground = document.querySelector('.hero-cover');
    if (heroBackground) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const parallaxSpeed = 0.5;
            heroBackground.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
        }, { passive: true });
    }

    // Feature Cards - Subtle Floating Parallax
    const featureCards = document.querySelectorAll('.feature-card');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                featureCards.forEach((card, index) => {
                    const depth = (index % 3) + 1; // 1, 2, or 3
                    const movement = scrollY * 0.05 * depth; // Very subtle
                    card.style.transform = `translateY(${movement}px)`;
                    card.dataset.depth = depth;
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Number Counter Animation
    function animateNumber(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    const numberElements = document.querySelectorAll('.stat-number');
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target) || parseInt(entry.target.textContent);
                animateNumber(entry.target, 0, target, 2000);
                numberObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    numberElements.forEach(el => numberObserver.observe(el));

    // Accessibility Widget Logic
    const a11yMenu = document.getElementById('a11y-menu');
    let currentFontSize = 100;
    let isHighContrast = false;
    let isHighlightLinks = false;

    window.toggleA11yMenu = () => {
        a11yMenu.style.display = a11yMenu.style.display === 'none' || a11yMenu.style.display === '' ? 'block' : 'none';
    };

    window.increaseFontSize = () => {
        if (currentFontSize < 150) {
            currentFontSize += 10;
            document.documentElement.style.fontSize = currentFontSize + '%';
        }
    };

    window.decreaseFontSize = () => {
        if (currentFontSize > 80) {
            currentFontSize -= 10;
            document.documentElement.style.fontSize = currentFontSize + '%';
        }
    };

    window.toggleHighContrast = () => {
        isHighContrast = !isHighContrast;
        document.body.style.filter = isHighContrast ? 'contrast(1.5) grayscale(1)' : '';
    };

    window.toggleHighlightLinks = () => {
        isHighlightLinks = !isHighlightLinks;
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            if (isHighlightLinks) {
                link.style.textDecoration = 'underline';
                link.style.backgroundColor = 'rgba(255, 255, 0, 0.4)';
            } else {
                link.style.textDecoration = '';
                link.style.backgroundColor = '';
            }
        });
    };

    window.resetA11y = () => {
        currentFontSize = 100;
        document.documentElement.style.fontSize = '100%';
        isHighContrast = false;
        document.body.style.filter = '';
        isHighlightLinks = true; 
        window.toggleHighlightLinks();
        a11yMenu.style.display = 'none';
    };

    // Lazy load Instagram script
    const igSection = document.getElementById('instagram');
    if (igSection) {
        const igObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const script = document.createElement('script');
                script.src = 'assets/js/instagram-carousel.js';
                document.body.appendChild(script);
                igObserver.disconnect();
            }
        }, { rootMargin: '200px' });
        igObserver.observe(igSection);
    }

    document.addEventListener('click', function(event) {
        const widget = document.getElementById('a11y-widget');
        if (widget && !widget.contains(event.target)) {
            a11yMenu.style.display = 'none';
        }
    });

});

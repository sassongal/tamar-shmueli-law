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
    // Mobile Menu
    const toggle = document.querySelector('.menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    if (toggle && mobileNav) {
        toggle.addEventListener('click', () => {
            const isOpened = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !isOpened);
            mobileNav.classList.toggle('is-active');
            mobileNav.hidden = isOpened;
            mobileNav.inert = isOpened;
            document.body.style.overflow = isOpened ? '' : 'hidden';
        });

        // Close on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('is-active');
                mobileNav.hidden = true;
                mobileNav.inert = true;
                document.body.style.overflow = '';
            });
        });
    }

    // Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-up, .fade-in-right').forEach(el => observer.observe(el));

    // Accessibility Widget Logic
    const a11yMenu = document.getElementById('a11y-menu');
    const a11yBtn = document.getElementById('a11y-btn');
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

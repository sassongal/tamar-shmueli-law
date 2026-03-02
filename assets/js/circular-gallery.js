/**
 * Circular Gallery - Vanilla JS Implementation
 * Inspired by ReactBits CircularGallery
 * Creates a curved, scrollable gallery with 3D perspective
 */

class CircularGallery {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      bend: options.bend || 2,
      scrollSpeed: options.scrollSpeed || 1.5,
      scrollEase: options.scrollEase || 0.08,
      ...options
    };

    this.scroll = { current: 0, target: 0, last: 0 };
    this.isDown = false;
    this.startX = 0;
    this.scrollLeft = 0;

    this.init();
  }

  init() {
    this.track = this.container.querySelector('.cg-track');
    this.items = Array.from(this.container.querySelectorAll('.cg-item'));

    if (!this.track || this.items.length === 0) return;

    // Clone items for infinite scroll
    this.cloneItems();

    // Calculate dimensions
    this.calculateDimensions();

    // Add event listeners
    this.addEventListeners();

    // Start animation loop
    this.animate();
  }

  cloneItems() {
    // Clone items to create seamless loop
    this.items.forEach(item => {
      const clone = item.cloneNode(true);
      clone.classList.add('cg-clone');
      this.track.appendChild(clone);
    });

    // Update items array to include clones
    this.allItems = Array.from(this.container.querySelectorAll('.cg-item'));
  }

  calculateDimensions() {
    this.containerWidth = this.container.offsetWidth;
    this.itemWidth = this.items[0].offsetWidth;
    this.gap = parseInt(getComputedStyle(this.track).gap) || 24;
    this.totalWidth = (this.itemWidth + this.gap) * this.items.length;
    this.maxScroll = this.totalWidth;
  }

  addEventListeners() {
    // Mouse events
    this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('mouseup', this.onMouseUp.bind(this));

    // Touch events
    this.container.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
    window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });
    window.addEventListener('touchend', this.onTouchEnd.bind(this));

    // Wheel event
    this.container.addEventListener('wheel', this.onWheel.bind(this), { passive: false });

    // Resize
    window.addEventListener('resize', this.onResize.bind(this));

    // Hover pause
    if (this.options.pauseOnHover) {
      this.container.addEventListener('mouseenter', () => { this.isPaused = true; });
      this.container.addEventListener('mouseleave', () => { this.isPaused = false; });
    }
  }

  onMouseDown(e) {
    this.isDown = true;
    this.container.classList.add('is-dragging');
    this.startX = e.pageX;
    this.scrollLeft = this.scroll.target;
  }

  onMouseMove(e) {
    if (!this.isDown) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (this.startX - x) * this.options.scrollSpeed;
    this.scroll.target = this.scrollLeft + walk;
  }

  onMouseUp() {
    this.isDown = false;
    this.container.classList.remove('is-dragging');
  }

  onTouchStart(e) {
    this.isDown = true;
    this.startX = e.touches[0].pageX;
    this.scrollLeft = this.scroll.target;
  }

  onTouchMove(e) {
    if (!this.isDown) return;
    const x = e.touches[0].pageX;
    const walk = (this.startX - x) * this.options.scrollSpeed;
    this.scroll.target = this.scrollLeft + walk;
  }

  onTouchEnd() {
    this.isDown = false;
  }

  onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY || e.deltaX;
    this.scroll.target += delta * this.options.scrollSpeed * 0.5;
  }

  onResize() {
    this.calculateDimensions();
  }

  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  animate() {
    // Smooth scroll
    this.scroll.current = this.lerp(this.scroll.current, this.scroll.target, this.options.scrollEase);

    // Infinite loop
    if (this.scroll.current >= this.maxScroll) {
      this.scroll.current -= this.maxScroll;
      this.scroll.target -= this.maxScroll;
    } else if (this.scroll.current < 0) {
      this.scroll.current += this.maxScroll;
      this.scroll.target += this.maxScroll;
    }

    // Apply transform and 3D curve effect
    this.updateItems();

    // Store last scroll for direction detection
    this.scroll.last = this.scroll.current;

    // Continue animation
    this.raf = requestAnimationFrame(this.animate.bind(this));
  }

  updateItems() {
    const centerX = this.containerWidth / 2;
    const bend = this.options.bend;

    this.allItems.forEach((item, index) => {
      // Calculate item position
      const itemX = (index * (this.itemWidth + this.gap)) - this.scroll.current;

      // Wrap position for infinite scroll
      let wrappedX = itemX;
      const totalTrackWidth = this.allItems.length * (this.itemWidth + this.gap);

      if (wrappedX < -this.itemWidth - this.gap) {
        wrappedX += totalTrackWidth;
      } else if (wrappedX > this.containerWidth + this.gap) {
        wrappedX -= totalTrackWidth;
      }

      // Calculate distance from center
      const itemCenterX = wrappedX + this.itemWidth / 2;
      const distanceFromCenter = itemCenterX - centerX;
      const normalizedDistance = distanceFromCenter / (this.containerWidth / 2);

      // Calculate curve (parabolic bend)
      const curveY = Math.pow(normalizedDistance, 2) * bend * 50;

      // Calculate rotation based on position
      const rotation = normalizedDistance * bend * 8;

      // Calculate scale - items in center are larger
      const scale = 1 - Math.abs(normalizedDistance) * 0.15;

      // Calculate opacity - fade edges
      const opacity = 1 - Math.abs(normalizedDistance) * 0.4;

      // Apply transforms
      item.style.transform = `
        translateX(${wrappedX}px)
        translateY(${curveY}px)
        rotateZ(${rotation}deg)
        scale(${Math.max(0.7, scale)})
      `;
      item.style.opacity = Math.max(0.3, opacity);
      item.style.zIndex = Math.round((1 - Math.abs(normalizedDistance)) * 10);
    });
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    // Remove clones
    this.container.querySelectorAll('.cg-clone').forEach(clone => clone.remove());
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const galleryContainer = document.querySelector('.circular-gallery-container');
  if (galleryContainer) {
    new CircularGallery(galleryContainer, {
      bend: 1.5,
      scrollSpeed: 1.2,
      scrollEase: 0.06
    });
  }
});

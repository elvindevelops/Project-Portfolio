// Carousel functionality
class Carousel {
    constructor(element) {
        this.carousel = element;
        this.slides = element.querySelectorAll('.carousel-slide');
        this.prevBtn = element.querySelector('.prev');
        this.nextBtn = element.querySelector('.next');
        this.indicatorsContainer = element.querySelector('.carousel-indicators');
        this.currentIndex = 0;

        this.init();
    }

    init() {
        // Create indicators
        this.createIndicators();

        // Show first slide
        this.showSlide(0);

        // Add click handlers to images for lightbox
        this.slides.forEach((slide, index) => {
            const img = slide.querySelector('img');
            if (img) {
                img.style.cursor = 'pointer';
                img.addEventListener('click', () => {
                    if (window.lightbox) {
                        window.lightbox.open(this, index);
                    }
                });
            }
        });

        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }

    createIndicators() {
        this.slides.forEach((_, index) => {
            const indicator = document.createElement('span');
            indicator.classList.add('indicator');
            indicator.addEventListener('click', () => this.showSlide(index));
            this.indicatorsContainer.appendChild(indicator);
        });
        this.indicators = this.indicatorsContainer.querySelectorAll('.indicator');
    }

    showSlide(index) {
        // Remove active class from all slides and indicators
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.indicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to current slide and indicator
        this.slides[index].classList.add('active');
        this.indicators[index].classList.add('active');

        this.currentIndex = index;
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
}

// Lightbox functionality
class Lightbox {
    constructor() {
        this.modal = document.getElementById('lightbox-modal');
        this.image = document.getElementById('lightbox-image');
        this.caption = document.getElementById('lightbox-caption');
        this.closeBtn = this.modal.querySelector('.lightbox-close');
        this.prevBtn = this.modal.querySelector('.lightbox-btn.prev');
        this.nextBtn = this.modal.querySelector('.lightbox-btn.next');
        this.currentCarousel = null;
        this.currentIndex = 0;

        this.init();
    }

    init() {
        // Close button
        this.closeBtn.addEventListener('click', () => this.close());

        // Click outside to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Navigation buttons
        this.prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.prev();
        });

        this.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.next();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;

            if (e.key === 'Escape') this.close();
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
    }

    open(carousel, index) {
        this.currentCarousel = carousel;
        this.currentIndex = index;
        this.updateContent();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }

    updateContent() {
        const slide = this.currentCarousel.slides[this.currentIndex];
        const img = slide.querySelector('img');
        const captionElement = slide.querySelector('.caption');

        // Update image
        this.image.src = img.src;
        this.image.alt = img.alt;

        // Update caption
        if (captionElement) {
            this.caption.innerHTML = captionElement.innerHTML;
        } else {
            this.caption.innerHTML = '';
        }
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.currentCarousel.slides.length;
        this.updateContent();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.currentCarousel.slides.length) % this.currentCarousel.slides.length;
        this.updateContent();
    }
}

// Initialize all carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => new Carousel(carousel));

    // Initialize lightbox
    window.lightbox = new Lightbox();
});

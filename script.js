const menuToggle = document.getElementById('menu-toggle');
const siteNav = document.getElementById('site-nav');
const imageModal = document.getElementById('image-modal');
const imageModalImg = document.getElementById('image-modal-img');
const imageModalClose = document.getElementById('image-modal-close');
const imageModalBackdrop = document.getElementById('image-modal-backdrop');
const imageModalPrev = document.getElementById('image-modal-prev');
const imageModalNext = document.getElementById('image-modal-next');
const galleryGrid = document.querySelector('.gallery-grid');

let galleryImages = [];
let currentIndex = 0;

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    siteNav.classList.toggle('open');
  });
}

const updateModalImage = (index) => {
  if (!imageModalImg || !galleryImages.length) return;
  currentIndex = (index + galleryImages.length) % galleryImages.length;
  imageModalImg.src = galleryImages[currentIndex].src;
  imageModalImg.alt = galleryImages[currentIndex].alt || 'Фото галереи';
};

const openModal = (index) => {
  if (!imageModal) return;
  updateModalImage(index);
  imageModal.classList.add('open');
  imageModal.setAttribute('aria-hidden', 'false');
};

const closeModal = () => {
  if (!imageModal) return;
  imageModal.classList.remove('open');
  imageModal.setAttribute('aria-hidden', 'true');
  if (imageModalImg) {
    imageModalImg.src = '';
    imageModalImg.alt = '';
  }
};

let imageTransitioning = false;

const animateModalImage = (index) => {
  if (!imageModalImg || imageTransitioning) return;
  imageTransitioning = true;
  imageModalImg.classList.add('transitioning');

  setTimeout(() => {
    updateModalImage(index);
    imageModalImg.classList.remove('transitioning');
    imageTransitioning = false;
  }, 220);
};

const showPrevious = () => {
  animateModalImage(currentIndex - 1);
};

const showNext = () => {
  animateModalImage(currentIndex + 1);
};

if (galleryGrid && imageModal && imageModalImg) {
  galleryImages = Array.from(galleryGrid.querySelectorAll('.photo-card img'));

  galleryGrid.addEventListener('click', (event) => {
    const card = event.target.closest('.photo-card');
    if (!card) return;
    const img = card.querySelector('img');
    if (!img) return;

    const index = galleryImages.findIndex((galleryImg) => galleryImg === img);
    if (index === -1) return;

    openModal(index);
  });
}

if (imageModalClose) {
  imageModalClose.addEventListener('click', closeModal);
}

if (imageModalBackdrop) {
  imageModalBackdrop.addEventListener('click', closeModal);
}

if (imageModalPrev) {
  imageModalPrev.addEventListener('click', (event) => {
    event.stopPropagation();
    showPrevious();
  });
}

if (imageModalNext) {
  imageModalNext.addEventListener('click', (event) => {
    event.stopPropagation();
    showNext();
  });
}

window.addEventListener('keydown', (event) => {
  if (!imageModal || !imageModal.classList.contains('open')) return;
  if (event.key === 'Escape') {
    closeModal();
  }
  if (event.key === 'ArrowLeft') {
    showPrevious();
  }
  if (event.key === 'ArrowRight') {
    showNext();
  }
});

// Intersection Observer для анимации контактов
const contactTypingElement = document.querySelector('.contact-typing');
if (contactTypingElement) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !contactTypingElement.classList.contains('active')) {
          contactTypingElement.classList.add('active');
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(contactTypingElement);
}

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
  const closeMenu = () => {
    siteNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    // русская страница оставляет подпись на русском
    if (document.documentElement.lang === 'ru') {
      menuToggle.setAttribute('aria-label', 'Открыть меню');
    } else {
      menuToggle.setAttribute('aria-label', 'Open menu');
    }
  };

  const openMenu = () => {
    siteNav.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    if (document.documentElement.lang === 'ru') {
      menuToggle.setAttribute('aria-label', 'Закрыть меню');
    } else {
      menuToggle.setAttribute('aria-label', 'Close menu');
    }
  };

  menuToggle.addEventListener('click', (event) => {
    const isOpen = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (isOpen) {
      if (document.documentElement.lang === 'ru') menuToggle.setAttribute('aria-label', 'Закрыть меню');
      else menuToggle.setAttribute('aria-label', 'Close menu');
    } else {
      if (document.documentElement.lang === 'ru') menuToggle.setAttribute('aria-label', 'Открыть меню');
      else menuToggle.setAttribute('aria-label', 'Open menu');
    }
  });

  // Закрыть меню при клике на ссылку внутри навигации
  siteNav.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (link) closeMenu();
  });

  // Закрыть меню при клике вне навигации
  document.addEventListener('click', (event) => {
    if (!siteNav.classList.contains('open')) return;
    if (!event.target.closest('#site-nav') && !event.target.closest('#menu-toggle')) {
      closeMenu();
    }
  });

  // Закрыть меню по Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && siteNav.classList.contains('open')) {
      closeMenu();
    }
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

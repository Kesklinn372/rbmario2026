const menuToggle = document.getElementById('menu-toggle');
const siteNav = document.getElementById('site-nav');
const imageModal = document.getElementById('image-modal');
const imageModalImg = document.getElementById('image-modal-img');
const imageModalVideo = document.getElementById('image-modal-video');
const imageModalClose = document.getElementById('image-modal-close');
const imageModalBackdrop = document.getElementById('image-modal-backdrop');
const imageModalPrev = document.getElementById('image-modal-prev');
const imageModalNext = document.getElementById('image-modal-next');
const imageModalMute = document.getElementById('image-modal-mute');
const galleryGrid = document.querySelector('.gallery-grid');

let galleryItems = [];
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

const toggleMute = () => {
  if (!imageModalVideo) return;
  imageModalVideo.muted = !imageModalVideo.muted;
  if (imageModalMute) {
    imageModalMute.textContent = imageModalVideo.muted ? '🔇' : '🔊';
    imageModalMute.setAttribute('aria-label', imageModalVideo.muted ? 'Включить звук' : 'Выключить звук');
  }
};

const updateModalMedia = (index) => {
  if (!galleryItems.length) return;
  currentIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentIndex];

  // reset/hide both
  if (imageModalImg) {
    imageModalImg.style.display = 'none';
    imageModalImg.src = '';
    imageModalImg.alt = '';
  }
  if (imageModalVideo) {
    imageModalVideo.muted = false;
    imageModalVideo.defaultMuted = false;
    imageModalVideo.volume = 1;
    imageModalVideo.controls = true;
    imageModalVideo.removeAttribute('muted');
    imageModalVideo.setAttribute('controls', 'controls');
    imageModalVideo.style.display = 'none';
    imageModalVideo.pause();
    imageModalVideo.removeAttribute('src');
    while (imageModalVideo.firstChild) imageModalVideo.removeChild(imageModalVideo.firstChild);
    imageModalVideo.setAttribute('aria-hidden', 'true');
  }
  if (imageModalMute) {
    imageModalMute.hidden = true;
    imageModalMute.textContent = '🔊';
    imageModalMute.setAttribute('aria-label', 'Выключить звук');
  }

  if (item.type === 'image') {
    imageModalImg.src = item.src;
    imageModalImg.alt = item.alt || 'Фото галереи';
    imageModalImg.style.display = '';
  } else if (item.type === 'video') {
    imageModalVideo.muted = false;
    imageModalVideo.defaultMuted = false;
    imageModalVideo.volume = 1;
    imageModalVideo.controls = true;
    imageModalVideo.removeAttribute('muted');
    imageModalVideo.setAttribute('controls', 'controls');
    imageModalVideo.innerHTML = '';
    const source = document.createElement('source');
    source.src = item.src;
    source.type = item.mime || 'video/mp4';
    imageModalVideo.appendChild(source);
    imageModalVideo.load();
    imageModalVideo.style.display = '';
    imageModalVideo.setAttribute('aria-hidden', 'false');
    if (imageModalMute) {
      imageModalMute.hidden = false;
      imageModalMute.textContent = '🔊';
      imageModalMute.setAttribute('aria-label', 'Выключить звук');
    }
    const p = imageModalVideo.play();
    if (p && p.catch) p.catch(() => {});
  }
};

const openModal = (index) => {
  if (!imageModal) return;
  const scrollY = window.scrollY || window.pageYOffset;
  document.body.dataset.modalScrollY = String(scrollY);
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
  updateModalMedia(index);
  imageModal.classList.add('open');
  imageModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  document.documentElement.classList.add('modal-open');
};

const closeModal = () => {
  if (!imageModal) return;
  const previousScrollY = Number(document.body.dataset.modalScrollY || 0);
  imageModal.classList.remove('open');
  imageModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  document.documentElement.classList.remove('modal-open');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  document.body.dataset.modalScrollY = '';
  if (imageModalImg) {
    imageModalImg.src = '';
    imageModalImg.alt = '';
    imageModalImg.style.display = 'none';
  }
  if (imageModalVideo) {
    imageModalVideo.pause();
    imageModalVideo.removeAttribute('src');
    while (imageModalVideo.firstChild) imageModalVideo.removeChild(imageModalVideo.firstChild);
    imageModalVideo.style.display = 'none';
    imageModalVideo.setAttribute('aria-hidden', 'true');
  }
  window.scrollTo(0, previousScrollY);
};

let imageTransitioning = false;

const animateModalItem = (index) => {
  if (imageTransitioning) return;
  imageTransitioning = true;
  if (imageModalImg) imageModalImg.classList.add('transitioning');

  setTimeout(() => {
    updateModalMedia(index);
    if (imageModalImg) imageModalImg.classList.remove('transitioning');
    imageTransitioning = false;
  }, 220);
};

const showPrevious = () => {
  animateModalItem(currentIndex - 1);
};

const showNext = () => {
  animateModalItem(currentIndex + 1);
};

if (galleryGrid && imageModal) {
  // collect images and videos
  galleryItems = Array.from(galleryGrid.querySelectorAll('.photo-card')).map((card) => {
    const img = card.querySelector('img');
    const vid = card.querySelector('video');
    if (img) {
      return { type: 'image', src: img.getAttribute('src'), alt: img.getAttribute('alt') };
    }
    if (vid) {
      const source = vid.querySelector('source');
      const src = source ? source.getAttribute('src') : vid.getAttribute('src');
      const mime = source ? source.getAttribute('type') : null;
      return { type: 'video', src: src, mime: mime };
    }
    return null;
  }).filter(Boolean);

  galleryGrid.addEventListener('click', (event) => {
    const card = event.target.closest('.photo-card');
    if (!card) return;

    const cards = Array.from(galleryGrid.querySelectorAll('.photo-card'));
    const index = cards.indexOf(card);
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

if (imageModalMute) {
  imageModalMute.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMute();
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

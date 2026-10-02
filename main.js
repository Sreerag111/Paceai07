/**
 * Slipe AI — Interactive Frontend Logic
 * Before/After Sliders, Comparison Tab Filter, Mobile Drawer & Modal Handlers
 */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------------------- */
  /* 1. HEADER SCROLL EFFECT                                                    */
  /* -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* -------------------------------------------------------------------------- */
  /* 2. MOBILE MENU TOGGLE                                                      */
  /* -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('active');
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
      });
    });
  }

  /* -------------------------------------------------------------------------- */
  /* 3. INTERACTIVE HERO BEFORE/AFTER SLIDER                                     */
  /* -------------------------------------------------------------------------- */
  function initBeforeAfterSlider(containerId, beforeLayerId, handleId) {
    const container = document.getElementById(containerId);
    const beforeLayer = document.getElementById(beforeLayerId);
    const handle = document.getElementById(handleId);

    if (!container || !beforeLayer || !handle) return;

    let isDragging = false;

    function setPosition(x) {
      const rect = container.getBoundingClientRect();
      let offsetX = x - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      beforeLayer.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    }

    function onPointerDown(e) {
      isDragging = true;
      setPosition(e.clientX || (e.touches && e.touches[0].clientX));
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      setPosition(e.clientX || (e.touches && e.touches[0].clientX));
    }

    function onPointerUp() {
      isDragging = false;
    }

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', onPointerDown);
    window.addEventListener('touchmove', onPointerMove);
    window.addEventListener('touchend', onPointerUp);
  }

  // Initialize Hero Slider
  initBeforeAfterSlider('hero-slider-card', 'hero-before-layer', 'hero-slider-handle');

  // Initialize Comparison Section Slider
  initBeforeAfterSlider('main-comp-slider', 'main-before-layer', 'main-slider-handle');

  /* -------------------------------------------------------------------------- */
  /* 4. COMPARISON SECTION TABS & SAMPLES                                       */
  /* -------------------------------------------------------------------------- */
  const compTabs = document.querySelectorAll('.comp-tab');
  const compBeforeImg = document.getElementById('comp-before-img');
  const compAfterImg = document.getElementById('comp-after-img');

  const compSamples = {
    'portrait': {
      after: 'assets/portrait-enhanced.jpg',
      filter: 'blur(2.5px) contrast(0.92) brightness(0.92)'
    },
    'low-quality': {
      after: 'assets/portrait-enhanced.jpg',
      filter: 'blur(4px) contrast(0.8) brightness(0.9) saturate(0.8)'
    },
    'old-photo': {
      after: 'assets/portrait-enhanced.jpg',
      filter: 'sepia(0.5) blur(2px) contrast(0.85) brightness(0.9)'
    },
    'outdoor': {
      after: 'assets/cinematic-ai.jpg',
      filter: 'blur(3px) contrast(0.88) brightness(0.92)'
    }
  };

  compTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      compTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.comp;
      if (compSamples[target] && compBeforeImg && compAfterImg) {
        compAfterImg.src = compSamples[target].after;
        compBeforeImg.src = compSamples[target].after;
        compBeforeImg.style.filter = compSamples[target].filter;
      }
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 5. MODAL CONTROLLER                                                        */
  /* -------------------------------------------------------------------------- */
  const modalBackdrop = document.getElementById('modal-backdrop');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtn = document.getElementById('modal-close');
  const doneModalBtn = document.getElementById('modal-done-btn');
  const accessForm = document.getElementById('access-form');
  const formView = document.getElementById('modal-form-view');
  const successView = document.getElementById('modal-success-view');

  function openModal() {
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (accessForm) accessForm.reset();
      formView.classList.remove('hidden');
      successView.classList.add('hidden');
    }, 400);
  }

  openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (doneModalBtn) doneModalBtn.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  if (accessForm) {
    accessForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('email-input');
      if (emailInput && emailInput.value) {
        formView.classList.add('hidden');
        successView.classList.remove('hidden');
      }
    });
  }

  /* -------------------------------------------------------------------------- */
  /* 6. INTERSECTION OBSERVER FOR FADE-IN REVEALS                              */
  /* -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.major-feature-card, .gallery-card, .step-card, .use-case-box, .philosophy-card, .cta-box');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
  });

  /* -------------------------------------------------------------------------- */
  /* 7. DYNAMIC YEAR IN FOOTER                                                  */
  /* -------------------------------------------------------------------------- */
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

});

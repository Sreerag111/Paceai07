/**
 * Pace AI — Interactive Frontend Logic
 * Canvas Sine-Wave Animation, Focus Mode Rhythms, Modal Handler, and Scroll Triggers
 */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------------------- */
  /* 1. HERO HARMONIC CANVAS ANIMATION                                          */
  /* -------------------------------------------------------------------------- */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let time = 0;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function drawWave(yOffset, frequency, amplitude, speed, color, lineWidth) {
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;

      for (let x = 0; x < width; x += 4) {
        const mouseDist = Math.sin((x / width) * Math.PI);
        const y = yOffset + 
          Math.sin(x * frequency + time * speed) * amplitude + 
          mouse.x * 30 * mouseDist;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);
      time += 0.015;

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const centerY = height * 0.45;

      // Layered electric blue & amber pace waves for light mode
      drawWave(centerY, 0.003, 40, 0.8, 'rgba(0, 102, 255, 0.25)', 2);
      drawWave(centerY + 30, 0.002, 60, 0.6, 'rgba(217, 119, 6, 0.18)', 1.5);
      drawWave(centerY - 20, 0.004, 30, 1.1, 'rgba(15, 23, 42, 0.1)', 1);

      requestAnimationFrame(renderCanvas);
    }

    renderCanvas();
  }

  /* -------------------------------------------------------------------------- */
  /* 2. HEADER SCROLL EFFECT                                                    */
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
  /* 3. FOCUS MODE RHYTHMS INTERACTIVE SELECTOR                                 */
  /* -------------------------------------------------------------------------- */
  const rhythmChips = document.querySelectorAll('.rhythm-chip');
  const timerValue = document.querySelector('.timer-value');
  const timerLabel = document.querySelector('.timer-label');
  const focusProgress = document.querySelector('.focus-progress');

  const focusPresets = {
    'Deep Work Flow': { time: '25:00', label: 'FOCUS SESSION ACTIVE', progress: '75%' },
    'Mindful Relaxation': { time: '05:00', label: 'RELAXATION & BREATHING', progress: '30%' },
    'App Blocker Active': { time: '45:00', label: 'APP BLOCKER ACTIVE · APPS BLOCKED ON YOUR TIME', progress: '90%' }
  };

  rhythmChips.forEach(chip => {
    chip.addEventListener('click', () => {
      rhythmChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const modeName = chip.querySelector('span:last-child').textContent.trim();
      if (focusPresets[modeName]) {
        if (timerValue) timerValue.textContent = focusPresets[modeName].time;
        if (timerLabel) timerLabel.textContent = focusPresets[modeName].label;
        if (focusProgress) focusProgress.style.width = focusPresets[modeName].progress;
      }
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 4. PHILOSOPHY INTERACTIVE SWITCH TABS                                      */
  /* -------------------------------------------------------------------------- */
  const switchTabs = document.querySelectorAll('.switch-tab');
  const switchContents = document.querySelectorAll('.switch-content');

  switchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;

      switchTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      switchContents.forEach(content => {
        if (content.id === `tab-${targetTab}`) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
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
  /* 6. INTERSECTION OBSERVER FOR SCROLL REVEAL                                 */
  /* -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.pillar-card, .feature-box, .focus-banner, .why-grid, .vision-banner, .closing-box');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
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

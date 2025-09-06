"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const sliders = document.querySelectorAll('[data-slider]');
    sliders.forEach(initSlider);
  });

  function initSlider(viewport) {
    const track = viewport.querySelector('.slider__track');
    const slides = Array.from(viewport.querySelectorAll('.slider__slide'));
    const btnPrev = viewport.querySelector('.slider__btn--prev');
    const btnNext = viewport.querySelector('.slider__btn--next');
    const dotsBox = viewport.querySelector('.slider__dots');

    if (!track || slides.length === 0) return;

    let index = 0;
    let locked = false;
    let autoTimer = null;
    let autoDelay = 4000;
    let isPointerDown = false;
    let startX = 0;
    let currentX = 0;
    let deltaX = 0;

    // Build dots
    if (dotsBox) {
      dotsBox.innerHTML = '';
      slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', `Перейти к слайду ${i + 1}`);
        b.addEventListener('click', () => goTo(i));
        dotsBox.appendChild(b);
      });
    }

    function updateDots() {
      if (!dotsBox) return;
      const bs = dotsBox.querySelectorAll('button');
      bs.forEach((b, i) => b.setAttribute('aria-current', i === index ? 'true' : 'false'));
    }

    function applyTransform(xPercent, withAnim = true) {
      if (!withAnim) track.style.transition = 'none';
      else track.style.transition = '';
      track.style.transform = `translateX(${xPercent}%)`;
      // force reflow to apply no-transition case instantly and then restore
      if (!withAnim) track.getBoundingClientRect();
    }

    function goTo(i, opts = {}) {
      if (locked) return;
      const withAnim = opts.animate !== false;
      index = Math.max(0, Math.min(slides.length - 1, i));
      const x = -index * 100;
      applyTransform(x, withAnim);
      updateDots();
      restartAutoplay();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    // Buttons
    if (btnNext) btnNext.addEventListener('click', () => { stopAutoplay(); next(); });
    if (btnPrev) btnPrev.addEventListener('click', () => { stopAutoplay(); prev(); });

    // Autoplay
    function startAutoplay() {
      if (autoTimer) return;
      autoTimer = setInterval(() => {
        if (document.hidden) return;
        if (index >= slides.length - 1) goTo(0);
        else next();
      }, autoDelay);
    }
    function stopAutoplay() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }
    function restartAutoplay() { stopAutoplay(); startAutoplay(); }

    viewport.addEventListener('mouseenter', stopAutoplay, { passive: true });
    viewport.addEventListener('mouseleave', startAutoplay, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay(); else startAutoplay();
    });

    // Touch / Pointer swipe
    const threshold = 0.18; // percent of width

    function onPointerDown(e) {
      isPointerDown = true;
      stopAutoplay();
      locked = true;
      startX = getX(e);
      currentX = startX;
      deltaX = 0;
      viewport.setPointerCapture?.(e.pointerId || 0);
    }

    function onPointerMove(e) {
      if (!isPointerDown) return;
      currentX = getX(e);
      deltaX = currentX - startX;
      const rect = viewport.getBoundingClientRect();
      const percent = (deltaX / rect.width) * 100;
      const base = -index * 100;
      applyTransform(base + percent, false);
    }

    function onPointerUp(e) {
      if (!isPointerDown) return;
      isPointerDown = false;
      const rect = viewport.getBoundingClientRect();
      const moved = Math.abs(deltaX) / rect.width;
      const dir = deltaX < 0 ? 1 : -1;
      locked = false;
      if (moved > threshold) {
        if (dir > 0) next(); else prev();
      } else {
        goTo(index);
      }
      startAutoplay();
    }

    // Support both pointer and touch events
    if (window.PointerEvent) {
      viewport.addEventListener('pointerdown', onPointerDown, { passive: true });
      viewport.addEventListener('pointermove', onPointerMove, { passive: true });
      viewport.addEventListener('pointerup', onPointerUp, { passive: true });
      viewport.addEventListener('pointercancel', onPointerUp, { passive: true });
      viewport.addEventListener('pointerleave', onPointerUp, { passive: true });
    } else {
      viewport.addEventListener('touchstart', onPointerDown, { passive: true });
      viewport.addEventListener('touchmove', onPointerMove, { passive: true });
      viewport.addEventListener('touchend', onPointerUp, { passive: true });
      viewport.addEventListener('touchcancel', onPointerUp, { passive: true });
    }

    function getX(e) {
      if (e.touches && e.touches[0]) return e.touches[0].clientX;
      if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].clientX;
      return e.clientX;
    }

    // Keyboard navigation for accessibility
    viewport.setAttribute('tabindex', '0');
    viewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { stopAutoplay(); next(); }
      else if (e.key === 'ArrowLeft') { stopAutoplay(); prev(); }
    });

    // Init
    goTo(0, { animate: false });
    startAutoplay();
    updateDots();

    // Dots click after init needs current state
    // (already wired in creation)
  }
})();

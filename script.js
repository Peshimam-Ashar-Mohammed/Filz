/* ============================================
   SCRIPT.JS — Proposal Experience
   ============================================ */

(function () {
  'use strict';

  // ——— State ———
  let currentSection = 1;
  const totalSections = 6;
  let transitioning = false;
  let section1Ready = false;
  let sectionAnimated = {};

  // ——— DOM refs ———
  const sections = {};
  for (let i = 1; i <= totalSections; i++) {
    sections[i] = document.getElementById(`section-${i}`);
  }
  const musicBtn = document.getElementById('music-btn');
  const bgMusic = document.getElementById('bg-music');
  const cursorCanvas = document.getElementById('cursor-trail');
  const cursorCtx = cursorCanvas.getContext('2d');
  const heartsCanvas = document.getElementById('hearts-canvas');
  const heartsCtx = heartsCanvas.getContext('2d');

  // ——— Detect touch device ———
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Replace "click" with "tap" on touch devices
  if (isTouchDevice) {
    document.querySelectorAll('.continue-indicator span').forEach(el => {
      el.textContent = el.textContent.replace('click', 'tap');
    });
  }

  // ——— Canvas sizing ———
  function resizeCanvases() {
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
    heartsCanvas.width = window.innerWidth;
    heartsCanvas.height = window.innerHeight;
  }
  resizeCanvases();
  window.addEventListener('resize', resizeCanvases);

  // ============================================
  // CURSOR TRAIL
  // ============================================
  const trail = [];
  const TRAIL_LENGTH = 20;

  function updateCursor(x, y) {
    document.documentElement.style.setProperty('--cx', x + 'px');
    document.documentElement.style.setProperty('--cy', y + 'px');
    trail.push({ x, y, alpha: 1 });
    if (trail.length > TRAIL_LENGTH) trail.shift();
  }

  if (!isTouchDevice) {
    document.addEventListener('mousemove', e => {
      updateCursor(e.clientX, e.clientY);
    });
  }

  function drawTrail() {
    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    if (isTouchDevice) {
      requestAnimationFrame(drawTrail);
      return;
    }
    for (let i = 0; i < trail.length; i++) {
      const p = trail[i];
      const ratio = i / trail.length;
      const radius = ratio * 4 + 1;
      cursorCtx.beginPath();
      cursorCtx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      cursorCtx.fillStyle = `rgba(255, 46, 136, ${ratio * 0.35})`;
      cursorCtx.fill();
    }
    requestAnimationFrame(drawTrail);
  }
  drawTrail();

  // ============================================
  // MUSIC
  // ============================================
  let musicStarted = false;

  musicBtn.addEventListener('click', e => {
    e.stopPropagation();
    toggleMusic();
  });

  function toggleMusic() {
    if (!musicStarted) {
      bgMusic.volume = 0.25;
      bgMusic.play().then(() => {
        musicStarted = true;
        musicBtn.classList.add('playing');
        musicBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg>`;
      }).catch(() => { });
    } else {
      if (bgMusic.paused) {
        bgMusic.play();
        musicBtn.classList.add('playing');
        musicBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg>`;
      } else {
        bgMusic.pause();
        musicBtn.classList.remove('playing');
        musicBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg>`;
      }
    }
  }

  // Try autoplay
  setTimeout(() => {
    if (!musicStarted) {
      bgMusic.volume = 0.25;
      bgMusic.play().then(() => {
        musicStarted = true;
        musicBtn.classList.add('playing');
        musicBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg>`;
      }).catch(() => { });
    }
  }, 500);

  // ============================================
  // SECTION NAVIGATION
  // ============================================
  function goToSection(n) {
    if (n < 1 || n > totalSections || transitioning) return;
    if (n === currentSection) return;

    transitioning = true;
    const prev = sections[currentSection];
    const next = sections[n];

    prev.classList.remove('active');
    setTimeout(() => {
      next.classList.add('active');
      currentSection = n;
      animateSection(n);
      setTimeout(() => {
        transitioning = false;
      }, 600);
    }, 400);
  }

  // Click / tap anywhere to advance (except section 5 & 6)
  document.addEventListener('click', () => {
    if (currentSection === 5 || currentSection === 6) return;
    if (currentSection === 1 && !section1Ready) return;
    goToSection(currentSection + 1);
  });

  // Also handle continue indicators
  document.querySelectorAll('.continue-indicator').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      if (currentSection === 1 && !section1Ready) return;
      goToSection(currentSection + 1);
    });
  });

  // ============================================
  // SECTION 1: TYPEWRITER
  // ============================================
  function typewriterEffect(elementId, text, speed, callback) {
    const el = document.getElementById(elementId);
    let i = 0;
    // Add cursor
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'cursor-blink';
    el.textContent = '';
    el.appendChild(cursorSpan);

    function type() {
      if (i < text.length) {
        el.textContent = text.substring(0, i + 1);
        el.appendChild(cursorSpan);
        i++;
        setTimeout(type, speed);
      } else {
        // Remove cursor after a beat
        setTimeout(() => {
          el.removeChild(cursorSpan);
          if (callback) callback();
        }, 400);
      }
    }
    type();
  }

  function animateSection1() {
    if (sectionAnimated[1]) return;
    sectionAnimated[1] = true;

    typewriterEffect('tw-line-1', "I don't know how it happened…", 50, () => {
      setTimeout(() => {
        typewriterEffect('tw-line-2', "but you became a part of my life, Filza.", 45, () => {
          setTimeout(() => {
            const line3 = document.getElementById('tw-line-3');
            line3.textContent = "And it's not like this with other people.";
            line3.classList.add('visible');
            section1Ready = true;
            showContinue(1);
          }, 800);
        });
      }, 1000);
    });
  }

  function showContinue(n) {
    const el = document.getElementById(`continue-${n}`);
    if (el) {
      setTimeout(() => el.classList.add('visible'), 600);
    }
  }

  // ============================================
  // SECTION 2: FEELINGS
  // ============================================
  function animateSection2() {
    if (sectionAnimated[2]) return;
    sectionAnimated[2] = true;

    const lines = sections[2].querySelectorAll('.feel-line');
    lines.forEach(line => {
      const delay = parseInt(line.dataset.delay || 0);
      setTimeout(() => line.classList.add('visible'), delay);
    });

    const maxDelay = Math.max(...[...lines].map(l => parseInt(l.dataset.delay || 0)));
    setTimeout(() => showContinue(2), maxDelay + 800);
  }

  // ============================================
  // SECTION 3: DISTANCE
  // ============================================
  function animateSection3() {
    if (sectionAnimated[3]) return;
    sectionAnimated[3] = true;

    // Show dots
    setTimeout(() => {
      document.querySelector('.dot-india').classList.add('visible');
      document.querySelector('.india-label').classList.add('visible');
    }, 300);

    // Animate line
    setTimeout(() => {
      document.querySelector('.distance-line').classList.add('animate');
    }, 600);

    // Show pakistan dot
    setTimeout(() => {
      document.querySelector('.dot-pakistan').classList.add('visible');
      document.querySelector('.pakistan-label').classList.add('visible');
    }, 2400);

    // Show text
    const lines = sections[3].querySelectorAll('.dist-line');
    lines.forEach(line => {
      const delay = parseInt(line.dataset.delay || 0);
      setTimeout(() => line.classList.add('visible'), delay);
    });

    const maxDelay = Math.max(...[...lines].map(l => parseInt(l.dataset.delay || 0)));
    setTimeout(() => showContinue(3), maxDelay + 800);
  }

  // ============================================
  // SECTION 4: PROPOSAL
  // ============================================
  function animateSection4() {
    if (sectionAnimated[4]) return;
    sectionAnimated[4] = true;

    // Show bouquet wrapper with orbital rings
    setTimeout(() => {
      document.getElementById('bouquet-wrapper').classList.add('visible');
      document.getElementById('ring-3d').classList.add('visible');
    }, 500);

    // Show text lines
    const lines = sections[4].querySelectorAll('.prop-line');
    lines.forEach(line => {
      const delay = parseInt(line.dataset.delay || 0);
      setTimeout(() => line.classList.add('visible'), delay);
    });

    const maxDelay = Math.max(...[...lines].map(l => parseInt(l.dataset.delay || 0)));
    setTimeout(() => showContinue(4), maxDelay + 1200);
  }

  // ============================================
  // SECTION 5: BUTTONS
  // ============================================
  const noBtn = document.getElementById('btn-no');
  const yesBtn = document.getElementById('btn-yes');
  const noText = document.getElementById('no-text');
  let noAttempts = 0;

  function moveNoButton() {
    const area = sections[5].querySelector('.button-area');
    const rect = area.getBoundingClientRect();
    const btnW = noBtn.offsetWidth;
    const btnH = noBtn.offsetHeight;

    const maxX = rect.width - btnW - 20;
    const maxY = rect.height - btnH - 20;

    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    const rotation = (Math.random() - 0.5) * 60;
    const scale = 0.6 + Math.random() * 0.6;

    noBtn.style.right = 'auto';
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
    noBtn.style.transform = `rotate(${rotation}deg) scale(${scale})`;

    noAttempts++;
    if (noAttempts >= 2) {
      noText.classList.add('visible');
    }
  }

  // Desktop: move on hover
  noBtn.addEventListener('mouseenter', () => {
    moveNoButton();
  });

  // Mobile: move on touch
  noBtn.addEventListener('touchstart', e => {
    e.preventDefault();
    moveNoButton();
  });

  // Also move on click just in case
  noBtn.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    moveNoButton();
  });

  // YES button
  yesBtn.addEventListener('click', e => {
    e.stopPropagation();
    triggerYes();
  });

  function triggerYes() {
    // Flash overlay
    const flash = document.createElement('div');
    flash.className = 'flash-overlay';
    document.body.appendChild(flash);
    requestAnimationFrame(() => {
      flash.classList.add('flash');
      setTimeout(() => {
        flash.classList.remove('flash');
        setTimeout(() => flash.remove(), 300);
      }, 250);
    });

    setTimeout(() => {
      goToSection(6);
    }, 500);
  }

  // ============================================
  // SECTION 6: AFTER YES
  // ============================================
  function animateSection6() {
    if (sectionAnimated[6]) return;
    sectionAnimated[6] = true;

    sections[6].classList.add('after-yes-active');

    const lines = sections[6].querySelectorAll('.ay-line');
    lines.forEach(line => {
      const delay = parseInt(line.dataset.delay || 0);
      setTimeout(() => {
        line.classList.add('visible');

        // Trigger loading bar when its container becomes visible
        const loadingBar = line.querySelector('.loading-bar');
        if (loadingBar) {
          setTimeout(() => loadingBar.classList.add('animate'), 200);
        }
      }, delay);
    });

    // Also handle the loading bar container separately
    const loadingBarEl = sections[6].querySelector('.loading-bar');
    if (loadingBarEl) {
      setTimeout(() => loadingBarEl.classList.add('animate'), 2200);
    }

    // Start hearts after a delay
    setTimeout(() => startHearts(), 5000);
  }

  // ============================================
  // FLOATING HEARTS
  // ============================================
  const hearts = [];

  function startHearts() {
    for (let i = 0; i < 25; i++) {
      setTimeout(() => {
        hearts.push(createHeart());
      }, i * 400);
    }
    animateHearts();
  }

  function createHeart() {
    return {
      x: Math.random() * heartsCanvas.width,
      y: heartsCanvas.height + 20,
      size: 8 + Math.random() * 14,
      speedY: 0.4 + Math.random() * 0.8,
      speedX: (Math.random() - 0.5) * 0.5,
      alpha: 0.3 + Math.random() * 0.5,
      wobble: Math.random() * Math.PI * 2
    };
  }

  function drawHeart(ctx, x, y, size, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ff2e88';
    ctx.shadowColor = '#ff2e88';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    const topY = y - size / 2;
    ctx.moveTo(x, topY + size / 4);
    ctx.bezierCurveTo(x, topY, x - size / 2, topY, x - size / 2, topY + size / 4);
    ctx.bezierCurveTo(x - size / 2, topY + size / 2, x, topY + size * 0.7, x, topY + size);
    ctx.bezierCurveTo(x, topY + size * 0.7, x + size / 2, topY + size / 2, x + size / 2, topY + size / 4);
    ctx.bezierCurveTo(x + size / 2, topY, x, topY, x, topY + size / 4);
    ctx.fill();
    ctx.restore();
  }

  function animateHearts() {
    heartsCtx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);

    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      h.y -= h.speedY;
      h.wobble += 0.02;
      h.x += Math.sin(h.wobble) * 0.3 + h.speedX;
      h.alpha -= 0.001;

      if (h.y < -30 || h.alpha <= 0) {
        hearts[i] = createHeart();
        continue;
      }

      drawHeart(heartsCtx, h.x, h.y, h.size, h.alpha);
    }

    requestAnimationFrame(animateHearts);
  }

  // ============================================
  // SECTION ANIMATION DISPATCHER
  // ============================================
  function animateSection(n) {
    switch (n) {
      case 1: animateSection1(); break;
      case 2: animateSection2(); break;
      case 3: animateSection3(); break;
      case 4: animateSection4(); break;
      case 5: /* buttons are always ready */ break;
      case 6: animateSection6(); break;
    }
  }

  // ============================================
  // INIT
  // ============================================
  animateSection1();

})();

/* ==========================================
   VIRGUEZMC - JavaScript
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {

  // --- Particle System ---
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedY = -(Math.random() * 0.3 + 0.1);
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.fadeSpeed = Math.random() * 0.003 + 0.001;
        const colors = ['74, 222, 128', '34, 211, 238', '251, 191, 36', '167, 139, 250', '255, 255, 255'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.opacity -= this.fadeSpeed;
        if (this.opacity <= 0 || this.y < -10) {
          this.reset();
          this.y = canvas.height + 10;
          this.opacity = Math.random() * 0.5 + 0.1;
        }
      }
      draw() {
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size);
      }
    }

    const particleCount = Math.min(Math.floor(window.innerWidth / 15), 80);
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animFrame = requestAnimationFrame(animateParticles);
    }
    animateParticles();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(animFrame);
      else animateParticles();
    });
  }

  // --- Navbar scroll ---
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }, { passive: true });
  }

  // --- Mobile nav toggle ---
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // --- Copy IP ---
  const copyIpBtn = document.getElementById('copy-ip');
  const ipCopied = document.getElementById('ip-copied');
  if (copyIpBtn && ipCopied) {
    copyIpBtn.addEventListener('click', async () => {
      const ip = copyIpBtn.dataset.ip;
      try {
        await navigator.clipboard.writeText(ip);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = ip;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      ipCopied.classList.add('show');
      setTimeout(() => ipCopied.classList.remove('show'), 1500);
    });
  }

  // --- Stat counter ---
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  function countUp(el, target) {
    const duration = 1800;
    const startTime = performance.now();
    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  function checkStats() {
    if (statsCounted) return;
    const statsBar = document.querySelector('.stats-bar');
    if (!statsBar) return;
    if (statsBar.getBoundingClientRect().top < window.innerHeight * 0.85) {
      statsCounted = true;
      statNumbers.forEach(el => countUp(el, parseInt(el.dataset.target, 10)));
    }
  }

  // --- Scroll reveal ---
  function revealOnScroll() {
    document.querySelectorAll('.rank-card, .feature-card').forEach((el, i) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.88) {
        setTimeout(() => el.classList.add('visible'), i * 100);
      }
    });
  }

  checkStats();
  revealOnScroll();
  window.addEventListener('scroll', () => { checkStats(); revealOnScroll(); }, { passive: true });

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('active');
        const oa = other.querySelector('.faq-answer');
        const oq = other.querySelector('.faq-question');
        if (oa) oa.style.maxHeight = '0';
        if (oq) oq.setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --- Smooth scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const navHeight = navbar ? navbar.offsetHeight : 0;
        window.scrollTo({
          top: targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 20,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Rank card glow ---
  document.querySelectorAll('.rank-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });

});

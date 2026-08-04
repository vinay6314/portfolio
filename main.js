/* ==========================================================================
   DEVELOPER PORTFOLIO - CORE INTERACTION LOGIC
   Candidate: Boppana Naga Venkata Vinay
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initTypewriter();
  initCounterStats();
  initSpotlightMode();
  initModals();
  initThemeToggle();
  initContactForm();
  initMobileNav();
});

/* --------------------------------------------------------------------------
   1. ANIMATED CANVAS BACKGROUND (Particle Constellation)
   -------------------------------------------------------------------------- */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const particleCount = 50;
  let mouse = { x: null, y: null, radius: 160 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x && mouse.y) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 158, 11, ${this.alpha})`;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(245, 158, 11, ${0.18 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. DYNAMIC TYPEWRITER EFFECT
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    "Full-Stack Web Development (React & Node)",
    "AI Integration (Claude API)",
    "Database Optimization (Prisma & Redis)",
    "DevOps & Cloud (Docker, AWS, CI/CD)"
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      el.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
    }

    let typeSpeed = isDeleting ? 30 : 70;

    if (!isDeleting && charIdx === currentPhrase.length) {
      typeSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   3. HERO STATS COUNTER ANIMATION
   -------------------------------------------------------------------------- */
function initCounterStats() {
  const statNums = document.querySelectorAll('.stat-num');
  let animated = false;

  function runCounters() {
    if (animated) return;
    animated = true;

    statNums.forEach(stat => {
      const isFloat = stat.getAttribute('data-float') === 'true';
      const target = parseFloat(stat.getAttribute('data-target'));
      let count = 0;
      const step = isFloat ? 0.2 : Math.ceil(target / 30);

      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          stat.textContent = isFloat ? target.toFixed(2) : Math.round(target);
          clearInterval(timer);
        } else {
          stat.textContent = isFloat ? count.toFixed(2) : Math.round(count);
        }
      }, 40);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      runCounters();
    }
  }, { threshold: 0.5 });

  const heroSection = document.getElementById('hero');
  if (heroSection) observer.observe(heroSection);
}

/* --------------------------------------------------------------------------
   4. RECRUITER ROLE SPOTLIGHT SWITCHER
   -------------------------------------------------------------------------- */
const spotlightData = {
  all: {
    title: "Full Spectrum Overview",
    headline: "Building full-stack AI-driven applications with robust backend architecture",
    summary: "Engineered PriceIQ, a full-stack AI price optimization SaaS app using React, Node.js, PostgreSQL, Claude API, Prisma ORM, Redis, Docker, and AWS.",
    highlights: [
      "<i class='fa-solid fa-check'></i> Claude API Integration & Price Optimization",
      "<i class='fa-solid fa-check'></i> JWT Secured REST APIs & Express.js",
      "<i class='fa-solid fa-check'></i> Prisma ORM & Redis Performance Caching",
      "<i class='fa-solid fa-check'></i> Docker, AWS & GitHub Actions CI/CD Deployment"
    ]
  },
  fullstack: {
    title: "Full-Stack Web Developer",
    headline: "Connecting React UIs with Node.js, Express & PostgreSQL backends",
    summary: "Proven ability to craft responsive frontends using React & Tailwind CSS, backed by secure REST APIs with JWT authentication, Prisma ORM, and relational database schemas.",
    highlights: [
      "<i class='fa-solid fa-check'></i> React & Tailwind CSS Responsive Interfaces",
      "<i class='fa-solid fa-check'></i> Node.js & Express RESTful APIs",
      "<i class='fa-solid fa-check'></i> PostgreSQL & Prisma ORM Schema Design",
      "<i class='fa-solid fa-check'></i> Real-time Analytics & Competitor Price Tracking"
    ]
  },
  aiml: {
    title: "AI & Intelligent Applications",
    headline: "Smart Price Optimization leveraging Claude API & AI Analytics",
    summary: "Integrated LLM capabilities (Claude API) into PriceIQ to analyze competitor pricing trends and output automated, intelligent pricing strategies.",
    highlights: [
      "<i class='fa-solid fa-check'></i> Claude API Prompt Engineering & Pipeline Integration",
      "<i class='fa-solid fa-check'></i> Real-time Competitor Price Tracking Engine",
      "<i class='fa-solid fa-check'></i> Automated Insights & Pricing Recommendations",
      "<i class='fa-solid fa-check'></i> Python & Modern Web Technology Stack"
    ]
  },
  devops: {
    title: "Cloud, Docker & CI/CD",
    headline: "Containerization, Cloud Deployments & Automated Build Pipelines",
    summary: "Experience containerizing SaaS applications using Docker, deploying on AWS infrastructure, and setting up automated GitHub Actions CI/CD pipelines.",
    highlights: [
      "<i class='fa-solid fa-check'></i> Docker Containerization for Full-Stack Services",
      "<i class='fa-solid fa-check'></i> AWS Cloud Deployment Infrastructure",
      "<i class='fa-solid fa-check'></i> Automated GitHub Actions CI/CD Pipelines",
      "<i class='fa-solid fa-check'></i> Vercel Production Hosting (priceiq-saxo.vercel.app)"
    ]
  }
};

function initSpotlightMode() {
  const chips = document.querySelectorAll('.role-chip');
  const titleEl = document.getElementById('spotlight-role-title');
  const headlineEl = document.getElementById('spotlight-headline');
  const summaryEl = document.getElementById('spotlight-summary');
  const highlightsEl = document.getElementById('spotlight-highlights');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const roleKey = chip.getAttribute('data-role');
      const data = spotlightData[roleKey] || spotlightData.all;

      const card = document.getElementById('spotlight-card');
      card.style.opacity = '0.4';

      setTimeout(() => {
        titleEl.textContent = data.title;
        headlineEl.textContent = data.headline;
        summaryEl.textContent = data.summary;
        highlightsEl.innerHTML = data.highlights.map(h => `<div class="highlight-pill">${h}</div>`).join('');
        card.style.opacity = '1';
      }, 150);
    });
  });
}

/* --------------------------------------------------------------------------
   5. RESUME MODAL & THEME TOGGLE
   -------------------------------------------------------------------------- */
function initModals() {
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const resumeCloseBtn = document.getElementById('resume-close-btn');

  if (openResumeBtn) {
    openResumeBtn.addEventListener('click', () => {
      resumeModal.classList.add('active');
    });
  }

  if (resumeCloseBtn) {
    resumeCloseBtn.addEventListener('click', () => {
      resumeModal.classList.remove('active');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === resumeModal) resumeModal.classList.remove('active');
  });
}

function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const html = document.documentElement;

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    themeIcon.className = newTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  });
}

/* --------------------------------------------------------------------------
   6. CONTACT FORM & MOBILE NAV
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const messageInput = document.getElementById('message');
  const statusDiv = document.getElementById('form-status');
  const chipBtns = document.querySelectorAll('.btn-chip');

  chipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = btn.getAttribute('data-msg');
      if (messageInput) {
        messageInput.value = msg;
        messageInput.focus();
      }
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      statusDiv.innerHTML = "<span class='highlight-green'><i class='fa-solid fa-circle-check'></i> Message sent! Thank you for reaching out to Vinay.</span>";
      form.reset();
      setTimeout(() => statusDiv.innerHTML = '', 5000);
    });
  }
}

function initMobileNav() {
  const mobileBtn = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
}

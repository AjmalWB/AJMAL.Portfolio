/* ============================================================
   SERVICE PAGES — Shared JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- CUSTOM CURSOR ----
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  if (dot && ring) {
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });
    (function animRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animRing);
    })();
    document.querySelectorAll('a, button, .tool-pill, .tech-badge, .gd-portfolio-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('expand'));
      el.addEventListener('mouseleave', () => ring.classList.remove('expand'));
    });
  }

  // ---- NAVBAR SCROLL ----
  const nav = document.querySelector('.navbar-custom');
  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ---- SCROLL REVEAL ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));

  // ---- SKILL BARS ----
  const barIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => { entry.target.style.width = entry.target.dataset.width; }, 200);
        barIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.skill-bar-fill').forEach(b => barIO.observe(b));

  // ---- COUNTER ----
  const cntIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        let cur = 0;
        const step = target / 70;
        (function tick() {
          cur += step;
          if (cur < target) { el.textContent = prefix + Math.floor(cur) + suffix; requestAnimationFrame(tick); }
          else { el.textContent = prefix + target + suffix; }
        })();
        cntIO.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.count-num[data-target]').forEach(c => cntIO.observe(c));

  // ---- PAGE TRANSITION ----
  const overlay = document.querySelector('.page-transition');
  document.querySelectorAll('a[href]:not([href^="#"]):not([target="_blank"])').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('mailto') || href.startsWith('tel')) return;
      e.preventDefault();
      if (overlay) {
        overlay.classList.add('entering');
        setTimeout(() => { window.location.href = href; }, 480);
      } else { window.location.href = href; }
    });
  });
  if (overlay) {
    overlay.classList.add('leaving');
    setTimeout(() => overlay.classList.remove('entering', 'leaving'), 600);
  }

  // ---- ACTIVE NAV ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links .nav-item a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });

  // ---- MAGNETIC BUTTONS ----
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  // ---- FAQ TOGGLE ----
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => { q.closest('.faq-item').classList.toggle('open'); });
  });

  // ---- PARALLAX HERO VISUAL ----
  const heroVis = document.querySelector('.parallax-target');
  if (heroVis) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroVis.style.transform = `translateY(${y * 0.08}px)`;
    });
  }

  // ---- DM BAR CHART ANIMATE ----
  const bars = document.querySelectorAll('.dm-bar');
  if (bars.length) {
    const heights = ['40%','65%','50%','85%','70%','90%','60%','45%','75%'];
    bars.forEach((bar, i) => {
      bar.style.height = '0';
      setTimeout(() => {
        bar.style.transition = 'height 1.2s cubic-bezier(0.23,1,0.32,1)';
        bar.style.height = heights[i] || '50%';
      }, 400 + i * 80);
    });
  }

  // ---- GD COLOR SWATCH INTERACTION ----
  document.querySelectorAll('.gd-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      const preview = document.querySelector('.gd-font-preview');
      if (preview) preview.style.color = getComputedStyle(sw).backgroundColor;
    });
  });

  // ---- SPARKLINE DRAW ----
  document.querySelectorAll('.sparkline-path').forEach(path => {
    const len = path.getTotalLength?.() || 100;
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    const spIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          path.style.transition = 'stroke-dashoffset 1.5s ease';
          path.style.strokeDashoffset = '0';
          spIO.unobserve(path);
        }
      });
    }, { threshold: 0.5 });
    spIO.observe(path);
  });

});
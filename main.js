/* ============================================================
   AJMAL PORTFOLIO - Premium JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- CUSTOM CURSOR ----
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .filter-btn, .carousel-btn').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('expand'));
    el.addEventListener('mouseleave', () => ring.classList.remove('expand'));
  });

  // ---- NAVBAR SCROLL ----
  const navbar = document.querySelector('.navbar-custom');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // ---- SCROLL REVEAL ----
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Trigger skill bars if inside
        entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => observer.observe(el));

  // Also observe skill bars individually
  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    const barObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.width = entry.target.dataset.width;
          }, 200);
        }
      });
    }, { threshold: 0.5 });
    barObserver.observe(bar);
  });

  // ---- COUNTER ANIMATION ----
  const counters = document.querySelectorAll('.counter-num[data-target]');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const increment = target / 70;
        const update = () => {
          current += increment;
          if (current < target) {
            el.textContent = Math.floor(current) + suffix;
            requestAnimationFrame(update);
          } else {
            el.textContent = target + suffix;
          }
        };
        update();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // ---- WORK FILTER ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-cat]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.cat === filter) {
          card.style.display = '';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = ''; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ---- CAROUSEL ----
  const carousel = document.querySelector('.work-carousel-slide');
  if (carousel) {
    const items = carousel.querySelectorAll('.work-carousel-item');
    let current = 0;
    const total = items.length;

    const goTo = (idx) => {
      current = (idx + total) % total;
      carousel.style.transform = `translateX(-${current * 100}%)`;
      updateDots();
    };

    document.querySelector('.carousel-next')?.addEventListener('click', () => goTo(current + 1));
    document.querySelector('.carousel-prev')?.addEventListener('click', () => goTo(current - 1));

    // Auto slide
    setInterval(() => goTo(current + 1), 5000);

    // Dots
    const dotsWrap = document.querySelector('.carousel-dots');
    if (dotsWrap) {
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots() {
      document.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }
  }

  // ---- PAGE TRANSITION ----
  const overlay = document.querySelector('.page-transition');
  document.querySelectorAll('a[href]:not([href^="#"]):not([target="_blank"])').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('mailto') || href.startsWith('tel')) return;
      e.preventDefault();
      if (overlay) {
        overlay.classList.add('entering');
        setTimeout(() => {
          window.location.href = href;
        }, 500);
      } else {
        window.location.href = href;
      }
    });
  });

  if (overlay) {
    overlay.classList.add('leaving');
    setTimeout(() => overlay.classList.remove('entering', 'leaving'), 600);
  }

  // ---- ACTIVE NAV ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links .nav-item a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---- TYPING EFFECT (hero) ----
  const typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    const words = typingEl.dataset.words?.split(',') || [];
    let wi = 0, ci = 0, deleting = false;

    function type() {
      const word = words[wi];
      if (!deleting) {
        typingEl.textContent = word.slice(0, ++ci);
        if (ci === word.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
      } else {
        typingEl.textContent = word.slice(0, --ci);
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
        }
      }
      setTimeout(type, deleting ? 60 : 100);
    }
    type();
  }

  // ---- MAGNETIC BUTTON ----
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ---- TILT EFFECT on cards ----
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});





/* ============================================================
   AJMAL PORTFOLIO - Premium JavaScript  (filter fix applied)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- CUSTOM CURSOR ----
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .filter-btn, .carousel-btn').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('expand'));
    el.addEventListener('mouseleave', () => ring.classList.remove('expand'));
  });

  // ---- NAVBAR SCROLL ----
  const navbar = document.querySelector('.navbar-custom');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // ---- SCROLL REVEAL ----
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => observer.observe(el));

  // Also observe skill bars individually
  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    const barObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.width = entry.target.dataset.width;
          }, 200);
        }
      });
    }, { threshold: 0.5 });
    barObserver.observe(bar);
  });

  // ---- COUNTER ANIMATION ----
  const counters = document.querySelectorAll('.counter-num[data-target]');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const increment = target / 70;
        const update = () => {
          current += increment;
          if (current < target) {
            el.textContent = Math.floor(current) + suffix;
            requestAnimationFrame(update);
          } else {
            el.textContent = target + suffix;
          }
        };
        update();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // ================================================================
  //  WORK FILTER — FIXED
  //  Target .project-item wrappers (not .project-card[data-cat]).
  //  Toggle .hidden class so CSS Grid reflows cards from top-left.
  // ================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('#projects-grid .project-item[data-cat]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectItems.forEach(item => {
        const match = filter === 'all' || item.dataset.cat === filter;

        if (match) {
          // Show: remove hidden, trigger fade-in animation
          item.classList.remove('hidden');
          // remove then re-add to re-trigger animation
          item.classList.remove('fade-in');
          // force reflow so animation restarts
          void item.offsetWidth;
          item.classList.add('fade-in');
        } else {
          // Hide: add hidden (display:none removes from grid flow)
          item.classList.add('hidden');
          item.classList.remove('fade-in');
        }
      });
    });
  });

  // ---- CAROUSEL ----
  const carousel = document.querySelector('.work-carousel-slide');
  if (carousel) {
    const items = carousel.querySelectorAll('.work-carousel-item');
    let current = 0;
    const total = items.length;

    const goTo = (idx) => {
      current = (idx + total) % total;
      carousel.style.transform = `translateX(-${current * 100}%)`;
      updateDots();
    };

    document.querySelector('.carousel-next')?.addEventListener('click', () => goTo(current + 1));
    document.querySelector('.carousel-prev')?.addEventListener('click', () => goTo(current - 1));

    // Auto slide
    setInterval(() => goTo(current + 1), 5000);

    // Dots
    const dotsWrap = document.querySelector('.carousel-dots');
    if (dotsWrap) {
      for (let i = 0; i < total; i++) {
        const d = document.createElement('button');
        d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
      }
    }

    function updateDots() {
      document.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }
  }

  // ---- PAGE TRANSITION ----
  const overlay = document.querySelector('.page-transition');
  document.querySelectorAll('a[href]:not([href^="#"]):not([target="_blank"])').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('mailto') || href.startsWith('tel')) return;
      e.preventDefault();
      if (overlay) {
        overlay.classList.add('entering');
        setTimeout(() => {
          window.location.href = href;
        }, 500);
      } else {
        window.location.href = href;
      }
    });
  });

  if (overlay) {
    overlay.classList.add('leaving');
    setTimeout(() => overlay.classList.remove('entering', 'leaving'), 600);
  }

  // ---- ACTIVE NAV ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links .nav-item a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---- TYPING EFFECT (hero) ----
  const typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    const words = typingEl.dataset.words?.split(',') || [];
    let wi = 0, ci = 0, deleting = false;

    function type() {
      const word = words[wi];
      if (!deleting) {
        typingEl.textContent = word.slice(0, ++ci);
        if (ci === word.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
      } else {
        typingEl.textContent = word.slice(0, --ci);
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
        }
      }
      setTimeout(type, deleting ? 60 : 100);
    }
    type();
  }

  // ---- MAGNETIC BUTTON ----
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ---- TILT EFFECT on cards ----
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});



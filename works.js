/* ============================================================
   works.js — Project Gallery Filter + Modal
   UPDATE: "View Live Project" button href is set dynamically
           from each project's data-url attribute.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ================================================================
     CURSOR
  ================================================================ */
  const cursorRing = document.querySelector('.cursor-ring');
  const cursorDot  = document.querySelector('.cursor-dot');

  document.addEventListener('mousemove', e => {
    if (cursorDot) {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top  = e.clientY + 'px';
    }
  });

  document.querySelectorAll(
    '.pmodal-close, .pmodal-nav-btn, .pmodal-actions a, .pmodal-tag'
  ).forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing?.classList.add('expand'));
    el.addEventListener('mouseleave', () => cursorRing?.classList.remove('expand'));
  });


  /* ================================================================
     WORK FILTER
  ================================================================ */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('#projects-grid .project-item[data-cat]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      let delay = 0;

      projectItems.forEach(item => {
        const match = filter === 'all' || item.dataset.cat === filter;
        if (match) {
          item.classList.remove('hidden', 'fade-in');
          void item.offsetWidth;
          item.style.animationDelay = `${delay}s`;
          item.classList.add('fade-in');
          delay += 0.06;
        } else {
          item.classList.remove('fade-in');
          item.classList.add('hidden');
        }
      });

      if (backdrop?.classList.contains('open')) closeModal();
    });
  });


  /* ================================================================
     PROJECT MODAL
  ================================================================ */
  const backdrop   = document.getElementById('project-modal');
  const modalImg   = document.getElementById('pmodal-img');
  const modalTitle = document.getElementById('pmodal-title');
  const modalCat   = document.getElementById('pmodal-cat');
  const modalYear  = document.getElementById('pmodal-year');
  const modalDesc  = document.getElementById('pmodal-desc');
  const modalTags  = document.getElementById('pmodal-tags');
  const modalCount = document.getElementById('pmodal-nav-count');
  const closeBtn   = document.getElementById('pmodal-close');
  const prevBtn    = document.getElementById('pmodal-prev');
  const nextBtn    = document.getElementById('pmodal-next');
  const liveBtn    = document.getElementById('pmodal-live-btn'); // ← the "View Live Project" <a>
  const imgWrap    = backdrop?.querySelector('.pmodal-img-wrap');
  const infoPanel  = backdrop?.querySelector('.pmodal-info-panel');

  if (!backdrop) return;

  let visibleItems = [];
  let currentIndex = 0;

  function getVisibleItems() {
    return [...document.querySelectorAll('#projects-grid .project-item[data-cat]:not(.hidden)')];
  }

  function populateModal(item, animate = false) {
    const d = item.dataset;

    if (animate) {
      imgWrap.classList.add('transitioning');
      infoPanel.classList.add('transitioning');
      setTimeout(() => {
        imgWrap.classList.remove('transitioning');
        infoPanel.classList.remove('transitioning');
      }, 450);
    }

    modalImg.src           = d.img      || '';
    modalImg.alt           = d.title    || '';
    modalTitle.textContent = d.title    || '';
    modalCat.textContent   = d.catLabel || d.cat || '';
    modalYear.textContent  = d.year     || '';
    modalDesc.textContent  = d.desc     || '';

    // ── Dynamically set the unique URL for this project ──────────
    if (liveBtn) {
      liveBtn.href = d.url || '#';
    }
    // ─────────────────────────────────────────────────────────────

    modalTags.innerHTML = '';
    (d.tags || '').split(',').forEach(tag => {
      const span = document.createElement('span');
      span.className = 'pmodal-tag';
      span.textContent = tag.trim();
      modalTags.appendChild(span);
    });

    visibleItems = getVisibleItems();
    currentIndex = visibleItems.indexOf(item);
    modalCount.textContent = `${currentIndex + 1} / ${visibleItems.length}`;

    infoPanel.scrollTop = 0;
  }

  function openModal(item) {
    visibleItems = getVisibleItems();
    currentIndex = visibleItems.indexOf(item);
    populateModal(item, false);
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { modalImg.src = ''; }, 500);
  }

  function navigate(dir) {
    visibleItems = getVisibleItems();
    if (!visibleItems.length) return;
    currentIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
    populateModal(visibleItems[currentIndex], true);
  }

  /* ---- Event Listeners ---- */
  document.querySelectorAll('#projects-grid .project-item').forEach(item => {
    const card = item.querySelector('.project-card');
    if (card) card.addEventListener('click', () => openModal(item));
  });

  closeBtn.addEventListener('click', closeModal);

  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) closeModal();
  });

  prevBtn.addEventListener('click', () => navigate(-1));
  nextBtn.addEventListener('click', () => navigate(+1));

  document.addEventListener('keydown', e => {
    if (!backdrop.classList.contains('open')) return;
    if (e.key === 'Escape')     closeModal();
    if (e.key === 'ArrowRight') navigate(+1);
    if (e.key === 'ArrowLeft')  navigate(-1);
  });

  let touchStartX = 0;
  backdrop.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  backdrop.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) navigate(diff < 0 ? 1 : -1);
  }, { passive: true });

}); // end DOMContentLoaded
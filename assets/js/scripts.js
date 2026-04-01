/* ============================================================
   Roddie Walker Tours — scripts.js
   Versão final sem caracteres indesejados
   ============================================================ */

'use strict';

// ── Language detection ───────────────────────────────────
const getLang = () => {
  const path = window.location.pathname;
  if (path.includes('/en/')) return 'en';
  if (path.includes('/pt/')) return 'pt';
  return 'pt';
};

const LANG = getLang();
console.log('LANG:', LANG);

// ── Translations ─────────────────────────────────────────
const translations = {
  pt: {
    loading: 'A carregar percursos…',
    error: 'Erro ao carregar percursos. Recarregue a página.',
    duration: (h) => `${h}h`,
    maxGroup: 'Máx.',
    persons: 'pessoas',
    bookNow: 'Reservar',
    seeItinerary: 'Ver itinerário',
    close: '×',
    itinerary: 'Itinerário',
    perPerson: 'por pessoa',
    filters: { all: 'Todos', featured: 'Destaques', easy: 'Fácil', moderate: 'Moderado' },
    filterLabel: 'Filtrar:',
    langTags: { pt: 'PT / ', en: 'EN' },
    noResults: 'Nenhum percurso encontrado.',
    slideshowCaption: 'Lisboa · Portugal',
  },
  en: {
    loading: 'Loading tours…',
    error: 'Error loading tours. Please refresh.',
    duration: (h) => `${h}h`,
    maxGroup: 'Max.',
    persons: 'people',
    bookNow: 'Book',
    seeItinerary: 'View itinerary',
    close: '×',
    itinerary: 'Itinerary',
    perPerson: 'per person',
    filters: { all: 'All', featured: 'Featured', easy: 'Easy', moderate: 'Moderate' },
    filterLabel: 'Filter:',
    langTags: { pt: 'PT / ', en: 'EN' },
    noResults: 'No tours found.',
    slideshowCaption: 'Lisbon · Portugal',
  },
};

const t = translations[LANG];

// ── Fetch tours ──────────────────────────────────────────
async function loadTours() {
  try {
    const response = await fetch('../data/percursos.json');
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    console.log('Tours carregados:', data.tours.length);
    return data.tours;
  } catch (err) {
    console.error('Erro:', err);
    return null;
  }
}

// ── Helper para escapar HTML ─────────────────────────────
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ── Render tours ─────────────────────────────────────────
function renderTours(tours, container) {
  if (!tours || tours.length === 0) {
    container.innerHTML = '<p style="text-align:center;padding:48px;color:var(--stone);">' + t.error + '</p>';
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'tours-grid';

  tours.forEach(function(tour) {
    const local = tour[LANG];
    if (!local) return;

    const card = document.createElement('article');
    card.className = 'tour-card';
    card.setAttribute('data-difficulty', tour.difficulty);
    card.setAttribute('data-featured', tour.featured);

    let langTagsHtml = '';
    for (let i = 0; i < tour.languages.length; i++) {
      const l = tour.languages[i];
      langTagsHtml += '<span class="tour-card__lang-tag">' + (t.langTags[l] || l.toUpperCase()) + '</span>';
    }
    
    let featuredBadgeHtml = '';
    if (tour.featured) {
      featuredBadgeHtml = '<span class="tour-card__badge">Destaque</span>';
    }
    
    const priceHtml = '<div class="tour-price">€' + tour.price_eur + ' <small>' + t.perPerson + '</small></div>';

    card.innerHTML = 
      '<div class="tour-card__img-wrap">' +
        '<img class="tour-card__img" src="' + tour.image + '" alt="' + local.name + '" loading="lazy">' +
        featuredBadgeHtml +
      '</div>' +
      '<div class="tour-card__body">' +
        '<div class="tour-card__meta">' +
          '<span class="tour-card__meta-item">' + t.duration(tour.duration_hours) + '</span>' +
          '<span class="tour-card__meta-item">' + local.difficulty_label + '</span>' +
          '<span class="tour-card__meta-item">' + t.maxGroup + ' ' + tour.max_group + '</span>' +
        '</div>' +
        '<h3 class="tour-card__name">' + escapeHtml(local.name) + '</h3>' +
        '<p class="tour-card__tagline">' + escapeHtml(local.tagline) + '</p>' +
        '<p class="tour-card__desc">' + escapeHtml(local.description.substring(0, 100)) + (local.description.length > 100 ? '…' : '') + '</p>' +
        '<div class="tour-card__footer">' +
          '<div class="tour-card__langs">' + langTagsHtml + '</div>' +
          priceHtml +
          '<button class="btn btn--outline-dark view-itinerary" data-tour-id="' + tour.id + '">' + t.seeItinerary + '</button>' +
        '</div>' +
      '</div>';

    const btn = card.querySelector('.view-itinerary');
    if (btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openModal(tour);
      });
    }

    grid.appendChild(card);
  });

  container.innerHTML = '';
  container.appendChild(grid);
}

// ── Modal ────────────────────────────────────────────────
let currentModal = null;

function openModal(tour) {
  console.log('Opening modal for:', tour.id);
  
  if (currentModal) {
    closeModal();
  }
  
  const local = tour[LANG];
  if (!local) {
    console.error('No translation found for tour:', tour.id);
    return;
  }

  let itineraryHtml = '';
  for (let i = 0; i < local.itinerary.length; i++) {
    const item = local.itinerary[i];
    itineraryHtml += 
      '<div class="itinerary-item">' +
        '<div class="itinerary-item__num">' + item.order + '</div>' +
        '<div>' +
          '<div class="itinerary-item__stop">' + escapeHtml(item.stop) + '</div>' +
          '<div class="itinerary-item__note">' + escapeHtml(item.note) + '</div>' +
        '</div>' +
      '</div>';
  }

  const modal = document.createElement('div');
  modal.className = 'tour-detail open';
  modal.id = 'tour-modal';
  modal.innerHTML = 
    '<div class="tour-detail__panel">' +
      '<button class="tour-detail__close" aria-label="' + t.close + '">' + t.close + '</button>' +
      '<img class="tour-detail__img" src="' + tour.image + '" alt="' + local.name + '">' +
      '<div class="tour-detail__body">' +
        '<h2 class="tour-detail__name">' + escapeHtml(local.name) + '</h2>' +
        '<p class="tour-detail__tagline">' + escapeHtml(local.tagline) + '</p>' +
        '<div class="tour-detail__meta">' +
          '<span>⏱️ ' + t.duration(tour.duration_hours) + '</span>' +
          '<span>📍 ' + local.difficulty_label + '</span>' +
          '<span>👥 ' + t.maxGroup + ' ' + tour.max_group + ' ' + t.persons + '</span>' +
        '</div>' +
        '<p class="tour-detail__desc">' + escapeHtml(local.description) + '</p>' +
        '<h4 class="tour-detail__itinerary-title">' + t.itinerary + '</h4>' +
        '<div class="itinerary-list">' + itineraryHtml + '</div>' +
        '<div class="tour-detail__cta">' +
          '<div class="tour-detail__price">€' + tour.price_eur + ' <span>' + t.perPerson + '</span></div>' +
          '<a href="' + (LANG === 'en' ? '/en/contact.html' : '/pt/contact.html') + '" class="btn btn--primary">' + t.bookNow + '</a>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.body.appendChild(modal);
  currentModal = modal;
  document.body.style.overflow = 'hidden';

  const closeBtn = modal.querySelector('.tour-detail__close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  function escHandler(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  }
  document.addEventListener('keydown', escHandler);
}

function closeModal() {
  if (currentModal) {
    currentModal.remove();
    currentModal = null;
    document.body.style.overflow = '';
    console.log('Modal closed');
  }
}

// ── Filter ───────────────────────────────────────────────
function setupFilters(tours, container) {
  const filterBar = document.getElementById('filter-bar');
  if (!filterBar) return;

  const filters = [
    { key: 'all', label: t.filters.all },
    { key: 'featured', label: t.filters.featured },
    { key: 'easy', label: t.filters.easy },
    { key: 'moderate', label: t.filters.moderate },
  ];

  filterBar.innerHTML = '<span class="filter-bar__label">' + t.filterLabel + '</span>';

  for (let i = 0; i < filters.length; i++) {
    const f = filters[i];
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (f.key === 'all' ? ' active' : '');
    btn.textContent = f.label;
    btn.style.marginLeft = '8px';
    btn.style.marginRight = '4px';
    btn.onclick = (function(key) {
      return function() {
        const btns = filterBar.querySelectorAll('.filter-btn');
        for (let j = 0; j < btns.length; j++) {
          btns[j].classList.remove('active');
        }
        btn.classList.add('active');
        applyFilter(key, container);
      };
    })(f.key);
    filterBar.appendChild(btn);
  }
}

function applyFilter(key, container) {
  const cards = container.querySelectorAll('.tour-card');
  let visible = 0;
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    let show = false;
    if (key === 'all') show = true;
    else if (key === 'featured') show = card.getAttribute('data-featured') === 'true';
    else if (key === 'easy') show = card.getAttribute('data-difficulty') === 'easy';
    else if (key === 'moderate') show = card.getAttribute('data-difficulty') === 'moderate';
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  }

  const parent = container.parentElement;
  let noResults = parent.querySelector('.no-results');
  if (visible === 0) {
    if (!noResults) {
      noResults = document.createElement('p');
      noResults.className = 'no-results';
      noResults.textContent = t.noResults;
      noResults.style.cssText = 'text-align:center;padding:48px;color:var(--stone);font-family:var(--ff-ui)';
      parent.appendChild(noResults);
    }
  } else if (noResults) {
    noResults.remove();
  }
}

// ── Slideshow ────────────────────────────────────────────
function initSlideshow() {
  const container = document.getElementById('slideshow-container');
  if (!container) return;

  const images = [];
  for (let i = 1; i <= 10; i++) {
    images.push('../assets/photos/lisbon-' + i + '.jpg');
  }

  let current = 0;
  let interval;
  let loadedImages = [];

  const slidesWrapper = document.createElement('div');
  slidesWrapper.className = 'slideshow-container';
  slidesWrapper.style.position = 'relative';
  slidesWrapper.style.aspectRatio = '4/3';
  slidesWrapper.style.overflow = 'hidden';
  slidesWrapper.style.borderRadius = 'var(--radius-lg)';

  const dotsWrapper = document.createElement('div');
  dotsWrapper.className = 'slide-dots';
  dotsWrapper.style.position = 'absolute';
  dotsWrapper.style.bottom = '12px';
  dotsWrapper.style.left = '0';
  dotsWrapper.style.right = '0';
  dotsWrapper.style.display = 'flex';
  dotsWrapper.style.justifyContent = 'center';
  dotsWrapper.style.gap = '8px';
  dotsWrapper.style.zIndex = '10';

  function addImage(src, index) {
    const slide = document.createElement('div');
    slide.className = 'slide' + (index === 0 ? ' active' : '');
    slide.style.position = 'absolute';
    slide.style.top = '0';
    slide.style.left = '0';
    slide.style.width = '100%';
    slide.style.height = '100%';
    slide.style.opacity = index === 0 ? '1' : '0';
    slide.style.transition = 'opacity 1s ease';
    
    const img = document.createElement('img');
    img.src = src;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.alt = LANG === 'pt' ? 'Lisboa' : 'Lisbon';
    img.onerror = function() { slide.remove(); };
    
    const caption = document.createElement('div');
    caption.className = 'slide-caption';
    caption.textContent = t.slideshowCaption;
    caption.style.position = 'absolute';
    caption.style.bottom = '0';
    caption.style.left = '0';
    caption.style.right = '0';
    caption.style.background = 'linear-gradient(transparent, rgba(0,0,0,0.7))';
    caption.style.padding = '20px 12px 12px';
    caption.style.color = 'white';
    caption.style.fontFamily = 'var(--ff-ui)';
    caption.style.fontSize = '0.7rem';
    caption.style.textAlign = 'center';
    
    slide.appendChild(img);
    slide.appendChild(caption);
    slidesWrapper.appendChild(slide);
    loadedImages.push({ slide: slide, index: index });
    
    updateDots();
  }

  function updateDots() {
    dotsWrapper.innerHTML = '';
    for (let i = 0; i < loadedImages.length; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === current ? ' active' : '');
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.borderRadius = '50%';
      dot.style.background = i === current ? 'var(--terracotta)' : 'rgba(255,255,255,0.5)';
      dot.style.cursor = 'pointer';
      dot.onclick = (function(idx) {
        return function() {
          goToSlide(idx);
          resetInterval();
        };
      })(i);
      dotsWrapper.appendChild(dot);
    }
  }

  function goToSlide(index) {
    const slides = slidesWrapper.querySelectorAll('.slide');
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.opacity = i === index ? '1' : '0';
    }
    current = index;
    updateDots();
  }

  function nextSlide() {
    if (loadedImages.length === 0) return;
    const next = (current + 1) % loadedImages.length;
    goToSlide(next);
    if (loadedImages.length < images.length && next === loadedImages.length - 1) {
      const nextIndex = loadedImages.length;
      if (nextIndex < images.length) {
        const img = new Image();
        img.onload = function() {
          addImage(images[nextIndex], nextIndex);
        };
        img.src = images[nextIndex];
      }
    }
  }

  function resetInterval() {
    if (interval) clearInterval(interval);
    interval = setInterval(nextSlide, 4000);
  }

  const firstImg = new Image();
  firstImg.onload = function() {
    addImage(images[0], 0);
    resetInterval();
    for (let i = 1; i < images.length; i++) {
      const img = new Image();
      img.onload = (function(idx) {
        return function() {
          let found = false;
          for (let j = 0; j < loadedImages.length; j++) {
            if (loadedImages[j].index === idx) found = true;
          }
          if (!found) {
            addImage(images[idx], idx);
          }
        };
      })(i);
      img.src = images[i];
    }
  };
  firstImg.onerror = function() {
    slidesWrapper.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;background:var(--azulejo);color:white;border-radius:var(--radius-lg);font-family:var(--ff-ui);">' + (LANG === 'pt' ? 'Fotos de Lisboa' : 'Lisbon Photos') + '</div>';
  };
  firstImg.src = images[0];

  container.appendChild(slidesWrapper);
  container.appendChild(dotsWrapper);

  container.addEventListener('mouseenter', function() {
    if (interval) clearInterval(interval);
  });
  container.addEventListener('mouseleave', function() {
    if (interval) clearInterval(interval);
    resetInterval();
  });
}

// ── Menu mobile ──────────────────────────────────────────
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('nav-mobile');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function() {
      const isOpen = mobileMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      const spans = toggle.querySelectorAll('span');
      if (spans.length >= 3) {
        spans[1].style.opacity = isOpen ? '0' : '1';
        spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
        spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
      }
    });
  }
}

// ── Active nav link ──────────────────────────────────────
function initActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav__links a');
  for (let i = 0; i < links.length; i++) {
    const a = links[i];
    if (a.getAttribute('href') === current) {
      a.classList.add('active');
    }
  }
}

// ── Language links ───────────────────────────────────────
function initLangLinks() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  const langLinks = document.querySelectorAll('.nav__lang a');
  for (let i = 0; i < langLinks.length; i++) {
    const a = langLinks[i];
    const href = a.getAttribute('href');
    if (href) {
      if ((LANG === 'pt' && href.includes('/pt/')) || (LANG === 'en' && href.includes('/en/'))) {
        a.classList.add('active');
      }
      a.setAttribute('href', href.replace('index.html', current));
    }
  }
}

// ── Main ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async function() {
  console.log('DOM ready');
  initMobileMenu();
  initActiveNav();
  initLangLinks();
  initSlideshow();

  const toursContainer = document.getElementById('tours-container');
  if (toursContainer) {
    toursContainer.innerHTML = '<p style="text-align:center;padding:48px;color:var(--stone);">' + t.loading + '</p>';
    const tours = await loadTours();
    if (tours) {
      renderTours(tours, toursContainer);
      setupFilters(tours, toursContainer);
    } else {
      toursContainer.innerHTML = '<p style="text-align:center;padding:48px;color:var(--stone);">' + t.error + '</p>';
    }
  }
});

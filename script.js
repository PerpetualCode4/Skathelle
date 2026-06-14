// Hamburger-meny
const hamburger = document.getElementById('hamburger');
const nav       = document.getElementById('nav');

if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll-reveal via IntersectionObserver
const reveals  = document.querySelectorAll('[data-reveal]');
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

reveals.forEach(el => observer.observe(el));

// Lightbox for avisklipp
const clippingTrigger = document.getElementById('clippingTrigger');
const lightbox        = document.getElementById('lightbox');
const lightboxClose   = document.getElementById('lightboxClose');

if (clippingTrigger && lightbox && lightboxClose) {
  const openLightbox = () => {
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
  };

  clippingTrigger.addEventListener('click', openLightbox);
  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}

/* TIDSLINJE */
const timelineTrack = document.getElementById('timelineTrack');

if (timelineTrack) {
  const events = [
    {
      year: 1978,
      img: 'Bilder/Skjermbilde 2026-06-11 202021.png',
      imgAlt: 'Avisklipp frå Sogn og Fjordane 1978',
      heading: 'To kroner i lomma og hella på ryggen',
      body: 'Sogn og Fjordane dekka skathellekasting i Jostedalen. Bana var 23 meter lang, inngangspengane to kroner. Tre kastarar per lag. Sporten trakk folk frå heile bygda.',
      source: 'Sogn og Fjordane, 19. juli 1978',
      url: 'https://www.nb.no/items/dd0d7278510d740033b193493e648965?page=6'
    },
    {
      year: 1979,
      img: null,
      imgAlt: null,
      heading: 'Riksdekkande merksemd',
      body: 'VG, Bergens Tidende og Fjordingen (Nordfjord) skreiv alle om skathellekasting i Jostedalen same sommar. Sporten fekk nasjonal merksemd for første gong.',
      source: 'VG 9. aug 1979 · Bergens Tidende 28. aug 1979 · Fjordingen 10. aug 1979',
      url: null
    },
    {
      year: 1984,
      img: null,
      imgAlt: null,
      heading: 'Stor marknadshelg i Dolaheimen',
      body: 'Sogn og Fjordane dekka den årlege marknaden i Jostedalen, der skathellekasting var ein sentral del av programmet saman med mylse.',
      source: 'Sogn og Fjordane, 6. juli 1984',
      url: null
    },
    {
      year: 1985,
      img: null,
      imgAlt: null,
      heading: 'Marknadshelg i Dalaheimen',
      body: 'Sogningen-Sogns Avis rapporterte frå marknaden. Skathellekasting og mylse omtalt som grunnmuren i den tradisjonelle marknaden.',
      source: 'Sogningen-Sogns Avis, 11. juli 1985',
      url: null
    },
    {
      year: 1987,
      img: null,
      imgAlt: null,
      heading: 'Dokumentert i Sogningen',
      body: 'Sogningen-Sogns Avis dekka skathellekasting ved Jostedalsmarknaden nok ein gong.',
      source: 'Sogningen-Sogns Avis, 21. juli 1987',
      url: null
    },
    {
      year: 1994,
      img: null,
      imgAlt: null,
      heading: 'Sogn Avis på bana',
      body: 'Sogn Avis skreiv om skathellekasting i Jostedalen.',
      source: 'Sogn Avis, 19. juli 1994',
      url: null
    },
    {
      year: 1997,
      img: null,
      imgAlt: null,
      heading: 'Tradisjonen lever',
      body: 'Nok eit år, nok eit avisoppslag. Skathellekasting held stand i Jostedalen.',
      source: 'Sogn Avis, 17. juli 1997',
      url: null
    },
    {
      year: 2007,
      img: null,
      imgAlt: null,
      heading: 'Bloggdokumentasjon startar',
      body: 'Dei første bloggpostane frå turneringa blir publiserte på bakken.wordpress.com. Resultat og stemning frå mesterskapet vert dokumentert digitalt for første gong.',
      source: 'bakken.wordpress.com, 2007',
      url: null
    },
    {
      year: 2023,
      img: 'Bilder/Magne_Hesjevoll_2023.jpg',
      imgAlt: 'Magne Hesjevoll ved Dølaheimen i Jostedalen, 2023',
      heading: 'Magne Hesjevoll — mannen bak tradisjonen',
      body: 'Magne Hesjevoll har i ei årrekkje vore trenar og ankerperson for skathellekasting i Jostedalen. Det var han som introduserte Brage Norberg og Lars Andreas Myklebust Neset for sporten. Intervju med Magne kjem.',
      source: 'Foto: Jostedalen, 2023',
      url: null
    }
  ];

  const timelineDots          = document.getElementById('timelineDots');
  const timelineLightbox      = document.getElementById('timelineLightbox');
  const timelineLightboxImg   = document.getElementById('timelineLightboxImg');
  const timelineLightboxClose = document.getElementById('timelineLightboxClose');

  const openTimelineLightbox = (src, alt) => {
    if (!timelineLightbox || !timelineLightboxImg) return;
    timelineLightboxImg.src = src;
    timelineLightboxImg.alt = alt || '';
    timelineLightbox.classList.add('is-open');
    timelineLightbox.setAttribute('aria-hidden', 'false');
  };

  const closeTimelineLightbox = () => {
    if (!timelineLightbox) return;
    timelineLightbox.classList.remove('is-open');
    timelineLightbox.setAttribute('aria-hidden', 'true');
  };

  if (timelineLightbox && timelineLightboxClose) {
    timelineLightboxClose.addEventListener('click', closeTimelineLightbox);

    timelineLightbox.addEventListener('click', e => {
      if (e.target === timelineLightbox) closeTimelineLightbox();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && timelineLightbox.classList.contains('is-open')) {
        closeTimelineLightbox();
      }
    });
  }

  events.forEach((event, i) => {
    const card = document.createElement('div');
    card.className = 'timeline-card';
    card.setAttribute('data-reveal', '');
    if (i > 0) card.setAttribute('data-delay', String(Math.min(i, 5)));

    const imgBlock = event.img
      ? `<div class="timeline-img-wrap timeline-img-wrap--clickable">
          <img src="${event.img}" alt="${event.imgAlt || ''}" loading="lazy">
        </div>`
      : `<div class="timeline-img-placeholder"><span>Bilete kjem</span></div>`;

    const linkBlock = event.url
      ? `<a href="${event.url}" class="timeline-link" target="_blank" rel="noopener noreferrer">Les kjelda på nb.no &#8594;</a>`
      : '';

    card.innerHTML = `
      ${imgBlock}
      <div class="timeline-year">${event.year}</div>
      <h3 class="timeline-heading">${event.heading}</h3>
      <p class="timeline-body">${event.body}</p>
      <p class="timeline-source">${event.source}</p>
      ${linkBlock}
    `;

    if (event.img) {
      card.querySelector('.timeline-img-wrap').addEventListener('click', () => {
        openTimelineLightbox(event.img, event.imgAlt);
      });
    }

    timelineTrack.appendChild(card);
  });

  const timelineCards = timelineTrack.querySelectorAll('.timeline-card');

  // Indikatorprikkar
  if (timelineDots) {
    events.forEach((event, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'timeline-dot';
      dot.setAttribute('aria-label', `Gå til ${event.year}`);
      dot.addEventListener('click', () => {
        timelineCards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      timelineDots.appendChild(dot);
    });
  }

  const timelineDotEls = timelineDots ? timelineDots.querySelectorAll('.timeline-dot') : [];

  const timelineObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          timelineObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  timelineCards.forEach(card => timelineObserver.observe(card));

  // Marker kortet og prikken nærmast midten som aktive
  const setActiveTimelineCard = () => {
    const trackRect   = timelineTrack.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;
    let closestIndex = 0;
    let closestDist  = Infinity;

    timelineCards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const dist = Math.abs(cardCenter - trackCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });

    timelineCards.forEach((card, i) => card.classList.toggle('is-active', i === closestIndex));
    timelineDotEls.forEach((dot, i) => dot.classList.toggle('is-active', i === closestIndex));
  };

  timelineTrack.addEventListener('scroll', setActiveTimelineCard, { passive: true });
  setActiveTimelineCard();

  // Skroll-steg = kortbredde + gap
  const timelineStep = () => {
    const card = timelineTrack.querySelector('.timeline-card');
    return card ? card.getBoundingClientRect().width + 24 : 300;
  };

  // Piltastar
  timelineTrack.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      timelineTrack.scrollBy({ left: timelineStep(), behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      timelineTrack.scrollBy({ left: -timelineStep(), behavior: 'smooth' });
    }
  });

  // Pilknappar
  const timelinePrev = document.querySelector('.timeline-arrow--prev');
  const timelineNext = document.querySelector('.timeline-arrow--next');

  if (timelinePrev) {
    timelinePrev.addEventListener('click', () => {
      timelineTrack.scrollBy({ left: -timelineStep(), behavior: 'smooth' });
    });
  }

  if (timelineNext) {
    timelineNext.addEventListener('click', () => {
      timelineTrack.scrollBy({ left: timelineStep(), behavior: 'smooth' });
    });
  }

  // Drag/swipe
  let isDragging      = false;
  let dragStartX      = 0;
  let dragScrollStart = 0;

  timelineTrack.addEventListener('pointerdown', e => {
    isDragging = true;
    dragStartX = e.clientX;
    dragScrollStart = timelineTrack.scrollLeft;
    timelineTrack.classList.add('is-dragging');
  });

  timelineTrack.addEventListener('pointermove', e => {
    if (!isDragging) return;
    timelineTrack.scrollLeft = dragScrollStart - (e.clientX - dragStartX);
  });

  ['pointerup', 'pointerleave', 'pointercancel'].forEach(type => {
    timelineTrack.addEventListener(type, () => {
      isDragging = false;
      timelineTrack.classList.remove('is-dragging');
    });
  });
}

// Countdown til Skathellemesterskapet
// ENDRE DATOEN HER når du veit eksakt dato for 2026:
const TARGET = new Date('2026-07-18T12:00:00');

function updateCountdown() {
  const now = new Date();
  const diff = TARGET - now;
  if (diff <= 0) {
    document.getElementById('countdown-label').textContent = 'Mesterskapet er i dag!';
    ['cd-days','cd-hours','cd-min','cd-sec'].forEach(id => document.getElementById(id).textContent = '0');
    return;
  }
  const days  = Math.floor(diff / 864e5);
  const hours = Math.floor((diff % 864e5) / 36e5);
  const min   = Math.floor((diff % 36e5) / 6e4);
  const sec   = Math.floor((diff % 6e4) / 1e3);
  document.getElementById('cd-days').textContent  = String(days).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('cd-min').textContent   = String(min).padStart(2,'0');
  document.getElementById('cd-sec').textContent   = String(sec).padStart(2,'0');
}

if (document.getElementById('countdown')) {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* MAGNE FLOAT */
const magneImg = document.getElementById('magne-float');
if (magneImg) {
  const magneObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          magneObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  magneObserver.observe(magneImg);
}

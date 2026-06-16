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

const events = [
  { year: 1978, label: 'Avisklipp', heading: 'To kroner i lomma og hella på ryggen', body: 'Sogn og Fjordane dekka skathellekasting i Jostedalen. Bana var 23 meter lang, inngangspengane to kroner. Tre kastarar per lag. Sporten trakk folk frå heile bygda til Dølaheimen.', imgs: ['Bilder/Skjermbilde 2026-06-11 202021.png'], source: 'Sogn og Fjordane, 19. juli 1978', url: 'https://www.nb.no/items/dd0d7278510d740033b193493e648965?page=6' },
  { year: 1979, label: 'Riksdekkande', heading: 'Heile landet fekk augo opp', body: 'VG, Bergens Tidende og Fjordingen skreiv alle om skathellekasting i Jostedalen same sommar. Sporten fekk nasjonal merksemd for første gong.', imgs: [], source: 'VG 9. aug · Bergens Tidende 28. aug · Fjordingen 10. aug 1979', url: null },
  { year: 1984, label: 'Marknad', heading: 'Stor marknadshelg i Dølaheimen', body: 'Skathellekasting og mylse var grunnmuren i den årlege marknaden ved Dølaheimen. Sogn og Fjordane dekka arrangementet.', imgs: [], source: 'Sogn og Fjordane, 6. juli 1984', url: null },
  { year: 1985, label: 'Marknad', heading: 'Marknadshelg i Dølaheimen', body: 'Sogningen-Sogns Avis rapporterte frå marknaden. Skathellekasting og mylse omtalt som den tradisjonelle grunnmuren i marknaden.', imgs: [], source: 'Sogningen-Sogns Avis, 11. juli 1985', url: null },
  { year: 1987, label: 'Avisklipp', heading: 'Dokumentert i Sogningen', body: 'Sogningen-Sogns Avis dekka skathellekasting ved Jostedalsmarknaden nok ein gong.', imgs: [], source: 'Sogningen-Sogns Avis, 21. juli 1987', url: null },
  { year: 1994, label: 'Avisklipp', heading: 'Sogn Avis på bana', body: 'Sogn Avis skreiv om skathellekasting i Jostedalen.', imgs: [], source: 'Sogn Avis, 19. juli 1994', url: null },
  { year: 1997, label: 'Avisklipp', heading: 'Tradisjonen lever', body: 'Nok eit år, nok eit avisoppslag. Skathellekasting held stand i Jostedalen.', imgs: [], source: 'Sogn Avis, 17. juli 1997', url: null },
  { year: 2007, label: 'Digital', heading: 'Første digitale dokumentasjon', body: 'Dei første bloggpostane frå turneringa blir publiserte på bakken.wordpress.com. Resultat og stemning frå mesterskapet vert dokumentert digitalt for første gong.', imgs: [], source: 'bakken.wordpress.com, 2007', url: null },
  { year: 2014, label: 'Meisterskap', heading: 'Meisterskapet 2014', body: 'Kastinga går føre seg ved Dølaheimen ein typisk sommardag. Vinnarlag og andreplasslag tek imot premiane — blå t-skjorter til vinnarane, trofé til dei andre. Stort frammøte av publikum.', imgs: ['Bilder/2014_bilde.jpg','Bilder/2014.jpg','Bilder/2014_Dei3TilVenstreErVinnarar_Dei3TilHøgreEr2plass.jpg'], source: 'Foto: Olav Grov, 2014', url: null },
  { year: 2015, label: 'Meisterskap', heading: 'Meisterskapet 2015', body: 'Action frå bana med Jostedalfjella som bakteppe. Vinnarane tek imot krus med Jostedalen-motiv som premie.', imgs: ['Bilder/2015kast.jpg','Bilder/Vinnarar2015.jpg'], source: 'Foto: Olav Grov, 2015', url: null },
  { year: 2018, label: 'Meisterskap', heading: 'Meisterskapet 2018', body: 'Tre vinnarar held skathellene sine mot kamera. Tribunen bak er full av tilskodarar — skathellekasting samlar framleis folk i Jostedalen.', imgs: ['Bilder/2018Vinnarar.jpg'], source: 'Foto: Olav Grov, 2018', url: null },
  { year: 2019, label: 'Meisterskap', heading: 'Meisterskapet 2019', body: 'Vinnarane fotografert med skathellene sine. Stort publikum i bakgrunnen vitnar om at tradisjonen framleis engasjerer.', imgs: ['Bilder/2019Vinnarar.jpg'], source: 'Foto: Olav Grov', url: null },
  { year: 2023, label: 'Portrett', heading: 'Magne Hesjevoll — mannen bak tradisjonen', body: 'Magne Hesjevoll har i ei årrekkje vore trenar og ankerperson for skathellekasting i Jostedalen. Det var han som introduserte Brage Norberg og Lars Andreas Myklebust Neset for sporten. Intervju med Magne kjem.', imgs: ['Bilder/Magne_Hesjevoll_2023.jpg'], source: 'Foto: Jostedalen, 2023', url: null },
  { year: 2024, label: 'Meisterskap', heading: 'Meisterskapet 2024', body: 'Ung kastar i full aksjon ved Dølaheimen. Vinnarane mottek krus som premie. Anlegget er oppgradert med nytt mål.', imgs: ['Bilder/2024_kast.jpg','Bilder/2024_vinnarar.jpg'], source: 'Foto: Olav Grov, 2024', url: null },
  { year: 2025, label: 'Meisterskap', heading: 'Meisterskapet 2025', body: 'To kastesituasjonar med fullt publikum på benkane. Det nye målet er godt synleg. Tradisjonen lever vidare ved Dølaheimen.', imgs: ['Bilder/2025.jpg','Bilder/2025ja.jpg'], source: 'Foto: Olav Grov, 2025', url: null }
];

(function () {
  const rail    = document.getElementById('tlTrack');
  const content = document.getElementById('tlContent');
  const dotsEl  = document.getElementById('tlDots');
  const btnL    = document.getElementById('tlLeft');
  const btnR    = document.getElementById('tlRight');
  if (!rail || !content) return;

  let current = 0;

  // Bygg årstal-rail og prikkar
  events.forEach((ev, i) => {
    if (i > 0) {
      const line = document.createElement('div');
      line.className = 'tl-line';
      rail.appendChild(line);
    }
    const btn = document.createElement('button');
    btn.className = 'tl-year-btn' + (i === 0 ? ' is-active' : '');
    btn.innerHTML = `<span class="tl-year-num">${ev.year}</span>`;
    btn.addEventListener('click', () => { if (!isDragging) setActive(i); });
    rail.appendChild(btn);

    const dot = document.createElement('button');
    dot.className = 'tl-dot' + (i === 0 ? ' is-active' : '');
    dot.addEventListener('click', () => setActive(i));
    dotsEl.appendChild(dot);
  });

  function setActive(i) {
    current = i;
    const ev = events[i];

    rail.querySelectorAll('.tl-year-btn').forEach((b, j) => b.classList.toggle('is-active', j === i));
    dotsEl.querySelectorAll('.tl-dot').forEach((d, j) => d.classList.toggle('is-active', j === i));

    // Sentrér aktivt årstal
    const activeBtn = rail.querySelectorAll('.tl-year-btn')[i];
    const wrap = rail.parentElement;
    const target = activeBtn.offsetLeft - wrap.clientWidth / 2 + activeBtn.offsetWidth / 2;
    rail.style.transform = `translateX(${-Math.max(0, target)}px)`;

    // Bygg innhald
    content.classList.remove('is-visible');
    setTimeout(() => {
      const imgHTML = ev.imgs.length
        ? `<div class="tl-imgs">${ev.imgs.map(src =>
            `<button class="tl-img-btn" onclick="openTlLightbox('${src}','${ev.heading.replace(/'/g,"\\'")}')">
               <img src="${src}" alt="${ev.heading}" loading="lazy">
             </button>`).join('')}</div>`
        : `<div class="tl-no-img"><p>Bilete kjem</p></div>`;

      const linkHTML = ev.url
        ? `<a href="${ev.url}" class="tl-content-link" target="_blank" rel="noopener noreferrer">Les kjelda på nb.no &#8594;</a>`
        : '';

      content.innerHTML = `
        <div class="tl-content-inner">
          <div>
            <div class="tl-content-year">${ev.year}</div>
            <p class="tl-content-label">${ev.label}</p>
            <h3 class="tl-content-heading">${ev.heading}</h3>
            <p class="tl-content-body">${ev.body}</p>
            <p class="tl-content-source">${ev.source}</p>
            ${linkHTML}
          </div>
          <div>${imgHTML}</div>
        </div>`;
      content.classList.add('is-visible');
    }, 180);
  }

  // Piltastar
  if (btnL) btnL.addEventListener('click', () => { if (current > 0) setActive(current - 1); });
  if (btnR) btnR.addEventListener('click', () => { if (current < events.length - 1) setActive(current + 1); });

  // Tastatur
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && current > 0) setActive(current - 1);
    if (e.key === 'ArrowRight' && current < events.length - 1) setActive(current + 1);
  });

  // DRAG — held inne og dreg heile tl-outer-området
  const outer = document.querySelector('.tl-outer');
  let isDragging = false;
  let dragStartX = 0;
  let dragDist   = 0;

  outer.addEventListener('mousedown', e => {
    isDragging = true;
    dragStartX = e.clientX;
    dragDist   = 0;
    outer.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    dragDist = e.clientX - dragStartX;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    outer.style.cursor = 'grab';
    if (dragDist < -60 && current < events.length - 1) setActive(current + 1);
    if (dragDist >  60 && current > 0)                  setActive(current - 1);
    dragDist = 0;
  });

  // TOUCH — mobil
  outer.addEventListener('touchstart', e => {
    dragStartX = e.touches[0].clientX;
    dragDist   = 0;
  }, { passive: true });

  outer.addEventListener('touchmove', e => {
    dragDist = e.touches[0].clientX - dragStartX;
  }, { passive: true });

  outer.addEventListener('touchend', () => {
    if (dragDist < -60 && current < events.length - 1) setActive(current + 1);
    if (dragDist >  60 && current > 0)                  setActive(current - 1);
    dragDist = 0;
  });

  // Lightbox
  window.openTlLightbox = function(src, alt) {
    const lb  = document.getElementById('timelineLightbox');
    const img = document.getElementById('timelineLightboxImg');
    if (lb && img) {
      img.src = src; img.alt = alt;
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
    }
  };

  const lbClose = document.getElementById('timelineLightboxClose');
  const lb      = document.getElementById('timelineLightbox');
  if (lbClose && lb) {
    lbClose.addEventListener('click', () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden','true'); });
    lb.addEventListener('click', e => { if (e.target === lb) { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden','true'); }});
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden','true'); }});
  }

  setActive(0);
})();

/* MAGNE FLOAT */
const magneImg = document.getElementById('magne-float');
if (magneImg) {
  const mo = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); mo.unobserve(e.target); }});
  }, { threshold: 0.15 });
  mo.observe(magneImg);
}

/* COUNTDOWN */
const TARGET = new Date('2026-07-18T12:00:00');
function updateCountdown() {
  const diff = TARGET - new Date();
  if (diff <= 0) {
    const lbl = document.getElementById('countdown-label');
    if (lbl) lbl.textContent = 'Mesterskapet er i dag!';
    ['cd-days','cd-hours','cd-min','cd-sec'].forEach(id => { const el = document.getElementById(id); if(el) el.textContent = '0'; });
    return;
  }
  const pad = n => String(Math.floor(n)).padStart(2,'0');
  const g = id => document.getElementById(id);
  if(g('cd-days'))  g('cd-days').textContent  = pad(diff/864e5);
  if(g('cd-hours')) g('cd-hours').textContent = pad((diff%864e5)/36e5);
  if(g('cd-min'))   g('cd-min').textContent   = pad((diff%36e5)/6e4);
  if(g('cd-sec'))   g('cd-sec').textContent   = pad((diff%6e4)/1e3);
}
updateCountdown();
setInterval(updateCountdown, 1000);

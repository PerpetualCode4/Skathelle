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
  {
    year: '~1900',
    label: 'Sportens opphav',
    heading: 'Ein sport blir til',
    body: 'Skathellekasting i Jostedalen har sine røter tilbake til byrjinga av 1900-talet, ifølgje skriftlege kjelder frå tida. Sporten oppstod som ein lokal leik blant ungdom i bygda. Eldre jostedøler fortel at dei dreiv med skathellekasting når dei var "vorten litt eldre, rundt konfirmasjonsalderen". Sporten gjekk i arv frå generasjon til generasjon, og forma seg etter kvart til ein eigen tradisjon med faste reglar.',
    imgs: [],
    source: 'Munnleg tradisjon, dokumentert i lokalaviser frå 1996 og 1999',
    url: null
  },
  {
    year: 1957,
    label: 'Eldste skriftlege kjelde',
    heading: 'Nytt liv i gamal sport',
    body: 'Den fyrste skriftlege kjelda om skathellekasting er frå 1957. Artikkelen "Nytt liv i gamal sport i Jostedalen" omtalar ein skathellekamp der Anders Nigard vart kåra som meister. Det viktigaste er at sporten allereie i 1957 vart omtalt som "gamal" — eit tydeleg teikn på at tradisjonen strekker seg langt tilbake i tid. Dette gjev oss det fyrste konkrete punktet i den dokumenterte historia.',
    imgs: ['Bilder/1957_nytt_liv_i_gammal_sport_i_Jostedalen.png'],
    source: 'Lokalavis, 1957',
    url: 'https://www.nb.no/items/6971033cb52499f7bb079555b3ffcd94?search='
  },
  {
    year: 1958,
    label: 'Jostedalsmeisterskap',
    heading: 'Melkior Fossen vart skathellemeister',
    body: 'Fram Ungdomslag i Jostedalen arrangerte skathelletevling 29. juni 1958 med 36 deltakarar fordelt på 12 lag. Lag frå Hafslo deltok òg. Melkior Fossen vart kåra som vinnar — og dette vart rekna som Jostedalsmeisterskapet. Artikkelen melder at skathellekasting har vorte svært populært i bygda, eit teikn på at sporten var i full blomstring midt på 1950-talet. Same år vart skathellekasting eit av hovudprogrammene på årsmøtet til Jostedal historielag.',
    imgs: [
      'Bilder/1958_melkior_fossen_var_skathellemestar.png',
      'Bilder/1958_arsmote_i_historielaget.png'
    ],
    source: 'Lokalavis, 1958',
    url: 'https://www.nb.no/items/263888736d3deb7a24c7b4ce3e3114cd?page=1&search='
  },
  {
    year: 1972,
    label: 'Urgamal nasjonalsport',
    heading: 'Sporten blir kalla urgamal',
    body: 'Långendalsposten omteler skathellekasting som ein "urgamal nasjonalsport" i Jostedalen — i ein artikkel som beskriv Jostedalen som "den einaste Sognebygda kor det ikkje snakkast sognemål", med si eiga historie og kultur. Dette er den fyrste skriftlege kjelda som tydeleg slår fast at sporten er svært gamal. Når sporten blir kalla urgamal allereie i 1972, vert det vanskeleg å sjå tilbake utan å innsjå at me snakkar om ein tradisjon med djupe historiske røter.',
    imgs: ['Bilder/1972_langendalsposten.png'],
    source: 'Långendalsposten, 1972',
    url: 'https://www.nb.no/items/29dd0d369e44678c059226a8763d6618?page=3&search='
  },
  {
    year: 1978,
    label: 'Folkesport',
    heading: 'Populær folkesport i Jostedal',
    body: 'Sogn og Fjordane publiserer ein stor reportasje om skathellekasting under tittelen "Populær folkesport i Jostedal". Reglane vert dokumentert: ei om lag 23 meter lang bane, tre kastarar per lag, målet er ein stein i andre enden. Berre i Jostedalen vert sporten driven aktivt. Formannen i Jostedal ungdomslag, Norvald Bakken, etterlyser samtidig eit ordentleg meisterskap — det er berre i Jostedalen sporten lever, og det trengst grendacupar og finalar for å oppretthalde tradisjonen.',
    imgs: [
      'Bilder/1978_skathelle_foleksport.png',
      'Bilder/1978_me_ma_satse_pa_skathellemeisterskap.png'
    ],
    source: 'Sogn og Fjordane, 1978',
    url: 'https://www.nb.no/items/c771606e4d5834568bf4c319395343e0?page=3&search='
  },
  {
    year: 1979,
    label: 'Fylkesmeisterskap',
    heading: 'For første gong: Fylkesmeisterskap',
    body: 'Det fyrste fylkesmeisterskapet i skathellekasting vert halde 24.-26. august 1979 i samband med Husmannsdagane i Gaupne. Jostedal ungdomslag arrangerer saman med avisa Sogn og Fjordane. Banelengda vert sett til 20-23 meter. Stortingsmann Kåre Øvregard, sjølv frå Jostedalen, er kommentator. 7000 menneske var innom Husmannsdagane. Vinnarlaget vart erfarne jostedøler: Erik Fossen, Torleiv Vigdal og Per Bakken. VG, Bergens Tidende og Fjordingen skreiv alle om sporten same sommar — nasjonal merksemd for første gong.',
    imgs: [
      'Bilder/1979_For_forste_gong_fylkesmesterskap_i_gaupne.png',
      'Bilder/1979_rutinerte_jostedoler.png',
      'Bilder/1979_Husmannsdagar_borkabrod_og_skathellekasting.png',
      'Bilder/1979_Firda_reglar_for_skathelle.png'
    ],
    source: 'Sogn og Fjordane, august 1979',
    url: 'https://www.nb.no/items/af3f6a7b2ccf15d72759a4a25bf78104?page=7&search='
  },
  {
    year: 1985,
    label: 'Dølaheimen — mekka',
    heading: 'Skathellekastinga sitt mekka',
    body: '"Fotballen har sitt mekka på Wembley. Skathellekastinga har sitt ved Dølaheimen." Slik startar den store reportasjen i Sogn og Fjordane sommaren 1985. Artikkelen dokumenterer korleis Dølaheimen er blitt det heilage sentrumet for sporten — det einaste staden i landet der ein driv aktivt med skathellekasting. Folk frå fjern og nær møter opp under marknadshelga for å sjå konkurransen. Sogningen-Sogns Avis rapporterte same år frå marknadshelga og omtalte skathellekasting og mylse som "den tradisjonelle grunnmuren" i marknaden.',
    imgs: [
      'Bilder/1985_Dolaheimen_skathellekastinga_sitt_mekka.png',
      'Bilder/1985_Programmet_for_marknadshelgi.png'
    ],
    source: 'Sogn og Fjordane / Sogningen-Sogns Avis, 1985',
    url: 'https://www.nb.no/items/2daf44de52ecd85fcbc60728abf880e6?page=9&search='
  },
  {
    year: 1987,
    label: 'Nasjonalsport',
    heading: 'Skathellekasting er topp',
    body: 'Stor reportasje i Sogn og Fjordane med tittel "Skathellekasting er topp". "Sei skathellekasting, og jostedølene vert andektige i blikket," startar artikkelen. Sporten vert omtalt som nasjonalsport i Jostedalen — ein sport som går på tvers av generasjonsskilje. Folk i alle aldrar sit på sidelina med sakkunnige kommentarar. Artikkelen konkluderer: "Skathellekasting må vera ein ypperleg form for sosial omgang."',
    imgs: ['Bilder/1987_skathellekasting_er_topp.png'],
    source: 'Sogn og Fjordane, 1987',
    url: 'https://www.nb.no/items/c39c97ed2ee7668e2f635aa9ce260e6c?page=1&search='
  },
  {
    year: 1988,
    label: 'Tradisjon',
    heading: 'Populært med skathellekasting',
    body: 'Reportasje frå Brehelgi 88. Jarle Ruud viser den rette kastiteknikken. "Skathellekasting er ein gamal tradisjon i Jostedalen, og for å verta ein god kastar må ein øve og atter øve," seier Berget. Same år kom Rune Rudberg til marknaden — eit av dei store åra for Jostedalsmarknaden. Sporten samlar både erfarne kastarar og nysgjerrige publikum.',
    imgs: ['Bilder/1988_populaert_med_skathellekasting.png'],
    source: 'Sogningen-Sogns Avis, 1988',
    url: 'https://www.nb.no/items/408e4b7256ff0d66dbf47afc8583b7a1?page=3&search='
  },
  {
    year: 1994,
    label: 'Åleine om sporten',
    heading: 'Berre Jostedalen att',
    body: 'Stor reportasje i Sogn Avis med tittelen "Åleine om skathellekasting". Sporten har vorte heilt unik for Jostedalen — ingen andre stader i Noreg driv med skathellekasting lenger. Edvin Flati uttaler seg som rutinert kastar, og Magnus Nigard (81 år) deler erfaringa si: "Hella må vera flat under, og ikkje for tjukk." Sporten samlar folk i alle aldrar, men det er framleis karane som kastar mest. "Kvinnfolka må ikkje slå smerta om våren. Det dårlege folk gjør i bygda er at folk ein ikkje skulle smelta om våren."',
    imgs: ['Bilder/1994_aleine_om_skathellekasting.png'],
    source: 'Sogn Avis, 19. juli 1994',
    url: 'https://www.nb.no/items/59fe4978afddb51498db0a6303dcfa0f?page=7&search='
  },
  {
    year: 1997,
    label: 'Senior-tradisjon',
    heading: 'Lange baskar i varm sol',
    body: 'Sogn Avis dekkar marknadshelga 1997 i ein stor reportasje. "Publikum på skathellekasting er ikkje av det bråkete slaget, men lyttar til mumling frå seniorbenken — kjem med meiningar når karane ikkje treff steinen 23 meter unna." Artikkelen omteler sporten som "den gamle tradisjonen" — utan kostbart utstyr, open for alle, og med sterk tilknyting til Jostedalen og familien. Konkurransen er prestisjetung, men ikkje meir formell enn at folk smiler og kommenterer som dei vil.',
    imgs: ['Bilder/1997_lange_baskar_i_varm_sol.png'],
    source: 'Sogn Avis, 17. juli 1997',
    url: 'https://www.nb.no/items/ed8647f426acec327eecd7ee703aa67d?page=9&search='
  },
  {
    year: 1999,
    label: 'Røter i 1900-talet',
    heading: 'Lang tradisjon dokumentert',
    body: '"Skathellekastinga har lang tradisjon i Jostedalen, og det er viktig at me tek vare på denne artige aktiviteten." Dette er den fyrste skriftlege kjelda som datofester sporten — artikkelen dokumenterer at skathellekasting i Jostedalen truleg startar frå byrjinga av 1900-talet. Det var oftast karane som kasta, men jenter deltok òg i den årlege konkurransen. Bilettekst frå året: "Skathellekasting er spesielt for Jostedalen og mange deltok i den spennande konkurransen under marknadshelga."',
    imgs: [
      'Bilder/1999_om_skathellekasting.png',
      'Bilder/1999_skathellebilde_.png'
    ],
    source: 'Lokalavis, 1999',
    url: 'https://www.nb.no/items/a300c3b7f1871bf702db844c9cc85aa7?page=7&search='
  },
  {
    year: 2002,
    label: 'Presisjon',
    heading: 'Presisjon og prestisje',
    body: '"Du kan høyre ein knappenål dette i det skathella flyg gjennom lufta." Stor reportasje i Sogn Avis om skathellekasting som presisjonssport. Tom Røysi (34) er avbilda i kasteposisjon. Sporten vert omtalt som årets mest prestisjetunge konkurranse i Jostedalen. Familiebandet til sporten er sterkt — deltakarane stiller alltid opp på marknadshelga, år etter år. Eit høgdepunkt i sommarkalenderen for jostedølene.',
    imgs: ['Bilder/2002_presisjon_og_prestisje.png'],
    source: 'Sogn Avis, 2002',
    url: 'https://www.nb.no/items/7d1032f70b7210cccca98ad88ce12457?page=9&search='
  },
  {
    year: 2004,
    label: 'Ny generasjon',
    heading: 'Håvard sviktar ikkje med skathella',
    body: 'Stor reportasje i Sogn Avis med dramatisk bilete av Håvard Hesjevoll i hopp-kast. Jostedølene fryktar likevel for framtida til skathellekastinga — dei unge er ikkje like aktive som dei eldre. "Rekrutteringa er for dårleg," seier Anders Grov. Marknadshelga dette året hadde om lag 40.000 kroner netto i inntekter. Trass i framtidsfrykt held tradisjonen stand, og ein ny generasjon viser at sporten har overlevingsevne.',
    imgs: ['Bilder/2004_Havard_sviktar_ikkje_med_skathella.png'],
    source: 'Sogn Avis, 2004',
    url: 'https://www.nb.no/items/43fe11d33298bae5e9e3da96e51fa4e3?page=9&search='
  },
  {
    year: 2007,
    label: 'Rekruttering',
    heading: 'Skathellekurs mot forgubbing',
    body: 'Fem unge jostedøler og ein immigrant deltok på det fyrste nybyrjarkurset i skathellekasting. "Me lyt prøva å motverka forgubbinga i skathellekastingmiljøet," seier Britt Elin Fossøy. Norvald Bakken er instruktør. Sporten har vorte ein "elitesport" der erfarne tek heim premiane — kurset skal endra det og få unge med. Same år startar dei fyrste digitale dokumentasjonane av sporten på blogg-plattforma bakken.wordpress.com.',
    imgs: ['Bilder/2007_skathellekurs.png'],
    source: 'Sogn Avis, 2007',
    url: 'https://www.nb.no/items/833745e7e63afea61d259e17fc66ea7c?page=15&search='
  },
  {
    year: 2010,
    label: 'Veke for veke',
    heading: 'Tevling kvar veke',
    body: '"Steinane flyg høgt og hardt på skathellebana ved Dølaheimen. Konkurranselystne jostedøler har tevla i ein særs lokal-tradisjonell sportsgrein." Sogn Avis rapporterer om at turneringa no vert arrangert kvar veke gjennom sommaren. Totalt 16 deltakarar dette året, og det vert oppretta ein eigen junior-serie for dei unge. Britt Elin Fossøy Norberg leiar arbeidet for å halde tradisjonen levande.',
    imgs: ['Bilder/2010_Tevlar_i_skathellekasting.png'],
    source: 'Sogn Avis, 2010',
    url: 'https://www.nb.no/items/1fb3f56af8b4b8cc506aae9b0364d1f4?page=9&search='
  },
  {
    year: 2014,
    label: 'Meisterskap',
    heading: 'Meisterskapet 2014',
    body: 'Kastinga går føre seg ved Dølaheimen ein typisk sommardag. Vinnarlaget og andreplasslaget tek imot premiane — blå t-skjorter til vinnarane, trofé til dei andre. Stort frammøte av publikum. Bilde dokumenterer både kastesituasjonar og prisutdeling. Tradisjonen lever framleis sterkt 60+ år etter at Melkior Fossen vart fyrste dokumenterte Jostedalsmeister.',
    imgs: [
      'Bilder/2014_kast_a.jpg',
      'Bilder/2014_kast_b.jpg',
      'Bilder/2014_vinnarar.jpg'
    ],
    source: 'Foto: Olav Grov, 2014',
    url: null
  },
  {
    year: 2015,
    label: 'Meisterskap',
    heading: 'Meisterskapet 2015',
    body: 'Action frå bana med Jostedalfjella som bakteppe. Vinnarane tek imot krus med Jostedalen-motiv som premie. Eit typisk år ved Dølaheimen — folk samla, kastarar konsentrerte, og naturen rundt som ein storslått ramme rundt det heile.',
    imgs: [
      'Bilder/2015_kast.jpg',
      'Bilder/2015_vinnarar.jpg'
    ],
    source: 'Foto: Olav Grov, 2015',
    url: null
  },
  {
    year: 2018,
    label: 'Meisterskap',
    heading: 'Meisterskapet 2018',
    body: 'Tre vinnarar held skathellene sine mot kamera. Tribunen bak er full av tilskodarar — skathellekasting samlar framleis folk i Jostedalen. Bileta viser tydeleg at sporten ikkje berre er om vinnaren, men om fellesskapet rundt.',
    imgs: ['Bilder/2018_vinnarar.png'],
    source: 'Foto: Olav Grov, 2018',
    url: null
  },
  {
    year: 2019,
    label: 'Meisterskap',
    heading: 'Meisterskapet 2019',
    body: 'Vinnarane fotografert med skathellene sine. Stort publikum i bakgrunnen vitnar om at tradisjonen framleis engasjerer breitt. Sporten har overlevd alle bølgjer av modernisering og held framleis på sin særeigne plass i Jostedalen sin kultur.',
    imgs: ['Bilder/2019_vinnarar.png'],
    source: 'Foto: Olav Grov, 2019',
    url: null
  },
  {
    year: 2022,
    label: 'Meisterskap',
    heading: 'Meisterskapet 2022',
    body: 'Etter to år utan konkurranse på grunn av koronapandemien, kom skathellekastinga tilbake til marknadshelgi. Vinnarlag: Erling Sperle, Ingar Norberg og Nils Neset. Marknadssjef Henning Skjervik var aktivt med på bana.',
    imgs: ['Bilder/2022_vinnarar.png'],
    source: 'Foto: Olav Grov, 2022',
    url: null
  },
  {
    year: 2023,
    label: 'Portrett',
    heading: 'Magne Hesjevoll — mannen bak tradisjonen',
    body: 'Magne Hesjevoll har i ei årrekkje vore trenar og ankerperson for skathellekasting i Jostedalen. Det var han som introduserte Brage Norberg og Lars Andreas Myklebust Neset for sporten — og som i mange tiår har sett til at unge får læra teknikken. Intervju med Magne kjem.',
    imgs: ['Bilder/Magne_Hesjevoll_2023.jpg'],
    source: 'Foto: Jostedalen, 2023',
    url: null
  },
  {
    year: 2023,
    label: 'Meisterskap',
    heading: 'Meisterskapet 2023',
    body: 'Ein heil dag på skathellebana gav resultat. Vinnarlag: Arne Fossøy, Even Loe og Ingar Norberg. Sogn Avis lagar reportasje skriven av Magnus Grotle Førde.',
    imgs: ['Bilder/2023_vinnarar.png'],
    source: 'Foto: Sogn Avis, 2023',
    url: 'https://www.sognavis.no/5-115-1021394'
  },
  {
    year: 2024,
    label: 'Meisterskap',
    heading: 'Meisterskapet 2024',
    body: 'Ung kastar i full aksjon ved Dølaheimen. Vinnarane mottek krus som premie. Anlegget er oppgradert med nytt mål. Sporten lever vidare — sjølv om dei unge er færre enn på 70-talet, er det framleis liv i kasta. Eit teikn på at tradisjonen klarer å fornye seg utan å miste seg sjølv.',
    imgs: [
      'Bilder/2024_kast.jpg',
      'Bilder/2024_vinnarar.jpg'
    ],
    source: 'Foto: Olav Grov, 2024',
    url: null
  },
  {
    year: 2025,
    label: 'Meisterskap',
    heading: 'Meisterskapet 2025',
    body: 'To kastesituasjonar med fullt publikum på benkane. Det nye målet er godt synleg. Tradisjonen lever vidare ved Dølaheimen, og marknadshelga held framleis på sin tradisjonelle plass i juli. Eit nytt steg på vegen mot å sikra at sporten lever vidare i mange tiår til.',
    imgs: [
      'Bilder/2025_kast_a.jpg',
      'Bilder/2025_kast_b.jpg'
    ],
    source: 'Foto: Olav Grov, 2025',
    url: null
  },
  {
    year: 2026,
    label: 'Digital arv',
    heading: 'skathelle.no — sporten på nett',
    body: 'Brage Norberg og Lars Andreas Myklebust Neset lanserer skathelle.no — eit komplett digitalt arkiv over skathellekasting i Jostedalen. Over 120 verifiserte avisartiklar frå 1957 til 2010 vert samla på ein stad, saman med moderne foto og dokumentasjon. Målet er å sikra at tradisjonen overlever og at nye generasjonar kan oppdaga sporten — uansett kvar dei er i verda.',
    imgs: [],
    source: 'Skathelle.no, juni 2026',
    url: null
  }
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
      const hasImgs = ev.imgs.length > 0;
      const imgHTML = hasImgs
        ? `<div class="tl-imgs">${ev.imgs.map(src =>
            `<button class="tl-img-btn" onclick="openTlLightbox('${src}','${ev.heading.replace(/'/g,"\\'")}')">
               <img src="${src}" alt="${ev.heading}" loading="lazy">
             </button>`).join('')}</div>`
        : '';

      const linkHTML = ev.url
        ? `<a href="${ev.url}" class="tl-content-link" target="_blank" rel="noopener noreferrer">Les kjelda på nb.no &#8594;</a>`
        : '';

      content.innerHTML = `
        <div class="tl-content-inner${hasImgs ? '' : ' tl-content-inner--text-only'}">
          <div>
            <div class="tl-content-year">${ev.year}</div>
            <p class="tl-content-label">${ev.label}</p>
            <h3 class="tl-content-heading">${ev.heading}</h3>
            <p class="tl-content-body">${ev.body}</p>
            <p class="tl-content-source">${ev.source}</p>
            ${linkHTML}
          </div>
          ${hasImgs ? `<div>${imgHTML}</div>` : ''}
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
const TARGET = new Date('2026-07-18T13:30:00');
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

/* REGLAR LIGHTBOX */
window.openReglarLightbox = function() {
  const lb = document.getElementById('reglarLightbox');
  if (lb) { lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); }
};

const reglarLbClose = document.getElementById('reglarLightboxClose');
const reglarLb = document.getElementById('reglarLightbox');
if (reglarLbClose && reglarLb) {
  reglarLbClose.addEventListener('click', () => { reglarLb.classList.remove('is-open'); reglarLb.setAttribute('aria-hidden','true'); });
  reglarLb.addEventListener('click', e => { if (e.target === reglarLb) { reglarLb.classList.remove('is-open'); reglarLb.setAttribute('aria-hidden','true'); }});
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { reglarLb.classList.remove('is-open'); reglarLb.setAttribute('aria-hidden','true'); }});
}

/* GROV LIGHTBOX */
function openGrovLightbox() {
  const lb = document.getElementById('grovLightbox');
  if (lb) { lb.classList.add('is-open'); lb.setAttribute('aria-hidden','false'); }
}
document.addEventListener('DOMContentLoaded', () => {
  const close = document.getElementById('grovLightboxClose');
  const lb = document.getElementById('grovLightbox');
  if (close && lb) {
    close.addEventListener('click', () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden','true'); });
    lb.addEventListener('click', e => { if (e.target === lb) { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden','true'); } });
  }
});

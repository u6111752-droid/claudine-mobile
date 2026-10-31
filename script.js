/* CLAUDINE — SCRIPT.JS */

/* ANIMACIÓ DEL POEMA */
const introContent = document.querySelector(".intro-content");

if (introContent) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 },
  );

  observer.observe(introContent);
}

/* COMENÇAR DES DE LA PORTADA */
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  if (window.location.hash) {
    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
  }

  window.scrollTo(0, 0);
});

/* GALERIA HORITZONTAL */
const gallery = document.querySelector(".gallery-horizontal");
const galleryScroll = document.querySelector("#galleryScroll");

if (gallery && galleryScroll) {
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function updateGallery() {
    const maxScroll = Math.max(
      0,
      galleryScroll.scrollWidth - galleryScroll.clientWidth,
    );

    const progress = maxScroll
      ? clamp(galleryScroll.scrollLeft / maxScroll, 0, 1)
      : 0;

    /* NEGRE → GRIS → BLANC ROSAT */
    const greyOpacity = clamp(progress * 2, 0, 1);
    const ivoryOpacity = clamp((progress - 0.5) * 2, 0, 1);

    gallery.style.setProperty("--grey-opacity", String(greyOpacity));

    gallery.style.setProperty("--ivory-opacity", String(ivoryOpacity));

    /* COLOR DEL TÍTOL */
    gallery.style.setProperty(
      "--gallery-text",
      progress > 0.74 ? "#29231f" : "#f5f2ed",
    );
  }

  /* SCROLL LATERAL REAL */
  galleryScroll.addEventListener("scroll", updateGallery, { passive: true });

  window.addEventListener("resize", updateGallery);

  /* INICIAR EN LA PRIMERA GALERIA */
  galleryScroll.scrollLeft = 0;
  updateGallery();
}

/* NAVEGACIÓ PORTADA → PORTFOLIO */

const arrel = document.documentElement;
const seccioPoema = document.querySelector("#work");
const botoEntrada = document.querySelector("#explore-btn");

let portfolioObert = false;

arrel.classList.add("portada-bloquejada");

/* PORTADA → POEMA — TRANSICIÓ CINEMATOGRÀFICA */

function obrirPortfolio() {
  if (!seccioPoema || portfolioObert) return;

  const reduirMoviment = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reduirMoviment) {
    portfolioObert = true;
    arrel.classList.remove("portada-bloquejada");
    arrel.classList.add("portfolio-actiu");

    seccioPoema.scrollIntoView({
      behavior: "instant",
      block: "start",
    });
    return;
  }

  // 1. Enfosquir la portada
  document.body.classList.add("is-entering-work");

  // 2. Esperar que acabi el fos a negre
  setTimeout(() => {
    portfolioObert = true;

    arrel.classList.remove("portada-bloquejada");
    arrel.classList.add("portfolio-actiu");

    // El canvi de secció queda ocult per la capa negra
    seccioPoema.scrollIntoView({
      behavior: "instant",
      block: "start",
    });

    // 3. Revelar progressivament el poema
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove("is-entering-work");
        document.body.classList.add("is-revealing-work");
      });
    });

    // 4. Netejar les classes de la transició
    setTimeout(() => {
      document.body.classList.remove("is-revealing-work");
    }, 1250);
  }, 850);
}

botoEntrada?.addEventListener("click", (event) => {
  event.preventDefault();
  obrirPortfolio();
});

/* NO PERMETRE TORNAR A LA PORTADA */

window.addEventListener(
  "scroll",
  () => {
    if (!portfolioObert || !seccioPoema) return;

    const limit = seccioPoema.getBoundingClientRect().top + window.scrollY;

    if (window.scrollY < limit - 1) {
      window.scrollTo({
        top: limit,
        behavior: "instant",
      });
    }
  },
  { passive: true },
);

/* ==========================================
   BLOQUEJAR SCROLL GALERIA → ABOUT ME
========================================== */

(() => {
  const gallery = document.querySelector("#gallery");
  const about = document.querySelector("#about");
  const aboutButton = document.querySelector(".gallery-about-link");

  if (!gallery || !about || !aboutButton) return;

  let aboutUnlocked = false;

  aboutButton.addEventListener("click", (event) => {
    event.preventDefault();

    aboutUnlocked = true;

    about.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

  window.addEventListener(
    "scroll",
    () => {
      if (!portfolioObert || aboutUnlocked) return;

      const galleryBottom =
        gallery.getBoundingClientRect().bottom + window.scrollY;

      const maxScroll = galleryBottom - window.innerHeight;

      if (window.scrollY > maxScroll) {
        window.scrollTo({
          top: maxScroll,
          behavior: "instant",
        });
      }
    },
    { passive: true },
  );
})();

/* LE SUBLIME — OVERLAY */

const sublimeOverlay = document.querySelector("#project-sublime");
const sublimeCard = document.querySelector('.gallery-card[href="#sublime"]');

if (sublimeOverlay && sublimeCard) {
  const sublimePage = sublimeOverlay.querySelector(".project-page");
  const closeButtons = sublimeOverlay.querySelectorAll(
    ".project-close, .sublime-back",
  );

  let previousFocus = null;

  function openSublime(event) {
    event.preventDefault();

    previousFocus = document.activeElement;

    sublimePage.scrollTop = 0;
    sublimeOverlay.classList.add("is-open");
    sublimeOverlay.setAttribute("aria-hidden", "false");

    sublimeOverlay.querySelector(".project-close").focus();
  }

  function closeSublime() {
    sublimeOverlay.classList.remove("is-open");
    sublimeOverlay.setAttribute("aria-hidden", "true");

    if (previousFocus) {
      previousFocus.focus({ preventScroll: true });
    }
  }

  sublimeCard.addEventListener("click", openSublime);

  /* PROVA TEMPORAL — BOTONS LE SUBLIME */

  sublimeOverlay
    .querySelector(".sublime-back")
    ?.addEventListener("click", () => {
      console.log("BACK funciona");
    });

  sublimeOverlay
    .querySelector(".sublime-next")
    ?.addEventListener("click", () => {
      console.log("NEXT funciona");
    });

  /* LE SUBLIME → NEXT PROJECT: EL LABERINT */

  const sublimeNextButton = sublimeOverlay.querySelector(".sublime-next");

  sublimeNextButton?.addEventListener("click", () => {
    const laberintCard = document.querySelector(
      '.gallery-card[href="#laberint"]',
    );

    if (!laberintCard) {
      console.warn("No s'ha trobat la targeta EL LABERINT");
      return;
    }

    // Tancar LE SUBLIME
    closeSublime();

    // Obrir EL LABERINT amb el seu sistema original
    requestAnimationFrame(() => {
      laberintCard.click();
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeSublime);
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      sublimeOverlay.classList.contains("is-open")
    ) {
      closeSublime();
    }
  });
}

/* LE SUBLIME — EXPLORE MORE */

const sublimeExplore = document.querySelector(
  "#project-sublime .sublime-explore",
);

const sublimeMore = document.querySelector("#project-sublime .sublime-more");

const sublimeChapters = document.querySelectorAll(
  "#project-sublime .sublime-chapter",
);

const sublimeProjectPage = document.querySelector(
  "#project-sublime .project-page",
);

if (sublimeExplore && sublimeMore && sublimeProjectPage) {
  const chapterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    },
    {
      root: sublimeProjectPage,
      threshold: 0.15,
    },
  );

  sublimeChapters.forEach((chapter) => {
    chapterObserver.observe(chapter);
  });

  sublimeExplore.addEventListener("click", async () => {
    if (sublimeExplore.disabled) return;

    sublimeExplore.disabled = true;

    const transition = document.querySelector(
      "#project-sublime .sublime-wound-transition",
    );

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    sublimeMore.classList.add("is-visible");

    sublimeExplore.setAttribute("aria-expanded", "true");

    if (transition && !reducedMotion) {
      transition.classList.remove("is-active");
      void transition.offsetWidth;
      transition.classList.add("is-active");

      // Esperem que la pantalla quedi coberta.
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    // Canviem a la fotografia 02 mentre la pantalla és fosca.
    sublimeProjectPage.scrollTo({
      top:
        sublimeProjectPage.scrollTop +
        sublimeMore.getBoundingClientRect().top -
        sublimeProjectPage.getBoundingClientRect().top,
      behavior: "instant",
    });

    if (transition && !reducedMotion) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      transition.classList.remove("is-active");
    }

    sublimeExplore.disabled = false;
  });
}

/* =========================================
   EL LABERINT — FUNCIONAMENT COMPLET
========================================= */

{
  const laberintOverlay = document.querySelector("#project-laberint");
  const laberintCard = document.querySelector(
    '.gallery-card[href="#laberint"]',
  );

  if (laberintOverlay && laberintCard) {
    const laberintClose = laberintOverlay.querySelector(".laberint-close");

    const laberintPlayer = laberintOverlay.querySelector("#laberint-player");

    const laberintExplore = laberintOverlay.querySelector("#laberint-explore");

    const laberintJourney = laberintOverlay.querySelector("#laberint-journey");

    const laberintEndButton = laberintOverlay.querySelector(
      ".laberint-end-button",
    );

    const laberintBackButton = laberintOverlay.querySelector(".laberint-back");

    let previousFocus = null;
    let previousScrollY = 0;
    let previousGalleryX = 0;
    let isExploring = false;

    function openLaberint(event) {
      event.preventDefault();

      previousFocus = document.activeElement;
      previousScrollY = window.scrollY;

      const galleryScroll = document.querySelector("#galleryScroll");

      previousGalleryX = galleryScroll ? galleryScroll.scrollLeft : 0;

      isExploring = false;

      laberintOverlay.classList.remove("is-unlocked");
      laberintOverlay.classList.add("is-locked");

      laberintOverlay.scrollTop = 0;
      // Permetre arribar al botó EXPLORE MORE
      laberintOverlay.style.overflowY = "auto";
      laberintOverlay.classList.add("is-open");
      laberintOverlay.setAttribute("aria-hidden", "false");

      document.body.style.overflow = "hidden";

      if (laberintPlayer && laberintPlayer.dataset.src) {
        laberintPlayer.src = laberintPlayer.dataset.src;
      }

      requestAnimationFrame(() => {
        laberintOverlay.scrollTop = 0;
      });

      if (laberintClose) {
        laberintClose.focus({ preventScroll: true });
      }
    }

    function closeLaberint() {
      if (!laberintOverlay.classList.contains("is-open")) {
        return;
      }

      isExploring = false;

      if (laberintPlayer) {
        laberintPlayer.removeAttribute("src");
      }

      laberintOverlay.classList.remove("is-open", "is-locked", "is-unlocked");

      laberintOverlay.setAttribute("aria-hidden", "true");
      laberintOverlay.scrollTop = 0;

      document.body.style.overflow = "";

      const galleryScroll = document.querySelector("#galleryScroll");

      if (galleryScroll) {
        galleryScroll.scrollLeft = previousGalleryX;
      }

      window.scrollTo({
        top: previousScrollY,
        behavior: "instant",
      });

      if (previousFocus && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    }

    function exploreLaberint() {
      if (isExploring || !laberintJourney) {
        return;
      }

      isExploring = true;

      laberintOverlay.classList.remove("is-locked");
      laberintOverlay.classList.add("is-unlocked");

      requestAnimationFrame(() => {
        const overlayRect = laberintOverlay.getBoundingClientRect();

        const journeyRect = laberintJourney.getBoundingClientRect();

        const target =
          journeyRect.top - overlayRect.top + laberintOverlay.scrollTop;

        laberintOverlay.scrollTo({
          top: target,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
      });
    }

    laberintCard.addEventListener("click", openLaberint);

    if (laberintClose) {
      laberintClose.addEventListener("click", closeLaberint);
    }

    if (laberintExplore) {
      laberintExplore.addEventListener("click", exploreLaberint);
    }

    if (laberintBackButton) {
      laberintBackButton.addEventListener("click", closeLaberint);
    }

    /* EL LABERINT → THE MODERN COVEN OF LIGHT */

    const laberintNextButton = laberintOverlay.querySelector(".laberint-next");

    laberintNextButton?.addEventListener("click", () => {
      const covenCard = document.querySelector(
        '.gallery-card[href="#modern-coven"]',
      );

      if (!covenCard) {
        console.warn("No s'ha trobat la targeta de THE MODERN COVEN");
        return;
      }

      closeLaberint();

      requestAnimationFrame(() => {
        covenCard.click();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        laberintOverlay.classList.contains("is-open")
      ) {
        closeLaberint();
      }
    });
  }
}

/* =========================================
   04 — THE MODERN COVEN OF LIGHT
========================================= */

{
  const covenOverlay = document.querySelector("#project-modern-coven");

  const covenCard = document.querySelector(
    '.gallery-card[href="#modern-coven"]',
  );

  if (covenOverlay && covenCard) {
    const covenClose = covenOverlay.querySelector(".coven-close");

    const covenExplore = covenOverlay.querySelector("#coven-explore");

    const covenJourney = covenOverlay.querySelector("#coven-journey");

    const covenEnd = covenOverlay.querySelector(".coven-end-button");

    const covenChapters = covenOverlay.querySelectorAll(".coven-chapter");

    let previousFocus = null;
    let previousScrollY = 0;
    let previousGalleryX = 0;
    let previousBodyOverflow = "";
    let previousHtmlOverflow = "";

    /* =====================================
       OBRIR EL PROJECTE
    ===================================== */

    function openCoven(event) {
      event.preventDefault();

      previousFocus = document.activeElement;
      previousScrollY = window.scrollY;

      previousBodyOverflow = document.body.style.overflow;
      previousHtmlOverflow = document.documentElement.style.overflow;

      const galleryScroll = document.querySelector("#galleryScroll");

      previousGalleryX = galleryScroll ? galleryScroll.scrollLeft : 0;

      covenOverlay.classList.remove("is-open", "is-unlocked");

      covenOverlay.classList.add("is-locked");

      covenOverlay.scrollTop = 0;

      covenChapters.forEach((chapter) => {
        chapter.classList.remove("is-visible");
      });

      covenOverlay.classList.add("is-open");
      covenOverlay.setAttribute("aria-hidden", "false");

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      if (covenClose) {
        covenClose.focus({ preventScroll: true });
      }
    }

    /* =====================================
       TANCAR I TORNAR A LA GALERIA
    ===================================== */

    function closeCoven() {
      covenOverlay.classList.remove("is-open", "is-locked", "is-unlocked");

      covenOverlay.setAttribute("aria-hidden", "true");
      covenOverlay.scrollTop = 0;

      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;

      const galleryScroll = document.querySelector("#galleryScroll");

      if (galleryScroll) {
        galleryScroll.scrollTo({
          left: previousGalleryX,
          behavior: "instant",
        });
      }

      window.scrollTo({
        top: previousScrollY,
        behavior: "instant",
      });

      if (previousFocus && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    }

    /* =====================================
       EXPLORE MORE
    ===================================== */

    function exploreCoven() {
      covenOverlay.classList.remove("is-locked");
      covenOverlay.classList.add("is-unlocked");

      requestAnimationFrame(() => {
        if (!covenJourney) return;

        const journeyPosition =
          covenJourney.getBoundingClientRect().top -
          covenOverlay.getBoundingClientRect().top +
          covenOverlay.scrollTop;

        covenOverlay.scrollTo({
          top: journeyPosition,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
      });
    }

    /* =====================================
       ANIMACIONS DELS CAPÍTOLS
    ===================================== */

    const covenObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        root: covenOverlay,
        threshold: 0.1,
      },
    );

    covenChapters.forEach((chapter) => {
      covenObserver.observe(chapter);
    });

    /* =====================================
       ESDEVENIMENTS DELS BOTONS
    ===================================== */

    covenCard.addEventListener("click", openCoven);

    if (covenClose) {
      covenClose.addEventListener("click", closeCoven);
    }

    /* END OF PROJECT — NOMÉS TEXT */
    /* No necessita cap event de clic */

    /* BACK TO GALLERY — MODERN COVEN */

    const covenBack = covenOverlay.querySelector(".coven-back");

    if (covenBack) {
      covenBack.addEventListener("click", closeCoven);
    }

    if (covenExplore) {
      covenExplore.addEventListener("click", exploreCoven);
    }

    /* ==========================================
   MODERN COVEN → FRAGILE MASCULINITY
========================================== */

    const covenNextButton = covenOverlay.querySelector(".coven-next");

    covenNextButton?.addEventListener("click", () => {
      const fragileCard = document.querySelector(
        '.gallery-card[href="#fragile"]',
      );

      if (!fragileCard) {
        console.warn("No s'ha trobat FRAGILE MASCULINITY");
        return;
      }

      // Tancar THE MODERN COVEN
      closeCoven();

      // Obrir FRAGILE amb la seva transició
      requestAnimationFrame(() => {
        fragileCard.click();
      });
    });

    /* =====================================
       TANCAR AMB ESC
    ===================================== */

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        covenOverlay.classList.contains("is-open")
      ) {
        closeCoven();
      }
    });
  }
}

/* =========================================
   FINAL — THE MODERN COVEN OF LIGHT
========================================= */

/* =========================================
   05 — FRAGILE MASCULINITY
========================================= */

{
  const fragileOverlay = document.querySelector("#project-fragile");

  const fragileCard = document.querySelector('.gallery-card[href="#fragile"]');

  if (fragileOverlay && fragileCard) {
    const fragileClose = fragileOverlay.querySelector(".fragile-close");

    const fragileExplore = fragileOverlay.querySelector(".fragile-explore");

    const fragileJourney = fragileOverlay.querySelector(".fragile-journey");

    const fragileEnd = fragileOverlay.querySelector(".fragile-end-button");

    const fragileBack = fragileOverlay.querySelector(".fragile-back");

    const fragileChapters = fragileOverlay.querySelectorAll(".fragile-chapter");

    const galleryScroll = document.querySelector("#galleryScroll");

    let previousFocus = null;
    let previousScrollY = 0;
    let previousGalleryX = 0;
    let previousBodyOverflow = "";
    let previousHtmlOverflow = "";

    /* OBRIR PROJECTE */

    function openFragile(event) {
      event.preventDefault();

      previousFocus = document.activeElement;
      previousScrollY = window.scrollY;

      previousGalleryX = galleryScroll ? galleryScroll.scrollLeft : 0;

      previousBodyOverflow = document.body.style.overflow;
      previousHtmlOverflow = document.documentElement.style.overflow;

      fragileOverlay.classList.remove("is-open", "is-unlocked");

      fragileOverlay.classList.add("is-locked");
      fragileOverlay.scrollTop = 0;

      fragileChapters.forEach((chapter) => {
        chapter.classList.remove("is-visible");
      });

      fragileOverlay.classList.add("is-open");
      fragileOverlay.setAttribute("aria-hidden", "false");

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      fragileClose?.focus({ preventScroll: true });
    }

    /* TANCAR PROJECTE */

    function closeFragile() {
      fragileOverlay.classList.remove("is-open", "is-locked", "is-unlocked");

      fragileOverlay.setAttribute("aria-hidden", "true");
      fragileOverlay.scrollTop = 0;

      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;

      if (galleryScroll) {
        galleryScroll.scrollTo({
          left: previousGalleryX,
          behavior: "instant",
        });
      }

      window.scrollTo({
        top: previousScrollY,
        behavior: "instant",
      });

      if (previousFocus && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    }

    /* EXPLORE MORE */

    function exploreFragile() {
      fragileOverlay.classList.remove("is-locked");
      fragileOverlay.classList.add("is-unlocked");

      requestAnimationFrame(() => {
        if (!fragileJourney) return;

        const target =
          fragileJourney.getBoundingClientRect().top -
          fragileOverlay.getBoundingClientRect().top +
          fragileOverlay.scrollTop;

        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        fragileOverlay.scrollTo({
          top: target,
          behavior: reducedMotion ? "instant" : "smooth",
        });
      });
    }

    /* ANIMACIONS */

    const fragileObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        root: fragileOverlay,
        threshold: 0.1,
      },
    );

    fragileChapters.forEach((chapter) => {
      fragileObserver.observe(chapter);
    });

    /* ESDEVENIMENTS */

    fragileCard.addEventListener("click", openFragile);

    fragileClose?.addEventListener("click", closeFragile);

    fragileBack?.addEventListener("click", closeFragile);

    /* ==========================================
   FRAGILE → THE FASHION INDUSTRY
========================================== */

    const fragileNextButton = fragileOverlay.querySelector(".fragile-next");

    fragileNextButton?.addEventListener("click", () => {
      const fashionCard = document.querySelector(
        '.gallery-card[href="#fashion"]',
      );

      if (!fashionCard) {
        console.warn("No s'ha trobat THE FASHION INDUSTRY");
        return;
      }

      // Tancar FRAGILE MASCULINITY
      closeFragile();

      // Obrir THE FASHION INDUSTRY
      requestAnimationFrame(() => {
        fashionCard.click();
      });
    });

    fragileExplore?.addEventListener("click", exploreFragile);

    /* TANCAR AMB ESC */

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        fragileOverlay.classList.contains("is-open")
      ) {
        closeFragile();
      }
    });
  }
}

/* FINAL — FRAGILE MASCULINITY */

/* ==========================================
   PROJECT 06 — THE FASHION INDUSTRY
========================================== */

(() => {
  const fashionOverlay = document.querySelector("#project-fashion");

  if (!fashionOverlay) return;

  const fashionClose = fashionOverlay.querySelector(".fashion-close");

  const fashionExplore = fashionOverlay.querySelector(".fashion-explore");

  const fashionBack = fashionOverlay.querySelector(".fashion-back");

  const fashionBranded = fashionOverlay.querySelector("#fashion-branded");

  const fashionCard = document.querySelector('.gallery-card[href="#fashion"]');

  let previousBodyOverflow = "";
  let previousFocus = null;

  function openFashion(event) {
    if (event) event.preventDefault();

    previousFocus = document.activeElement;
    previousBodyOverflow = document.body.style.overflow;

    fashionOverlay.classList.add("is-open");
    fashionOverlay.classList.add("is-locked");
    fashionOverlay.classList.remove("is-unlocked");

    fashionOverlay.scrollTop = 0;
    fashionOverlay.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    fashionClose?.focus({
      preventScroll: true,
    });
  }

  function closeFashion() {
    fashionOverlay.classList.remove("is-open", "is-unlocked");

    fashionOverlay.classList.add("is-locked");

    fashionOverlay.scrollTop = 0;
    fashionOverlay.setAttribute("aria-hidden", "true");

    document.body.style.overflow = previousBodyOverflow;

    previousFocus?.focus?.({
      preventScroll: true,
    });
  }

  function exploreFashion() {
    fashionOverlay.classList.remove("is-locked");
    fashionOverlay.classList.add("is-unlocked");

    requestAnimationFrame(() => {
      if (!fashionBranded) return;

      const overlayRect = fashionOverlay.getBoundingClientRect();

      const targetRect = fashionBranded.getBoundingClientRect();

      const target =
        targetRect.top - overlayRect.top + fashionOverlay.scrollTop - 60;

      fashionOverlay.scrollTo({
        top: target,
        behavior: "smooth",
      });
    });
  }

  // OBRIR THE FASHION INDUSTRY DES DE LA GALERIA

  document
    .querySelectorAll(
      '.gallery-card[href="#fashion"], ' +
        '.gallery-card[href="#project-fashion"], ' +
        '.gallery-card[data-project="fashion"]',
    )
    .forEach((card) => {
      card.addEventListener("click", openFashion);
    });

  fashionClose?.addEventListener("click", closeFashion);

  fashionBack?.addEventListener("click", closeFashion);

  /* ==========================================
   THE FASHION INDUSTRY → APE STUDIOS
========================================== */

  const fashionNextButton = fashionOverlay.querySelector(".fashion-next");

  fashionNextButton?.addEventListener("click", () => {
    const apeCard = document.querySelector('.gallery-card[href="#ape"]');

    if (!apeCard) {
      console.warn("No s'ha trobat la targeta APE STUDIOS");
      return;
    }

    // Tancar THE FASHION INDUSTRY
    closeFashion();

    // Obrir APE STUDIOS amb la seva transició
    requestAnimationFrame(() => {
      apeCard.click();
    });
  });

  fashionExplore?.addEventListener("click", exploreFashion);

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      fashionOverlay.classList.contains("is-open")
    ) {
      closeFashion();
    }
  });

  // Permet obrir-lo des de NEXT PROJECT
  window.openFashionProject = openFashion;
  window.closeFashionProject = closeFashion;
})();

/* ==========================================
   PROJECT 07 — APE STUDIOS
========================================== */

(() => {
  const apeOverlay = document.querySelector("#project-ape");

  if (!apeOverlay) return;

  const apeClose = apeOverlay.querySelector(".ape-close");
  const apeExplore = apeOverlay.querySelector(".ape-explore");
  const apeBack = apeOverlay.querySelector(".ape-back");
  const apeNext = apeOverlay.querySelector(".ape-next");

  let previousBodyOverflow = "";
  let previousGalleryScroll = 0;
  let previousFocus = null;

  function openApe(event) {
    if (event) event.preventDefault();

    if (apeOverlay.classList.contains("is-open")) return;

    previousBodyOverflow = document.body.style.overflow;
    previousFocus = document.activeElement;

    const gallery = document.querySelector("#galleryScroll");

    previousGalleryScroll = gallery ? gallery.scrollLeft : 0;

    apeOverlay.classList.remove("is-unlocked");
    apeOverlay.classList.add("is-locked", "is-open");

    apeOverlay.scrollTop = 0;
    apeOverlay
      .querySelector(".ape-light")
      ?.classList.remove("ape-soft-visible");
    apeOverlay.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    apeClose?.focus({ preventScroll: true });
  }

  function closeApe() {
    apeOverlay.classList.remove("is-open", "is-unlocked");

    apeOverlay.classList.add("is-locked");
    apeOverlay.setAttribute("aria-hidden", "true");
    apeOverlay.scrollTop = 0;

    document.body.style.overflow = previousBodyOverflow;

    const gallery = document.querySelector("#galleryScroll");

    if (gallery) {
      gallery.scrollLeft = previousGalleryScroll;
    }

    if (previousFocus instanceof HTMLElement) {
      previousFocus.focus({ preventScroll: true });
    }
  }

  function exploreApe() {
    if (apeOverlay.classList.contains("is-unlocked")) return;

    const firstChapter = apeOverlay.querySelector(".ape-light");
    if (!firstChapter) return;

    // Preparar la revelació
    firstChapter.classList.remove("ape-soft-visible");

    apeOverlay.classList.remove("is-locked");
    apeOverlay.classList.add("is-unlocked");

    requestAnimationFrame(() => {
      const overlayRect = apeOverlay.getBoundingClientRect();
      const chapterRect = firstChapter.getBoundingClientRect();

      const target = chapterRect.top - overlayRect.top + apeOverlay.scrollTop;

      apeOverlay.scrollTo({
        top: Math.max(0, target),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });

      // Revelar la secció mentre ens hi acostem
      firstChapter.classList.add("ape-soft-visible");
    });
  }

  // OBRIR DES DE LA GALERIA

  document
    .querySelectorAll(
      '.gallery-card[href="#ape"], ' +
        '.gallery-card[href="#project-ape"], ' +
        '.gallery-card[data-project="ape"], ' +
        '.gallery-card[data-project="ape-studios"]',
    )
    .forEach((card) => {
      card.addEventListener("click", openApe);
    });

  apeClose?.addEventListener("click", closeApe);
  apeBack?.addEventListener("click", closeApe);

  /* ==========================================
   APE STUDIOS → FRAGMENTS OF SUMMER
========================================== */

  const apeNextButton = apeOverlay.querySelector(".ape-next");

  apeNextButton?.addEventListener("click", () => {
    const summerCard = document.querySelector('.gallery-card[href="#summer"]');

    if (!summerCard) {
      console.warn("No s'ha trobat FRAGMENTS OF SUMMER");
      return;
    }

    // Tancar APE STUDIOS
    closeApe();

    // Obrir SUMMER amb la seva transició original
    requestAnimationFrame(() => {
      summerCard.click();
    });
  });

  apeExplore?.addEventListener("click", exploreApe);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && apeOverlay.classList.contains("is-open")) {
      closeApe();
    }
  });
})();

/* ==========================================
   PROJECT 08 — FRAGMENTS OF SUMMER
========================================== */

(() => {
  const overlay = document.querySelector("#project-summer");

  if (!overlay) return;

  const closeButton = overlay.querySelector(".summer-close");
  const exploreButton = overlay.querySelector(".summer-explore");
  const backButton = overlay.querySelector(".summer-back");
  const nextButton = overlay.querySelector(".summer-next");
  const journey = overlay.querySelector(".summer-journey");

  let previousOverflow = "";
  let previousFocus = null;

  /* OBRIR PROJECTE */

  function openSummer(event) {
    if (event) event.preventDefault();

    if (overlay.classList.contains("is-open")) return;

    previousOverflow = document.body.style.overflow;
    previousFocus = document.activeElement;

    overlay.classList.add("is-open", "is-locked");
    overlay.classList.remove("is-unlocked");

    overlay.setAttribute("aria-hidden", "false");
    overlay.scrollTop = 0;

    document.body.style.overflow = "hidden";

    closeButton?.focus({ preventScroll: true });
  }

  /* TANCAR PROJECTE */

  function closeSummer() {
    if (!overlay.classList.contains("is-open")) return;

    overlay.classList.remove("is-open", "is-unlocked");
    overlay.classList.add("is-locked");

    overlay.setAttribute("aria-hidden", "true");
    overlay.scrollTop = 0;

    document.body.style.overflow = previousOverflow;

    if (previousFocus?.isConnected) {
      previousFocus.focus({ preventScroll: true });
    }
  }

  /* EXPLORE MORE */

  function exploreSummer() {
    overlay.classList.remove("is-locked");
    overlay.classList.add("is-unlocked");

    requestAnimationFrame(() => {
      if (!journey) return;

      const overlayRect = overlay.getBoundingClientRect();
      const journeyRect = journey.getBoundingClientRect();

      const target = journeyRect.top - overlayRect.top + overlay.scrollTop;

      overlay.scrollTo({
        top: Math.max(0, target),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });
  }

  /* OBRIR DES DE LA GALERIA */

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const card = target.closest(
      '.gallery-card[href="#summer"], ' +
        '.gallery-card[href="#project-summer"], ' +
        '.gallery-card[data-project="summer"]',
    );

    if (card) {
      openSummer(event);
    }
  });

  /* BOTÓ CLOSE */

  closeButton?.addEventListener("click", closeSummer);

  /* BACK TO GALLERY */

  backButton?.addEventListener("click", closeSummer);

  /* EXPLORE MORE */

  exploreButton?.addEventListener("click", exploreSummer);

  /* ==========================================
   SUMMER → AN INNER WORLD
========================================== */

  nextButton?.addEventListener("click", () => {
    const paintingCard = document.querySelector(
      '.gallery-card[href="#painting"], ' +
        '.gallery-card[href="#project-painting"], ' +
        '.gallery-card[data-project="painting"]',
    );

    if (!paintingCard) {
      console.warn("No s'ha trobat AN INNER WORLD");
      return;
    }

    // Tancar FRAGMENTS OF SUMMER
    closeSummer();

    // Obrir AN INNER WORLD amb la seva transició
    requestAnimationFrame(() => {
      paintingCard.click();
    });
  });

  /* TECLA ESC */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      closeSummer();
    }
  });
})();

/* ==========================================
   PROJECT 09 — AN INNER WORLD
========================================== */

(() => {
  const overlay = document.querySelector("#project-painting");
  if (!overlay) return;

  const closeButton = overlay.querySelector(".painting-close");
  const backButton = overlay.querySelector(".painting-back");
  const exploreButton = overlay.querySelector(".painting-explore");
  const nextButton = overlay.querySelector(".painting-next");

  let previousOverflow = "";
  let previousFocus = null;

  function openPainting(event) {
    event?.preventDefault();

    if (overlay.classList.contains("is-open")) return;

    previousOverflow = document.body.style.overflow;
    previousFocus = document.activeElement;

    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    overlay.scrollTop = 0;

    document.body.style.overflow = "hidden";
    closeButton?.focus({ preventScroll: true });
  }

  function closePainting() {
    if (!overlay.classList.contains("is-open")) return;

    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    overlay.scrollTop = 0;

    document.body.style.overflow = previousOverflow;

    if (previousFocus?.isConnected) {
      previousFocus.focus({ preventScroll: true });
    }
  }

  /* OBRIR DES DE LA GALERIA */

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const card = event.target.closest(
      '.gallery-card[href="#painting"], ' +
        '.gallery-card[href="#project-painting"], ' +
        '.gallery-card[data-project="painting"]',
    );

    if (card) openPainting(event);
  });

  /* TANCAR */

  closeButton?.addEventListener("click", closePainting);
  backButton?.addEventListener("click", closePainting);

  /* SCROLL TO EXPLORE */

  exploreButton?.addEventListener("click", () => {
    const ending = overlay.querySelector(".painting-ending");

    ending?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });

  /* NEXT PROJECT */

  nextButton?.addEventListener("click", () => {
    if (nextButton.disabled) return;
  });

  /* TECLA ESC */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      closePainting();
    }
  });

  /* ==========================================
   PROJECT 10 — RAW?
========================================== */

  (() => {
    const overlay = document.querySelector("#project-raw");
    if (!overlay) return;

    const closeButton = overlay.querySelector(".raw-close");
    const exploreButton = overlay.querySelector(".raw-explore");
    const backButton = overlay.querySelector(".raw-back");
    const playButton = overlay.querySelector(".raw-play");
    const video = overlay.querySelector(".raw-video");
    const manifesto = overlay.querySelector("#raw-manifesto");

    let previousOverflow = "";
    let previousFocus = null;

    /* OBRIR */

    function openRaw(event) {
      event?.preventDefault();

      if (overlay.classList.contains("is-open")) return;

      previousOverflow = document.body.style.overflow;
      previousFocus = document.activeElement;

      overlay.classList.add("is-open", "is-locked");
      overlay.classList.remove("is-unlocked");

      overlay.setAttribute("aria-hidden", "false");
      overlay.scrollTop = 0;

      document.body.style.overflow = "hidden";
    }

    /* TANCAR */

    function closeRaw() {
      video?.pause();

      overlay.classList.remove("is-open", "is-unlocked");
      overlay.classList.add("is-locked");

      overlay.setAttribute("aria-hidden", "true");
      overlay.scrollTop = 0;
      manifesto?.classList.remove("raw-soft-visible");

      document.body.style.overflow = previousOverflow;

      if (previousFocus?.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    }

    /* GALERIA PRINCIPAL */

    document.addEventListener("click", (event) => {
      const card = event.target.closest(
        '.gallery-card[href="#raw"], ' +
          '.gallery-card[href="#project-raw"], ' +
          '.gallery-card[data-project="raw"]',
      );

      if (card) openRaw(event);
    });

    /* BOTONS DE TANCAMENT */

    closeButton?.addEventListener("click", closeRaw);
    backButton?.addEventListener("click", closeRaw);

    /* RAW? → NEXT PROJECT: LE SUBLIME */

    const nextButton = overlay.querySelector(".raw-next");

    nextButton?.addEventListener("click", () => {
      const sublimeCard = document.querySelector(
        '.gallery-card[href="#sublime"]',
      );

      if (!sublimeCard) {
        console.warn("No s'ha trobat la targeta LE SUBLIME");
        return;
      }

      // Tancar RAW?
      closeRaw();

      // Obrir LE SUBLIME amb la seva transició
      requestAnimationFrame(() => {
        sublimeCard.click();
      });
    });

    /* VÍDEO */

    playButton?.addEventListener("click", async () => {
      if (!video) return;

      if (video.paused) {
        try {
          await video.play();
          playButton.style.opacity = "0";
          playButton.style.pointerEvents = "none";
        } catch (error) {
          console.error("Error reproduint RAW?", error);
        }
      } else {
        video.pause();
      }
    });

    video?.addEventListener("pause", () => {
      if (playButton) {
        playButton.style.opacity = "1";
        playButton.style.pointerEvents = "auto";
      }
    });

    video?.addEventListener("ended", () => {
      if (playButton) {
        playButton.style.opacity = "1";
        playButton.style.pointerEvents = "auto";
      }
    });

    /* EXPLORE MORE */

    /* RAW? — EXPLORE MORE */

    exploreButton?.addEventListener("click", () => {
      if (!manifesto) return;
      if (overlay.classList.contains("is-unlocked")) return;

      // Preparar el contingut
      manifesto.classList.remove("raw-soft-visible");

      overlay.classList.remove("is-locked");
      overlay.classList.add("is-unlocked");

      requestAnimationFrame(() => {
        const overlayRect = overlay.getBoundingClientRect();
        const manifestoRect = manifesto.getBoundingClientRect();

        const target = manifestoRect.top - overlayRect.top + overlay.scrollTop;

        overlay.scrollTo({
          top: Math.max(0, target),
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });

        // Activar la revelació
        requestAnimationFrame(() => {
          manifesto.classList.add("raw-soft-visible");
        });
      });
    });

    /* ESC */

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && overlay.classList.contains("is-open")) {
        closeRaw();
      }
    });
  })();

  /* ==========================================
   ABOUT ME — CARRUSEL CIRCULAR INFINIT
========================================== */

  (() => {
    const slider = document.querySelector(".about-photo-slider");
    if (!slider) return;

    const slides = [...slider.querySelectorAll(".about-slide")];
    const currentLabel = slider.querySelector(".about-current");
    const totalLabel = slider.querySelector(".about-total");

    if (!slides.length) return;

    let currentIndex = 0;
    let isAnimating = false;
    let interval = null;

    const formatNumber = (number) => String(number).padStart(2, "0");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (totalLabel) {
      totalLabel.textContent = formatNumber(slides.length);
    }

    function resetSlides() {
      slides.forEach((slide, index) => {
        slide.classList.remove(
          "is-active",
          "is-exiting",
          "is-entering",
          "is-animating",
        );

        if (index === currentIndex) {
          slide.classList.add("is-active");
        }
      });

      if (currentLabel) {
        currentLabel.textContent = formatNumber(currentIndex + 1);
      }
    }

    resetSlides();

    function nextSlide() {
      if (isAnimating || slides.length < 2) return;

      isAnimating = true;

      const previousIndex = currentIndex;
      const nextIndex = (currentIndex + 1) % slides.length;

      const previousSlide = slides[previousIndex];
      const nextSlideElement = slides[nextIndex];

      nextSlideElement.classList.remove(
        "is-active",
        "is-exiting",
        "is-entering",
        "is-animating",
      );

      previousSlide.classList.add("is-active");

      // Registrar la posició inicial
      void nextSlideElement.offsetWidth;

      previousSlide.classList.add("is-animating");
      nextSlideElement.classList.add("is-animating");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          previousSlide.classList.remove("is-active");
          previousSlide.classList.add("is-exiting");

          nextSlideElement.classList.add("is-entering");
        });
      });

      currentIndex = nextIndex;

      if (currentLabel) {
        currentLabel.textContent = formatNumber(currentIndex + 1);
      }

      const duration = reducedMotion.matches ? 20 : 1000;

      setTimeout(() => {
        resetSlides();
        isAnimating = false;
      }, duration + 50);
    }

    function startSlider() {
      if (slides.length < 2 || interval) return;

      interval = setInterval(nextSlide, 4000);
    }

    function stopSlider() {
      clearInterval(interval);
      interval = null;
    }

    startSlider();

    slider.addEventListener("mouseenter", stopSlider);
    slider.addEventListener("mouseleave", startSlider);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopSlider();
      } else {
        startSlider();
      }
    });
  })();

  /* ==========================================
   GALERIA → ABOUT ME
========================================== */

  (() => {
    const button = document.querySelector(".gallery-about-link");
    const about = document.querySelector("#about");

    if (!button || !about) return;

    button.addEventListener("click", (event) => {
      event.preventDefault();

      about.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  })();
})();

/* ==========================================
   GLOBAL — EXPLORE MORE
   SOFT IMMERSION
========================================== */

(() => {
  const selectors = [
    ".sublime-chapter",
    ".laberint-journey > section",
    ".coven-journey > section",
    ".fragile-journey > section",
    ".fashion-journey > section",
    ".ape-journey > section",
    ".summer-journey > section",
  ];

  const sections = document.querySelectorAll(selectors.join(","));

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("soft-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08,
    },
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
})();

/* ==========================================
   ABOUT + CONTACT → HOME
========================================== */

document.querySelectorAll(".back-to-home").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();

    // Tornar a la portada inicial
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  });
});


/* ==========================================
   CLAUDINE — MOBILE / PAS 1: MENU
========================================== */
(() => {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('#mobile-navigation');
  if (!toggle || !nav) return;

  function setOpen(open) {
    nav.classList.toggle('is-mobile-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tancar menú' : 'Obrir menú');
    toggle.textContent = open ? 'CLOSE ×' : 'MENU ☰';
  }

  toggle.addEventListener('click', () => {
    setOpen(!nav.classList.contains('is-mobile-open'));
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.navbar')) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setOpen(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 700) setOpen(false);
  });
})();
document.addEventListener("DOMContentLoaded", () => {
  const appMain = document.getElementById("appMain");
  const siteHeader = document.getElementById("siteHeader");
  const menuOverlay = document.getElementById("menuOverlay");
  const menuToggle = document.getElementById("menuToggle");
  const menuClose = document.getElementById("menuClose");
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  // Lightbox elements
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  let currentLightboxImages = [];
  let currentLightboxIndex = 0;
  let heroInterval = null;

  // Populate Footer Instagram Grid
  const instaGrid = document.getElementById("instaGrid");
  if (instaGrid) {
    instaGrid.innerHTML = SITE_DATA.instagram
      .map(
        (url) => `
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="insta-item">
          <img src="${url}" alt="Instagram moment" loading="lazy" />
        </a>`
      )
      .join("");
  }

  // Menu Overlay Controls
  menuToggle.addEventListener("click", () => {
    menuOverlay.classList.add("active");
    menuOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });

  function closeMenu() {
    menuOverlay.classList.remove("active");
    menuOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  menuClose.addEventListener("click", closeMenu);

  // Overlay Accordions
  document.querySelectorAll(".accordion-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      const plus = btn.querySelector(".plus-icon");
      target.classList.toggle("open");
      plus.textContent = target.classList.contains("open") ? "−" : "+";
    });
  });

  // Scroll to Top
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Header scroll appearance
  function updateHeaderState(isHome) {
    if (!isHome) {
      siteHeader.classList.remove("over-hero");
      siteHeader.classList.add("solid-light");
      return;
    }
    if (window.scrollY > window.innerHeight * 0.75) {
      siteHeader.classList.remove("over-hero");
      siteHeader.classList.add("solid-light");
    } else {
      siteHeader.classList.add("over-hero");
      siteHeader.classList.remove("solid-light");
    }
  }

  // Intersection Observer for Reveal Animations
  function initRevealObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }

  // Lightbox Logic
  function openLightbox(images, index) {
    currentLightboxImages = images;
    currentLightboxIndex = index;
    updateLightboxContent();
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function updateLightboxContent() {
    const item = currentLightboxImages[currentLightboxIndex];
    if (!item) return;
    lightboxImg.src = item.src;
    lightboxCaption.textContent = item.caption || "";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => {
    currentLightboxIndex =
      (currentLightboxIndex - 1 + currentLightboxImages.length) %
      currentLightboxImages.length;
    updateLightboxContent();
  });
  lightboxNext.addEventListener("click", () => {
    currentLightboxIndex =
      (currentLightboxIndex + 1) % currentLightboxImages.length;
    updateLightboxContent();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("active")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxPrev.click();
      if (e.key === "ArrowRight") lightboxNext.click();
    } else if (menuOverlay.classList.contains("active") && e.key === "Escape") {
      closeMenu();
    }
  });

  // Render Views
  function renderHome() {
    const selectedWorks = [
      ...SITE_DATA.categories.weddings.images.slice(0, 3),
      ...SITE_DATA.categories.engagements.images.slice(0, 3)
    ];

    appMain.innerHTML = `
      <section class="hero-section" id="heroSection">
        ${SITE_DATA.heroSlides
          .map(
            (slide, idx) => `
          <div class="hero-slide ${idx === 0 ? "active" : ""}">
            <img src="${slide.img}" alt="${slide.title}" />
            <div class="hero-overlay-content">
              <h1 class="hero-title">${slide.title}</h1>
              <p class="hero-subtitle">${slide.subtitle}</p>
            </div>
          </div>`
          )
          .join("")}
        <button class="hero-arrow prev" id="heroPrev" aria-label="Previous Slide">&#8592;</button>
        <button class="hero-arrow next" id="heroNext" aria-label="Next Slide">&#8594;</button>
      </section>

      <section class="philosophy-section reveal">
        <div class="philosophy-images">
          <img src="images/image37.jpg" alt="Editorial wedding portrait" />
          <img src="images/image38.jpg" alt="Candid couple embrace" />
        </div>
        <div class="philosophy-text">
          <p class="eyebrow">EDITORIAL & CANDID</p>
          <h2 class="section-heading">CAPTURING THE IN-BETWEEN MOMENTS</h2>
          <p class="editorial-body">
            My most favorite photos are often unstaged, unposed, and effortless. It is all about the elegance of those quiet in-between moments—that is when the real magic happens.
          </p>
          <a href="#about" class="btn-outline" data-route="about">MORE ABOUT ME</a>
        </div>
      </section>

      <section class="masonry-wrapper reveal">
        <div style="text-align:center; margin-bottom:48px;">
          <p class="eyebrow" style="margin-bottom:12px;">CURATED STORIES</p>
          <h2 class="section-heading">SELECTED WORKS</h2>
        </div>
        <div class="masonry-grid" id="homeMasonry">
          ${selectedWorks
            .map(
              (item, idx) => `
            <div class="masonry-item" data-index="${idx}">
              <img src="${item.src}" alt="${item.caption}" loading="lazy" />
            </div>`
            )
            .join("")}
        </div>
        <div class="center-cta">
          <a href="#portfolio" class="btn-charcoal" data-route="portfolio">EXPLORE FULL PORTFOLIO</a>
        </div>
      </section>

      <section class="testimonial-section reveal">
        <p class="eyebrow">KIND WORDS</p>
        <div class="testimonial-stage">
          <button class="testimonial-arrow" id="testimonialPrev" aria-label="Previous testimonial">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><polyline points="15 5 8 12 15 19"></polyline></svg>
          </button>
          <div class="testimonial-body">
            <p class="testimonial-quote" id="testimonialQuote">${SITE_DATA.testimonials[0].quote}</p>
            <p class="testimonial-author" id="testimonialAuthor">${SITE_DATA.testimonials[0].author}</p>
          </div>
          <button class="testimonial-arrow" id="testimonialNext" aria-label="Next testimonial">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><polyline points="9 5 16 12 9 19"></polyline></svg>
          </button>
        </div>
        <div class="testimonial-dots">
          ${SITE_DATA.testimonials
            .map(
              (_, i) =>
                `<button class="testimonial-dot ${i === 0 ? "active" : ""}" data-tindex="${i}" aria-label="Testimonial ${i + 1}"></button>`
            )
            .join("")}
        </div>
      </section>

      <section class="alabaster-box reveal" style="margin-bottom: 96px;">
        <p class="eyebrow">AVAILABLE FOR 2026 & 2027</p>
        <h2 class="section-heading">LET'S TELL YOUR STORY</h2>
        <p class="editorial-body" style="margin-bottom:32px;">
          Whether an intimate elopement or a timeless portrait session, I would love to hear what you are envisioning.
        </p>
        <a href="#contact" class="btn-charcoal" data-route="contact">BOOK A SESSION</a>
      </section>
    `;

    // Hero Carousel Logic
    let currentSlide = 0;
    const slides = document.querySelectorAll(".hero-slide");
    function showSlide(n) {
      slides[currentSlide].classList.remove("active");
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add("active");
    }

    document.getElementById("heroPrev").addEventListener("click", () => {
      showSlide(currentSlide - 1);
    });
    document.getElementById("heroNext").addEventListener("click", () => {
      showSlide(currentSlide + 1);
    });

    clearInterval(heroInterval);
    heroInterval = setInterval(() => showSlide(currentSlide + 1), 6500);

    // Lightbox trigger for Selected Works
    document.querySelectorAll("#homeMasonry .masonry-item").forEach((el) => {
      el.addEventListener("click", () => {
        openLightbox(selectedWorks, Number(el.dataset.index));
      });
    });

    // Testimonial switcher
    document.querySelectorAll(".testimonial-dot").forEach((dot) => {
      dot.addEventListener("click", () => {
        const idx = Number(dot.dataset.tindex);
        document.getElementById("testimonialQuote").textContent = SITE_DATA.testimonials[idx].quote;
        document.getElementById("testimonialAuthor").textContent = SITE_DATA.testimonials[idx].author;
        document.querySelectorAll(".testimonial-dot").forEach((d) => d.classList.remove("active"));
        dot.classList.add("active");
      });
    });
  }

  function renderPortfolio() {
    const cats = SITE_DATA.categories;
    appMain.innerHTML = `
      <section class="alabaster-box reveal" style="margin-top: 112px;">
        <h1 class="section-heading">MY PORTFOLIO</h1>
        <p class="eyebrow">COLLECTION OF LOVE STORIES<br/>SINCE 2014</p>
        <p class="editorial-body">
          My most favorite photos are often unstaged, unposed, and effortless. It's all about the elegance of those in-between moments, that is when the real magic happens.
        </p>
      </section>

      <section class="category-showcase">
        ${Object.keys(cats)
          .map(
            (key) => `
          <div class="category-banner-card reveal" data-route="category" data-category="${key}">
            <img src="${cats[key].cover}" alt="${cats[key].title}" loading="lazy" />
            <h2 class="category-banner-title">${cats[key].title}</h2>
          </div>`
          )
          .join("")}
      </section>
    `;
  }

  function renderCategory(categoryKey) {
    const cat = SITE_DATA.categories[categoryKey] || SITE_DATA.categories.engagements;
    appMain.innerHTML = `
      <section class="alabaster-box reveal" style="margin-top: 112px; padding: 84px 24px;">
        <h1 class="section-heading" style="margin-bottom:0;">${cat.title}</h1>
      </section>

      <section class="masonry-wrapper reveal">
        <div class="masonry-grid" id="categoryMasonry">
          ${cat.images
            .map(
              (item, idx) => `
            <div class="masonry-item" data-index="${idx}">
              <img src="${item.src}" alt="${item.caption}" loading="lazy" />
            </div>`
            )
            .join("")}
        </div>

        <div class="center-cta">
          <a href="#contact" class="btn-charcoal" data-route="contact">BOOK A SESSION</a>
        </div>
      </section>
    `;

    document.querySelectorAll("#categoryMasonry .masonry-item").forEach((el) => {
      el.addEventListener("click", () => {
        openLightbox(cat.images, Number(el.dataset.index));
      });
    });
  }

  function renderAbout() {
    appMain.innerHTML = `
      <section class="about-grid reveal">
        <div class="about-portrait">
          <img src="images/image39.jpg" alt="Photographer portrait" />
        </div>
        <div>
          <p class="eyebrow" style="margin-bottom:14px;">BEHIND THE LENS</p>
          <h1 class="section-heading" style="margin-bottom:24px;">HELLO, I'M NINUJA</h1>
          <p class="editorial-body" style="margin-bottom:20px;">
            Based in Sri Lanka, I specialize in modern portrait, wedding, and storytelling photography rooted in human connection and quiet emotion.
          </p>
          <p class="editorial-body" style="margin-bottom:32px;">
            Inspired by editorial fashion, natural shadows, and slow visual narratives, my goal is to create photographs that feel timeless decades from now.
          </p>
          <a href="#contact" class="btn-charcoal" data-route="contact">GET IN TOUCH</a>
        </div>
      </section>
    `;
  }

  function renderBlog() {
    appMain.innerHTML = `
      <section class="alabaster-box reveal" style="margin-top: 112px;">
        <h1 class="section-heading">JOURNAL</h1>
        <p class="eyebrow" style="margin-bottom:0;">STORIES, NOTES & RECENT SESSIONS</p>
      </section>

      <section class="blog-grid reveal">
        ${SITE_DATA.blogs
          .map(
            (post) => `
          <article class="blog-card">
            <img src="${post.img}" alt="${post.title}" loading="lazy" />
            <p class="eyebrow">${post.date}</p>
            <h3>${post.title}</h3>
            <p class="editorial-body">${post.excerpt}</p>
          </article>`
          )
          .join("")}
      </section>
    `;
  }

  function renderInfo() {
    appMain.innerHTML = `
      <section class="alabaster-box reveal" style="margin-top: 112px;">
        <h1 class="section-heading">EXPERIENCE & INFO</h1>
        <p class="eyebrow" style="margin-bottom:0;">FREQUENTLY ASKED QUESTIONS</p>
      </section>

      <section class="faq-container reveal">
        ${SITE_DATA.faqs
          .map(
            (faq) => `
          <div class="faq-item">
            <button class="faq-question">
              <span>${faq.q}</span>
              <span class="faq-plus">+</span>
            </button>
            <div class="faq-answer">
              <p class="editorial-body">${faq.a}</p>
            </div>
          </div>`
          )
          .join("")}
        <div class="center-cta">
          <a href="#contact" class="btn-charcoal" data-route="contact">INQUIRE FOR RATES</a>
        </div>
      </section>
    `;

    document.querySelectorAll(".faq-item").forEach((item) => {
      item.querySelector(".faq-question").addEventListener("click", () => {
        item.classList.toggle("open");
        item.querySelector(".faq-plus").textContent = item.classList.contains("open") ? "−" : "+";
      });
    });
  }

  function renderContact() {
    appMain.innerHTML = `
      <section class="alabaster-box reveal" style="margin-top: 112px;">
        <h1 class="section-heading">CONTACT</h1>
        <p class="eyebrow">INQUIRE ABOUT YOUR DATE</p>
        <p class="editorial-body">
          Fill out the details below and connect directly via WhatsApp or Email.
        </p>
      </section>

      <section class="contact-wrapper reveal">
        <form id="contactForm">
          <div class="form-group">
            <label for="contactName">YOUR NAME</label>
            <input type="text" id="contactName" class="form-input" placeholder="Jane Doe" required />
          </div>
          <div class="form-group">
            <label for="contactEmail">EMAIL ADDRESS</label>
            <input type="email" id="contactEmail" class="form-input" placeholder="jane@example.com" required />
          </div>
          <div class="form-group">
            <label for="contactType">SESSION TYPE & DATE</label>
            <input type="text" id="contactType" class="form-input" placeholder="Wedding / Engagement / Portrait — Date & Location" />
          </div>
          <div class="form-group">
            <label for="contactMessage">TELL ME ABOUT YOUR STORY</label>
            <textarea id="contactMessage" rows="4" class="form-input" placeholder="Share your vision, location, and details..." required></textarea>
          </div>

          <div class="contact-actions">
            <button type="button" id="whatsappSendBtn" class="btn-charcoal">SEND VIA WHATSAPP</button>
            <button type="button" id="emailSendBtn" class="btn-outline">SEND VIA EMAIL</button>
          </div>
        </form>
      </section>
    `;

    // Direct WhatsApp Connection
    document.getElementById("whatsappSendBtn").addEventListener("click", () => {
      const name = document.getElementById("contactName").value.trim();
      const email = document.getElementById("contactEmail").value.trim();
      const type = document.getElementById("contactType").value.trim();
      const message = document.getElementById("contactMessage").value.trim();

      const text =
        `Hello! I would like to inquire about a photography session:
` +
        (name ? `Name: ${name}
` : "") +
        (email ? `Email: ${email}
` : "") +
        (type ? `Session / Date: ${type}
` : "") +
        (message ? `Details: ${message}` : "");

      const waUrl = `https://wa.me/${SITE_DATA.contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    });

    // Direct Email Connection
    document.getElementById("emailSendBtn").addEventListener("click", () => {
      const name = document.getElementById("contactName").value.trim();
      const email = document.getElementById("contactEmail").value.trim();
      const type = document.getElementById("contactType").value.trim();
      const message = document.getElementById("contactMessage").value.trim();

      const subject = encodeURIComponent(`Photography Inquiry${name ? ` — ${name}` : ""}`);
      const body = encodeURIComponent(
        (name ? `Name: ${name}
` : "") +
        (email ? `Email: ${email}
` : "") +
        (type ? `Session / Date: ${type}

` : "\n") +
        message
      );

      window.location.href = `mailto:${SITE_DATA.contact.emailAddress}?subject=${subject}&body=${body}`;
    });
  }

  // Router
  function navigateTo(route, category = null) {
    clearInterval(heroInterval);
    closeMenu();
    window.scrollTo({ top: 0, behavior: "instant" });

    if (route === "portfolio") {
      renderPortfolio();
      updateHeaderState(false);
    } else if (route === "category") {
      renderCategory(category);
      updateHeaderState(false);
    } else if (route === "about") {
      renderAbout();
      updateHeaderState(false);
    } else if (route === "blog") {
      renderBlog();
      updateHeaderState(false);
    } else if (route === "info") {
      renderInfo();
      updateHeaderState(false);
    } else if (route === "contact") {
      renderContact();
      updateHeaderState(false);
    } else {
      renderHome();
      updateHeaderState(true);
    }

    initRevealObserver();
  }

  // Global Route Link Delegation
  document.addEventListener("click", (e) => {
    const routeTrigger = e.target.closest("[data-route]");
    if (routeTrigger) {
      e.preventDefault();
      const route = routeTrigger.dataset.route;
      const category = routeTrigger.dataset.category || null;
      navigateTo(route, category);
    }
  });

  window.addEventListener("scroll", () => {
    const isHome = Boolean(document.getElementById("heroSection"));
    updateHeaderState(isHome);
  });

  // Initial Load
  navigateTo("home");
});


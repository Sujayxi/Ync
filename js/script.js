document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const desktopSwitch = document.getElementById('themeSwitch');
  const mobileSwitch = document.getElementById('themeSwitchMobile');
  const splashScreen = document.querySelector('.splash-screen');
  const mainContent = document.querySelector('.main-content');
  const navLinks = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.hamburger');
  const serviceSection = document.querySelector(".service-cards-horizontal");

  // Splash screen handling
  if (splashScreen && mainContent) {
    setTimeout(() => {
      splashScreen.classList.add('fade-out');
      mainContent.classList.add('show');
      body.classList.remove('loading');

      setTimeout(() => {
        splashScreen.remove();
      }, 1000);
    }, 5000);
  }

  // Helpers to set background per theme on toggle (play once)
  const frameImages = [
    'ezgif-split/ezgif-frame-001.jpg',
    'ezgif-split/ezgif-frame-002.jpg',
    'ezgif-split/ezgif-frame-003.jpg',
    'ezgif-split/ezgif-frame-004.jpg',
    'ezgif-split/ezgif-frame-005.jpg',
    'ezgif-split/ezgif-frame-006.jpg',
    'ezgif-split/ezgif-frame-007.jpg',
    'ezgif-split/ezgif-frame-008.jpg',
    'ezgif-split/ezgif-frame-009.jpg',
    'ezgif-split/ezgif-frame-010.jpg',
    'ezgif-split/ezgif-frame-011.jpg',
    'ezgif-split/ezgif-frame-012.jpg',
    'ezgif-split/ezgif-frame-013.jpg',
    'ezgif-split/ezgif-frame-014.jpg',
  ];

  // Preload all frame images for smooth animation, show loader until done
  const loader = document.getElementById('preload-loader');
  if (desktopSwitch) desktopSwitch.disabled = true;
  if (mobileSwitch) mobileSwitch.disabled = true;
  let loadedCount = 0;
  const totalImages = frameImages.length;
  frameImages.forEach(src => {
    const img = new Image();
    img.onload = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        if (loader) loader.style.display = 'none';
        if (desktopSwitch) desktopSwitch.disabled = false;
        if (mobileSwitch) mobileSwitch.disabled = false;
      }
    };
    img.onerror = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        if (loader) loader.style.display = 'none';
        if (desktopSwitch) desktopSwitch.disabled = false;
        if (mobileSwitch) mobileSwitch.disabled = false;
      }
    };
    img.src = src;
  });

  function animateBackground(frames, callback) {
    let i = 0;
    function nextFrame() {
      if (i < frames.length) {
        body.style.backgroundImage = `url('${frames[i]}')`;
        i++;
        setTimeout(nextFrame, 1000 / 24);
      } else if (callback) {
        callback();
      }
    }
    nextFrame();
  }

  function setDarkThemeMedia() {
    // Animate reverse (light to dark)
    animateBackground([...frameImages].reverse(), () => {
      body.style.backgroundImage = `url('${frameImages[0]}')`;
    });
  }

  function setLightThemeMedia() {
    // Animate forward (dark to light)
    animateBackground(frameImages, () => {
      body.style.backgroundImage = `url('${frameImages[frameImages.length - 1]}')`;
    });
  }

  // Init helpers: set background only, do not animate
  function setDarkBackgroundOnly() {
    body.style.backgroundImage = `url('${frameImages[0]}')`;
  }

  function setLightBackgroundOnly() {
    body.style.backgroundImage = `url('${frameImages[frameImages.length - 1]}')`;
  }

  // Theme setup: always default to dark on new visit
  body.classList.remove('theme-light');
  if (desktopSwitch) desktopSwitch.checked = false;
  if (mobileSwitch) mobileSwitch.checked = false;
  setDarkBackgroundOnly();

  function applyTheme(isLight) {
    if (isLight) {
      body.classList.add('theme-light');
      setLightThemeMedia();
    } else {
      body.classList.remove('theme-light');
      setDarkThemeMedia();
    }
  }

  function syncSwitches(checked) {
    if (desktopSwitch) desktopSwitch.checked = checked;
    if (mobileSwitch) mobileSwitch.checked = checked;
  }

  if (desktopSwitch) {
    desktopSwitch.addEventListener('change', (e) => {
      applyTheme(e.target.checked);
      syncSwitches(e.target.checked);
    });
  }
  if (mobileSwitch) {
    mobileSwitch.addEventListener('change', (e) => {
      applyTheme(e.target.checked);
      syncSwitches(e.target.checked);
    });
  }

  function toggleMenu() {
    const navLinksElement = document.querySelector('.nav-links');
    if (navLinksElement) {
      navLinksElement.classList.toggle('open');
    }
  }
  

  // --- Offset Smooth Scroll for Nav Links and CTA Button (accounts for fixed navbar) ---
  document.querySelectorAll("nav a, .cta-button").forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const href = this.getAttribute("href");
      if (href && href.startsWith("#")) {
        const targetSection = document.querySelector(href);
        if (targetSection) {
          e.preventDefault();
          // Get navbar height (fixed, visible one)
          const navbar = document.querySelector('header .navbar');
          const navHeight = navbar ? navbar.offsetHeight : 0;
          // Get section's top relative to document
          const sectionTop = targetSection.getBoundingClientRect().top + window.pageYOffset;
          // Scroll so section appears just below navbar
          window.scrollTo({
            top: sectionTop - navHeight,
            behavior: "smooth"
          });
        }
      }
      // Close the menu if a link is clicked (for mobile)
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
      }
    });
  });

  // Toggle mobile navbar
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Gallery image hover effect
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * 20;
      const rotateY = (x - centerX) / centerX * 20;
      item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });

  // Smooth horizontal scroll in services section
  let scrollInterval;
  const scrollSpeed = 5; // Adjust speed for smoothness
  const scrollBoundary = 50; // Pixels from edge to trigger scrolling

  if (serviceSection) {
    serviceSection.addEventListener("mousemove", (e) => {
      const rect = serviceSection.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;

      clearInterval(scrollInterval); // Stop any existing scroll

      // Smooth scroll left if near the left edge
      if (mouseX < scrollBoundary) {
        scrollInterval = setInterval(() => {
          serviceSection.scrollLeft -= scrollSpeed;
          if (serviceSection.scrollLeft <= 0) clearInterval(scrollInterval); // Stop at beginning
        }, 10);
      }

      // Smooth scroll right if near the right edge
      else if (mouseX > rect.width - scrollBoundary) {
        scrollInterval = setInterval(() => {
          serviceSection.scrollLeft += scrollSpeed;
          if (serviceSection.scrollLeft + rect.width >= serviceSection.scrollWidth) {
            clearInterval(scrollInterval); // Stop at end
          }
        }, 10);
      }
    });

    // Stop scrolling when mouse leaves the section
    serviceSection.addEventListener("mouseleave", () => {
      clearInterval(scrollInterval);
    });
  }

  // Image Gallery Modal
  document.addEventListener('DOMContentLoaded', function() {
    const modal = document.querySelector('.image-modal');
    const modalImg = document.getElementById('expandedImg');
    const closeBtn = document.querySelector('.close-modal');
    const galleryCards = document.querySelectorAll('.gallery-card');

    galleryCards.forEach(card => {
      card.addEventListener('click', function() {
        const img = this.querySelector('.gallery-item');
        modal.classList.add('active');
        modalImg.src = img.src;
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
      });
    });

    // Close modal when clicking the close button
    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
    }
  });

  // --- Gallery Card Zoom Feature ---
  const zoomOverlay = document.getElementById('zoom-overlay');
  document.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('click', function(e) {
      // Prevent triggering the old modal
      e.stopPropagation();
      const img = card.querySelector('img');
      if (!img || !zoomOverlay) return;
      // Build zoomed card
      zoomOverlay.innerHTML = '';
      const zoomedCard = document.createElement('div');
      zoomedCard.className = 'zoomed-card';
      const zoomedImg = document.createElement('img');
      zoomedImg.src = img.src;
      zoomedImg.alt = img.alt || '';
      zoomedCard.appendChild(zoomedImg);
      // Add close button
      const closeBtn = document.createElement('button');
      closeBtn.className = 'zoom-close';
      closeBtn.innerHTML = '&times;';
      closeBtn.onclick = closeZoom;
      zoomedCard.appendChild(closeBtn);
      zoomOverlay.appendChild(zoomedCard);
      zoomOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Close on overlay click (not on card)
      zoomOverlay.onclick = function(ev) {
        if (ev.target === zoomOverlay) closeZoom();
      };
      // Close on ESC
      document.addEventListener('keydown', escZoom, { once: true });
    });
  });
  function closeZoom() {
    if (zoomOverlay) zoomOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  function escZoom(e) {
    if (e.key === 'Escape') closeZoom();
  }
});

// Form submission handling with null check
const form = document.querySelector("form");
if (form) {
  const submitWrapper = document.querySelector('.btn-submit-wrapper');
  const submitButton = submitWrapper ? submitWrapper.querySelector('button[type="submit"]') : null;
  const tickOverlay = submitWrapper ? submitWrapper.querySelector('.tick-overlay') : null;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.classList.add('disabled');
    }

    var formData = new FormData(this);
    var phone = document.getElementById('phone');
    if (phone && phone.value.trim()) {
      var originalMessage = formData.get('entry.1194294917') || '';
      formData.set('entry.1194294917', originalMessage + "\n\nPhone: " + phone.value.trim());
    }
    fetch(this.action, {
      method: "POST",
      body: formData,
      mode: "no-cors"
    }).then(() => {
      if (tickOverlay && submitButton) {
        tickOverlay.classList.add('show');
        submitButton.classList.add('btn-tick');
      }
      setTimeout(() => {
        if (tickOverlay) tickOverlay.classList.remove('show');
        if (submitButton) {
          submitButton.classList.remove('btn-tick', 'disabled');
          submitButton.disabled = false;
        }
        form.reset();
      }, 1400);
    }).catch(() => {
      if (submitButton) {
        submitButton.classList.add('btn-error');
        setTimeout(() => submitButton.classList.remove('btn-error'), 1200);
        submitButton.disabled = false;
        submitButton.classList.remove('disabled');
      }
    });
  });
}

// Marquee functionality - removed as it references non-existent elements
// The tech stack is now handled by CSS animations in the HTML

// Carousel functionality - removed as it references non-existent elements
// The tech stack slider is now handled by CSS animations in the HTML

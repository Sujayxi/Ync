document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const desktopSwitch = document.getElementById('themeSwitch');
  const mobileSwitch = document.getElementById('themeSwitchMobile');
  const bgVideo = document.getElementById('bgVideo');
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

  // Helpers to set background and video per theme on toggle (play once)
  function setDarkThemeMedia() {
    // Background image: frame-1.png
    body.style.backgroundImage = "url('frame-1.png')";
    // Video: frat1.mp4 when toggling to dark
    if (bgVideo) {
      const desiredSrc = 'frat1.mp4';
      bgVideo.loop = false;
      bgVideo.autoplay = false;
      bgVideo.onended = () => {
        try { bgVideo.pause(); } catch(e) {}
        bgVideo.removeAttribute('src');
        bgVideo.style.display = 'none';
        try { bgVideo.load(); } catch(e) {}
      };
      if (!bgVideo.currentSrc || bgVideo.currentSrc.indexOf(desiredSrc) === -1) {
        bgVideo.src = desiredSrc;
      }
      try { bgVideo.currentTime = 0; } catch(e) {}
      bgVideo.style.display = '';
      bgVideo.load();
      bgVideo.play().catch(() => {});
    }
  }

  function setLightThemeMedia() {
    // Background image: 2.png
    body.style.backgroundImage = "url('2.png')";
    // Video: frat.mp4 when toggling to light
    if (bgVideo) {
      const desiredSrc = 'frat.mp4';
      bgVideo.loop = false;
      bgVideo.autoplay = false;
      bgVideo.onended = () => {
        // Fade out to reveal 2.png underneath
        bgVideo.style.opacity = '0';
        setTimeout(() => {
          try { bgVideo.pause(); } catch(e) {}
          bgVideo.removeAttribute('src');
          bgVideo.style.display = 'none';
          bgVideo.style.opacity = '';
          try { bgVideo.load(); } catch(e) {}
        }, 300);
      };
      if (!bgVideo.currentSrc || bgVideo.currentSrc.indexOf(desiredSrc) === -1) {
        bgVideo.src = desiredSrc;
      }
      try { bgVideo.currentTime = 0; } catch(e) {}
      bgVideo.style.display = '';
      bgVideo.style.opacity = '1';
      bgVideo.load();
      bgVideo.play().catch(() => {});
    }
  }

  // Init helpers: set background only, do not play
  function setDarkBackgroundOnly() {
    body.style.backgroundImage = "url('frame-1.png')";
    if (bgVideo) {
      bgVideo.pause();
      bgVideo.removeAttribute('src');
      bgVideo.style.display = 'none';
      try { bgVideo.load(); } catch(e) {}
    }
  }

  function setLightBackgroundOnly() {
    body.style.backgroundImage = "url('2.png')";
    if (bgVideo) {
      bgVideo.pause();
      bgVideo.removeAttribute('src');
      bgVideo.style.display = 'none';
      try { bgVideo.load(); } catch(e) {}
    }
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
  

  // Smooth scroll function
  function smoothScroll(target, duration) {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }

  // Add smooth scroll to all navigation links
  document.querySelectorAll("nav a, .cta-button").forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const targetSection = document.querySelector(this.getAttribute("href"));
      if (targetSection) {
        const duration = this.classList.contains('cta-button') ? 2000 : 1000;
        smoothScroll(targetSection, duration);
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

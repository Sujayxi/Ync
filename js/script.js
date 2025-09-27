document.addEventListener('DOMContentLoaded', () => {
  // --- Initial DOM Selections ---
  const body = document.body;
  const desktopSwitch = document.getElementById('themeSwitch');
  const mobileSwitch = document.getElementById('themeSwitchMobile');
  const splashScreen = document.querySelector('.splash-screen');
  const mainContent = document.querySelector('.main-content');
  const hamburger = document.querySelector('.hamburger'); // Used for mobile menu toggle
  const mobileMenuCheckbox = document.getElementById('mobileMenuToggle'); // Checkbox for the mobile menu
  const serviceSection = document.querySelector(".service-cards-horizontal");
  const loader = document.getElementById('preload-loader');
  
  // --- Animation Constants & Variables ---
  const FRAME_RATE = 24; // Desired playback FPS (can be up to 60)
  const FRAME_DURATION = 1000 / FRAME_RATE; // Time budget per frame in milliseconds (e.g., 33.33ms)
  
  // List of image paths (no change)
  const frameImagesPaths = [
      'ezgif-split/ezgif-frame-001.jpg',
      'ezgif-split/ezgif-frame-002.jpg',
      'ezgif-split/ezgif-frame-003.jpg',
      'ezgif-split/ezgif-frame-004.jpg',
      'ezgif-split/ezgif-frame-005.jpg',
      'ezgif-split/ezgif-frame-006.jpg',
      'ezgif-split/ezgif-frame-007.jpg',
      'ezgif-split/ezgif-frame-008.jpg',
      'ezgif-split/ezgif-frame-009.jpg',
      'ezgif-split/ezgif-frame-0010.jpg',
      'ezgif-split/ezgif-frame-0011.jpg',
      'ezgif-split/ezgif-frame-0012.jpg',
      'ezgif-split/ezgif-frame-0013.jpg',
      'ezgif-split/ezgif-frame-0014.jpg',
  ];
  
  // NEW: Array to store the preloaded Image objects (critical for speed)
  const loadedImages = []; 

  // Variable to cancel any running animation sequence
  let currentAnimationId = null; 

  // --- 1. Preload Logic (Modified to store Image objects) ---

  if (desktopSwitch) desktopSwitch.disabled = true;
  if (mobileSwitch) mobileSwitch.disabled = true;
  let loadedCount = 0;
  const totalImages = frameImagesPaths.length;
  
  frameImagesPaths.forEach(src => {
      const img = new Image();
      img.onload = img.onerror = () => { // Handle both success and error as 'loaded'
          loadedCount++;
          if (img.complete) { // Only store if successfully loaded (complete)
              loadedImages.push(img);
          }
          
          if (loadedCount === totalImages) {
              // Ensure the loadedImages array is sorted by frame number (since preloading is asynchronous)
              loadedImages.sort((a, b) => {
                  const numA = parseInt(a.src.match(/frame-(\d+)\.jpg/)[1]);
                  const numB = parseInt(b.src.match(/frame-(\d+)\.jpg/)[1]);
                  return numA - numB;
              });

              if (loader) loader.style.display = 'none';
              if (desktopSwitch) desktopSwitch.disabled = false;
              if (mobileSwitch) mobileSwitch.disabled = false;
              
              // Initial theme setup (must happen AFTER loading)
              body.classList.remove('theme-light');
              if (desktopSwitch) desktopSwitch.checked = false;
              if (mobileSwitch) mobileSwitch.checked = false;
              setDarkBackgroundOnly(); 
          }
      };
      img.src = src;
  });


  // --- 2. Lag-Free Animation Function (Using requestAnimationFrame) ---

  /**
   * Plays a sequence of preloaded images using rAF for smooth timing.
   * @param {Image[]} frames - Array of preloaded Image objects.
   * @param {function} callback - Function to run when the animation completes.
   */
  function animateBackground(frames, callback) {
      if (currentAnimationId) {
          cancelAnimationFrame(currentAnimationId);
      }

      let i = 0;
      let lastTimestamp = 0;

      function nextFrame(timestamp) {
          // Check if enough time has passed based on the FRAME_DURATION
          if (timestamp >= lastTimestamp + FRAME_DURATION) {
              lastTimestamp = timestamp; // Reset the timer

              if (i < frames.length) {
                  // Critical: Use the preloaded Image object's source
                  body.style.backgroundImage = `url('${frames[i].src}')`; 
                  i++;
              } else {
                  // Animation complete
                  if (callback) callback();
                  return; // Stop the rAF loop
              }
          }
          // Request the next frame regardless of whether an image was swapped this time
          currentAnimationId = requestAnimationFrame(nextFrame);
      }

      currentAnimationId = requestAnimationFrame(nextFrame); // Start the loop
  }


 // ... (rest of the file remains the same until Theme Toggle Functions)

    // --- 3. Theme Toggle Functions (Corrected Final Background) ---

    // Sets the background using the animation sequence (light to dark)
    function setDarkThemeMedia() {
      const reversedFrames = [...loadedImages].reverse(); // Animate reverse (light to dark)
      animateBackground(reversedFrames, () => {
          // When animation finishes, set the final frame (frame 001) as the static dark background
          if (loadedImages.length > 0) {
              // The first loaded image (index 0) is the final dark theme frame (001)
              body.style.backgroundImage = `url('${loadedImages[0].src}')`; 
          }
      });
  }

  // Sets the background using the animation sequence (dark to light)
  function setLightThemeMedia() {
      // Animate forward (dark to light)
      animateBackground(loadedImages, () => {
          // *** CORRECTION HERE ***
          // When animation finishes, set the final frame (frame 014) as the static light background
          if (loadedImages.length > 0) {
              const finalLightFrame = loadedImages[loadedImages.length - 1]; // This is frame 014
              body.style.backgroundImage = `url('${finalLightFrame.src}')`;
          }
      });
  }

  // Init helpers: set background only, do not animate (used for initial load)
  function setDarkBackgroundOnly() {
      if (loadedImages.length > 0) {
           // Dark theme is frame 001 (index 0)
          body.style.backgroundImage = `url('${loadedImages[0].src}')`;
      }
  }

  // Init helpers: set background only, do not animate
  function setLightBackgroundOnly() {
      // *** CORRECTION HERE ***
      if (loadedImages.length > 0) {
          // Light theme is frame 014 (last index)
          const finalLightFrame = loadedImages[loadedImages.length - 1];
          body.style.backgroundImage = `url('${finalLightFrame.src}')`;
      }
  }
// ... (rest of the file remains the same)

  // --- 4. Theme Application & Switch Logic ---

  function applyTheme(isLight) {
      // Stop any running animation before starting a new one
      if (currentAnimationId) {
          cancelAnimationFrame(currentAnimationId);
          currentAnimationId = null;
      }

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

  // --- 5. Existing Code Blocks (Copied from your original JS) ---

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
  
  // Toggle mobile menu (Using the checkbox logic from your HTML)
  if (mobileMenuCheckbox) {
      mobileMenuCheckbox.addEventListener('change', (e) => {
          if (e.target.checked) {
              // Prevent scrolling when menu is open
              document.body.style.overflow = 'hidden'; 
          } else {
              document.body.style.overflow = '';
          }
      });
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
          if (mobileMenuCheckbox && mobileMenuCheckbox.checked) {
              mobileMenuCheckbox.checked = false;
              document.body.style.overflow = '';
          }
      });
  });

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

  // Smooth horizontal scroll in services section (Uses setInterval, which is acceptable here)
  let scrollInterval;
  const scrollSpeed = 5; 
  const scrollBoundary = 50; 

  if (serviceSection) {
      serviceSection.addEventListener("mousemove", (e) => {
          const rect = serviceSection.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;

          clearInterval(scrollInterval); 

          if (mouseX < scrollBoundary) {
              scrollInterval = setInterval(() => {
                  serviceSection.scrollLeft -= scrollSpeed;
                  if (serviceSection.scrollLeft <= 0) clearInterval(scrollInterval); 
              }, 10);
          }

          else if (mouseX > rect.width - scrollBoundary) {
              scrollInterval = setInterval(() => {
                  serviceSection.scrollLeft += scrollSpeed;
                  if (serviceSection.scrollLeft + rect.width >= serviceSection.scrollWidth) {
                      clearInterval(scrollInterval); 
                  }
              }, 10);
          }
      });

      serviceSection.addEventListener("mouseleave", () => {
          clearInterval(scrollInterval);
      });
  }

  // Image Gallery Modal (Original logic cleanup)
  const modal = document.querySelector('.image-modal');
  const modalImg = document.getElementById('expandedImg');
  const closeBtn = document.querySelector('.close-modal');
  const galleryCards = document.querySelectorAll('.gallery-card');

  function closeModal() {
      if (modal) modal.classList.remove('active');
      document.body.style.overflow = ''; 
      document.removeEventListener('keydown', escCloseModal);
  }
  function escCloseModal(e) {
      if (e.key === 'Escape') closeModal();
  }

  galleryCards.forEach(card => {
      card.addEventListener('click', function() {
          const img = this.querySelector('.gallery-item');
          if (modal) modal.classList.add('active');
          if (modalImg) modalImg.src = img.src;
          document.body.style.overflow = 'hidden'; 
          document.addEventListener('keydown', escCloseModal, { once: true });
      });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
      modal.addEventListener('click', function(e) {
          if (e.target === modal) closeModal();
      });
  }

  // --- Gallery Card Zoom Feature (Replaces old modal logic) ---
  const zoomOverlay = document.getElementById('zoom-overlay');
  function closeZoom() {
      if (zoomOverlay) zoomOverlay.classList.remove('active');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', escZoom);
  }
  function escZoom(e) {
      if (e.key === 'Escape') closeZoom();
  }
  
  document.querySelectorAll('.gallery-card').forEach(card => {
      card.addEventListener('click', function(e) {
          e.stopPropagation(); // Stop propagation for the old modal
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
});

// --- Form submission handling with null check (Outside DOMContentLoaded) ---
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
      // Corrected element ID usage based on your HTML (you have no 'phone' ID, using entry.1251248798's input)
      var phoneInput = this.querySelector('input[name="entry.1251248798"]'); 
      
      // This is complex logic to consolidate phone into the message field, usually not needed with GForms.
      // Assuming your GForm handles fields correctly, but keeping your original intent to merge:
      if (phoneInput && phoneInput.value.trim()) {
          // Find the message field by its name (entry.893908689)
          var messageInput = this.querySelector('textarea[name="entry.893908689"]');
          var originalMessage = messageInput ? messageInput.value : '';
          if (messageInput) {
               // Append phone to message field value on submission, but reset afterwards.
               messageInput.value = originalMessage + "\n\nPhone: " + phoneInput.value.trim();
          }
      }
      
      // The Google Form URL already handles the data collection
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
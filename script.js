/**
 * ApexDigital - Interactive Landing Page Logic
 * Features: Dark/Light Mode, Mobile Menu, Active Scrollspy,
 * Animated Stats, Interactive Card Glow, Form Validation & Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Dynamic Year in Footer
  // -------------------------------------------------------------------------
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------------------
  // 2. Theme Toggle (Dark / Light Mode)
  // -------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('apex_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('apex_theme', newTheme);
    });
  }

  // -------------------------------------------------------------------------
  // 3. Header Scroll Effect & Back-to-Top Visibility
  // -------------------------------------------------------------------------
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header background change
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // -------------------------------------------------------------------------
  // 4. Mobile Navigation Toggle
  // -------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMobileMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburgerBtn.classList.toggle('active');
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
  };

  const closeMobileMenu = () => {
    if (navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  };

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);

    // Close when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    });
  }

  // -------------------------------------------------------------------------
  // 5. Active Link Scrollspy
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const updateActiveNavLink = () => {
    const scrollY = window.scrollY + 120; // Offset for header

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // -------------------------------------------------------------------------
  // 6. Animated Counter (About Section Stats)
  // -------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // EaseOutQuart easing function
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(easeOut * target);

        stat.textContent = currentValue;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = target;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  // IntersectionObserver for Stats
  const statsSection = document.querySelector('.about-stats-grid');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  // -------------------------------------------------------------------------
  // 7. Interactive Feature Cards Mouse Glow Effect
  // -------------------------------------------------------------------------
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // -------------------------------------------------------------------------
  // 8. Contact Form Validation & Toast Notification
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('contact-submit-btn');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  const toast = document.getElementById('toast-notification');
  const toastCloseBtn = document.getElementById('toast-close-btn');
  let toastTimeout;

  const showToast = (title, message) => {
    if (!toast) return;
    const titleEl = document.getElementById('toast-title');
    const msgEl = document.getElementById('toast-message');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 5000);
  };

  if (toastCloseBtn) {
    toastCloseBtn.addEventListener('click', () => {
      toast.classList.remove('show');
    });
  }

  // Real-time error clearance
  const clearError = (input, errorEl) => {
    input.classList.remove('is-invalid');
    if (errorEl) errorEl.textContent = '';
  };

  const setError = (input, errorEl, msg) => {
    input.classList.add('is-invalid');
    if (errorEl) errorEl.textContent = msg;
  };

  if (nameInput) nameInput.addEventListener('input', () => clearError(nameInput, nameError));
  if (emailInput) emailInput.addEventListener('input', () => clearError(emailInput, emailError));
  if (messageInput) messageInput.addEventListener('input', () => clearError(messageInput, messageError));

  // Email format check helper
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        setError(nameInput, nameError, 'გთხოვთ მიუთითოთ სახელი');
        isValid = false;
      } else if (nameInput.value.trim().length < 2) {
        setError(nameInput, nameError, 'სახელი უნდა შედგებოდეს მინიმუმ 2 სიმბოლოსგან');
        isValid = false;
      } else {
        clearError(nameInput, nameError);
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        setError(emailInput, emailError, 'გთხოვთ მიუთითოთ ელ-ფოსტის მისამართი');
        isValid = false;
      } else if (!isValidEmail(emailInput.value.trim())) {
        setError(emailInput, emailError, 'გთხოვთ შეიყვანოთ სწორი ელ-ფოსტის ფორმატი');
        isValid = false;
      } else {
        clearError(emailInput, emailError);
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        setError(messageInput, messageError, 'გთხოვთ დაწეროთ შეტყობინება');
        isValid = false;
      } else if (messageInput.value.trim().length < 8) {
        setError(messageInput, messageError, 'შეტყობინება უნდა შედგებოდეს მინიმუმ 8 სიმბოლოსგან');
        isValid = false;
      } else {
        clearError(messageInput, messageError);
      }

      if (!isValid) return;

      // Simulate sending with loading spinner
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        // Show Toast Notification
        showToast('შეტყობინება გაიგზავნა!', 'გმადლობთ დაკავშირებისთვის, ჩვენი გუნდი მალე გიპასუხებთ.');

        // Reset Form
        contactForm.reset();
      }, 1200);
    });
  }
});

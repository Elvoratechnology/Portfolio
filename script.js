/**
 * May Pearl J. Impas - Personal Portfolio Website
 * Cinematic UI/UX Interactions (Aimee Rose Style)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Sticky Navigation & Scroll Spy ---
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-item a, .mobile-nav-list a, .nav-cta-btn');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ScrollSpy with IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-25% 0px -65% 0px',
    threshold: 0
  };

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => scrollSpyObserver.observe(sec));

  // --- Mobile Drawer Navigation ---
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNav = document.getElementById('mobileNav');

  const toggleMobileNav = () => {
    const isOpen = mobileToggle.classList.toggle('open');
    mobileNav.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMobileNav = () => {
    if (!mobileToggle) return;
    mobileToggle.classList.remove('open');
    mobileNav.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileNav);
  }

  document.querySelectorAll('.mobile-nav-list a').forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  // --- Story Inline Expand / Collapse ---
  const toggleStoryBtn = document.getElementById('toggleStoryBtn');
  const inlineStoryBody = document.getElementById('inlineStoryBody');

  if (toggleStoryBtn && inlineStoryBody) {
    toggleStoryBtn.addEventListener('click', () => {
      const isExpanded = inlineStoryBody.classList.toggle('expanded');
      toggleStoryBtn.innerHTML = isExpanded
        ? `<span>Collapse Story</span> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>`
        : `<span>Read Full Story Inline</span> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>`;
    });
  }

  // --- Story Modal Reader ---
  const openReaderModalBtn = document.getElementById('openReaderModalBtn');
  const storyModal = document.getElementById('storyModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  const openModal = () => {
    if (!storyModal) return;
    storyModal.classList.add('open');
    storyModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!storyModal) return;
    storyModal.classList.remove('open');
    storyModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (openReaderModalBtn) {
    openReaderModalBtn.addEventListener('click', openModal);
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (storyModal) {
    storyModal.addEventListener('click', (e) => {
      if (e.target === storyModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileNav();
      closeModal();
    }
  });

  // --- Blog Post Expand / Collapse ---
  const toggleBlogBtn = document.getElementById('toggleBlogBtn');
  const blogFullPost = document.getElementById('blogFullPost');

  if (toggleBlogBtn && blogFullPost) {
    toggleBlogBtn.addEventListener('click', () => {
      const isExpanded = blogFullPost.classList.toggle('expanded');
      toggleBlogBtn.innerHTML = isExpanded
        ? `<span>Show Less</span> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>`
        : `<span>Read Complete Post</span> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`;
    });
  }

  // Share Blog Link
  const shareBlogBtn = document.getElementById('shareBlogBtn');
  if (shareBlogBtn) {
    shareBlogBtn.addEventListener('click', () => {
      const url = window.location.origin + window.location.pathname + '#blog';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          showToast('Blog link copied to clipboard!');
        });
      } else {
        showToast('Link ready to share!');
      }
    });
  }

  // --- Testimonials Category Filter ---
  const tabBtns = document.querySelectorAll('.filter-tabs-row .tab-btn');
  const testimonialCards = document.querySelectorAll('.testimonial-card');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      testimonialCards.forEach((card) => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Testimonials Read More Toggle
  document.querySelectorAll('.read-toggle-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.testimonial-card');
      const text = card.querySelector('.testimonial-text');
      const isClamped = text.classList.toggle('clamped');
      btn.innerHTML = isClamped
        ? `<span>Read Full Note</span> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>`
        : `<span>Show Less</span> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>`;
    });
  });

  // --- Copy Social Handles ---
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const handle = btn.getAttribute('data-handle');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(handle).then(() => {
          showToast(`Copied ${handle} to clipboard!`);
        });
      } else {
        showToast(`Handle: ${handle}`);
      }
    });
  });

  // --- Contact Form ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !message) {
        showToast('Please complete all required fields.');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span>`;

      setTimeout(() => {
        showToast('Message sent! Thank you for reaching out to May Pearl.');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHtml;
      }, 900);
    });
  }

  // --- Scroll Reveal Animations (IntersectionObserver) ---
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-scale, .reveal-left, .reveal-line'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -20px 0px',
        threshold: 0.01
      }
    );

    revealElements.forEach((el) => {
      // Check if already in viewport on load
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible');
      } else {
        revealObserver.observe(el);
      }
    });
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // --- Cursor Glow (subtle ambient mouse follow) ---
  const cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  document.body.appendChild(cursorGlow);

  let mouseX = -500, mouseY = -500;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.style.left = mouseX + 'px';
    cursorGlow.style.top = mouseY + 'px';
  });

  // Hide glow when mouse leaves window
  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorGlow.style.opacity = '1';
  });

  // --- Toast Helper ---
  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3200);
  }
});

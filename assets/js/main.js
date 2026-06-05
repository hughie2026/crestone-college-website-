/* =========================================================
   The Crestone College
   File: assets/js/main.js

   Rule:
   Content must remain visible even if JavaScript fails.
   JavaScript only enhances navigation, animation, counters, and forms.
   ========================================================= */

(function () {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  root.classList.add("js");

  /* ---------- Mobile navigation ---------- */

  function closeNav() {
    body.classList.remove("nav-open");

    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation menu");
    }
  }

  function openNav() {
    body.classList.add("nav-open");

    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Close navigation menu");
    }
  }

  if (navToggle && navLinks) {
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");

    navToggle.addEventListener("click", function () {
      if (body.classList.contains("nav-open")) {
        closeNav();
      } else {
        openNav();
      }
    });

    navLinks.addEventListener("click", function (event) {
      const target = event.target;

      if (target && target.tagName === "A") {
        closeNav();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeNav();
      }
    });

    document.addEventListener("click", function (event) {
      const clickedInsideHeader = header && header.contains(event.target);

      if (!clickedInsideHeader) {
        closeNav();
      }
    });
  }

  /* ---------- Current page highlight ---------- */

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navItems = document.querySelectorAll(".nav-links a, .footer-links a");

  navItems.forEach(function (link) {
    const href = link.getAttribute("href");

    if (!href || href.startsWith("#") || href.startsWith("mailto:")) {
      return;
    }

    const linkPage = href.split("/").pop() || "index.html";

    if (linkPage === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* ---------- Header scroll state ---------- */

  function updateHeaderState() {
    if (!header) return;

    if (window.scrollY > 8) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  /* ---------- Safe reveal animation ---------- */

  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealItems.length > 0) {
    root.classList.add("can-reveal");

    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  /* ---------- Count-up numbers ---------- */

  const counters = document.querySelectorAll("[data-count]");

  function animateCounter(element) {
    const rawTarget = element.getAttribute("data-count");
    const target = Number(rawTarget);

    if (!Number.isFinite(target)) return;

    const duration = 1100;
    const start = performance.now();
    const prefix = element.getAttribute("data-prefix") || "";
    const suffix = element.getAttribute("data-suffix") || "";

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);

      element.textContent = prefix + value.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window && counters.length > 0) {
    const counterObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- Smooth anchor scrolling ---------- */

  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const id = link.getAttribute("href");

      if (!id || id === "#") return;

      const target = document.querySelector(id);

      if (!target) return;

      event.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop =
        target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 18;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth"
      });
    });
  });

  /* ---------- Contact form mailto helper ---------- */

  const forms = document.querySelectorAll("form[data-mailto]");

  forms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const recipient = form.getAttribute("data-mailto");

      if (!recipient) return;

      const subjectInput = form.querySelector("[name='subject']");
      const nameInput = form.querySelector("[name='name']");
      const emailInput = form.querySelector("[name='email']");
      const messageInput = form.querySelector("[name='message']");

      const subject =
        subjectInput && subjectInput.value.trim()
          ? subjectInput.value.trim()
          : "Website inquiry";

      const name =
        nameInput && nameInput.value.trim()
          ? nameInput.value.trim()
          : "";

      const email =
        emailInput && emailInput.value.trim()
          ? emailInput.value.trim()
          : "";

      const message =
        messageInput && messageInput.value.trim()
          ? messageInput.value.trim()
          : "";

      const bodyText = [
        name ? "Name: " + name : "",
        email ? "Email: " + email : "",
        "",
        message
      ]
        .filter(function (line) {
          return line !== null && line !== undefined;
        })
        .join("\n");

      const mailtoUrl =
        "mailto:" +
        encodeURIComponent(recipient) +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(bodyText);

      window.location.href = mailtoUrl;
    });
  });

  /* ---------- External links ---------- */

  const externalLinks = document.querySelectorAll("a[href^='http']");

  externalLinks.forEach(function (link) {
    if (link.hostname !== window.location.hostname) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });

  /* ---------- Footer year ---------- */

  const yearTargets = document.querySelectorAll("[data-current-year]");

  yearTargets.forEach(function (target) {
    target.textContent = new Date().getFullYear();
  });
})();

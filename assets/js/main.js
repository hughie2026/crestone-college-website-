/* =========================================================
   The Crestone College
   Main JavaScript
   File: assets/js/main.js
   ========================================================= */

(function () {
  "use strict";

  const body = document.body;
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".nav, .navbar");
  const navLinks = document.querySelector(".nav-links");

  body.classList.add("js-ready");

  /* ---------- Mobile navigation ---------- */

  function setupMobileNavigation() {
    if (!nav || !navLinks) return;

    let toggle = document.querySelector(".nav-toggle");

    if (!toggle) {
      toggle = document.createElement("button");
      toggle.className = "nav-toggle";
      toggle.type = "button";
      toggle.setAttribute("aria-label", "Open navigation");
      toggle.setAttribute("aria-expanded", "false");
      toggle.innerHTML = "<span></span><span></span><span></span>";
      nav.appendChild(toggle);
    }

    function closeMenu() {
      body.classList.remove("nav-open");
      navLinks.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    }

    function openMenu() {
      body.classList.add("nav-open");
      navLinks.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close navigation");
    }

    toggle.addEventListener("click", function () {
      if (body.classList.contains("nav-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", function (event) {
      const clickedInsideNav = nav.contains(event.target);
      if (!clickedInsideNav) closeMenu();
    });
  }

  /* ---------- Active page link ---------- */

  function setupActiveNavigation() {
    const links = document.querySelectorAll(".nav-links a");
    if (!links.length) return;

    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    links.forEach(function (link) {
      const href = link.getAttribute("href");
      if (!href) return;

      const linkPath = href.split("/").pop();

      if (
        linkPath === currentPath ||
        (currentPath === "" && linkPath === "index.html")
      ) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---------- Header shrink on scroll ---------- */

  function setupHeaderScroll() {
    if (!header) return;

    function updateHeader() {
      if (window.scrollY > 24) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  /* ---------- Smooth anchor offset ---------- */

  function setupSmoothAnchors() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function (link) {
      link.addEventListener("click", function (event) {
        const targetId = link.getAttribute("href");
        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);
        if (!target) return;

        event.preventDefault();

        const headerHeight = header ? header.offsetHeight : 0;
        const top =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          16;

        window.scrollTo({
          top: top,
          behavior: "smooth",
        });
      });
    });
  }

  /* ---------- Back to top button ---------- */

  function setupBackToTop() {
    let button = document.querySelector(".back-to-top");

    if (!button) {
      button = document.createElement("button");
      button.className = "back-to-top";
      button.type = "button";
      button.setAttribute("aria-label", "Back to top");
      button.textContent = "↑";
      document.body.appendChild(button);
    }

    function updateButton() {
      if (window.scrollY > 520) {
        button.classList.add("is-visible");
      } else {
        button.classList.remove("is-visible");
      }
    }

    button.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    updateButton();
    window.addEventListener("scroll", updateButton, { passive: true });
  }

  /* ---------- Current year ---------- */

  function setupCurrentYear() {
    const year = new Date().getFullYear();
    const targets = document.querySelectorAll("#year, .year, .js-year");

    targets.forEach(function (target) {
      target.textContent = year;
    });
  }

  /* ---------- Gentle reveal enhancement ---------- */
  /* 注意：CSS 已保證正文預設顯示，JS 只是增加細微效果，不會再把內容藏起來。 */

  function setupRevealEnhancement() {
    const items = document.querySelectorAll(".card, .program-card, .faculty-card, .contact-card, .info-card, .leadership-card, .timeline-item");

    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* ---------- External links ---------- */

  function setupExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]');

    links.forEach(function (link) {
      const isSameHost = link.hostname === window.location.hostname;
      if (!isSameHost) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    });
  }

  /* ---------- Init ---------- */

  function init() {
    setupMobileNavigation();
    setupActiveNavigation();
    setupHeaderScroll();
    setupSmoothAnchors();
    setupBackToTop();
    setupCurrentYear();
    setupRevealEnhancement();
    setupExternalLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

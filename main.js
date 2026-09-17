(function () {
  "use strict";

  /* Wrap every init in safe() so one failing module never breaks the rest. */
  function safe(fn, name) {
    try { fn(); }
    catch (err) { console.error("[shamu.barberrr] " + name + " failed:", err); }
  }

  /* ---------- Hard fallback: guarantee content is visible even if JS breaks ---------- */
  function initHardFallback() {
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
        el.classList.add("is-visible");
      });
      var splash = document.getElementById("splash");
      if (splash) splash.classList.add("is-hidden");
    }, 2600);
  }

  /* ---------- Splash loader ---------- */
  function initSplash() {
    var splash = document.getElementById("splash");
    if (!splash) return;
    var hide = function () { splash.classList.add("is-hidden"); };
    if (document.readyState === "complete") {
      setTimeout(hide, 300);
    } else {
      window.addEventListener("load", function () { setTimeout(hide, 300); });
    }
  }

  /* ---------- Nav: shrink on scroll + mobile toggle ---------- */
  function initNav() {
    var nav = document.getElementById("nav");
    var burger = document.getElementById("navBurger");
    var mobile = document.getElementById("navMobile");
    if (nav) {
      var onScroll = function () {
        if (window.scrollY > 40) nav.classList.add("is-scrolled");
        else nav.classList.remove("is-scrolled");
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
    if (burger && mobile) {
      burger.addEventListener("click", function () {
        var isOpen = mobile.classList.toggle("is-open");
        burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
      mobile.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          mobile.classList.remove("is-open");
          burger.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  /* ---------- Reveal on scroll (IntersectionObserver — no heavy deps needed) ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Tilt effect on cards ---------- */
  function initTilt() {
    var cards = document.querySelectorAll(".tilt");
    if (!cards.length) return;
    var isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return; /* skip on touch devices */

    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        var max = 6; /* degrees, subtle */
        card.style.transform =
          "perspective(700px) rotateX(" + (-y * max) + "deg) rotateY(" + (x * max) + "deg) translateY(-2px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    var els = document.querySelectorAll(".magnetic");
    if (!els.length) return;
    var isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    els.forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = "translate(" + (x * 10) + "px, " + (y * 10) + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "";
      });
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    safe(initHardFallback, "hardFallback");
    safe(initSplash, "splash");
    safe(initNav, "nav");
    safe(initReveal, "reveal");
    safe(initTilt, "tilt");
    safe(initMagnetic, "magnetic");
  });
})();

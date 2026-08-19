/* ============================================================
   SKINN · SEA BREEZE — interactions
   - Composer: scent + size selector, live rupee pricing,
     accent re-tint, bottle swap, selection summary
   - Lead form + newsletter validation
   - Scroll reveals, count-up stats, sticky nav, mobile CTA
   ============================================================ */
(function () {
  "use strict";

  // Mark JS active immediately so reveal animations arm (see .js .reveal in CSS).
  // If this script fails to load, content stays visible — no invisible hero.
  document.documentElement.classList.add("js");

  /* ---------- Currency ---------- */
  const inr = (n) =>
    "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  /* ---------- Product data ----------
     Base price is the 50 ml price; sizes scale from it.
     'was' is the pre-launch (struck-through) price. ------------ */
  const SCENTS = {
    sea: {
      name: "Breeze",
      desc: "Bright, salted citrus over driftwood musk — the original marine signature.",
      base: 2499,
      accent: "#a51026",
      accentDeep: "#7e0b1d",
      fallback: "bottle",
      img: "assets/skinn-sea-breeze.png",
    },
    mist: {
      name: "Aura",
      desc: "A soft floral aura with luminous musk — elegant, polished and effortlessly feminine.",
      base: 2299,
      accent: "#a51026",
      accentDeep: "#7e0b1d",
      fallback: "water",
      img: "assets/skinn aura.png",
    },
    onyx: {
      name: "Silk Rose",
      desc: "A rich rose signature with warm woods — smooth, confident and made for evening.",
      base: 2999,
      accent: "#a51026",
      accentDeep: "#7e0b1d",
      fallback: "onyx",
      img: "assets/rose edition.png",
    },
  };

  // Size multipliers relative to the 50 ml base price
  const SIZES = {
    "30": { mult: 0.62, label: "30 ml" },
    "50": { mult: 1.0, label: "50 ml" },
    "100": { mult: 1.7, label: "100 ml" },
  };

  const round99 = (n) => Math.round(n / 100) * 100 - 1; // → ...99 pricing

  const state = { scent: "onyx", size: "50" };

  /* ---------- Element refs ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const els = {
    root: document.documentElement,
    img: $("#composeImg"),
    imgWrap: $(".composer__visual"),
    badge: $("#composeBadge"),
    name: $("#composeName"),
    desc: $("#composeDesc"),
    priceNow: $("#priceNow"),
    priceWas: $("#priceWas"),
    priceSave: $("#priceSave"),
    meta: $("#composeMeta"),
    selectionValue: $("#selectionValue"),
    selectionField: $("#selectionField"),
    mobilePrice: $("#mobileCtaPrice"),
  };

  /* ---------- Core update ---------- */
  function currentPrice() {
    const base = SCENTS[state.scent].base;
    const now = round99(base * SIZES[state.size].mult);
    const was = round99(now * 1.28); // implied discount
    const save = Math.round((1 - now / was) * 100);
    return { now, was, save };
  }

  function summaryText() {
    const s = SCENTS[state.scent];
    const { now } = currentPrice();
    return `${s.name} · ${SIZES[state.size].label} — ${inr(now)}`;
  }

  function update(swapImage) {
    const s = SCENTS[state.scent];
    const { now, was, save } = currentPrice();

    // Accent re-tint (drives --accent everywhere)
    els.root.style.setProperty("--accent", s.accent);
    els.root.style.setProperty("--accent-deep", s.accentDeep);

    // Text
    if (els.name) els.name.textContent = s.name;
    if (els.desc) els.desc.textContent = s.desc;
    if (els.badge) els.badge.textContent = s.name;
    if (els.priceNow) els.priceNow.textContent = inr(now);
    if (els.priceWas) els.priceWas.textContent = inr(was);
    if (els.priceSave) els.priceSave.textContent = "Save " + save + "%";
    if (els.meta)
      els.meta.textContent = `${s.name} · ${SIZES[state.size].label} · Eau de Parfum`;

    // Selection → reserve form
    const summary = summaryText();
    if (els.selectionValue) els.selectionValue.textContent = summary;
    if (els.selectionField) els.selectionField.value = summary;
    if (els.mobilePrice) els.mobilePrice.textContent = inr(now);

    // Image swap (only when scent changes)
    if (swapImage && els.img) {
      els.img.style.opacity = "0";
      if (els.imgWrap) els.imgWrap.setAttribute("data-fallback", s.fallback);
      const next = new Image();
      next.onload = () => {
        els.img.src = s.img;
        els.img.style.display = "block";
        els.img.style.opacity = "1";
      };
      next.onerror = () => {
        // keep gradient fallback visible
        els.img.style.display = "none";
      };
      next.src = s.img;
      els.img.alt = s.name + " fragrance bottle";
    }
  }

  /* ---------- Chip selection ---------- */
  function bindChips(attr, key, onChange) {
    $$(`.chip[data-${attr}]`).forEach((chip) => {
      chip.addEventListener("click", () => {
        const group = chip.parentElement;
        $$(".chip", group).forEach((c) => {
          c.classList.remove("is-active");
          c.setAttribute("aria-checked", "false");
        });
        chip.classList.add("is-active");
        chip.setAttribute("aria-checked", "true");
        state[key] = chip.getAttribute("data-" + attr);
        onChange();
      });
      // keyboard: arrow keys within a radiogroup
      chip.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        const group = $$(".chip", chip.parentElement);
        let i = group.indexOf(chip);
        i = e.key === "ArrowRight" ? (i + 1) % group.length : (i - 1 + group.length) % group.length;
        group[i].focus();
        group[i].click();
      });
    });
  }

  bindChips("scent", "scent", () => update(true));
  bindChips("size", "size", () => update(false));

  /* ---------- Product cards → load into composer ---------- */
  $$("[data-load]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const scent = btn.getAttribute("data-load");
      // sync chips
      $$(".chip[data-scent]").forEach((c) => {
        const on = c.getAttribute("data-scent") === scent;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-checked", on ? "true" : "false");
      });
      state.scent = scent;
      update(true);
      document.getElementById("compose").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  // whole product card is clickable too
  $$(".product[data-scent]").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".link-arrow")) return; // handled above
      const btn = card.querySelector("[data-load]");
      if (btn) btn.click();
    });
  });

  /* ---------- Testimonial carousel ---------- */
  const reviewTrack = $(".reviews__track");
  const reviewPrev = $("[data-review-prev]");
  const reviewNext = $("[data-review-next]");
  let reviewIndex = 0;

  function updateReviews() {
    if (!reviewTrack || !reviewPrev || !reviewNext) return;
    const cards = $$(".quote", reviewTrack);
    const visible = window.matchMedia("(min-width: 992px)").matches ? 3 : 1;
    const maxIndex = Math.max(0, cards.length - visible);
    reviewIndex = Math.min(reviewIndex, maxIndex);
    const cardWidth = cards[0] ? cards[0].getBoundingClientRect().width : 0;
    const gap = parseFloat(getComputedStyle(reviewTrack).gap) || 0;
    reviewTrack.style.transform = `translateX(-${reviewIndex * (cardWidth + gap)}px)`;
    reviewPrev.disabled = reviewIndex === 0;
    reviewNext.disabled = reviewIndex === maxIndex;
  }

  if (reviewTrack && reviewPrev && reviewNext) {
    reviewPrev.addEventListener("click", () => {
      reviewIndex -= 1;
      updateReviews();
    });
    reviewNext.addEventListener("click", () => {
      reviewIndex += 1;
      updateReviews();
    });
    window.addEventListener("resize", updateReviews);
    updateReviews();
  }

  /* ---------- Lead form ---------- */
  const leadForm = $("#leadForm");
  if (leadForm) {
    // digits only for phone
    const phone = $("#phone");
    if (phone) phone.addEventListener("input", () => {
      phone.value = phone.value.replace(/\D/g, "").slice(0, 10);
    });

    leadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      $$("#leadForm [required]").forEach((field) => {
        const valid = field.type === "checkbox" ? field.checked : field.checkValidity();
        field.classList.toggle("is-invalid", !valid);
        if (!valid) ok = false;
      });
      if (!ok) {
        const firstBad = $("#leadForm .is-invalid");
        if (firstBad) firstBad.focus();
        return;
      }
      // success
      const success = $("#leadSuccess");
      const msg = $("#successMsg");
      const s = SCENTS[state.scent];
      if (msg) msg.textContent = `We've reserved your ${s.name} · ${SIZES[state.size].label}. Watch your inbox — we'll confirm shipping shortly.`;
      leadForm.setAttribute("hidden", "");
      if (success) success.removeAttribute("hidden");
    });
  }

  const resetBtn = $("#resetForm");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      leadForm.reset();
      $$("#leadForm .is-invalid").forEach((f) => f.classList.remove("is-invalid"));
      $("#leadSuccess").setAttribute("hidden", "");
      leadForm.removeAttribute("hidden");
    });
  }

  /* ---------- Newsletter ---------- */
  const newsForm = $("#newsForm");
  if (newsForm) {
    newsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("#newsEmail");
      const msg = $("#newsMsg");
      if (email.checkValidity()) {
        msg.textContent = "You're in — welcome to Skinn. Check your inbox for a hello.";
        newsForm.reset();
      } else {
        msg.textContent = "Please enter a valid email address.";
        email.focus();
      }
    });
  }

  /* ---------- Scroll reveals ---------- */
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = $$(".reveal");
  if (!prefersReduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 90 + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Count-up stats ---------- */
  const counters = $$(".stat__num[data-count]");
  if (!prefersReduced && "IntersectionObserver" in window) {
    const io2 = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target;
          const target = parseFloat(el.getAttribute("data-count"));
          const suffix = el.getAttribute("data-suffix") || "";
          const dur = 1400;
          const start = performance.now();
          const step = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io2.unobserve(el);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => io2.observe(el));
  }

  /* ---------- Sticky nav shadow ---------- */
  const nav = $("#siteNav");
  const onScroll = () => {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 20);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Close mobile menu on link click ---------- */
  $$("#navLinks .nav-link, #navLinks .nav-cta").forEach((link) => {
    link.addEventListener("click", () => {
      const collapse = $("#navLinks");
      if (collapse && collapse.classList.contains("show")) {
        const bs = window.bootstrap && window.bootstrap.Collapse.getInstance(collapse);
        if (bs) bs.hide();
      }
    });
  });

  /* ---------- Init ---------- */
  update(false);
})();

(function () {
  var root = document.documentElement;
  var body = document.body;
  var key = "haishu-theme";
  var toggle = document.getElementById("themeToggle");
  var yearEl = document.getElementById("year");
  var header = document.getElementById("siteHeader");
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  document.querySelectorAll("[data-reveal]").forEach(function (el) {
    var d = el.getAttribute("data-reveal-delay");
    if (d) {
      el.style.setProperty("--reveal-delay", d);
    }
  });

  function setScroll() {
    var doc = document.documentElement;
    var total = doc.scrollHeight - doc.clientHeight;
    var p = total <= 0 ? 0 : (doc.scrollTop / total) * 100;
    root.style.setProperty("--scroll", Math.min(100, Math.max(0, p)) + "%");
  }

  function onScroll() {
    setScroll();
    if (header) {
      if (window.scrollY > 24) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }
  }

  setScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (!reduced) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        body.classList.add("is-loaded");
      });
    });
  } else {
    body.classList.add("is-loaded");
  }

  if (!reduced) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-revealed");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.classList.add("is-revealed");
    });
  }

  if (!reduced && finePointer) {
    window.addEventListener(
      "mousemove",
      function (e) {
        root.style.setProperty("--cx", e.clientX + "px");
        root.style.setProperty("--cy", e.clientY + "px");
      },
      { passive: true }
    );
  }

  if (!reduced) {
    document.querySelectorAll("[data-tilt]").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        var ry = (x - 0.5) * 12;
        var rx = (0.5 - y) * 10;
        el.style.setProperty("--tilt-x", rx + "deg");
        el.style.setProperty("--tilt-y", ry + "deg");
      });
      el.addEventListener("mouseleave", function () {
        el.style.setProperty("--tilt-x", "0deg");
        el.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  function getStored() {
    try {
      return localStorage.getItem(key);
    } catch (_e) {
      return null;
    }
  }

  function applyTheme(mode) {
    if (mode === "light" || mode === "dark") {
      root.setAttribute("data-theme", mode);
    } else {
      root.removeAttribute("data-theme");
    }
  }

  var stored = getStored();
  if (stored === "light" || stored === "dark") {
    applyTheme(stored);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    applyTheme("light");
  }

  function setTheme(next) {
    applyTheme(next);
    try {
      localStorage.setItem(key, next);
    } catch (_e) {}
    if (toggle) {
      toggle.setAttribute("aria-pressed", next === "light" ? "true" : "false");
    }
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      setTheme(current === "light" ? "dark" : "light");
    });
    var cur = root.getAttribute("data-theme") || "dark";
    toggle.setAttribute("aria-pressed", cur === "light" ? "true" : "false");
  }

  function initHeroConstellation() {
    var canvas = document.getElementById("heroConstellation");
    var section = document.getElementById("top");
    if (!canvas || !canvas.getContext || !section) {
      return;
    }
    var parent = canvas.parentElement;
    if (!parent) {
      return;
    }
    var ctx = canvas.getContext("2d");
    var nodes = [];
    var rafId = 0;
    var motionOff = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var inView = false;
    var running = false;
    var W = 1;
    var H = 1;

    function buildNodes(w, h) {
      var area = w * h;
      var n = Math.min(72, Math.max(28, Math.floor(Math.sqrt(area) * 0.38)));
      nodes = [];
      for (var i = 0; i < n; i++) {
        nodes.push({
          nx: Math.random(),
          ny: Math.random(),
          phase: Math.random() * Math.PI * 2,
          speed: 0.35 + Math.random() * 1.1,
          r: Math.random() * 1.4 + 0.55,
        });
      }
    }

    function positions(t, w, h, anim) {
      var flow = Math.min(w, h) * 0.024;
      var out = [];
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var ox = anim ? Math.sin(t * n.speed + n.phase) * flow : 0;
        var oy = anim ? Math.cos(t * n.speed * 0.82 + n.phase * 1.37) * flow : 0;
        out.push({
          x: n.nx * w + ox,
          y: n.ny * h + oy,
          r: n.r,
          tw: n.phase + (anim ? t * 1.6 : 0),
        });
      }
      return out;
    }

    function drawOnce(nowMs, t, w, h, anim) {
      var light = root.getAttribute("data-theme") === "light";
      var pos = positions(t, w, h, anim);
      var linkDist = Math.min(w, h) * 0.28;
      var dashOff = anim ? -nowMs * 0.045 : 0;

      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.setLineDash([3, 10, 2, 14]);
      ctx.lineDashOffset = dashOff;
      ctx.lineCap = "round";

      for (var i = 0; i < pos.length; i++) {
        for (var j = i + 1; j < pos.length; j++) {
          var a = pos[i];
          var b = pos[j];
          var dx = b.x - a.x;
          var dy = b.y - a.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= linkDist) {
            continue;
          }
          var f = 1 - dist / linkDist;
          var pulse = 0.45 + 0.55 * Math.sin(t * 1.4 + i * 0.21 + j * 0.11);
          var alpha = f * 0.38 * pulse;
          if (light) {
            ctx.strokeStyle = "rgba(0, 120, 100, " + (alpha * 0.85) + ")";
          } else {
            ctx.strokeStyle = "rgba(0, 212, 170, " + alpha + ")";
          }
          ctx.lineWidth = 1 + f * 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.restore();

      for (var k = 0; k < pos.length; k++) {
        var p = pos[k];
        var tw = 0.35 + Math.sin(p.tw) * 0.35;
        if (light) {
          ctx.fillStyle = "rgba(0, 90, 75, " + (0.35 + tw * 0.45) + ")";
        } else {
          ctx.fillStyle = "rgba(220, 245, 255, " + (0.25 + tw * 0.55) + ")";
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = light ? "rgba(255,255,255," + (0.15 + tw * 0.25) + ")" : "rgba(255,255,255," + (0.2 + tw * 0.35) + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() {
      if (!inView || motionOff) {
        running = false;
        return;
      }
      var nowMs = performance.now();
      drawOnce(nowMs, nowMs / 1000, W, H, true);
      rafId = requestAnimationFrame(loop);
    }

    function resize() {
      var rect = parent.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes(W, H);
      cancelAnimationFrame(rafId);
      running = false;
      if (motionOff) {
        drawOnce(0, 0, W, H, false);
        return;
      }
      if (inView) {
        running = true;
        rafId = requestAnimationFrame(loop);
      }
    }

    function setInViewFromRect() {
      var r = section.getBoundingClientRect();
      inView = r.top < window.innerHeight && r.bottom > 0;
    }

    setInViewFromRect();

    if (typeof IntersectionObserver !== "undefined") {
      new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            inView = entry.isIntersecting;
            if (inView && !motionOff) {
              if (!running) {
                running = true;
                rafId = requestAnimationFrame(loop);
              }
            } else {
              cancelAnimationFrame(rafId);
              running = false;
            }
          });
        },
        { rootMargin: "80px", threshold: 0 }
      ).observe(section);
    }

    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(resize).observe(section);
    } else {
      window.addEventListener("resize", resize);
    }
    resize();
  }

  function initPhotoLightbox() {
    var section = document.getElementById("photos");
    var wfScroller = section && section.querySelector(".wf-scroller");
    var strip = section && section.querySelector(".wf-scroller__strip:not([aria-hidden])");
    var dialog = document.getElementById("photoLightbox");
    var rail = document.getElementById("photoLightboxRail");
    var viewport = document.getElementById("photoLightboxViewport");
    var btClose = dialog && dialog.querySelector(".photo-lightbox__close");
    var btPrev = document.getElementById("photoLightboxPrev");
    var btNext = document.getElementById("photoLightboxNext");
    var idxEl = document.getElementById("photoLightboxIndex");
    var totalEl = document.getElementById("photoLightboxTotal");
    if (!section || !strip || !dialog || !rail || !viewport || !wfScroller || !idxEl || !totalEl) {
      return;
    }
    if (typeof dialog.showModal !== "function") {
      return;
    }

    var imgs = strip.querySelectorAll(".wf__img");
    var total = imgs.length;
    if (total === 0) {
      return;
    }

    var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var railBuilt = false;
    var scrollRaf = 0;

    function setLbWidth() {
      var w = viewport.clientWidth;
      if (w > 0) {
        viewport.style.setProperty("--lbw", w + "px");
      }
    }

    function buildRail() {
      rail.innerHTML = "";
      for (var i = 0; i < imgs.length; i++) {
        var srcImg = imgs[i];
        var fig = document.createElement("figure");
        fig.className = "photo-lightbox__slide";
        var im = document.createElement("img");
        im.src = srcImg.currentSrc || srcImg.src;
        im.alt = srcImg.alt || "照片 " + (i + 1);
        im.decoding = "async";
        im.loading = "eager";
        fig.appendChild(im);
        rail.appendChild(fig);
      }
      totalEl.textContent = String(total);
    }

    function ensureRail() {
      if (railBuilt) {
        return;
      }
      buildRail();
      railBuilt = true;
    }

    function currentIndex() {
      var w = viewport.clientWidth;
      if (w <= 0) {
        return 0;
      }
      var i = Math.round(viewport.scrollLeft / w);
      if (i < 0) {
        i = 0;
      }
      if (i >= total) {
        i = total - 1;
      }
      return i;
    }

    function updateCounter() {
      idxEl.textContent = String(currentIndex() + 1);
    }

    function scrollToIndex(i, smooth) {
      var w = viewport.clientWidth;
      if (w <= 0) {
        return;
      }
      if (i < 0) {
        i = 0;
      }
      if (i >= total) {
        i = total - 1;
      }
      var behavior = smooth && !reducedMotion ? "smooth" : "auto";
      viewport.scrollTo({ left: i * w, top: 0, behavior: behavior });
    }

    function openAt(index) {
      wfScroller.classList.add("is-lightbox-open");
      dialog.showModal();
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          ensureRail();
          setLbWidth();
          if (index < 0) {
            index = 0;
          }
          if (index >= total) {
            index = total - 1;
          }
          var w = viewport.clientWidth;
          viewport.scrollTo({ left: index * w, top: 0, behavior: "auto" });
          updateCounter();
          if (btClose) {
            btClose.focus();
          }
        });
      });
    }

    function onDialogClose() {
      wfScroller.classList.remove("is-lightbox-open");
    }

    strip.querySelectorAll(".wf__item").forEach(function (fig, i) {
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("role", "button");
      var im = fig.querySelector(".wf__img");
      var t = im && im.alt ? im.alt + "，点击放大" : "照片 " + (i + 1) + "，点击放大";
      fig.setAttribute("aria-label", t);
    });

    strip.addEventListener("click", function (e) {
      var item = e.target.closest(".wf__item");
      if (!item || !strip.contains(item)) {
        return;
      }
      var img = item.querySelector(".wf__img");
      if (!img) {
        return;
      }
      var ix = Array.prototype.indexOf.call(imgs, img);
      if (ix < 0) {
        return;
      }
      openAt(ix);
    });

    strip.addEventListener("keydown", function (e) {
      var item = e.target.closest(".wf__item");
      if (!item || !strip.contains(item)) {
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") {
        return;
      }
      e.preventDefault();
      var img = item.querySelector(".wf__img");
      if (!img) {
        return;
      }
      var ix = Array.prototype.indexOf.call(imgs, img);
      if (ix < 0) {
        return;
      }
      openAt(ix);
    });

    dialog.addEventListener("close", onDialogClose);

    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) {
        dialog.close();
      }
    });

    if (btClose) {
      btClose.addEventListener("click", function () {
        dialog.close();
      });
    }

    if (btPrev) {
      btPrev.addEventListener("click", function () {
        scrollToIndex(currentIndex() - 1, true);
      });
    }
    if (btNext) {
      btNext.addEventListener("click", function () {
        scrollToIndex(currentIndex() + 1, true);
      });
    }

    dialog.addEventListener("keydown", function (e) {
      if (!dialog.open) {
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollToIndex(currentIndex() - 1, true);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollToIndex(currentIndex() + 1, true);
      }
    });

    viewport.addEventListener(
      "scroll",
      function () {
        if (scrollRaf) {
          cancelAnimationFrame(scrollRaf);
        }
        scrollRaf = requestAnimationFrame(updateCounter);
      },
      { passive: true }
    );

    window.addEventListener("resize", function () {
      if (!dialog.open) {
        return;
      }
      var i = currentIndex();
      setLbWidth();
      var w = viewport.clientWidth;
      viewport.scrollTo({ left: i * w, top: 0, behavior: "auto" });
      updateCounter();
    });
  }

  function boot() {
    initHeroConstellation();
    initPhotoLightbox();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

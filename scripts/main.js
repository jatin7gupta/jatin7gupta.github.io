(() => {
  const onReady = (fn) => {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  };

  const createSvgElement = (tag, attrs = {}) => {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      el.setAttribute(key, String(value));
    });
    return el;
  };

  onReady(() => {
    const root = document.documentElement;
    const THEME_KEY = "jg-theme";
    const MODE_KEY = "jg-mode";
    const WORDS = ["simple,", "reliable,", "sharp,"];

    const rotateEl = document.getElementById("rotate");
    const subline = document.getElementById("subline");
    const badgeEls = Array.from(document.querySelectorAll("#wins .badge"));
    const modeButtons = Array.from(document.querySelectorAll(".switch .pill"));
    const themeToggle = document.querySelector("[data-theme-toggle]");
    const tile = document.querySelector(".tile");
    const svg = document.getElementById("sig");
    const revealTargets = Array.from(document.querySelectorAll("[data-reveal]"));

    const schemeQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    const reduceMotionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    const prefersReduced = () => !!(reduceMotionQuery && reduceMotionQuery.matches);

    /* Theme toggle ------------------------------------------------------ */
    let storedTheme = localStorage.getItem(THEME_KEY);

    const applyTheme = (value) => {
      const shouldBeDark = value === "dark" || (!value && schemeQuery && schemeQuery.matches);
      root.classList.toggle("theme-dark", shouldBeDark);
      if (themeToggle) {
        themeToggle.setAttribute("aria-pressed", shouldBeDark ? "true" : "false");
        themeToggle.setAttribute("aria-label", shouldBeDark ? "Switch to light theme" : "Switch to dark theme");
      }
    };

    applyTheme(storedTheme);

    if (schemeQuery) {
      schemeQuery.addEventListener("change", () => {
        if (!storedTheme) {
          applyTheme(null);
        }
      });
    }

    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const isDark = root.classList.contains("theme-dark");
        const next = isDark ? "light" : "dark";
        storedTheme = next;
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
      });
    }

    /* Rotating hero word ------------------------------------------------ */
    let rotateTimer = null;
    let wordIndex = 0;
    let hoverPaused = false;

    if (rotateEl) {
      const initial = WORDS.indexOf((rotateEl.textContent || "").trim());
      if (initial >= 0) {
        wordIndex = initial;
      } else {
        rotateEl.textContent = WORDS[0];
        wordIndex = 0;
      }
    }

    const stepWord = () => {
      if (!rotateEl) return;
      wordIndex = (wordIndex + 1) % WORDS.length;
      rotateEl.classList.add("is-fading");
      window.setTimeout(() => {
        rotateEl.textContent = WORDS[wordIndex];
        rotateEl.classList.remove("is-fading");
      }, 220);
    };

    const stopCycle = () => {
      if (rotateTimer) {
        window.clearInterval(rotateTimer);
        rotateTimer = null;
      }
    };

    const startCycle = () => {
      if (!rotateEl || prefersReduced() || document.hidden || hoverPaused || rotateTimer) return;
      rotateTimer = window.setInterval(stepWord, 1500);
    };

    if (rotateEl) {
      rotateEl.addEventListener("mouseenter", () => {
        hoverPaused = true;
        stopCycle();
      });
      rotateEl.addEventListener("mouseleave", () => {
        hoverPaused = false;
        startCycle();
      });
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopCycle();
      } else {
        startCycle();
      }
    });

    if (reduceMotionQuery) {
      reduceMotionQuery.addEventListener("change", () => {
        stopCycle();
        startCycle();
      });
    }

    startCycle();

    /* Identity switch --------------------------------------------------- */
    const MODES = {
      leader: {
        sub: "Leading engineers to ship clean, fast, and with purpose.",
        badges: [
          "Scaled delivery across multiple squads",
          "Growth frameworks for senior engineers",
          "AI adoption in engineering workflows"
        ]
      },
      builder: {
        sub: "Designing systems that scale with less noise.",
        badges: [
          "Reliable services and clear SLOs",
          "Fewer flaky tests, faster CI",
          "Safer feature flags and rollouts"
        ]
      },
      mentor: {
        sub: "Growing strong engineers into stronger teams.",
        badges: [
          "Clear growth frameworks",
          "Reviews that teach",
          "Regular, calm feedback loops"
        ]
      }
    };

    const applyMode = (mode) => {
      const preset = MODES[mode] || MODES.leader;
      if (subline) subline.textContent = preset.sub;
      badgeEls.forEach((badge, index) => {
        if (preset.badges[index]) {
          badge.textContent = preset.badges[index];
        }
      });
      modeButtons.forEach((btn) => {
        const active = btn.dataset.mode === mode;
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });
      localStorage.setItem(MODE_KEY, mode);
    };

    const savedMode = localStorage.getItem(MODE_KEY) || "leader";
    applyMode(savedMode);

    modeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.mode || "leader";
        applyMode(mode);
      });
    });

    /* Signature tile ---------------------------------------------------- */
    let layers = [];

    const drawSignature = () => {
      if (!svg) return;
      svg.innerHTML = "";
      const shapeCount = Math.floor(Math.random() * 3) + 5; // 5-7 shapes
      const palette = [
        "rgba(249, 115, 22, 0.75)",
        "rgba(249, 115, 22, 0.45)",
        "rgba(15, 23, 42, 0.35)"
      ];

      for (let i = 0; i < shapeCount; i += 1) {
        const depth = (0.02 + Math.random() * 0.06).toFixed(3);
        const group = createSvgElement("g", { "data-depth": depth });
        const stroke = palette[Math.floor(Math.random() * palette.length)];
        const weight = (0.6 + Math.random() * 0.8).toFixed(2);
        const choice = Math.random();

        if (choice < 0.45) {
          const line = createSvgElement("line", {
            x1: (Math.random() * 320 + 20).toFixed(2),
            y1: (Math.random() * 320 + 20).toFixed(2),
            x2: (Math.random() * 320 + 20).toFixed(2),
            y2: (Math.random() * 320 + 20).toFixed(2),
            stroke,
            "stroke-width": weight,
            "stroke-linecap": "round"
          });
          group.append(line);
        } else if (choice < 0.75) {
          const points = Array.from({ length: 4 }, () => {
            const px = (Math.random() * 320 + 20).toFixed(2);
            const py = (Math.random() * 320 + 20).toFixed(2);
            return `${px},${py}`;
          }).join(" ");
          const polyline = createSvgElement("polyline", {
            points,
            stroke,
            "stroke-width": weight,
            fill: "none",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-dasharray": Math.random() > 0.5 ? "6 10" : undefined
          });
          group.append(polyline);
        } else {
          const startX = (Math.random() * 200 + 60).toFixed(2);
          const startY = (Math.random() * 200 + 60).toFixed(2);
          const radius = (Math.random() * 120 + 30).toFixed(2);
          const arc = createSvgElement("path", {
            d: `M ${startX} ${startY} m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0`,
            stroke,
            "stroke-width": weight,
            fill: "none",
            "stroke-dasharray": "4 8"
          });
          group.append(arc);
        }

        svg.append(group);
      }

      layers = Array.from(svg.querySelectorAll("g[data-depth]"));
    };

    drawSignature();

    const applyParallax = (event) => {
      if (!tile || !layers.length || event.pointerType === "touch") return;
      const rect = tile.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth || 0.02);
        layer.style.transform = `translate(${(x * depth * 80).toFixed(2)}px, ${(y * depth * 60).toFixed(2)}px)`;
      });
      tile.classList.add("is-lit");
    };

    const resetParallax = () => {
      layers.forEach((layer) => {
        layer.style.transform = "translate(0, 0)";
      });
      if (tile) {
        tile.classList.remove("is-lit");
      }
    };

    const enableTileMotion = () => {
      if (!tile || !svg || tile.dataset.motion === "on") return;
      tile.addEventListener("pointermove", applyParallax);
      tile.addEventListener("pointerleave", resetParallax);
      tile.dataset.motion = "on";
    };

    const disableTileMotion = () => {
      if (!tile) return;
      tile.removeEventListener("pointermove", applyParallax);
      tile.removeEventListener("pointerleave", resetParallax);
      delete tile.dataset.motion;
      resetParallax();
    };

    if (!prefersReduced()) {
      enableTileMotion();
    } else {
      disableTileMotion();
    }

    if (reduceMotionQuery) {
      reduceMotionQuery.addEventListener("change", (event) => {
        if (event.matches) {
          disableTileMotion();
        } else {
          enableTileMotion();
        }
      });
    }

    /* Section reveals --------------------------------------------------- */
    const showTargets = (targets) => {
      targets.forEach((target) => target.classList.add("is-visible"));
    };

    if (!prefersReduced() && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25 }
      );

      revealTargets.forEach((target) => observer.observe(target));
    } else {
      showTargets(revealTargets);
    }
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("instagram");
  const track = document.getElementById("ig-track");
  const prevBtn = document.querySelector(".carousel-btn.prev-btn");
  const nextBtn = document.querySelector(".carousel-btn.next-btn");
  const dotsContainer = document.querySelector(".carousel-dots");

  if (!section || !track) return;

  let loaded = false;
  const items = Array.from(track.querySelectorAll(".carousel-item"));

  /* ——— Faster embed loading ——— */
  const loadEmbeds = () => {
    if (loaded) return;
    loaded = true;

    // Convert placeholders to Instagram blockquotes
    track.querySelectorAll(".ig-placeholder").forEach((ph) => {
      const permalink = ph.getAttribute("data-instgrm-permalink");
      const version = ph.getAttribute("data-instgrm-version") || "14";
      if (!permalink) return;

      const bq = document.createElement("blockquote");
      bq.className = "instagram-media";
      bq.setAttribute("data-instgrm-permalink", permalink);
      bq.setAttribute("data-instgrm-version", version);
      bq.setAttribute("data-instgrm-captioned", "");
      bq.style.cssText =
        "background:#FFF;border:0;border-radius:12px;box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15);margin:1px;max-width:540px;min-width:326px;padding:0;width:calc(100% - 2px)";

      // Move any children (fallback links) into blockquote
      while (ph.firstChild) bq.appendChild(ph.firstChild);
      ph.parentNode.replaceChild(bq, ph);
    });

    // Load Instagram embed.js
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.onload = () => {
      if (window.instgrm) window.instgrm.Embeds.process();
    };
    document.body.appendChild(script);
  };

  /* ——— IntersectionObserver (trigger early at 400px) ——— */
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Use requestIdleCallback if available, else setTimeout
          if ("requestIdleCallback" in window) {
            requestIdleCallback(loadEmbeds, { timeout: 1500 });
          } else {
            setTimeout(loadEmbeds, 100);
          }
          obs.disconnect();
        }
      });
    },
    { root: null, rootMargin: "400px", threshold: 0.1 }
  );
  observer.observe(section);

  /* ——— Dots navigation ——— */
  if (dotsContainer && items.length > 0) {
    items.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = idx === 0 ? "dot active" : "dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-selected", idx === 0 ? "true" : "false");
      dot.setAttribute("aria-controls", "ig-track");
      dot.setAttribute("aria-label", `עבור לפריט ${idx + 1}`);
      dot.setAttribute("tabindex", idx === 0 ? "0" : "-1");
      dot.addEventListener("click", () => goTo(idx));
      dotsContainer.appendChild(dot);
    });
  }

  const dots = Array.from(document.querySelectorAll(".dot"));
  let current = 0;

  const updateDots = (idx) => {
    dots.forEach((d, i) => {
      const active = i === idx;
      d.classList.toggle("active", active);
      d.setAttribute("aria-selected", active ? "true" : "false");
      d.setAttribute("tabindex", active ? "0" : "-1");
    });
  };

  const goTo = (idx) => {
    if (!items[idx]) return;
    items[idx].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
    current = idx;
    updateDots(current);
  };

  /* ——— Prev/Next buttons ——— */
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      goTo(current > 0 ? current - 1 : items.length - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      goTo(current < items.length - 1 ? current + 1 : 0);
    });
  }

  /* ——— Scroll-snap sync ——— */
  let scrollTimer;
  track.addEventListener("scroll", () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const rect = track.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      let closest = 0;
      let minDist = Infinity;
      items.forEach((item, i) => {
        const r = item.getBoundingClientRect();
        const dist = Math.abs(center - (r.left + r.width / 2));
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      if (closest !== current) {
        current = closest;
        updateDots(current);
      }
    }, 100);
  });
});

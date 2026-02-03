// =============================
// DOM Ready Helper
// =============================
function ready(fn) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

ready(function () {
  // =============================
  // Year in footer
  // =============================
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // =============================
  // Smooth scroll for nav links
  // =============================
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // =============================
  // Theme toggle (Dark / Light)
  // =============================
  const body = document.body;
  const toggleBtn = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  const THEME_KEY = "portfolio-theme";

  function applyTheme(theme) {
    if (!theme) return;
    body.setAttribute("data-theme", theme);
    if (themeIcon) {
      themeIcon.textContent = theme === "dark" ? "🌙" : "🌞";
    }
  }

  // Initial theme from localStorage or prefers-color-scheme
  (function initTheme() {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") {
      applyTheme(stored);
    } else {
      // default dark, but respect system if explicitly light
      const prefersDark = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(prefersDark ? "dark" : "dark");
    }
  })();

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = body.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      window.localStorage.setItem(THEME_KEY, next);
    });
  }

  // =============================
  // Terminal Typing Effect
  // =============================
  const terminalTextEl = document.getElementById("terminalText");
  const terminalCursorEl = document.getElementById("terminalCursor");

  if (terminalTextEl && terminalCursorEl) {
    const lines = [
      "$ npm init -y",
      "$ npm install react react-dom",
      "$ git init",
      "$ git add .",
      '$ git commit -m "feat: initial setup"',
      "$ npm run dev",
      "# Deploying to production...",
      "# Done. Portfolio is live."
    ];

    let lineIndex = 0;
    let charIndex = 0;

    const typingSpeed = 55; // ms per char
    const linePause = 600; // pause between lines

    function type() {
      if (lineIndex >= lines.length) {
        // Loop effect: small delay, then reset text
        setTimeout(() => {
          terminalTextEl.textContent = "";
          lineIndex = 0;
          charIndex = 0;
          type();
        }, 1300);
        return;
      }

      const currentLine = lines[lineIndex];

      if (charIndex <= currentLine.length) {
        const visible = currentLine.slice(0, charIndex);
        // Keep existing previous lines, only update last
        const prev = terminalTextEl.textContent.split("\n");
        prev[prev.length - 1] = visible;
        terminalTextEl.textContent = prev.join("\n");
        charIndex++;
        setTimeout(type, typingSpeed);
      } else {
        // Finish line and go to next
        terminalTextEl.textContent +=
          (terminalTextEl.textContent ? "\n" : "") + currentLine;
        terminalTextEl.textContent = terminalTextEl.textContent
          .split("\n")
          .slice(0, lineIndex + 1)
          .join("\n");
        lineIndex++;
        charIndex = 0;

        // Prepare next line placeholder
        if (lineIndex < lines.length) {
          terminalTextEl.textContent += "\n";
        }

        setTimeout(type, linePause);
      }
    }

    // Initialize first line placeholder so splitting works
    terminalTextEl.textContent = "";
    setTimeout(type, 500); // run after small delay on load
  }

  // =============================
  // Contact form (client-side only)
  // =============================
  const contactForm = document.getElementById("contactForm");
  const feedbackEl = document.getElementById("formFeedback");

  if (contactForm && feedbackEl) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const message = String(formData.get("message") || "").trim();

      if (!name || !email || !message) {
        feedbackEl.textContent = "Semua field wajib diisi.";
        feedbackEl.classList.remove("form-feedback--success");
        feedbackEl.classList.add("form-feedback--error");
        return;
      }

      // Simulasi submit sukses (siap dihubungkan ke backend / service email)
      contactForm.reset();
      feedbackEl.textContent = "Terima kasih! Pesanmu sudah terkirim (simulasi).";
      feedbackEl.classList.remove("form-feedback--error");
      feedbackEl.classList.add("form-feedback--success");

      setTimeout(() => {
        feedbackEl.textContent = "";
        feedbackEl.classList.remove("form-feedback--success");
      }, 3500);
    });
  }
});

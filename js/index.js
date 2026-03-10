// Lightweight enhancements for the portfolio landing page.

const header = document.querySelector(".site-header");
const yearEl = document.getElementById("year");

// Add a compact style to the header after scrolling a bit.
if (header) {
  const toggleHeaderState = () => {
    const scrolled = window.scrollY > 24;
    header.classList.toggle("site-header--scrolled", scrolled);
  };

  toggleHeaderState();
  window.addEventListener("scroll", toggleHeaderState, { passive: true });
}

// Keep the footer year up to date.
if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}


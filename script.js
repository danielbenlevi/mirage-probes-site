const reveals = document.querySelectorAll(".reveal");
const navLinks = [...document.querySelectorAll(".nav a")];
const copyButton = document.querySelector("[data-copy]");
const copyStatus = document.querySelector(".copy-status");
const placeholderLinks = document.querySelectorAll("[data-placeholder='true']");

document.body.classList.add("js");

placeholderLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    }
  },
  { threshold: 0.18 }
);

reveals.forEach((el) => observer.observe(el));

const navObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    const id = visible.target.id;
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", active);
    });
  },
  { rootMargin: "-25% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] }
);

document.querySelectorAll("section[id]").forEach((section) => navObserver.observe(section));

if (copyButton) {
  copyButton.addEventListener("click", async () => {
    const target = document.querySelector(copyButton.getAttribute("data-copy"));
    if (!target) return;

    try {
      await navigator.clipboard.writeText(target.innerText.trim());
      if (copyStatus) copyStatus.textContent = "Copied to clipboard.";
    } catch {
      if (copyStatus) copyStatus.textContent = "Copy failed. Select the text manually.";
    }

    window.clearTimeout(copyButton._statusTimer);
    copyButton._statusTimer = window.setTimeout(() => {
      if (copyStatus) copyStatus.textContent = "";
    }, 1800);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter((section) => section instanceof HTMLElement);

  if (!("IntersectionObserver" in window) || sections.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-active", isActive);
          if (isActive) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      }
    },
    { rootMargin: "-25% 0px -65% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
});

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = form.querySelector(".form-status");
  const submitButton = form.querySelector('button[type="submit"]');

  const setStatus = (text, type) => {
    if (!status) return;
    status.textContent = text;
    status.classList.remove("is-success", "is-error");
    status.classList.add(type);
  };

  // Fallback guidance lives in the markup, not duplicated here as a string:
  // it stays clickable for sighted users and is announced to screen readers.
  const fallback = form.querySelector(".form-fallback");
  if (fallback) fallback.hidden = true;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (submitButton) submitButton.disabled = true;

    // Post to the endpoint declared in the markup, so the form still works
    // with JavaScript disabled.
    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Formspree responded with ${response.status}`);
        form.reset();
        setStatus("Thanks for your message — it has been sent.", "is-success");
      })
      .catch(() => {
        setStatus("Sorry, your message could not be sent.", "is-error");
        if (fallback) fallback.hidden = false;
      })
      .finally(() => {
        if (submitButton) submitButton.disabled = false;
      });
  });
});

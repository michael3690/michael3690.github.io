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
    status.textContent = text;
    status.classList.remove("is-success", "is-error");
    status.classList.add(type);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (submitButton) submitButton.disabled = true;

    fetch("https://formspree.io/f/mljjvqbj?hide_success=true", {
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
        setStatus(
          "Sorry, something went wrong sending your message. Please email michaeldonohoe58@gmail.com directly.",
          "is-error"
        );
      })
      .finally(() => {
        if (submitButton) submitButton.disabled = false;
      });
  });
});

gsap.registerPlugin(ScrollTrigger, TextPlugin);
const mm = gsap.matchMedia();

// TYPED effect
const roles = ["UI Designer.", "Creador Digital.", "Tech Enthusiast.", "Front End Dev."];
let ri = 0, ci = 0, del = false;
const typed = document.querySelector(".typed");
function typeAnim() {
  const current = roles[ri];
  if (!del) {
    typed.textContent = current.slice(0, ++ci);
    if (ci === current.length) { del = true; setTimeout(typeAnim, 1500); return; }
  } else {
    typed.textContent = current.slice(0, --ci);
    if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(typeAnim, del ? 60 : 120);
}
setTimeout(typeAnim, 1800);

// NAVBAR scroll
ScrollTrigger.create({
  trigger: "body",
  start: "80px top",
  onEnter: () => document.getElementById("navbar").classList.add("scrolled"),
  onLeaveBack: () => document.getElementById("navbar").classList.remove("scrolled"),
});

// ============ DESKTOP ============
mm.add("(min-width:901px)", () => {

  // HERO
  gsap.timeline({ delay: 0.3 })
    .to(".hero-tag", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
    .to(".hero-name", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=.2")
    .to(".hero-role", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=.3")
    .to(".hero-cta", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=.2");

  // SOBRE
  gsap.from(".sobre-img-wrap", { opacity: 0, x: -60, duration: 1, scrollTrigger: { trigger: "#sobre", start: "top 75%" } });
  gsap.from(".sobre-text > *", { opacity: 0, y: 30, duration: 0.7, stagger: 0.15, scrollTrigger: { trigger: "#sobre", start: "top 70%" } });

  // STATS
  document.querySelectorAll(".stat-num").forEach((el) => {
    ScrollTrigger.create({
      trigger: el, start: "top 85%", once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: +el.dataset.target, duration: 2, ease: "power1.out",
          onUpdate: function () { el.textContent = Math.round(this.targets()[0].val); }
        });
      }
    });
  });

  // SKILLS
  document.querySelectorAll(".skill-bar").forEach((bar) => {
    ScrollTrigger.create({
      trigger: bar, start: "top 85%", once: true,
      onEnter: () => gsap.to(bar, { width: bar.dataset.width + "%", duration: 1.2, ease: "power2.out" })
    });
  });

  // PROYECTOS
  gsap.from(".proyecto-card", { opacity: 0, y: 50, duration: 0.7, stagger: 0.15, scrollTrigger: { trigger: "#proyectos", start: "top 70%" } });

  // BREAK
  gsap.from(".break-section h2", { opacity: 0, y: 40, duration: 0.8, scrollTrigger: { trigger: "#break1", start: "top 75%" } });

  // TIMELINE
document.querySelectorAll(".timeline-item").forEach((item, i) => {
  gsap.fromTo(item,
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: 0.7, delay: i * 0.15, scrollTrigger: { trigger: item, start: "top 80%" } }
  );
});

  // CONTACTO
  gsap.from(".contacto-info", { opacity: 0, x: -40, duration: 0.8, scrollTrigger: { trigger: "#contacto", start: "top 70%" } });
  gsap.from(".contacto-form", { opacity: 0, x: 40, duration: 0.8, scrollTrigger: { trigger: "#contacto", start: "top 70%" } });
});

// ============ MÓVIL ============
mm.add("(max-width:900px)", () => {

  // Hero visible de una
  gsap.set([".hero-tag", ".hero-name", ".hero-role", ".hero-cta"], { opacity: 1, y: 0 });
  gsap.timeline({ delay: 0.3 })
    .to(".hero-tag", { opacity: 1, y: 0, duration: 0.5 })
    .to(".hero-name", { opacity: 1, y: 0, duration: 0.5 }, "-=.1")
    .to(".hero-role", { opacity: 1, y: 0, duration: 0.5 }, "-=.1")
    .to(".hero-cta", { opacity: 1, y: 0, duration: 0.5 }, "-=.1");

  // Barras al ancho correcto
  document.querySelectorAll(".skill-bar").forEach((bar) => {
    bar.style.width = bar.dataset.width + "%";
  });

  // Timeline visible
  document.querySelectorAll(".timeline-item").forEach((el) => {
    el.style.opacity = 1;
    el.style.transform = "none";
  });
  // Stats en móvil — valor directo sin animación
document.querySelectorAll(".stat-num").forEach((el) => {
  el.textContent = el.dataset.target;
});

  // IntersectionObserver para mob-hidden
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll(".mob-hidden").forEach((el) => observer.observe(el));
});
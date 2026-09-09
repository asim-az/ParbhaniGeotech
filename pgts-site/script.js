// ===== Loader =====
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => loader.classList.add("hide"), 400);
});

// ===== Scroll progress bar =====
const progress = document.getElementById("scrollProgress");
function updateProgress(){
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progress.style.width = scrolled + "%";
}
document.addEventListener("scroll", updateProgress);

// ===== Nav scrolled state =====
const nav = document.getElementById("nav");
function updateNav(){
  if(window.scrollY > 40) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
}
document.addEventListener("scroll", updateNav);

// ===== Mobile menu =====
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  burger.classList.remove("open");
  navLinks.classList.remove("open");
}));

// ===== Active nav link on scroll =====
const sections = document.querySelectorAll("section[id]");
const links = document.querySelectorAll(".nav-link");
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      links.forEach(l => l.classList.remove("active"));
      const active = document.querySelector(`.nav-link[data-sec="${entry.target.id}"]`);
      if(active) active.classList.add("active");
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach(sec => navObserver.observe(sec));

// ===== Reveal on scroll =====
const revealEls = document.querySelectorAll(".reveal-up");
revealEls.forEach((el, i) => el.style.setProperty("--i", i % 6));
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ===== Strata timeline draw =====
const strataLine = document.getElementById("strataLine");
if(strataLine){
  const strataObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        strataLine.classList.add("drawn");
        strataObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  strataObserver.observe(strataLine);
}

// ===== Animated counters =====
const counters = document.querySelectorAll("[data-count]");
function animateCounter(el){
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const duration = 1400;
  const start = performance.now();
  function tick(now){
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const value = Math.round(target * eased);
    el.textContent = value + suffix;
    if(p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });
counters.forEach(c => counterObserver.observe(c));

// ===== Curtain page transition on internal nav =====
const curtain = document.getElementById("curtain");
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if(!target) return;
    e.preventDefault();
    curtain.classList.add("sweep-in");
    setTimeout(() => {
      target.scrollIntoView({ behavior: "auto", block: "start" });
      curtain.classList.remove("sweep-in");
      curtain.classList.add("sweep-out");
      setTimeout(() => curtain.classList.remove("sweep-out"), 550);
    }, 380);
  });
});

// ===== Unified expand modal (images + service cards) =====
const expandModal = document.getElementById("expandModal");
const expandBackdrop = document.getElementById("expandBackdrop");
const expandClose = document.getElementById("expandClose");
const expandImg = document.getElementById("expandImg");
const expandMedia = document.querySelector(".expand-media");
const expandTitle = document.getElementById("expandTitle");
const expandMeta = document.getElementById("expandMeta");
const expandDesc = document.getElementById("expandDesc");

function openExpand(el){
  const isImg = el.tagName === "IMG";
  const imgSrc = el.dataset.img || (isImg ? el.src : "");
  const title = el.dataset.title || (isImg ? el.alt : "");
  const meta = el.dataset.meta || "";
  const desc = el.dataset.desc || "";

  if(imgSrc){
    expandImg.src = imgSrc;
    expandImg.alt = title;
    expandMedia.style.display = "block";
  } else {
    expandMedia.style.display = "none";
  }
  expandTitle.textContent = title;
  expandMeta.textContent = meta;
  expandMeta.style.display = meta ? "inline-block" : "none";
  expandDesc.textContent = desc;
  expandModal.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeExpand(){
  expandModal.classList.remove("open");
  document.body.style.overflow = "";
}

// Standalone expandable-card elements (service cards) open directly
document.querySelectorAll(".expandable-card").forEach(el => {
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    openExpand(el);
  });
});

// Photo-frame images: flash the frame, then open the modal with that image's info
document.querySelectorAll(".photo-frame").forEach(frame => {
  frame.addEventListener("click", (e) => {
    e.stopPropagation();
    const img = frame.querySelector(".expandable");
    if(!img) return;
    frame.classList.add("flashing");
    setTimeout(() => frame.classList.remove("flashing"), 500);
    setTimeout(() => openExpand(img), 140);
  });
});

expandClose.addEventListener("click", closeExpand);
expandBackdrop.addEventListener("click", closeExpand);
document.addEventListener("keydown", (e) => { if(e.key === "Escape") closeExpand(); });

// ===== Tilt effect on cards =====
const tiltEls = document.querySelectorAll(".tilt");
tiltEls.forEach(el => {
  el.addEventListener("mousemove", (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-4px)`;
  });
  el.addEventListener("mouseleave", () => { el.style.transform = ""; });
});

// ===== Ripple on buttons =====
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const r = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    const size = Math.max(r.width, r.height);
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = (e.clientX - r.left - size / 2) + "px";
    ripple.style.top = (e.clientY - r.top - size / 2) + "px";
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

// ===== Seamless collaborations marquee =====
// Duplicate the track content once so the CSS translateX(-50%) loop has no visible seam,
// then re-bind flash/click + tilt behaviour on the cloned photo-frames.
const marqueeTrack = document.getElementById("marqueeTrack");
if(marqueeTrack){
  const clones = Array.from(marqueeTrack.children).map(node => node.cloneNode(true));
  clones.forEach(node => marqueeTrack.appendChild(node));
  marqueeTrack.querySelectorAll(".photo-frame").forEach(frame => {
    frame.classList.add("developed"); // marquee logos are always visible, skip the reveal-triggered develop effect
    frame.addEventListener("click", (e) => {
      e.stopPropagation();
      const img = frame.querySelector(".expandable");
      if(!img) return;
      frame.classList.add("flashing");
      setTimeout(() => frame.classList.remove("flashing"), 500);
      setTimeout(() => openExpand(img), 140);
    });
  });
}

// ===== Contact form (front-end only) =====
const form = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("cf-name").value.trim();
  const phone = document.getElementById("cf-phone").value.trim();
  const message = document.getElementById("cf-message").value.trim();
  const body = `Hi PGTS, I'm ${name} (${phone}). ${message}`;
  const waLink = `https://wa.me/918080606537?text=${encodeURIComponent(body)}`;
  formNote.textContent = "Thanks! Opening WhatsApp to send your message… 🚀";
  setTimeout(() => window.open(waLink, "_blank"), 500);
  form.reset();
});

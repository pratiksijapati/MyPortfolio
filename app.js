// ── TYPEWRITER EFFECT ──
const words = ["Frontend Developer", "React Developer", "UI/UX Designer", "AI/ML Enthusiast"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let current = "";

function type() {
  const word = words[wordIndex];

  if (!isDeleting) {
    current = word.slice(0, ++charIndex);
  } else {
    current = word.slice(0, --charIndex);
  }

  document.getElementById("typed").textContent = current + "|";

  if (!isDeleting && charIndex === word.length) {
    setTimeout(() => {
      isDeleting = true;
      setTimeout(type, 80);
    }, 1400);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
  }

  setTimeout(type, isDeleting ? 60 : 90);
}

type();


// ── MOBILE MENU TOGGLE ──
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");

menuBtn.addEventListener("click", () => {
  mobileNav.classList.toggle("open");
  menuBtn.textContent = mobileNav.classList.contains("open") ? "✕" : "☰";
});

document.querySelectorAll(".mnav-link").forEach(link => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuBtn.textContent = "☰";
  });
});
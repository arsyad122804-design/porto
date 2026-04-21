// NAVBAR SCROLL
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
});

// BACK TO TOP
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// HAMBURGER
document.getElementById('hamburger').addEventListener('click', () => {
  const nav = document.getElementById('navLinks');
  const isOpen = nav.style.display === 'flex';
  nav.style.display = isOpen ? 'none' : 'flex';
  if (!isOpen) {
    Object.assign(nav.style, {
      flexDirection: 'column', position: 'absolute',
      top: '64px', left: '0', right: '0',
      background: 'rgba(8,8,16,0.98)', padding: '20px 24px',
      borderBottom: '1px solid rgba(108,99,255,0.2)',
      backdropFilter: 'blur(20px)', zIndex: '999'
    });
  }
});

// TYPING EFFECT
const roles = ['AI Enthusiast', 'UI/UX Designer', 'Web Developer', 'Trader Profesional'];
let ri = 0, ci = 0, del = false;
const roleEl = document.getElementById('roleText');
function typeRole() {
  const cur = roles[ri];
  roleEl.textContent = del ? cur.substring(0, ci--) : cur.substring(0, ci++);
  if (!del && ci > cur.length) { del = true; setTimeout(typeRole, 2000); return; }
  if (del && ci < 0) { del = false; ri = (ri + 1) % roles.length; setTimeout(typeRole, 400); return; }
  setTimeout(typeRole, del ? 55 : 95);
}
typeRole();

// SCROLL ANIMATIONS + SKILL BARS
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      e.target.querySelectorAll('.skill-bar-fill').forEach(b => {
        b.style.width = b.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.timeline-card, .project-card, .edu-card, .hobi-card, .skill-card, .skills-bars, .about-grid, .contact-grid'
).forEach(el => { el.classList.add('fade-up'); observer.observe(el); });

// CONTACT FORM
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.innerHTML = '<i class="fas fa-check"></i> Pesan Terkirim!';
  btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
  setTimeout(() => {
    btn.innerHTML = 'Kirim Pesan <i class="fas fa-paper-plane"></i>';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
});

// ACTIVE NAV HIGHLIGHT
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) cur = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + cur ? '#fff' : '';
  });
});

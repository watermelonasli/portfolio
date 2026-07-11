/* ==========================================================================
   RENDER — builds the tech marquee & project cards from data.js
   ========================================================================== */

function techPillHTML(tech) {
  return `
    <div class="tech-pill">
      <div class="tech-icon" style="background:#fff;">
        <i class="${tech.icon || 'fa-solid fa-code'}"></i>
      </div>
      <span class="tech-name">${tech.name}</span>
    </div>`;
}

function renderTechMarquee() {
  const track = document.getElementById('techTrack');
  if (!track) return;
  // duplicate the list 4x, same as the original Blade @foreach x4, for a seamless loop
  let html = '';
  for (let i = 0; i < 4; i++) {
    html += technologies.map(techPillHTML).join('');
  }
  track.innerHTML = html;
}

function projectCardHTML(project) {
  const thumb = project.image
    ? `<a href="${project.link || '#'}"><img src="${project.image}" alt="${project.title}"></a>`
    : `<a href="${project.link || '#'}" class="project-thumb-placeholder"><i class="fa-solid fa-image"></i></a>`;

  return `
    <div class="project-card reveal active">
      <div class="card-top-line bg-gradient-to-r from-[#fd9707] to-transparent"></div>
      <div class="project-thumb">${thumb}</div>
      <div class="p-5 flex flex-col flex-1">
        <div class="flex items-start justify-between gap-2 mb-3">
          <h3 style="color:#fff;font-size:15px;font-weight:700;font-family:'Cabinet Grotesk',sans-serif;">
            ${project.title}
          </h3>
        </div>
        <p style="color:var(--text-muted);font-size:12px;line-height:1.7;flex:1;margin-bottom:16px;">
          ${project.description || 'No description available.'}
        </p>
        ${project.techStack ? `
        <div style="margin-bottom:12px;">
          <span style="font-size:10px;color:rgba(255,255,255,0.3);">Tech: ${project.techStack}</span>
        </div>` : ''}
        <div style="border-top:1px solid rgba(255,255,255,0.05);padding-top:12px;">
          <span style="font-size:11px;color:rgba(255,255,255,0.2);display:flex;align-items:center;gap:6px;">
            <i class="fa-regular fa-calendar"></i> ${project.year || ''}
          </span>
        </div>
      </div>
    </div>`;
}

function renderProjects() {
  const grid = document.getElementById('projectGrid');
  if (!grid) return;

  if (!projects || projects.length === 0) {
    grid.innerHTML = `<div class="col-span-3 text-center text-muted">No projects yet. Check back soon!</div>`;
    return;
  }
  grid.innerHTML = projects.map(projectCardHTML).join('');
}

function renderProjectCount() {
  const el = document.getElementById('projectCount');
  if (el) el.textContent = projects.length;
}

/* ==========================================================================
   CURSOR
   ========================================================================== */
function initCursor() {
  const cur = document.getElementById('cur');
  const curR = document.getElementById('cur-r');
  if (!cur || !curR) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function loop() {
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    curR.style.left = rx + 'px';
    curR.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
}

/* ==========================================================================
   NAV SCROLL STATE
   ========================================================================== */
function initNavScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* ==========================================================================
   REVEAL ON SCROLL
   ========================================================================== */
function initReveal() {
  function revealOnScroll() {
    document.querySelectorAll('.reveal').forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight - 48) el.classList.add('active');
      else el.classList.remove('active');
    });
  }
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();
}

/* ==========================================================================
   MESSAGE CHAR COUNTER
   ========================================================================== */
function initCharCounter() {
  const msgArea = document.getElementById('message');
  const charCount = document.getElementById('charCount');
  if (!msgArea || !charCount) return;
  msgArea.addEventListener('input', () => {
    const len = msgArea.value.length;
    const max = parseInt(msgArea.getAttribute('maxlength'));
    charCount.textContent = len + ' / ' + max;
    charCount.className = 'char-count' + (len > max * 0.9 ? (len >= max ? ' over' : ' warn') : '');
  });
}

/* ==========================================================================
   CONTACT FORM
   This is a static site (GitHub Pages has no backend / PHP), so the form
   can't post to /contact like the Laravel version did. It's wired up here
   to submit to Formspree (https://formspree.io) — free tier is enough for
   a portfolio contact form.

   SETUP:
   1. Create a free account at https://formspree.io
   2. Create a new form, copy the endpoint it gives you
      (looks like https://formspree.io/f/xxxxxxxx)
   3. Paste it into FORM_ENDPOINT below
   ========================================================================== */
const FORM_ENDPOINT = "https://formspree.io/f/your-form-id"; // <-- replace this

function initContactForm() {
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('submitBtn');
  const toast = document.getElementById('formToast');
  if (!form || !btn) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    btn.classList.add('loading');
    btn.querySelector('.btn-text').textContent = 'Sending…';

    try {
      const formData = new FormData(form);
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        form.reset();
        document.getElementById('charCount').textContent = '0 / 500';
        if (toast) toast.classList.add('show');
      } else {
        alert('Something went wrong sending your message. Please try again or email me directly.');
      }
    } catch (err) {
      alert('Something went wrong sending your message. Please try again or email me directly.');
    } finally {
      btn.classList.remove('loading');
      btn.querySelector('.btn-text').textContent = 'Send Message';
    }
  });
}

/* ==========================================================================
   MOBILE MENU
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    mobileMenu.classList.toggle('hiddens');
    const icon = this.querySelector('i');
    icon.className = mobileMenu.classList.contains('hiddens') ? 'fa-solid fa-bars' : 'fa-solid fa-xmark';
  });

  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hiddens');
      menuToggle.querySelector('i').className = 'fa-solid fa-bars';
    });
  });

  document.addEventListener('click', function (event) {
    if (!mobileMenu.classList.contains('hiddens') &&
        !menuToggle.contains(event.target) &&
        !mobileMenu.contains(event.target)) {
      mobileMenu.classList.add('hiddens');
      menuToggle.querySelector('i').className = 'fa-solid fa-bars';
    }
  });
}

/* ==========================================================================
   INIT
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderTechMarquee();
  renderProjects();
  renderProjectCount();
  initCursor();
  initNavScroll();
  initReveal();
  initCharCounter();
  initContactForm();
  initMobileMenu();
});

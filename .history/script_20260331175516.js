/* ═══════════════════════════════════════════════════════════════════
   PERSONAL.OS — MAIN SCRIPT
   Laser effects / Particles / GitHub API / Animations
   ═══════════════════════════════════════════════════════════════════ */

// ── CONFIG — REPLACE WITH YOUR INFO ──────────────────────────────────
const CONFIG = {
  github_username: 'YOUR_USERNAME',   // ← 填入你的 GitHub 用户名
  github_token: '',                    // ← 可选：填入 GitHub Personal Access Token
  site_name: 'SHENGBO SUN',           // ← 显示名
  roles: [                             // ← 打字机循环显示的职位
    'Software Engineer',
    'Full Stack Developer',
    'Open Source Enthusiast',
    'Knowledge Collector',
  ],
};
// ─────────────────────────────────────────────────────────────────────

/* ═══════════════════════ CUSTOM CURSOR ════════════════════════════ */
(function() {
  const dot = document.createElement('div');
  dot.style.cssText = `
    position:fixed;width:12px;height:12px;
    background:#00f5ff;border-radius:50%;
    pointer-events:none;z-index:99999;
    box-shadow:0 0 8px #00f5ff,0 0 20px rgba(0,245,255,0.4);
    transform:translate(-50%,-50%);transition:transform 0.05s;
    mix-blend-mode:screen;
  `;

  const ring = document.createElement('div');
  ring.style.cssText = `
    position:fixed;width:30px;height:30px;
    border:1px solid rgba(0,245,255,0.5);border-radius:50%;
    pointer-events:none;z-index:99998;
    transform:translate(-50%,-50%);
    transition:width 0.2s,height 0.2s,opacity 0.2s;
  `;

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function animRing() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  document.addEventListener('mousedown', () => {
    dot.style.transform = 'translate(-50%,-50%) scale(2)';
    ring.style.width = '50px'; ring.style.height = '50px';
    ring.style.opacity = '0.5';
  });
  document.addEventListener('mouseup', () => {
    dot.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.width = '30px'; ring.style.height = '30px';
    ring.style.opacity = '1';
  });

  const hoverTargets = 'a, button, .gallery-item, .article-card, .repo-card, .contact-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      dot.style.transform = 'translate(-50%,-50%) scale(0.5)';
      ring.style.width = '44px'; ring.style.height = '44px';
      ring.style.borderColor = 'rgba(0,245,255,0.9)';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.width = '30px'; ring.style.height = '30px';
      ring.style.borderColor = 'rgba(0,245,255,0.5)';
    }
  });
})();

/* ═══════════════════════ MATRIX RAIN ══════════════════════════════ */
function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, cols, drops;

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&ΑΒΓΔΘΛΞΠΣΦΨΩαβγδθλξπσφψω';
  const fontSize = 13;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols  = Math.floor(W / fontSize);
    drops = Array(cols).fill(1).map(() => Math.random() * -H / fontSize);
  }

  window.addEventListener('resize', resize);
  resize();

  function draw() {
    ctx.fillStyle = 'rgba(2,4,8,0.04)';
    ctx.fillRect(0, 0, W, H);

    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];

      // Leading char is brighter
      ctx.fillStyle = '#00f5ff';
      ctx.font = `${fontSize}px "Share Tech Mono", monospace`;
      ctx.fillText(char, i * fontSize, y * fontSize);

      // Trail
      ctx.fillStyle = 'rgba(0,180,200,0.7)';
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, (y - 1) * fontSize);

      if (y * fontSize > H && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.5;
    });
  }

  return setInterval(draw, 33);
}

/* ═══════════════════════ BOOT TEXT EFFECT ═════════════════════════ */
const bootLines = [
  'INITIALIZING KERNEL... OK',
  'LOADING NEURAL INTERFACE...',
  'ESTABLISHING SECURE CHANNEL...',
  'DECRYPTING ARCHIVE NODES...',
  'SYSTEM READY',
];

function runBootSequence() {
  const el = document.getElementById('boot-text');
  let lineIdx = 0;
  let charIdx = 0;
  let current = '';

  const interval = setInterval(() => {
    if (lineIdx >= bootLines.length) { clearInterval(interval); return; }

    const target = bootLines[lineIdx];
    if (charIdx < target.length) {
      current += target[charIdx++];
      el.textContent = current + '▮';
    } else {
      setTimeout(() => {
        current = '';
        charIdx = 0;
        lineIdx++;
        if (lineIdx < bootLines.length) {
          el.textContent = '';
        }
      }, 400);
    }
  }, 30);
}

/* ═══════════════════════ LAUNCH / LASER TRANSITION ════════════════ */
function launchSite() {
  const intro      = document.getElementById('intro-screen');
  const transition = document.getElementById('laser-transition');
  const mainSite   = document.getElementById('main-site');
  const laserH     = document.querySelector('.laser-h');
  const laserH2    = document.querySelector('.laser-h-2');
  const laserV     = document.querySelector('.laser-v');
  const laserV2    = document.querySelector('.laser-v-2');
  const laserFlash = document.querySelector('.laser-flash');

  // Disable button
  document.getElementById('enter-btn').disabled = true;

  // Phase 1: flash intro
  intro.style.animation = 'none';
  intro.style.transition = 'opacity 0.2s';
  intro.style.opacity = '0.7';

  setTimeout(() => {
    // Phase 2: show laser transition layer
    transition.classList.add('active');

    // Horizontal laser expands
    laserH.style.transition  = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
    laserH2.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
    laserH.style.transform   = 'scaleX(1)';
    laserH2.style.transform  = 'scaleX(1)';

    setTimeout(() => {
      // Vertical laser expands
      laserV.style.transition  = 'transform 0.35s cubic-bezier(0.4,0,0.2,1)';
      laserV2.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1)';
      laserV.style.transform   = 'scaleY(1)';
      laserV2.style.transform  = 'scaleY(1)';

      setTimeout(() => {
        // Flash + explode
        laserFlash.style.transition = 'opacity 0.15s';
        laserFlash.style.opacity    = '1';

        // Lasers scatter outward
        laserH.style.transition  = 'transform 0.5s ease, opacity 0.5s';
        laserH2.style.transition = 'transform 0.5s ease, opacity 0.5s';
        laserH.style.transform   = 'scaleX(3) scaleY(8)';
        laserH2.style.transform  = 'scaleX(3) scaleY(8)';
        laserV.style.transform   = 'scaleY(3) scaleX(8)';
        laserV2.style.transform  = 'scaleY(3) scaleX(8)';

        setTimeout(() => {
          // Hide intro + transition, show main
          intro.style.transition  = 'opacity 0.3s';
          intro.style.opacity     = '0';
          transition.style.opacity = '0';
          transition.style.transition = 'opacity 0.3s';

          mainSite.classList.remove('hidden');
          mainSite.style.opacity = '0';
          mainSite.style.transition = 'opacity 0.5s';

          setTimeout(() => {
            mainSite.style.opacity = '1';
            intro.style.display = 'none';
            transition.style.display = 'none';

            // Init main site systems
            initParticles();
            initTypingEffect();
            fetchGitHubData();
            initScrollAnimations();
          }, 100);

        }, 350);
      }, 350);
    }, 400);
  }, 200);
}

/* ═══════════════════════ PARTICLES ════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const count = 80;
  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.5 + 0.1,
  }));

  let mouseX = -9999, mouseY = -9999;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    particles.forEach((p, i) => {
      particles.slice(i + 1).forEach(q => {
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,245,255,${alpha})`;
          ctx.lineWidth   = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      });

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,245,255,${p.opacity})`;
      ctx.fill();

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Mouse repulsion
      const mdx = p.x - mouseX, mdy = p.y - mouseY;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 100) {
        const force = (100 - mdist) / 100 * 0.8;
        p.vx += (mdx / mdist) * force;
        p.vy += (mdy / mdist) * force;
      }

      // Dampen
      p.vx *= 0.99; p.vy *= 0.99;

      // Bounce
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

/* ═══════════════════════ TYPING EFFECT ════════════════════════════ */
function initTypingEffect() {
  const el = document.getElementById('typed-role');
  const roles = CONFIG.roles;
  let rIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const current = roles[rIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      el.textContent = current.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        rIdx = (rIdx + 1) % roles.length;
      }
    }
    setTimeout(type, deleting ? 60 : 90);
  }
  type();
}

/* ═══════════════════════ GITHUB API ═══════════════════════════════ */
async function fetchGitHubData() {
  const username = CONFIG.github_username;
  if (!username || username === 'YOUR_USERNAME') {
    renderFallbackRepos();
    return;
  }

  const headers = {};
  if (CONFIG.github_token) {
    headers['Authorization'] = `Bearer ${CONFIG.github_token}`;
  }

  try {
    // Fetch user profile
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (userRes.ok) {
      const user = await userRes.json();
      document.getElementById('github-avatar').src = user.avatar_url;
      document.getElementById('dp-username').textContent  = user.login;
      document.getElementById('dp-location').textContent  = user.location || 'EARTH';
      document.getElementById('dp-followers').textContent = user.followers;
      document.getElementById('stat-repos').textContent   = user.public_repos;

      // Update nav username
      const heroName = document.querySelector('.nav-name');
      if (heroName) heroName.textContent = user.login.toUpperCase();
    }

    // Fetch repos
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=stars&per_page=12&type=public`,
      { headers }
    );
    if (reposRes.ok) {
      const repos = await reposRes.json();
      const sorted = repos.sort((a, b) => (b.stargazers_count - a.stargazers_count));

      // Count total stars
      const totalStars = sorted.reduce((sum, r) => sum + r.stargazers_count, 0);
      document.getElementById('stat-stars').textContent = totalStars;

      renderRepos(sorted.slice(0, 9));
    }
  } catch (err) {
    console.warn('GitHub API error:', err);
    renderFallbackRepos();
  }
}

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Go:         '#00ADD8',
  Python:     '#3572A5',
  Rust:       '#dea584',
  Java:       '#b07219',
  'C++':      '#f34b7d',
  C:          '#555555',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  Vue:        '#41b883',
  Swift:      '#F05138',
  Kotlin:     '#A97BFF',
  Shell:      '#89e051',
};

function getLangColor(lang) {
  return LANG_COLORS[lang] || '#8b949e';
}

function renderRepos(repos) {
  const grid = document.getElementById('repos-grid');
  grid.innerHTML = repos.map(repo => `
    <a href="${repo.html_url}" target="_blank" class="repo-card">
      <div class="repo-name">${repo.name.toUpperCase()}</div>
      <div class="repo-desc">${repo.description || 'No description provided.'}</div>
      <div class="repo-meta">
        ${repo.language ? `
          <div class="repo-lang">
            <div class="lang-dot" style="background:${getLangColor(repo.language)}"></div>
            <span>${repo.language}</span>
          </div>
        ` : ''}
        <div class="repo-stars">★ ${repo.stargazers_count}</div>
        <div class="repo-forks">⑂ ${repo.forks_count}</div>
      </div>
    </a>
  `).join('');
}

function renderFallbackRepos() {
  const grid = document.getElementById('repos-grid');
  grid.innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:40px;
         font-family:'Share Tech Mono',monospace;font-size:12px;
         letter-spacing:3px;color:var(--text-dim);">
      // SET CONFIG.github_username IN script.js TO LOAD REPOS
    </div>
  `;
}

/* ═══════════════════════ SCROLL ANIMATIONS ════════════════════════ */
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.article-card, .gallery-item, .repo-card, .contact-card, .hero-content, .hero-visual'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity    = '1';
          entry.target.style.transform  = entry.target.style.transform
            ? entry.target.style.transform.replace('translateY(30px)', 'translateY(0)')
            : 'translateY(0)';
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s, box-shadow 0.3s';
    observer.observe(el);
  });
}

/* ═══════════════════════ NAVBAR SCROLL ═══════════════════════════ */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.style.background = 'rgba(2,4,8,0.95)';
    } else {
      nav.style.background = 'rgba(2,4,8,0.85)';
    }
  });

  // Active link
  const links = nav.querySelectorAll('.nav-link');
  const sections = Array.from(links).map(l => document.querySelector(l.getAttribute('href')));

  const sObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => l.classList.toggle(
          'active', l.getAttribute('href') === `#${id}`
        ));
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => s && sObs.observe(s));
}

/* ═══════════════════════ LASER HOVER TRAIL ════════════════════════ */
function initLaserTrail() {
  const trail = [];
  const maxTrail = 15;

  document.addEventListener('mousemove', e => {
    trail.push({ x: e.clientX, y: e.clientY, life: 1 });
    if (trail.length > maxTrail) trail.shift();
  });

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99990;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function drawTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 1; i < trail.length; i++) {
      const alpha = (i / trail.length) * 0.35;
      const prev = trail[i - 1];
      const curr = trail[i];
      ctx.beginPath();
      ctx.strokeStyle = `rgba(0,245,255,${alpha})`;
      ctx.lineWidth   = (i / trail.length) * 2;
      ctx.shadowBlur  = 6;
      ctx.shadowColor = 'rgba(0,245,255,0.4)';
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(curr.x, curr.y);
      ctx.stroke();
    }

    requestAnimationFrame(drawTrail);
  }
  drawTrail();
}

/* ═══════════════════════ INIT ═════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Start matrix rain
  initMatrix();

  // Boot sequence text
  setTimeout(runBootSequence, 500);

  // Laser trail follows cursor on main site
  document.getElementById('main-site').addEventListener('transitionend', () => {
    initLaserTrail();
    initNavbar();
  }, { once: true });
});

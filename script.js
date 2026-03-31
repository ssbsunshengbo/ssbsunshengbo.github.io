/* ═══════════════════════════════════════════════════════════════════
   PERSONAL.OS — MAIN SCRIPT (Performance Optimized)
   ═══════════════════════════════════════════════════════════════════ */

const CONFIG = {
  github_username: 'ssbsunshengbo',
  github_token: '',  // Token not stored in public repo; public API rate limit is sufficient
  site_name: 'SHENGBO SUN',
  roles: [
    'Software Engineer',
    'Full Stack Developer',
    'Open Source Enthusiast',
    'Knowledge Collector',
  ],
};

/* ═══════════════ CUSTOM CURSOR ════════════════════════════════════ */
(function () {
  const dot  = document.createElement('div');
  const ring = document.createElement('div');

  dot.style.cssText = `position:fixed;width:10px;height:10px;background:#00f5ff;
    border-radius:50%;pointer-events:none;z-index:99999;
    box-shadow:0 0 6px #00f5ff;transform:translate(-50%,-50%);
    will-change:transform;`;
  ring.style.cssText = `position:fixed;width:28px;height:28px;
    border:1px solid rgba(0,245,255,0.55);border-radius:50%;
    pointer-events:none;z-index:99998;transform:translate(-50%,-50%);
    will-change:transform;transition:width .18s,height .18s,border-color .18s;`;

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  }, { passive: true });

  let rafCursor;
  function tickCursor() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = Math.round(rx) + 'px';
    ring.style.top  = Math.round(ry) + 'px';
    rafCursor = requestAnimationFrame(tickCursor);
  }
  tickCursor();

  const HOVER_SEL = 'a,button,.gallery-item,.article-card,.repo-card,.contact-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(HOVER_SEL)) {
      ring.style.width  = ring.style.height = '40px';
      ring.style.borderColor = 'rgba(0,245,255,0.9)';
    }
  }, { passive: true });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(HOVER_SEL)) {
      ring.style.width  = ring.style.height = '28px';
      ring.style.borderColor = 'rgba(0,245,255,0.55)';
    }
  }, { passive: true });
})();

/* ═══════════════ MATRIX RAIN ══════════════════════════════════════
   Optimisation: requestAnimationFrame + frame-skip + pre-built char array
   ════════════════════════════════════════════════════════════════ */
function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx    = canvas.getContext('2d', { alpha: false });
  let W, H, cols, drops;

  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&ΑΒΓΘΛΞΠΣΦΨΩαβγδθλξπσφψω'.split('');
  const FS    = 14;
  let frame   = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols  = Math.floor(W / FS);
    drops = new Float32Array(cols).map(() => Math.random() * -(H / FS));
  }

  const onResize = debounce(resize, 150);
  window.addEventListener('resize', onResize, { passive: true });
  resize();

  function drawMatrix() {
    frame++;
    // Only draw every 2nd frame (~30fps) to cut GPU load
    if (frame % 2 === 0) {
      ctx.fillStyle = 'rgba(2,4,8,0.06)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = `${FS}px "Share Tech Mono",monospace`;

      for (let i = 0; i < cols; i++) {
        const y = drops[i];
        if (y * FS > -FS && y * FS < H + FS) {
          ctx.fillStyle = '#00f5ff';
          ctx.fillText(CHARS[Math.random() * CHARS.length | 0], i * FS, y * FS);
        }
        if (y * FS > H && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.4;
      }
    }
    requestAnimationFrame(drawMatrix);
  }
  drawMatrix();
}

/* ═══════════════ BOOT TEXT ════════════════════════════════════════ */
const BOOT_LINES = [
  'INITIALIZING KERNEL... OK',
  'LOADING NEURAL INTERFACE...',
  'ESTABLISHING SECURE CHANNEL...',
  'DECRYPTING ARCHIVE NODES...',
  'SYSTEM READY',
];

function runBootSequence() {
  const el = document.getElementById('boot-text');
  let li = 0, ci = 0, cur = '';

  const iv = setInterval(() => {
    if (li >= BOOT_LINES.length) { clearInterval(iv); return; }
    const t = BOOT_LINES[li];
    if (ci < t.length) {
      cur += t[ci++];
      el.textContent = cur + '▮';
    } else {
      setTimeout(() => { cur = ''; ci = 0; li++; el.textContent = ''; }, 360);
    }
  }, 28);
}

/* ═══════════════ LAUNCH / LASER TRANSITION ════════════════════════ */
function launchSite() {
  const intro      = document.getElementById('intro-screen');
  const transition = document.getElementById('laser-transition');
  const mainSite   = document.getElementById('main-site');
  const lH  = document.querySelector('.laser-h');
  const lH2 = document.querySelector('.laser-h-2');
  const lV  = document.querySelector('.laser-v');
  const lV2 = document.querySelector('.laser-v-2');
  const lF  = document.querySelector('.laser-flash');

  document.getElementById('enter-btn').disabled = true;
  intro.style.transition = 'opacity .2s';
  intro.style.opacity = '.7';

  setTimeout(() => {
    transition.classList.add('active');
    lH.style.transition = lH2.style.transition = 'transform .4s cubic-bezier(.4,0,.2,1)';
    lH.style.transform  = lH2.style.transform  = 'scaleX(1)';

    setTimeout(() => {
      lV.style.transition = lV2.style.transition = 'transform .35s cubic-bezier(.4,0,.2,1)';
      lV.style.transform  = lV2.style.transform  = 'scaleY(1)';

      setTimeout(() => {
        lF.style.transition = 'opacity .15s';
        lF.style.opacity = '1';
        lH.style.transition = lH2.style.transition = 'transform .5s ease,opacity .5s';
        lH.style.transform  = lH2.style.transform  = 'scaleX(3) scaleY(8)';
        lV.style.transform  = lV2.style.transform  = 'scaleY(3) scaleX(8)';

        setTimeout(() => {
          intro.style.opacity = '0';
          transition.style.cssText += ';opacity:0;transition:opacity .3s';
          mainSite.classList.remove('hidden');
          mainSite.style.cssText += ';opacity:0;transition:opacity .5s';

          setTimeout(() => {
            mainSite.style.opacity = '1';
            intro.remove();
            transition.remove();
            initParticles();
            initLaserTrail();
            initTypingEffect();
            fetchGitHubData();
            initScrollAnimations();
            initNavbar();
          }, 100);
        }, 340);
      }, 350);
    }, 400);
  }, 200);
}

/* ═══════════════ PARTICLES ════════════════════════════════════════
   Optimisation: spatial grid neighbour lookup, 50 particles,
   skip connection check for distant particles via grid buckets,
   single composite canvas operation, passive listeners.
   ════════════════════════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d', { alpha: true });
  let W, H;

  const CELL   = 120;   // grid cell = max connection dist
  const COUNT  = 50;
  const MOUSE_R = 90;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', debounce(resize, 150), { passive: true });
  resize();

  const pts = Array.from({ length: COUNT }, () => ({
    x:  Math.random() * W,
    y:  Math.random() * H,
    vx: (Math.random() - .5) * .5,
    vy: (Math.random() - .5) * .5,
    r:  Math.random() * 1.2 + .4,
    a:  Math.random() * .45 + .1,
  }));

  let mx = -9999, my = -9999;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function tick() {
    ctx.clearRect(0, 0, W, H);

    // Build spatial grid
    const gW  = Math.ceil(W / CELL);
    const gH  = Math.ceil(H / CELL);
    const grid = new Array(gW * gH).fill(null).map(() => []);
    pts.forEach((p, i) => {
      const col = Math.min(Math.floor(p.x / CELL), gW - 1);
      const row = Math.min(Math.floor(p.y / CELL), gH - 1);
      grid[row * gW + col].push(i);
    });

    ctx.lineWidth = .6;

    // Draw connections (only check adjacent cells)
    for (let row = 0; row < gH; row++) {
      for (let col = 0; col < gW; col++) {
        const cell = grid[row * gW + col];
        // neighbour offsets (current + 8 neighbours but deduplicate with i<j)
        for (let dr = 0; dr <= 1; dr++) {
          for (let dc = (dr === 0 ? 1 : -1); dc <= 1; dc++) {
            const nr = row + dr, nc = col + dc;
            if (nr < 0 || nr >= gH || nc < 0 || nc >= gW) continue;
            const nCell = grid[nr * gW + nc];
            for (const i of cell) {
              for (const j of nCell) {
                const pi = pts[i], pj = pts[j];
                const dx = pi.x - pj.x, dy = pi.y - pj.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < CELL * CELL) {
                  ctx.beginPath();
                  ctx.strokeStyle = `rgba(0,245,255,${(1 - d2 / (CELL * CELL)) * .12})`;
                  ctx.moveTo(pi.x, pi.y);
                  ctx.lineTo(pj.x, pj.y);
                  ctx.stroke();
                }
              }
            }
          }
        }
        // same-cell pairs
        for (let a = 0; a < cell.length; a++) {
          for (let b = a + 1; b < cell.length; b++) {
            const pi = pts[cell[a]], pj = pts[cell[b]];
            const dx = pi.x - pj.x, dy = pi.y - pj.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < CELL * CELL) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(0,245,255,${(1 - d2 / (CELL * CELL)) * .12})`;
              ctx.moveTo(pi.x, pi.y);
              ctx.lineTo(pj.x, pj.y);
              ctx.stroke();
            }
          }
        }
      }
    }

    // Draw dots + update positions
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = `rgba(0,245,255,${p.a})`;
      ctx.fill();

      // Mouse repulsion
      const dx = p.x - mx, dy = p.y - my;
      const d2 = dx * dx + dy * dy;
      if (d2 < MOUSE_R * MOUSE_R) {
        const d = Math.sqrt(d2) || 1;
        const f = (MOUSE_R - d) / MOUSE_R * .6;
        p.vx += dx / d * f;
        p.vy += dy / d * f;
      }

      p.vx *= .985; p.vy *= .985;
      p.x  += p.vx; p.y  += p.vy;

      if (p.x < 0)  { p.x = 0;  p.vx = Math.abs(p.vx); }
      if (p.x > W)  { p.x = W;  p.vx = -Math.abs(p.vx); }
      if (p.y < 0)  { p.y = 0;  p.vy = Math.abs(p.vy); }
      if (p.y > H)  { p.y = H;  p.vy = -Math.abs(p.vy); }
    });

    requestAnimationFrame(tick);
  }
  tick();
}

/* ═══════════════ LASER TRAIL ══════════════════════════════════════
   Optimisation: single rAF loop, throttled point push, capped trail,
   no shadowBlur on every segment (use single glow pass).
   ════════════════════════════════════════════════════════════════ */
function initLaserTrail() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99990;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d', { alpha: true });

  let W, H;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', debounce(resize, 150), { passive: true });
  resize();

  const trail = [];
  const MAX   = 18;
  let   lastX = -1, lastY = -1;

  document.addEventListener('mousemove', e => {
    // throttle: only push if moved > 4px
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    if (dx * dx + dy * dy > 16) {
      trail.push([e.clientX, e.clientY]);
      if (trail.length > MAX) trail.shift();
      lastX = e.clientX; lastY = e.clientY;
    }
  }, { passive: true });

  function drawTrail() {
    ctx.clearRect(0, 0, W, H);

    if (trail.length > 1) {
      // Single glow pass
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(0,245,255,0.5)';
      ctx.lineJoin = 'round';
      ctx.lineCap  = 'round';

      for (let i = 1; i < trail.length; i++) {
        const t  = i / trail.length;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,245,255,${t * .3})`;
        ctx.lineWidth   = t * 1.8;
        ctx.moveTo(trail[i - 1][0], trail[i - 1][1]);
        ctx.lineTo(trail[i][0],     trail[i][1]);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(drawTrail);
  }
  drawTrail();
}

/* ═══════════════ TYPING EFFECT ════════════════════════════════════ */
function initTypingEffect() {
  const el    = document.getElementById('typed-role');
  const roles = CONFIG.roles;
  let ri = 0, ci = 0, del = false;

  function tick() {
    const cur = roles[ri];
    if (!del) {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { del = true; setTimeout(tick, 1700); return; }
    } else {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(tick, del ? 55 : 85);
  }
  tick();
}

/* ═══════════════ GITHUB API ════════════════════════════════════════ */
const LANG_COLORS = {
  JavaScript:'#f1e05a', TypeScript:'#3178c6', Go:'#00ADD8',
  Python:'#3572A5', Rust:'#dea584', Java:'#b07219',
  'C++':'#f34b7d', C:'#555', HTML:'#e34c26', CSS:'#563d7c',
  Vue:'#41b883', Swift:'#F05138', Kotlin:'#A97BFF', Shell:'#89e051',
};

async function fetchGitHubData() {
  const { github_username: u, github_token: tok } = CONFIG;
  if (!u || u === 'YOUR_USERNAME') { renderFallbackRepos(); return; }

  const headers = tok ? { Authorization: `Bearer ${tok}` } : {};

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${u}`, { headers }),
      fetch(`https://api.github.com/users/${u}/repos?sort=stars&per_page=12&type=public`, { headers }),
    ]);

    if (userRes.ok) {
      const d = await userRes.json();
      const av = document.getElementById('github-avatar');
      if (av) av.src = d.avatar_url;
      setText('dp-username',  d.login);
      setText('dp-location',  d.location || 'EARTH');
      setText('dp-followers', d.followers);
      setText('stat-repos',   d.public_repos);
      const navName = document.querySelector('.nav-name');
      if (navName) navName.textContent = d.login.toUpperCase();

      // Update hero links
      document.querySelectorAll('a[href*="YOUR_USERNAME"]').forEach(a => {
        a.href = a.href.replace('YOUR_USERNAME', d.login);
      });
    }

    if (reposRes.ok) {
      const repos = await reposRes.json();
      const sorted = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);
      const stars  = sorted.reduce((s, r) => s + r.stargazers_count, 0);
      setText('stat-stars', stars);
      renderRepos(sorted.slice(0, 9));
    }
  } catch (e) {
    console.warn('GitHub API:', e);
    renderFallbackRepos();
  }
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function renderRepos(repos) {
  document.getElementById('repos-grid').innerHTML = repos.map(r => `
    <a href="${r.html_url}" target="_blank" rel="noopener" class="repo-card">
      <div class="repo-name">${r.name.toUpperCase()}</div>
      <div class="repo-desc">${r.description || 'No description provided.'}</div>
      <div class="repo-meta">
        ${r.language ? `<div class="repo-lang">
          <div class="lang-dot" style="background:${LANG_COLORS[r.language] || '#8b949e'}"></div>
          <span>${r.language}</span></div>` : ''}
        <div class="repo-stars">★ ${r.stargazers_count}</div>
        <div class="repo-forks">⑂ ${r.forks_count}</div>
      </div>
    </a>`).join('');
}

function renderFallbackRepos() {
  document.getElementById('repos-grid').innerHTML =
    `<div style="grid-column:1/-1;text-align:center;padding:40px;
     font-family:'Share Tech Mono',monospace;font-size:12px;
     letter-spacing:3px;color:var(--text-dim);">
     // SET CONFIG.github_username IN script.js TO LOAD REPOS</div>`;
}

/* ═══════════════ SCROLL ANIMATIONS ════════════════════════════════ */
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.article-card,.gallery-item,.repo-card,.contact-card,.hero-content,.hero-visual'
  );

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 70);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  targets.forEach(el => {
    el.classList.add('fade-up');
    io.observe(el);
  });
}

/* ═══════════════ NAVBAR ════════════════════════════════════════════ */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.style.background = window.scrollY > 20
          ? 'rgba(2,4,8,0.96)'
          : 'rgba(2,4,8,0.85)';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  const links    = nav.querySelectorAll('.nav-link');
  const sections = [...links].map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);

  const sObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sObs.observe(s));
}

/* ═══════════════ UTILITY ═══════════════════════════════════════════ */
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/* ═══════════════ INIT ══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initMatrix();
  setTimeout(runBootSequence, 500);
});

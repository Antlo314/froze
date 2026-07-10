import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* ═══════════════════════════════════════════════════════════
   DATA — placeholder entries until research lands; edit freely
   ═══════════════════════════════════════════════════════════ */

const BATTLES = [
  { league: 'BATTLE', name: 'ROSENBERG RAW', sub: 'Full battle catalog on the way', url: 'https://www.youtube.com/@FrozenbergTV' },
  { league: 'BATTLE', name: 'COLD ROUNDS', sub: 'Classic matchups being added', url: 'https://www.youtube.com/@FrozenbergTV' },
  { league: 'BATTLE', name: 'FROZENBERG TV', sub: 'New drops first on the channel', url: 'https://www.youtube.com/@FrozenbergTV' },
];

const CHANNELS = [
  { icon: '📺', name: 'FrozenbergTV', handle: '@FrozenbergTV', url: 'https://www.youtube.com/@FrozenbergTV' },
  { icon: '📸', name: 'Instagram', handle: '@rosenberg_raw610', url: 'https://www.instagram.com/rosenberg_raw610/' },
];

/* ═══════════ LOADER ═══════════ */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('done'), 900);
});

/* ═══════════ NAV ═══════════ */
const nav = document.getElementById('nav');
const burger = document.getElementById('nav-burger');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });
burger.addEventListener('click', () => nav.classList.toggle('menu-open'));
nav.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => nav.classList.remove('menu-open')));

document.getElementById('year').textContent = new Date().getFullYear();

/* ═══════════ CARD INJECTION ═══════════ */
const battleGrid = document.getElementById('battle-grid');
battleGrid.innerHTML = BATTLES.map(b => `
  <a class="battle-card reveal" href="${b.url}" target="_blank" rel="noopener" data-tilt>
    <div class="battle-thumb">
      ${b.thumb ? `<img src="${b.thumb}" alt="" loading="lazy" />` : ''}
      <span class="battle-vs">VS</span>
      <span class="battle-play">▶</span>
    </div>
    <div class="battle-meta">
      <p class="battle-league">${b.league}</p>
      <p class="battle-name">${b.name}</p>
      <p class="battle-sub">${b.sub}</p>
    </div>
  </a>`).join('');

const channelGrid = document.getElementById('channel-grid');
channelGrid.innerHTML = CHANNELS.map(c => `
  <a class="channel-card reveal" href="${c.url}" target="_blank" rel="noopener">
    <span class="channel-icon">${c.icon}</span>
    <span>
      <span class="channel-name">${c.name}</span><br/>
      <span class="channel-handle">${c.handle}</span>
    </span>
  </a>`).join('');

/* ═══════════ OPTIONAL ASSETS (drop-in) ═══════════ */
// Portrait: /public/assets/portrait.jpg
const portraitImg = new Image();
portraitImg.src = '/assets/portrait.jpg';
portraitImg.onload = () => {
  const media = document.querySelector('[data-asset="portrait"]');
  media.innerHTML = '';
  portraitImg.alt = 'Rosenberg Raw — Frozenberg';
  media.appendChild(portraitImg);
};
// TV loop: /public/assets/tv-loop.mp4
fetch('/assets/tv-loop.mp4', { method: 'HEAD' }).then(r => {
  if (!r.ok) return;
  const screen = document.querySelector('[data-asset="tv-loop"]');
  screen.innerHTML = '';
  const v = document.createElement('video');
  Object.assign(v, { src: '/assets/tv-loop.mp4', muted: true, loop: true, autoplay: true, playsInline: true });
  screen.appendChild(v);
}).catch(() => {});

/* ═══════════ REVEAL ON SCROLL ═══════════ */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ═══════════ DEVICE PROFILE ═══════════ */
const IS_MOBILE = matchMedia('(max-width: 768px)').matches || matchMedia('(pointer: coarse)').matches;

/* ═══════════ 3D TILT CARDS (pointer devices only) ═══════════ */
if (!IS_MOBILE) document.querySelectorAll('[data-tilt], .portrait-media').forEach(el => {
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(4px)`;
  });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
});

/* ═══════════════════════════════════════════════════════════
   THREE.JS — arctic hero: snow, smoke, ice shards
   ═══════════════════════════════════════════════════════════ */

const canvas = document.getElementById('ice-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !IS_MOBILE, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, IS_MOBILE ? 1.5 : 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x04070d, 0.055);

const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
camera.position.set(0, 0, 9);

// environment for glassy ice reflections
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

// ── lights ──
scene.add(new THREE.AmbientLight(0x223a55, 0.5));
const key = new THREE.DirectionalLight(0xcfeaff, 1.1);
key.position.set(4, 8, 6);
scene.add(key);
const rim = new THREE.PointLight(0x67e8f9, 26, 30);
rim.position.set(-6, -2, 4);
scene.add(rim);

// ── sprite textures (procedural, no assets needed) ──
function radialTexture(stops) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  stops.forEach(([o, col]) => g.addColorStop(o, col));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}
const snowTex = radialTexture([[0, 'rgba(234,246,255,1)'], [0.4, 'rgba(200,232,255,0.6)'], [1, 'rgba(200,232,255,0)']]);
const smokeTex = radialTexture([[0, 'rgba(160,200,235,0.35)'], [0.55, 'rgba(120,165,205,0.12)'], [1, 'rgba(120,165,205,0)']]);

// ── snow field ──
const SNOW_COUNT = IS_MOBILE ? 500 : 1400;
const snowGeo = new THREE.BufferGeometry();
const pos = new Float32Array(SNOW_COUNT * 3);
const speed = new Float32Array(SNOW_COUNT);
const sway = new Float32Array(SNOW_COUNT);
for (let i = 0; i < SNOW_COUNT; i++) {
  pos[i * 3] = (Math.random() - 0.5) * 26;
  pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
  pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
  speed[i] = 0.004 + Math.random() * 0.012;
  sway[i] = Math.random() * Math.PI * 2;
}
snowGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
const snow = new THREE.Points(snowGeo, new THREE.PointsMaterial({
  map: snowTex, size: 0.09, transparent: true, opacity: 0.85,
  depthWrite: false, blending: THREE.AdditiveBlending,
}));
scene.add(snow);

// ── smoke layer (light, drifting) ──
const smokeSprites = [];
const SMOKE_COUNT = IS_MOBILE ? 5 : 10;
for (let i = 0; i < SMOKE_COUNT; i++) {
  const m = new THREE.SpriteMaterial({
    map: smokeTex, transparent: true, depthWrite: false,
    opacity: 0.09 + Math.random() * 0.06, rotation: Math.random() * Math.PI * 2,
  });
  const s = new THREE.Sprite(m);
  const sc = 7 + Math.random() * 7;
  s.scale.set(sc, sc, 1);
  s.position.set((Math.random() - 0.5) * 18, -5.5 + Math.random() * 2.2, -3 - Math.random() * 4);
  s.userData = { spin: (Math.random() - 0.5) * 0.0009, drift: 0.0016 + Math.random() * 0.002, dir: Math.random() > 0.5 ? 1 : -1 };
  smokeSprites.push(s);
  scene.add(s);
}

// ── ice shards ──
const iceMat = new THREE.MeshPhysicalMaterial({
  color: 0x7fc2e8, metalness: 0, roughness: 0.14,
  transmission: 0.95, thickness: 2.2, ior: 1.31,
  envMapIntensity: 0.55, flatShading: true,
  clearcoat: 1, clearcoatRoughness: 0.15,
  transparent: true, opacity: 0.88,
  attenuationColor: new THREE.Color(0x2a7ea8), attenuationDistance: 2.5,
});
const shards = new THREE.Group();
const heroShard = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6, 0), iceMat);
const heroScale = IS_MOBILE ? 0.62 : 0.95;
heroShard.position.set(0, IS_MOBILE ? -1.1 : -0.3, -3);
heroShard.scale.set(heroScale, heroScale * 1.7, heroScale);
shards.add(heroShard);
const ORBIT_SHARDS = IS_MOBILE ? 3 : 6;
for (let i = 0; i < ORBIT_SHARDS; i++) {
  const s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22 + Math.random() * 0.3, 0), iceMat);
  const angle = (i / ORBIT_SHARDS) * Math.PI * 2;
  s.userData = { angle, radius: 3.2 + Math.random() * 1.8, y: (Math.random() - 0.5) * 3, speedMul: 0.5 + Math.random() };
  s.scale.y = 1.3 + Math.random();
  shards.add(s);
}
scene.add(shards);

// ── parallax: mouse on desktop, gentle autonomous sway on touch ──
const mouse = { x: 0, y: 0 };
if (!IS_MOBILE) {
  addEventListener('pointermove', e => {
    mouse.x = (e.clientX / innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });
}

// ── resize (ResizeObserver — survives late pane layout) ──
const heroEl = document.getElementById('hero');
function resize() {
  const w = heroEl.clientWidth, h = heroEl.clientHeight;
  if (!w || !h) return;
  renderer.setPixelRatio(Math.min(devicePixelRatio, IS_MOBILE ? 1.5 : 2));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(heroEl);
addEventListener('resize', resize);
resize();

// ── render loop (paused when hero off-screen) ──
let heroVisible = true;
new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; })
  .observe(document.getElementById('hero'));

const clock = new THREE.Clock();
function tick() {
  requestAnimationFrame(tick);
  if (!heroVisible) return;
  const t = clock.getElapsedTime();

  // snow fall + sway
  const p = snowGeo.attributes.position.array;
  for (let i = 0; i < SNOW_COUNT; i++) {
    p[i * 3 + 1] -= speed[i];
    p[i * 3] += Math.sin(t * 0.6 + sway[i]) * 0.0022;
    if (p[i * 3 + 1] < -8) p[i * 3 + 1] = 8;
  }
  snowGeo.attributes.position.needsUpdate = true;

  // smoke drift
  smokeSprites.forEach(s => {
    s.material.rotation += s.userData.spin;
    s.position.x += s.userData.drift * s.userData.dir * 0.4;
    if (s.position.x > 12) s.position.x = -12;
    if (s.position.x < -12) s.position.x = 12;
  });

  // shards
  heroShard.rotation.y = t * 0.18;
  heroShard.rotation.x = Math.sin(t * 0.3) * 0.12;
  heroShard.position.y = (IS_MOBILE ? -1.1 : -0.3) + Math.sin(t * 0.7) * 0.18;
  shards.children.forEach(s => {
    if (s === heroShard) return;
    const u = s.userData;
    s.position.set(
      Math.cos(u.angle + t * 0.12 * u.speedMul) * u.radius,
      u.y + Math.sin(t * 0.5 * u.speedMul) * 0.4,
      Math.sin(u.angle + t * 0.12 * u.speedMul) * u.radius * 0.5 - 1.5
    );
    s.rotation.y = t * 0.4 * u.speedMul;
    s.rotation.z = t * 0.2 * u.speedMul;
  });

  // camera parallax
  if (IS_MOBILE) { mouse.x = Math.sin(t * 0.16) * 0.5; mouse.y = Math.cos(t * 0.11) * 0.3; }
  camera.position.x += (mouse.x * 0.9 - camera.position.x) * 0.04;
  camera.position.y += (-mouse.y * 0.5 - camera.position.y) * 0.04;
  camera.lookAt(0, 0, -1.5);

  renderer.render(scene, camera);
}
tick();

/* ═══════════ STAT COUNTERS (animated when set) ═══════════ */
export function setStats({ battles, views }) {
  const animate = (el, target, suffix = '') => {
    const start = performance.now(), dur = 1400;
    const step = now => {
      const k = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))).toLocaleString() + suffix;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (battles) animate(document.getElementById('stat-battles'), battles, '+');
  if (views) animate(document.getElementById('stat-views'), views / 1e6, 'M+');
}

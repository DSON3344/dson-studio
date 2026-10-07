/*
 * DSON Studio — 3D street-corner scene used by the guided tour (tour.js).
 * The world is the "DSON 工作室街角" model (three.js r128, 1 unit = 1 m);
 * on top of it this file adds a path-following camera that walks visitors
 * between rooms, plus a free-walk mode. Exposes window.DSONStudio.create().
 */
(function () {
'use strict';

function create(canvas, opts) {
  opts = opts || {};
  const LOGO_SRC = opts.logoSrc || 'tour/logo-hd.png';
  const JP = '"Zen Maru Gothic","Hiragino Maru Gothic ProN","Hiragino Sans","Yu Gothic","Meiryo","Noto Sans JP",sans-serif';
  const DISPLAY = '"Syne","Avenir Next","Segoe UI",sans-serif';
  const MONO = '"JetBrains Mono","SFMono-Regular",Consolas,monospace';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowPower = !!opts.lowPower;

  // ---------- renderer / scene ----------
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, 0.05, 500);
  const root = new THREE.Group(); scene.add(root);

  // ---------- material helpers (physically based) ----------
  const lin = (c) => new THREE.Color(c).convertSRGBToLinear();
  const srgb = (t) => { if (t) t.encoding = THREE.sRGBEncoding; return t; };
  function std(c, o) {
    o = Object.assign({}, o || {});
    if (o.emissive !== undefined && !(o.emissive instanceof THREE.Color)) o.emissive = lin(o.emissive);
    if (o.map) srgb(o.map);
    return new THREE.MeshStandardMaterial(Object.assign({ color: lin(c), roughness: 0.82, metalness: 0 }, o));
  }
  const MC = {};
  const M = (c) => MC[c] || (MC[c] = std(c));
  function preset(c, o) { MC[c] = std(c, o); }
  function glow(c, o, k) {
    o = Object.assign({}, o || {}); if (o.map) srgb(o.map);
    const m = new THREE.MeshBasicMaterial(Object.assign({ color: lin(c) }, o));
    m.color.multiplyScalar(k === undefined ? 1.8 : k);
    return m;
  }
  const mat = (m) => (typeof m === 'number' ? M(m) : m);
  function add(mesh, parent, o) {
    o = o || {};
    (parent || root).add(mesh);
    if (o.shadow !== false) mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }
  // rounded-edge box, bottom-anchored
  function box(w, h, d, m, x, y, z, parent, o) {
    o = o || {};
    const mn = Math.min(w, h, d);
    const geo = (THREE.RoundedBoxGeometry && mn > 0.04 && !o.sharp) ? new THREE.RoundedBoxGeometry(w, h, d, 2, Math.min(0.02, mn * 0.2)) : new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat(m)); mesh.position.set(x, y + h / 2, z);
    return add(mesh, parent, o);
  }
  // sharp box with world-scaled UVs (one shared tiling texture, no clones)
  function wbox(w, h, d, m, x, y, z, parent, o) {
    o = o || {};
    const g = new THREE.BoxGeometry(w, h, d), uv = g.attributes.uv, s = o.uvs || 1;
    const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
    for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] / s, uv.getY(i) * dims[f][1] / s); }
    const mesh = new THREE.Mesh(g, Array.isArray(m) ? m : mat(m)); mesh.position.set(x, y + h / 2, z);
    return add(mesh, parent, o);
  }
  function wplane(x0, x1, z0, z1, y, m, s, parent) {
    const w = x1 - x0, d = z1 - z0, g = new THREE.PlaneGeometry(w, d), uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / s, uv.getY(i) * d / s);
    const mesh = new THREE.Mesh(g, mat(m)); mesh.rotation.x = -Math.PI / 2; mesh.position.set((x0 + x1) / 2, y, (z0 + z1) / 2);
    mesh.receiveShadow = true; (parent || root).add(mesh); return mesh;
  }
  function cyl(rt, rb, h, m, x, y, z, parent, o) {
    o = o || {};
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, o.seg || 18, 1, !!o.open), mat(m)); mesh.position.set(x, y + h / 2, z);
    return add(mesh, parent, o);
  }
  function sphere(r, m, x, y, z, parent, o) {
    o = o || {};
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, o.seg || 18, o.seg ? Math.max(6, o.seg - 6) : 12), mat(m)); mesh.position.set(x, y, z);
    return add(mesh, parent, o);
  }
  function plane(w, h, m, parent) { const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat(m)); (parent || root).add(mesh); return mesh; }
  const UP = new THREE.Vector3(0, 1, 0);
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  function rod(a, b, r, m, parent, o) {
    const d = new THREE.Vector3().subVectors(b, a), len = d.length();
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, (o && o.seg) || 8), mat(m));
    mesh.position.copy(a).addScaledVector(d, 0.5); mesh.quaternion.setFromUnitVectors(UP, d.normalize());
    return add(mesh, parent, o);
  }
  // foliage clumps (like flocked scale-model trees)
  function foliage(r, c, x, y, z, parent) {
    const n = Math.max(26, Math.round(r * r * 110));
    const im = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(r * 0.22, 0), new THREE.MeshStandardMaterial({ roughness: 0.92, flatShading: true }), n);
    const d = new THREE.Object3D(), col = new THREE.Color(), base = lin(c);
    for (let i = 0; i < n; i++) {
      const u = Math.random() * 2 - 1, a = Math.random() * 6.283, rr = r * Math.cbrt(0.25 + Math.random() * 0.75), sq = Math.sqrt(1 - u * u);
      d.position.set(x + Math.cos(a) * sq * rr, y + u * rr * 0.85, z + Math.sin(a) * sq * rr);
      d.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      const sc = 0.7 + Math.random() * 0.6; d.scale.set(sc, sc, sc); d.updateMatrix(); im.setMatrixAt(i, d.matrix);
      im.setColorAt(i, col.copy(base).multiplyScalar(0.7 + Math.random() * 0.5 + (u > 0 ? 0.15 : -0.1)));
    }
    im.castShadow = true; im.receiveShadow = true; (parent || root).add(im); return im;
  }

  // ---------- canvas textures ----------
  function tex(w, h, draw, opt) {
    const hi = (opt && opt.hi) || 1;
    const c = document.createElement('canvas'); c.width = w * hi; c.height = h * hi;
    const x = c.getContext('2d'); x.save(); x.scale(hi, hi); draw(x, w, h); x.restore();
    if (opt && opt.grain) {
      const id = x.getImageData(0, 0, c.width, c.height), d = id.data;
      for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - 0.5) * opt.grain; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
      x.putImageData(id, 0, 0);
    }
    const t = new THREE.CanvasTexture(c); t.anisotropy = maxAniso;
    if (opt && opt.repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }
  const texHi = (w, h, draw, grain) => tex(w, h, draw, { hi: 4, grain: grain === undefined ? 12 : grain, repeat: true });
  function rrect(x, a, b, w, h, r) {
    x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r);
    x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath();
  }

  // ---------- logo ----------
  let logoImg = null;
  function drawLogo(x, cx, cy, s, color) {
    if (!logoImg) return;
    const c = document.createElement('canvas'); c.width = logoImg.width; c.height = logoImg.height;
    const cx2 = c.getContext('2d'); cx2.drawImage(logoImg, 0, 0); cx2.globalCompositeOperation = 'source-in'; cx2.fillStyle = color; cx2.fillRect(0, 0, c.width, c.height);
    const w = s * c.width / c.height; x.drawImage(c, cx - w / 2, cy - s / 2, w, s);
  }
  const logoTexture = (color) => tex(340, 640, (x, w, h) => drawLogo(x, w / 2, h / 2, 620, color));
  const haloTexture = () => tex(256, 256, (x) => {
    const g = x.createRadialGradient(128, 128, 10, 128, 128, 128);
    g.addColorStop(0, 'rgba(0,230,254,.7)'); g.addColorStop(0.45, 'rgba(0,230,254,.22)'); g.addColorStop(1, 'rgba(0,230,254,0)');
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
  });
  function label(text, w, h, x, y, z, ry, parent) {
    const t = tex(320, 80, (c, W, H) => {
      c.fillStyle = '#16171d'; c.fillRect(0, 0, W, H); c.fillStyle = '#e8eaf0'; c.font = `700 30px ${MONO}`; c.textBaseline = 'middle'; c.fillText(text, 22, H / 2 + 1);
      c.fillStyle = '#00e6fe'; c.fillRect(W - 30, H / 2 - 4, 8, 8);
    });
    const p = plane(w, h, std(0xffffff, { map: t, roughness: 0.4 }), parent); p.position.set(x, y, z); p.rotation.y = ry || 0; return p;
  }

  // =====================================================================
  //  WORLD (1 unit = 1 m)
  // =====================================================================
  const HALF = 20, ROAD = 0.05, LOT = 0.12, SIDE = 0.18;
  const F1 = 0.15, F2 = 3.55, H1 = 3.2, ROOF = 6.75;
  const BX0 = -13, BX1 = 9, BZ0 = -14, BZ1 = 4;      // building footprint (1F)
  const UZ0 = -10;                                     // 2F rear wall (1F extends behind it under a flat roof)
  const UX0 = -7.5;                                    // 2F starts here (west part is a 1F roof terrace)
  const STAIR = { x0: 4.05, x1: 5.25, zBot: -3.3, zTop: -8.6 };

  // colliders per level: [x0, x1, z0, z1]
  const COL = { 1: [], 2: [] };
  const solid = (lvl, x0, x1, z0, z1) => { (lvl === 'both' ? [1, 2] : [lvl]).forEach((l) => COL[l].push([Math.min(x0, x1), Math.max(x0, x1), Math.min(z0, z1), Math.max(z0, z1)])); };

  // shared materials (assigned in build)
  let concM, cladM, paintM, ceilM, plankM, tileM, carpetM, glassM, frameM, walnutM, walnutDkM, stoneM, leatherBk, leatherTan, fabricM, aluM, brassM, steelDk, whiteLam, oakM;

  // ---------- walls with doors and windows ----------
  // wall along X at fixed z (axis 'x') or along Z at fixed x (axis 'z')
  // opt: lvl (1|2), t thickness, out ('+'|'-' which side faces outdoors, or null), gaps [[a,b,doorTop]], wins [[a,b,sill,top]], glass (full glass partition)
  function wall(axis, c, a0, a1, opt) {
    const lvl = opt.lvl, base = lvl === 1 ? F1 : F2, H = H1, t = opt.t || 0.14;
    const inner = opt.inner || paintM, outer = opt.out ? (lvl === 1 ? concM : cladM) : inner;
    const faceMats = (axis === 'x')
      ? [inner, inner, inner, inner, opt.out === '+' ? outer : inner, opt.out === '-' ? outer : inner]
      : [opt.out === '+' ? outer : inner, opt.out === '-' ? outer : inner, inner, inner, inner, inner];
    const piece = (p0, p1, y0, y1) => {
      if (p1 - p0 < 0.01 || y1 - y0 < 0.01) return;
      const len = p1 - p0, mid = (p0 + p1) / 2;
      if (axis === 'x') wbox(len, y1 - y0, t, faceMats, mid, base + y0, c, null, { uvs: 1.8 });
      else wbox(t, y1 - y0, len, faceMats, c, base + y0, mid, null, { uvs: 1.8 });
    };
    const glassAt = (p0, p1, y0, y1) => {
      const g = plane(p1 - p0, y1 - y0, glassM); g.renderOrder = 2;
      if (axis === 'x') g.position.set((p0 + p1) / 2, base + (y0 + y1) / 2, c);
      else { g.position.set(c, base + (y0 + y1) / 2, (p0 + p1) / 2); g.rotation.y = Math.PI / 2; }
      // slim frame
      const fr = (q0, q1, z0, z1) => (axis === 'x') ? wbox(q1 - q0, z1 - z0, 0.06, frameM, (q0 + q1) / 2, base + z0, c) : wbox(0.06, z1 - z0, q1 - q0, frameM, c, base + z0, (q0 + q1) / 2);
      fr(p0, p0 + 0.05, y0, y1); fr(p1 - 0.05, p1, y0, y1); fr(p0, p1, y0, y0 + 0.05); fr(p0, p1, y1 - 0.05, y1);
      const n = Math.round((p1 - p0) / 1.6); for (let i = 1; i < n; i++) { const q = p0 + (p1 - p0) * i / n; fr(q - 0.025, q + 0.025, y0, y1); }
    };
    // split by gaps
    const gaps = (opt.gaps || []).slice().sort((a, b) => a[0] - b[0]);
    let cur = a0; const segs = [];
    gaps.forEach((g) => { segs.push([cur, g[0]]); const top = g[2] || 2.2; piece(g[0], g[1], top, H); cur = g[1]; });
    segs.push([cur, a1]);
    segs.forEach(([p0, p1]) => {
      if (p1 - p0 < 0.01) return;
      if (axis === 'x') solid(lvl, p0, p1, c - t / 2, c + t / 2); else solid(lvl, c - t / 2, c + t / 2, p0, p1);
      if (opt.glass) { piece(p0, p1, 0, 0.06); glassAt(p0, p1, 0.06, opt.glassTop || H); if ((opt.glassTop || H) < H) piece(p0, p1, opt.glassTop, H); return; }
      const wins = (opt.wins || []).filter((w) => w[0] >= p0 - 0.001 && w[1] <= p1 + 0.001).sort((a, b) => a[0] - b[0]);
      let q = p0;
      wins.forEach(([w0, w1, sill, top]) => { piece(q, w0, 0, H); piece(w0, w1, 0, sill); piece(w0, w1, top, H); glassAt(w0, w1, sill, top); q = w1; });
      piece(q, p1, 0, H);
    });
  }

  // ---------- level / ground lookup ----------
  function outdoorY(x, z) {
    if (x > 14 || z > 14) return ROAD;
    if (x > 12 || z > 12) return SIDE;
    return LOT;
  }
  const GK = 0.135;   // genkan floor level
  function stairY(z) { const k = (STAIR.zBot - z) / (STAIR.zBot - STAIR.zTop); return F1 + Math.max(0, Math.min(1, k)) * (F2 - F1); }
  function inStair(x, z) { return x > STAIR.x0 - 0.05 && x < STAIR.x1 + 0.05 && z < STAIR.zBot + 0.1 && z > STAIR.zTop - 0.05; }
  function groundAt(x, z, curY) {
    if (inStair(x, z)) return stairY(z);
    const in1 = x > BX0 && x < BX1 && z > BZ0 && z < BZ1;
    if (curY > 2.2 && in1) return F2;
    if (in1) return (x > 5 && z > 1.2) ? GK : F1;   // genkan sits a step down
    return outdoorY(x, z);
  }

  // =====================================================================
  function build() {
    scene.background = srgb(tex(8, 512, (x, w, h) => {
      const g = x.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#0b0c1c'); g.addColorStop(0.5, '#15173a'); g.addColorStop(0.82, '#25234b'); g.addColorStop(1, '#2f2752');
      x.fillStyle = g; x.fillRect(0, 0, w, h);
    }));
    scene.fog = new THREE.FogExp2(lin(0x12142c).getHex(), 0.0032);
    (function () {
      const env = new THREE.Scene();
      env.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), new THREE.MeshBasicMaterial({ color: lin(0x0d0f22), side: THREE.BackSide })));
      const card = (w, h, c, k, x, y, z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: lin(c).multiplyScalar(k), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m); };
      card(60, 20, 0x1e2448, 1, 0, 30, 0);
      card(8, 3, 0xffc27a, 4, -20, 6, 25); card(6, 2, 0xffe2b8, 3, 25, 4, 18); card(10, 2, 0x00e6fe, 1.2, 18, 8, -25);
      card(5, 9, 0xffd2a0, 2.5, -28, 5, -12); card(12, 4, 0x8fa6ff, 1.2, 0, 14, 30);
      const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(env, 0.02).texture; pm.dispose();
    })();
    scene.add(new THREE.HemisphereLight(lin(0x8a93b8).getHex(), lin(0x2a2630).getHex(), 0.55));
    const moon = new THREE.DirectionalLight(lin(0xb4c0e0).getHex(), 0.45);
    moon.position.set(-22, 40, 26); moon.castShadow = true; moon.shadow.mapSize.set(lowPower ? 2048 : 4096, lowPower ? 2048 : 4096);
    Object.assign(moon.shadow.camera, { left: -27, right: 27, top: 27, bottom: -27, near: 5, far: 110 });
    moon.shadow.bias = -0.0004; moon.shadow.normalBias = 0.03; scene.add(moon);

    makeMaterials();
    buildPlinthAndStreets();
    buildShell();
    buildGround1();
    buildFloor2();
    buildFacade();
    buildYard();
    buildStreetFurniture();
    buildPoles();
  }

  function makeMaterials() {
    const concT = texHi(256, 256, (x, w, h) => {
      x.fillStyle = '#d3d2da'; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 160; i++) { x.fillStyle = `rgba(110,108,130,${Math.random() * 0.06})`; x.beginPath(); x.arc(Math.random() * w, Math.random() * h, 4 + Math.random() * 18, 0, 7); x.fill(); }
      x.strokeStyle = 'rgba(105,103,120,.5)'; x.lineWidth = 1.2; x.strokeRect(0.5, 0.5, w - 1, h / 2 - 1); x.strokeRect(0.5, h / 2, w - 1, h / 2 - 1);
      x.fillStyle = 'rgba(80,78,96,.65)';
      [h * 0.25, h * 0.75].forEach((yy) => [w * 0.17, w * 0.5, w * 0.83].forEach((xx) => { x.beginPath(); x.arc(xx, yy, 2.4, 0, 7); x.fill(); }));
    }, 12);
    concM = std(0xffffff, { map: concT, bumpMap: concT, bumpScale: 0.003, roughness: 0.8 });
    const slatT = texHi(128, 64, (x, w, h) => { for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? '#34353f' : '#3d3e4b'; x.fillRect(i * 16, 0, 14, h); x.fillStyle = '#1b1c24'; x.fillRect(i * 16 + 14, 0, 2, h); } }, 8);
    cladM = std(0xffffff, { map: slatT, bumpMap: slatT, bumpScale: 0.004, roughness: 0.55, metalness: 0.2 });
    paintM = std(0xe2ddd4, { roughness: 0.92, envMapIntensity: 0.35 });
    ceilM = std(0xeeebe5, { roughness: 0.95, envMapIntensity: 0.3 });
    const plankT = texHi(256, 256, (x, w, h) => {
      for (let r = 0; r < 8; r++) {
        const off = (r * 97) % 128;
        for (let i = -1; i < 3; i++) { const v = 84 + Math.random() * 24; x.fillStyle = `rgb(${v + 34},${v + 12},${v - 14})`; x.fillRect(off + i * 128, r * 32, 127, 31); }
        x.fillStyle = 'rgba(25,14,8,.7)'; x.fillRect(0, r * 32 + 31, w, 1);
      }
      for (let i = 0; i < 240; i++) { x.strokeStyle = `rgba(45,26,14,${Math.random() * 0.14})`; x.lineWidth = 0.6; const yy = Math.random() * h; x.beginPath(); x.moveTo(0, yy); x.bezierCurveTo(w * 0.3, yy + Math.random() * 3 - 1.5, w * 0.6, yy + Math.random() * 3 - 1.5, w, yy); x.stroke(); }
    }, 8);
    plankM = std(0xffffff, { map: plankT, roughness: 0.38, envMapIntensity: 0.6 });
    const tileT = texHi(128, 128, (x, w, h) => { x.fillStyle = '#cfd0d4'; x.fillRect(0, 0, w, h); x.fillStyle = '#a9aab0'; x.fillRect(0, 63, w, 2); x.fillRect(63, 0, 2, h); x.fillRect(0, 0, w, 1); x.fillRect(0, 0, 1, h); }, 8);
    tileM = std(0xffffff, { map: tileT, roughness: 0.25 });
    const carpetT = texHi(64, 64, (x, w, h) => { x.fillStyle = '#5a5d68'; x.fillRect(0, 0, w, h); }, 22);
    carpetM = std(0xffffff, { map: carpetT, roughness: 1 });
    glassM = std(0xbcd2ea, { transparent: true, opacity: 0.14, depthWrite: false, side: THREE.DoubleSide, roughness: 0.03, metalness: 0.25, envMapIntensity: 1.6 });
    frameM = std(0x1e1f29, { metalness: 0.7, roughness: 0.32 });
    const walnutT = texHi(128, 128, (x, w, h) => {
      x.fillStyle = '#5b3a27'; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 90; i++) { x.strokeStyle = `rgba(30,16,8,${Math.random() * 0.25})`; x.lineWidth = 0.5 + Math.random(); const yy = Math.random() * h; x.beginPath(); x.moveTo(0, yy); x.bezierCurveTo(w * 0.4, yy + Math.random() * 6 - 3, w * 0.7, yy + Math.random() * 6 - 3, w, yy); x.stroke(); }
    }, 8);
    walnutM = std(0xffffff, { map: walnutT, roughness: 0.38 });
    walnutDkM = std(0x8a7a70, { map: walnutT, roughness: 0.45 });
    const oakT = texHi(128, 128, (x, w, h) => {
      x.fillStyle = '#c49a6c'; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 70; i++) { x.strokeStyle = `rgba(110,70,40,${Math.random() * 0.2})`; x.lineWidth = 0.6; const yy = Math.random() * h; x.beginPath(); x.moveTo(0, yy); x.bezierCurveTo(w * 0.4, yy + Math.random() * 5 - 2.5, w * 0.7, yy + Math.random() * 5 - 2.5, w, yy); x.stroke(); }
    }, 8);
    oakM = std(0xffffff, { map: oakT, roughness: 0.45 });
    stoneM = std(0xeeebe5, { roughness: 0.14 });
    leatherBk = std(0x1a191e, { roughness: 0.42 });
    leatherTan = std(0x8e5c3c, { roughness: 0.5 });
    fabricM = std(0x3b3e48, { roughness: 0.95 });
    aluM = std(0xc4c7cf, { metalness: 0.85, roughness: 0.3 });
    brassM = std(0xc9a46a, { metalness: 0.9, roughness: 0.28 });
    steelDk = std(0x1c1d22, { metalness: 0.7, roughness: 0.35 });
    whiteLam = std(0xf1efea, { roughness: 0.45 });
    preset(0x5b6075, { metalness: 0.8, roughness: 0.35 });
    preset(0x6a6f88, { metalness: 0.7, roughness: 0.42 });
    preset(0x9da1b6, { metalness: 0.75, roughness: 0.38 });
    preset(0xf2f4fa, { metalness: 0.4, roughness: 0.3 });
  }

  // ---------------------------------------------------------------------
  function buildPlinthAndStreets() {
    wbox(2 * HALF, 1.6, 2 * HALF, std(0x231b26, { roughness: 0.38 }), 0, -1.6, 0);
    wbox(2 * HALF + 0.6, 0.3, 2 * HALF + 0.6, std(0x141018, { roughness: 0.3 }), 0, -1.9, 0);
    const plateTex = tex(768, 128, (x, w, h) => {
      const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#d9dbe4'); g.addColorStop(0.5, '#9fa3b2'); g.addColorStop(1, '#cfd2dc');
      x.fillStyle = g; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(30,32,44,.55)'; x.lineWidth = 3; x.strokeRect(10, 10, w - 20, h - 20);
      drawLogo(x, 62, h / 2, 76, '#16171f');
      x.fillStyle = '#16171f'; x.textBaseline = 'middle'; x.font = `800 48px ${DISPLAY}`; x.textAlign = 'left'; x.fillText('DSON STUDIO', 96, h / 2 + 2);
      x.font = `500 24px ${MONO}`; x.textAlign = 'right'; x.fillText('雨宮町 2-3-4  ·  HQ', w - 40, h / 2 + 2);
    });
    const plate = plane(5.2, 0.86, std(0xffffff, { map: plateTex, metalness: 0.85, roughness: 0.3 })); plate.position.set(0, -0.8, HALF + 0.005);

    // asphalt, sidewalks, lot
    const asphT = texHi(256, 256, (x, w, h) => { x.fillStyle = '#4a4d5a'; x.fillRect(0, 0, w, h); for (let i = 0; i < 5000; i++) { const v = 50 + Math.random() * 60; x.fillStyle = `rgb(${v},${v},${v + 8})`; x.fillRect(Math.random() * w, Math.random() * h, 1.2, 1.2); } }, 18);
    const asphM = std(0xffffff, { map: asphT, bumpMap: asphT, bumpScale: 0.004, roughness: 0.88, envMapIntensity: 0.6 });
    wbox(2 * HALF, ROAD, 6, asphM, 0, 0, 17, null, { uvs: 4 });
    wbox(6, ROAD, 34, asphM, 17, 0, -3, null, { uvs: 4 });
    const paverT = texHi(128, 128, (x, w, h) => {
      x.fillStyle = '#c3c5d4'; x.fillRect(0, 0, w, h); x.strokeStyle = '#9599ad'; x.lineWidth = 2;
      for (let i = 0; i <= 2; i++) { x.beginPath(); x.moveTo(0, i * 64); x.lineTo(w, i * 64); x.stroke(); }
      for (let r = 0; r < 2; r++) for (let i = 0; i <= 2; i++) { const xx = i * 64 + (r ? 32 : 0); x.beginPath(); x.moveTo(xx, r * 64); x.lineTo(xx, r * 64 + 64); x.stroke(); }
    }, 14);
    const paverM = std(0x9a9fb2, { map: paverT, bumpMap: paverT, bumpScale: 0.003, roughness: 0.8 });
    wbox(34, SIDE, 2, paverM, -3, 0, 13, null, { uvs: 0.9 });
    wbox(2, SIDE, 32, paverM, 13, 0, -4, null, { uvs: 0.9 });
    wbox(34, SIDE + 0.015, 0.16, 0xa4a8bd, -3, 0, 13.92, null, { sharp: true });
    wbox(0.16, SIDE + 0.015, 34, 0xa4a8bd, 13.92, 0, -3, null, { sharp: true });
    wbox(32, LOT, 32, std(0x86879f, { roughness: 0.85 }), -4, 0, -4, null, { uvs: 4 });

    // road markings
    const paint = std(0xd9dcec, { roughness: 0.7 });
    const line = (w, d, x, z) => wbox(w, 0.008, d, paint, x, ROAD, z, null, { sharp: true, shadow: false });
    line(33.6, 0.12, -3.2, 14.35); line(0.12, 33.6, 14.35, -3.2);
    for (let x = -19; x < 13; x += 3) line(1.6, 0.12, x, 17);
    for (let i = 0; i < 7; i++) line(0.45, 2.4, 14.8 + i * 0.75, 9.6);
    line(2.6, 0.35, 18.4, 13.4);
    const stopPaint = tex(256, 512, (x, w) => { x.fillStyle = '#e4e7f4'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.save(); x.scale(1, 1.55); x.font = `900 120px ${JP}`; x.fillText('止', w / 2, 70); x.fillText('ま', w / 2, 175); x.fillText('れ', w / 2, 270); x.restore(); });
    const sp = plane(1.3, 2.6, std(0xffffff, { map: stopPaint, transparent: true, depthWrite: false, opacity: 0.92, roughness: 0.7 })); sp.rotation.x = -Math.PI / 2; sp.position.set(18.4, ROAD + 0.01, 11.3);
    const manT = tex(256, 256, (x) => {
      x.fillStyle = '#4b4f66'; x.beginPath(); x.arc(128, 128, 126, 0, 7); x.fill(); x.strokeStyle = '#6f7591'; x.lineWidth = 10; x.beginPath(); x.arc(128, 128, 112, 0, 7); x.stroke();
      x.lineWidth = 7; for (let r = 28; r < 100; r += 18) { x.beginPath(); x.arc(128, 128, r, 0, 7); x.stroke(); }
    });
    const mh = plane(0.7, 0.7, std(0xffffff, { map: manT, transparent: true, alphaTest: 0.5, metalness: 0.5, roughness: 0.5 })); mh.rotation.x = -Math.PI / 2; mh.position.set(-6, ROAD + 0.01, 18.2);
    const tact = texHi(64, 64, (x) => { x.fillStyle = '#f2c230'; x.fillRect(0, 0, 64, 64); x.fillStyle = '#d9a514'; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { x.beginPath(); x.arc(8 + i * 16, 8 + j * 16, 4.5, 0, 7); x.fill(); } }, 6);
    const tm = std(0xffffff, { map: tact, roughness: 0.6 });
    wplane(12.9, 13.6, 8.3, 10.9, SIDE + 0.005, tm, 0.3);
  }

  // ---------------------------------------------------------------------
  // structure: slabs, exterior walls, partitions (both floors)
  function buildShell() {
    // 1F floor finishes
    wplane(BX0 + 0.1, -7.6, -2.95, BZ1 - 0.1, F1, std(0xa3a2ad, { roughness: 0.3 }), 2);             // garage
    wplane(-7.5, 5, -3, BZ1 - 0.1, F1, plankM, 2);                                                     // office + corridor
    wplane(5, BX1 - 0.1, -3, 1.2, F1, plankM, 2);                                                      // lobby
    wplane(5, BX1 - 0.1, 1.2, BZ1 - 0.1, GK, std(0x3a3b44, { roughness: 0.35 }), 1);               // genkan (step down)
    wbox(3.9, 0.1, 0.12, walnutM, 7, 0.05, 1.2, null, { sharp: true });                                 // 上がり框
    wplane(BX0 + 0.1, -6, BZ0 + 0.1, -3, F1, oakM, 2);                                                  // rec hall
    wplane(-6, -1, -8.5, -3, F1, carpetM, 1);                                                           // meeting
    wplane(-6, -1, BZ0 + 0.1, -8.5, F1, std(0x9c9ba6, { roughness: 0.4 }), 2);                        // storage
    wplane(-1, 4, BZ0 + 0.1, -3, F1, tileM, 1.2);                                                       // pantry
    wplane(5.3, BX1 - 0.1, BZ0 + 0.1, -3, F1, tileM, 1.2);                                              // corridor, restrooms, janitor
    // slab between floors (hole for the stair) and 1F roof over the west wing
    const slabM = [ceilM, ceilM, ceilM, ceilM, ceilM, ceilM];
    const slab = (x0, x1, z0, z1) => wbox(x1 - x0, F2 - (F1 + H1), z1 - z0, slabM, (x0 + x1) / 2, F1 + H1, (z0 + z1) / 2, null, { uvs: 4 });
    slab(UX0, STAIR.x0 - 0.05, BZ0, BZ1); slab(STAIR.x1 + 0.05, BX1, BZ0, BZ1);
    slab(STAIR.x0 - 0.05, STAIR.x1 + 0.05, -3.2, BZ1); slab(STAIR.x0 - 0.05, STAIR.x1 + 0.05, BZ0, STAIR.zTop);
    slab(BX0, UX0, BZ0, BZ1);
    // 2F floors
    wplane(UX0 + 0.1, 2.5, -4, BZ1 - 0.1, F2 + 0.004, plankM, 2);                                               // boss office
    wplane(UX0 + 0.1, 2.5, UZ0 + 0.1, -4, F2 + 0.004, carpetM, 1);                                              // boardroom
    wplane(2.5, STAIR.x0 - 0.05, UZ0 + 0.1, BZ1 - 0.1, F2 + 0.004, plankM, 2);
    wplane(STAIR.x0 - 0.05, STAIR.x1 + 0.05, -3.2, BZ1 - 0.1, F2 + 0.004, plankM, 2);
    wplane(STAIR.x0 - 0.05, STAIR.x1 + 0.05, UZ0 + 0.1, STAIR.zTop, F2 + 0.004, plankM, 2);
    wplane(STAIR.x1 + 0.05, 6.5, UZ0 + 0.1, BZ1 - 0.1, F2 + 0.004, plankM, 2);
    wplane(6.5, BX1 - 0.1, -6, -1, F2 + 0.004, tileM, 1.2);                                                     // pantry 2F
    wplane(6.5, BX1 - 0.1, UZ0 + 0.1, -6, F2 + 0.004, tileM, 1.2);                                              // toilet 2F
    wplane(6.5, BX1 - 0.1, -1, BZ1 - 0.1, F2 + 0.004, plankM, 2);                                               // secretary
    // roof terrace deck on the west wing
    const deckT = texHi(128, 128, (x, w, h) => { for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? '#7d5a46' : '#8c6650'; x.fillRect(0, i * 16, w, 14); x.fillStyle = '#3c2a24'; x.fillRect(0, i * 16 + 14, w, 2); } }, 10);
    wplane(BX0 + 0.3, UX0, BZ0 + 0.3, BZ1 - 0.3, F2 + 0.005, std(0xffffff, { map: deckT, roughness: 0.7 }), 1.2);
    // 2F roof
    wbox(BX1 - UX0 + 0.3, 0.22, BZ1 - UZ0 + 0.3, [ceilM, ceilM, std(0x6d6c7e, { roughness: 0.6 }), ceilM, ceilM, ceilM], (UX0 + BX1) / 2, ROOF, (UZ0 + BZ1) / 2, null, { uvs: 4 });

    // ---------- 1F walls ----------
    const L1 = { lvl: 1 };
    // exterior
    wall('x', BZ1, -7.5, BX1, Object.assign({ out: '+', t: 0.25, gaps: [[6.4, 7.6, 2.4]], wins: [[-7.1, 4.6, 0.55, 2.85], [5.4, 6.0, 0.9, 2.4]] }, L1));
    wall('x', BZ0, BX0, BX1, Object.assign({ out: '-', t: 0.25, wins: [[-12.4, -6.6, 0.9, 2.6], [-5.0, -2.0, 1.6, 2.4], [-0.6, 3.6, 1.2, 2.5], [7.2, 8.4, 1.7, 2.4]] }, L1));
    wall('z', BX1, BZ0, BZ1, Object.assign({ out: '+', t: 0.25, wins: [[-11.0, -9.6, 1.75, 2.45], [-6.2, -4.8, 1.75, 2.45], [-2.4, 0.8, 0.7, 2.6], [1.8, 3.4, 1.8, 2.6]] }, L1));
    wall('z', BX0, BZ0, BZ1, Object.assign({ out: '-', t: 0.25, wins: [[-12.6, -9.2, 0.9, 2.6], [-7.6, -4.0, 0.9, 2.6]] }, L1));
    // garage front header + side
    wbox(BX0 * -1 + UX0 + 0.25, 0.75, 0.25, [concM, concM, concM, concM, concM, concM], (BX0 + UX0) / 2, F1 + 2.45, BZ1, null, { uvs: 1.8 });
    // interior partitions
    wall('z', UX0, -3, BZ1, Object.assign({ gaps: [[-2.8, -1.85]], out: null }, L1));              // garage | office
    wall('x', -3, BX0, -6, Object.assign({ gaps: [[-7.3, -6.3]] }, L1));                             // garage | rec
    wall('z', -6, BZ0, -3, L1);                                                                      // rec | meeting + storage
    wall('x', -3, -6, -1, Object.assign({ glass: true, gaps: [[-2.05, -1.15]] }, L1));               // meeting glass front
    wall('x', -8.5, -6, -1, L1);                                                                     // meeting | storage
    wall('z', -1, BZ0, -3, Object.assign({ gaps: [[-12.4, -11.5]] }, L1));                          // meeting/storage | pantry
    wall('z', 4.0, BZ0, -3, Object.assign({ t: 0.1 }, L1));                                          // stair walls
    wall('z', 5.3, BZ0, -3, Object.assign({ t: 0.1 }, L1));
    wall('x', -3, 5.3, BX1, Object.assign({ gaps: [[5.45, 6.4, 2.4]] }, L1));                        // lobby | restroom corridor
    wall('z', 6.5, BZ0, -3, Object.assign({ gaps: [[-4.4, -3.55], [-8.55, -7.7], [-13.65, -12.8]] }, L1));   // corridor | rooms
    wall('x', -7.5, 6.5, BX1, L1);                                                                   // men | women
    wall('x', -12.4, 6.5, BX1, L1);                                                                  // women | janitor
    wall('z', 5.0, -3, BZ1, Object.assign({ glass: true, gaps: [[-1.5, 0.3]] }, L1));               // office | lobby + genkan (glass)
    solid(1, STAIR.x0, STAIR.x1, BZ0, STAIR.zTop);                                                   // under-stair closet

    // ---------- 2F walls ----------
    const L2 = { lvl: 2 };
    wall('x', BZ1, UX0, BX1, Object.assign({ out: '+', t: 0.25, wins: [[-7.0, 2.2, 0.45, 2.85], [7.2, 8.6, 0.9, 2.6]] }, L2));
    wall('x', UZ0, UX0, BX1, Object.assign({ out: '-', t: 0.25, wins: [[-7.0, 2.0, 0.9, 2.6], [3.0, 6.0, 0.9, 2.6], [7.6, 8.6, 1.7, 2.4]] }, L2));
    wall('z', BX1, UZ0, BZ1, Object.assign({ out: '+', t: 0.25, wins: [[-9.0, -8.0, 1.7, 2.4], [-5.2, -2.2, 0.9, 2.6], [0.2, 3.2, 0.9, 2.6]] }, L2));
    wall('z', UX0, UZ0, BZ1, Object.assign({ out: '-', t: 0.25, gaps: [[-1.0, 0.0, 2.3]], wins: [[-3.3, -1.4, 0.6, 2.6], [0.6, 3.4, 0.6, 2.6], [-9.0, -4.6, 0.9, 2.6]] }, L2));
    wall('z', 2.5, UZ0, BZ1, Object.assign({ gaps: [[-6.0, -5.0], [0.4, 1.4]] }, L2));
    wall('x', -4, UX0, 2.5, L2);
    wall('z', 6.5, UZ0, -1, Object.assign({ gaps: [[-8.0, -7.2], [-3.6, -2.8]] }, L2));
    wall('x', -6, 6.5, BX1, L2);
    // glass balustrade around the stair opening
    const rail2 = (x0, x1, z0, z1) => {
      const g = plane(Math.max(x1 - x0, z1 - z0), 1.0, glassM); g.position.set((x0 + x1) / 2, F2 + 0.5, (z0 + z1) / 2); if (x1 - x0 < 0.01) g.rotation.y = Math.PI / 2;
      rod(V(x0, F2 + 1.02, z0), V(x1, F2 + 1.02, z1), 0.022, steelDk); solid(2, x0 - 0.05, x1 + 0.05, z0 - 0.05, z1 + 0.05);
    };
    rail2(STAIR.x0 - 0.05, STAIR.x0 - 0.05, STAIR.zTop + 0.05, -3.2); rail2(STAIR.x1 + 0.05, STAIR.x1 + 0.05, STAIR.zTop + 0.05, -3.2); rail2(STAIR.x0 - 0.05, STAIR.x1 + 0.05, -3.2, -3.2);
    // terrace railing on the west wing roof
    const tr = (x0, x1, z0, z1) => {
      const g = plane(Math.max(x1 - x0, z1 - z0), 1.0, glassM); g.position.set((x0 + x1) / 2, F2 + 0.5, (z0 + z1) / 2); if (x1 - x0 < 0.01) g.rotation.y = Math.PI / 2;
      rod(V(x0, F2 + 1.02, z0), V(x1, F2 + 1.02, z1), 0.025, steelDk); solid(2, x0 - 0.1, x1 + 0.1, z0 - 0.1, z1 + 0.1);
    };
    tr(BX0 + 0.15, BX0 + 0.15, BZ0 + 0.15, BZ1 - 0.15); tr(BX0 + 0.15, UX0, BZ1 - 0.15, BZ1 - 0.15); tr(BX0 + 0.15, BX1 - 0.15, BZ0 + 0.15, BZ0 + 0.15); tr(BX1 - 0.15, BX1 - 0.15, BZ0 + 0.15, UZ0);
    wplane(UX0, BX1 - 0.2, BZ0 + 0.2, UZ0 - 0.15, F2 + 0.005, std(0x8f8e9e, { roughness: 0.95 }), 2);

    // staircase: floating walnut treads
    const n = 18, rise = (F2 - F1) / n, run = (STAIR.zBot - STAIR.zTop) / n;
    for (let i = 0; i < n; i++) wbox(STAIR.x1 - STAIR.x0, 0.06, run + 0.04, walnutM, (STAIR.x0 + STAIR.x1) / 2, F1 + (i + 1) * rise - 0.06, STAIR.zBot - (i + 0.5) * run, null, { uvs: 1 });
    rod(V(STAIR.x0 + 0.03, F1, STAIR.zBot), V(STAIR.x0 + 0.03, F2, STAIR.zTop), 0.04, steelDk);
    rod(V(STAIR.x1 - 0.03, F1 + 0.9, STAIR.zBot), V(STAIR.x1 - 0.03, F2 + 0.9, STAIR.zTop), 0.02, brassM);   // handrail
  }

  // ---------------------------------------------------------------------
  // furniture kit
  function deskUnit(x, z, ry, screenCol) {
    const g = new THREE.Group(); g.position.set(x, F1, z); g.rotation.y = ry; root.add(g);
    box(1.35, 0.03, 0.7, whiteLam, 0, 0.72, 0, g);
    [[-0.64, 0], [0.64, 0]].forEach(([lx]) => box(0.04, 0.72, 0.62, steelDk, lx, 0, 0, g, { sharp: true }));
    box(0.55, 0.34, 0.025, 0x16171c, 0, 0.92, -0.2, g);
    rod(V(0, 0.75, -0.22), V(0, 0.92, -0.22), 0.02, aluM, g);
    const st = tex(160, 100, (c, w, h) => { c.fillStyle = screenCol[0]; c.fillRect(0, 0, w, h); c.fillStyle = screenCol[1]; c.fillRect(10, 12, 64, 8); c.globalAlpha = 0.5; c.fillRect(10, 28, 110, 5); c.fillRect(10, 40, 90, 5); c.globalAlpha = 0.85; rrect(c, 96, 52, 52, 38, 6); c.fill(); });
    const sc = plane(0.51, 0.3, glow(0xffffff, { map: st }, 1.1), g); sc.position.set(0, 1.09, -0.186);
    box(0.42, 0.012, 0.14, 0x2a2b33, 0, 0.75, 0.05, g, { sharp: true });
    officeChair(0, 0.55, 0, g);
    return g;
  }
  function officeChair(x, z, ry, parent, m, y) {
    const c = new THREE.Group(); c.position.set(x, y || 0, z); c.rotation.y = ry; parent.add(c);
    for (let i = 0; i < 5; i++) { const a = i * 1.2566; rod(V(0, 0.07, 0), V(Math.cos(a) * 0.3, 0.04, Math.sin(a) * 0.3), 0.018, aluM, c); }
    cyl(0.025, 0.025, 0.38, aluM, 0, 0.07, 0, c, { seg: 10 });
    box(0.5, 0.08, 0.48, m || fabricM, 0, 0.45, 0, c);
    box(0.48, 0.55, 0.06, m || fabricM, 0, 0.55, 0.24, c);
    return c;
  }
  function chair(x, z, ry, parent, m, y) {
    const c = new THREE.Group(); c.position.set(x, y || 0, z); c.rotation.y = ry; parent.add(c);
    [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].forEach(([a, b]) => rod(V(a, 0, b), V(a, 0.45, b), 0.014, steelDk, c));
    box(0.46, 0.05, 0.46, m || oakM, 0, 0.45, 0, c);
    box(0.46, 0.4, 0.04, m || oakM, 0, 0.5, 0.22, c);
    return c;
  }
  function sofa(x, z, ry, len, m, y, parent) {
    const s = new THREE.Group(); s.position.set(x, y, z); s.rotation.y = ry; (parent || root).add(s);
    box(len, 0.42, 0.9, m, 0, 0.04, 0, s);
    box(len, 0.45, 0.2, m, 0, 0.42, 0.35, s);
    [-1, 1].forEach((k) => box(0.2, 0.62, 0.9, m, k * (len / 2 - 0.1), 0.04, 0, s));
    const nC = Math.max(1, Math.round((len - 0.4) / 0.8));
    for (let i = 0; i < nC; i++) box((len - 0.4) / nC - 0.03, 0.14, 0.66, m, -len / 2 + 0.2 + ((len - 0.4) / nC) * (i + 0.5), 0.42, -0.06, s);
    return s;
  }
  function plantPot(x, y, z, r, h, c, parent) {
    cyl(r, r * 0.8, h * 0.28, std(0x2a2b30, { roughness: 0.5 }), x, y, z, parent, { seg: 18 });
    rod(V(x, y + h * 0.28, z), V(x + 0.02, y + h * 0.75, z), 0.02, 0x5a4535, parent);
    foliage(r * 1.6, c || 0x4c8a62, x, y + h * 0.78, z, parent); foliage(r * 1.1, 0x2f6e5c, x + r * 0.5, y + h * 0.58, z + r * 0.3, parent);
  }
  function shelfUnit(x, z, ry, w, h, d, m, y, parent) {
    const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; (parent || root).add(g);
    box(w, 0.03, d, m, 0, 0, 0, g, { sharp: true }); box(w, 0.03, d, m, 0, h - 0.03, 0, g, { sharp: true });
    [-1, 1].forEach((k) => box(0.03, h, d, m, k * (w / 2 - 0.015), 0, 0, g, { sharp: true }));
    const rows = Math.max(2, Math.round(h / 0.38));
    for (let r = 1; r < rows; r++) box(w, 0.025, d, m, 0, (h / rows) * r, 0, g, { sharp: true });
    const cols = [0xe6e2da, 0x2d3240, 0x8e5c3c, 0x5b6075, 0xc9a46a, 0x9a5a3e, 0xd8d4cc];
    for (let r = 0; r < rows; r++) {
      let px = -w / 2 + 0.06;
      while (px < w / 2 - 0.15) {
        const bw = 0.04 + Math.random() * 0.05, bh = (h / rows) * (0.55 + Math.random() * 0.3);
        if (Math.random() < 0.82) box(bw, bh, d * 0.75, cols[(Math.random() * cols.length) | 0], px + bw / 2, (h / rows) * r + 0.03, 0, g, { sharp: true, shadow: false });
        px += bw + 0.01 + (Math.random() < 0.15 ? 0.12 : 0);
      }
    }
    return g;
  }
  function wc(x, z, ry, y) {
    const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; root.add(g);
    const porc = std(0xf4f4f2, { roughness: 0.15 });
    box(0.36, 0.4, 0.5, porc, 0, 0, 0.05, g); box(0.38, 0.05, 0.52, porc, 0, 0.4, 0.04, g);
    box(0.4, 0.7, 0.18, porc, 0, 0.2, -0.24, g);
    return g;
  }
  function sinkCounter(x, z, ry, len, y, nSinks) {
    const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; root.add(g);
    box(len, 0.06, 0.55, stoneM, 0, 0.82, 0, g); box(len, 0.3, 0.5, walnutDkM, 0, 0.52, 0.02, g);
    for (let i = 0; i < nSinks; i++) {
      const sx = -len / 2 + len * (i + 0.5) / nSinks;
      cyl(0.2, 0.17, 0.12, std(0xf4f4f2, { roughness: 0.15 }), sx, 0.88, 0, g, { seg: 24 });
      rod(V(sx, 0.88, -0.2), V(sx, 1.1, -0.2), 0.012, aluM, g); rod(V(sx, 1.1, -0.2), V(sx, 1.1, -0.08), 0.012, aluM, g);
      const mir = plane(0.55, 0.75, std(0xaab6c4, { metalness: 0.55, roughness: 0.12, emissive: 0x1c2026 }), g); mir.position.set(sx, 1.55, -0.27);
    }
    return g;
  }
  function kitchen(x0, x1, zWall, y, faceSign, withFridge) {
    // counter run along a wall at zWall, facing +z (faceSign 1) or -z (-1)
    const len = x1 - x0, cz = zWall + faceSign * 0.32, cx = (x0 + x1) / 2;
    box(len, 0.86, 0.6, whiteLam, cx, y, cz); box(len + 0.02, 0.04, 0.62, stoneM, cx, y + 0.86, cz);
    box(len, 0.7, 0.35, whiteLam, cx, y + 1.5, zWall + faceSign * 0.2);
    box(len - 0.1, 0.03, 0.03, glow(0xfff0d8, {}, 2), cx, y + 1.48, zWall + faceSign * 0.36, null, { sharp: true, shadow: false });
    box(0.55, 0.02, 0.4, std(0xd8dade, { metalness: 0.9, roughness: 0.2 }), x0 + 0.6, y + 0.9, cz, null, { sharp: true });
    rod(V(x0 + 0.6, y + 0.9, zWall + faceSign * 0.1), V(x0 + 0.6, y + 1.2, zWall + faceSign * 0.1), 0.015, aluM);
    box(0.32, 0.4, 0.38, 0x24252c, x0 + 1.4, y + 0.9, cz);                                      // coffee machine
    if (len > 2.3) box(0.5, 0.3, 0.38, 0x2e3038, x0 + 2.1, y + 0.9, cz);                        // microwave
    if (withFridge) { box(0.75, 1.9, 0.68, std(0xc9ccd4, { metalness: 0.7, roughness: 0.3 }), x1 + 0.42, y, zWall + faceSign * 0.36); solid(y > 2 ? 2 : 1, x1, x1 + 0.8, cz - 0.35, cz + 0.35); }
    solid(y > 2 ? 2 : 1, x0, x1, cz - 0.32, cz + 0.32);
  }
  function tableRect(x, z, w, d, h, m, y, legM) {
    box(w, 0.05, d, m, x, y + h - 0.05, z);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => box(0.06, h - 0.05, 0.06, legM || steelDk, x + a * (w / 2 - 0.12), y, z + b * (d / 2 - 0.12), null, { sharp: true }));
    solid(y > 2 ? 2 : 1, x - w / 2, x + w / 2, z - d / 2, z + d / 2);
  }
  function screenOnWall(x, y, z, ry, w, h, logo, draw) {
    const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; root.add(g);
    box(w, h, 0.05, 0x0e0f13, 0, 0, 0, g, { sharp: true });
    const t = tex(320, 180, (c, W, H) => { const gg = c.createLinearGradient(0, 0, W, H); gg.addColorStop(0, '#0f1626'); gg.addColorStop(1, '#22344c'); c.fillStyle = gg; c.fillRect(0, 0, W, H); if (draw) draw(c, W, H); else if (logo) drawLogo(c, W / 2, H / 2, 120, '#00e6fe'); });
    const s = plane(w - 0.06, h - 0.06, glow(0xffffff, { map: t }, 1.0), g); s.position.set(0, h / 2, 0.027);
  }
  function ceilingPanels(x0, x1, z0, z1, y, nx, nz) {
    for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
      const px = x0 + (x1 - x0) * (i + 0.5) / nx, pz = z0 + (z1 - z0) * (j + 0.5) / nz;
      const p = plane(0.6, 0.6, glow(0xfff4e2, {}, 2.0)); p.rotation.x = Math.PI / 2; p.position.set(px, y - 0.01, pz);
    }
  }
  function pointLight(c, k, dist, x, y, z) { const l = new THREE.PointLight(c, k * 0.72, dist, 1.9); l.position.set(x, y, z); root.add(l); return l; }

  // ---------------------------------------------------------------------
  function buildGround1() {
    const C1 = F1 + H1;
    // ---- garage + EV
    buildCar(-10.25, LOT + 0.03, 0.6, 0, 0x3e475e);
    shelfUnit(-12.55, -1.2, Math.PI / 2, 2.4, 2.0, 0.45, steelDk, F1); solid(1, -12.85, -12.3, -2.4, 0.0);
    for (let i = 0; i < 3; i++) cyl(0.33, 0.33, 0.22, 0x1d1c26, -12.4, F1 + i * 0.23, 1.6, null, { seg: 20 });
    box(0.4, 0.55, 0.14, 0xe9ebf2, -7.7, F1 + 1.0, -0.8);
    const evRing = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.09, 24), glow(0x00e6fe, {}, 2)); evRing.position.set(-7.78, F1 + 1.4, -0.8); evRing.rotation.y = -Math.PI / 2; root.add(evRing);
    const cable = new THREE.CatmullRomCurve3([V(-7.78, F1 + 1.05, -0.8), V(-8.2, F1 + 0.15, -0.5), V(-8.8, F1 + 0.2, -0.9), V(-9.2, F1 + 1.1, -1.4)]);
    root.add(new THREE.Mesh(new THREE.TubeGeometry(cable, 40, 0.025, 6), M(0x1d1f2a)));
    box(0.18, 0.06, 4.6, glow(0xeef9ff, {}, 2), -10.25, C1 - 0.08, 0.5, null, { sharp: true, shadow: false });
    pointLight(0xe8f4ff, 2.0, 9, -10.25, C1 - 0.4, 0.5);
    solid(1, -11.4, -9.1, -1.95, 3.15);
    label('GARAGE', 0.6, 0.15, -7.6, F1 + 1.9, -2.32, -Math.PI / 2);

    // ---- open office: two desk islands (6 + 4 = 10 workstations), walkways all round
    const scr = [['#cfeef7', '#0a8fa3'], ['#f3e6d4', '#e2734a'], ['#e4dcf5', '#6b4fc2'], ['#e9f2e4', '#3f8a5c'], ['#f6e9ec', '#c2475f']];
    const ISZ = 0.6;                                  // island centre line (z)
    function island(x0, n) {
      for (let i = 0; i < n; i++) {
        const x = x0 + 0.7 + i * 1.4;
        deskUnit(x, ISZ + 0.36, 0, scr[(i * 2) % 5]);        // south row, facing north
        deskUnit(x, ISZ - 0.36, Math.PI, scr[(i * 2 + 1) % 5]); // north row, facing south
      }
      wbox(n * 1.4, 0.4, 0.03, std(0x4c5a52, { roughness: 0.95 }), x0 + n * 0.7, F1 + 0.75, ISZ, null, { sharp: true });   // felt divider
      solid(1, x0, x0 + n * 1.4, ISZ - 0.72, ISZ + 0.72);
      box(0.06, 0.06, n * 1.4 - 0.2, glow(0xfff4e2, {}, 2.2), x0 + n * 0.7, C1 - 0.7, ISZ, null, { sharp: true, shadow: false }).rotation.y = Math.PI / 2;
      rod(V(x0 + 0.3, C1, ISZ), V(x0 + 0.3, C1 - 0.66, ISZ), 0.004, steelDk); rod(V(x0 + n * 1.4 - 0.3, C1, ISZ), V(x0 + n * 1.4 - 0.3, C1 - 0.66, ISZ), 0.004, steelDk);
    }
    island(-6.4, 3); island(-1.4, 2);   // 6 desks (x -6.4..-2.2) + 4 desks (x -1.4..1.4)
    // support zone at the east end of the office: printer, lockers, plants
    box(0.6, 0.45, 0.5, 0x3a3c45, 2.9, F1, 3.45); box(0.5, 0.25, 0.42, 0x2a2b33, 2.9, F1 + 0.45, 3.45); solid(1, 2.6, 3.2, 3.2, 3.75);
    for (let i = 0; i < 3; i++) box(0.45, 1.9, 0.5, std(i % 2 ? 0x5a6070 : 0x4a4f5c, { roughness: 0.4 }), -7.15, F1, -0.5 + i * 0.47);   // lockers on the garage wall
    solid(1, -7.45, -6.85, -0.75, 0.7);
    shelfUnit(-7.25, 2.2, Math.PI / 2, 2.6, 1.1, 0.4, whiteLam, F1); solid(1, -7.45, -7.05, 0.9, 3.5);
    plantPot(-6.6, F1, 3.45, 0.24, 1.6, 0x4c8a62); plantPot(1.9, F1, 3.4, 0.22, 1.4, 0x3f7d5a); plantPot(2.6, F1, -2.5, 0.24, 1.7);
    ceilingPanels(-6.8, 3.6, -2.4, 3.4, C1, 5, 2);
    pointLight(0xfff0dc, 3.2, 13, -2.4, C1 - 0.5, 0.6);

    // ---- genkan: shoe cabinet, bench, umbrella stand (entry path kept clear down the middle)
    box(0.42, 2.1, 2.5, walnutDkM, 8.65, GK, 2.65); solid(1, 8.4, 8.9, 1.4, 3.9);
    for (let i = 0; i < 4; i++) box(0.012, 1.9, 0.012, brassM, 8.43, GK + 0.1, 1.55 + i * 0.62, null, { sharp: true });
    box(1.2, 0.08, 0.38, oakM, 5.8, GK + 0.43, 3.65); [5.3, 6.3].forEach((x) => box(0.05, 0.43, 0.32, steelDk, x, GK, 3.65, null, { sharp: true }));
    solid(1, 5.2, 6.4, 3.45, 3.85);
    cyl(0.14, 0.14, 0.5, steelDk, 8.15, GK, 1.45, null, { seg: 16, open: true }); solid(1, 7.95, 8.35, 1.25, 1.65);
    for (let i = 0; i < 3; i++) rod(V(8.15 + (i - 1) * 0.04, GK + 0.05, 1.45), V(8.15 + (i - 1) * 0.08, GK + 0.9, 1.45 + (i - 1) * 0.03), 0.012, [0x2a2b33, 0x9a5a3e, 0x3e475e][i]);
    const matT = tex(256, 160, (x, w, h) => { x.fillStyle = '#25262f'; x.fillRect(0, 0, w, h); x.strokeStyle = '#4b4d5c'; x.lineWidth = 4; for (let i = 0; i < 18; i++) { x.beginPath(); x.moveTo(i * 15, 0); x.lineTo(i * 15, h); x.stroke(); } drawLogo(x, w / 2, h / 2, 104, '#8e93a8'); });
    const mat1 = plane(1.3, 0.8, std(0xffffff, { map: matT, roughness: 1 })); mat1.rotation.x = -Math.PI / 2; mat1.position.set(7, GK + 0.006, 3.4);
    ceilingPanels(5.5, 8.5, 1.4, 3.8, C1, 2, 1);

    // ---- lobby / waiting: seating along the east wall, open path from the genkan to the office
    sofa(8.4, -1.0, Math.PI / 2, 2.4, std(0xcab8a0, { roughness: 0.95 }), F1); solid(1, 7.9, 8.9, -2.25, 0.25);
    cyl(0.36, 0.36, 0.04, stoneM, 7.35, F1 + 0.38, -1.0, null, { seg: 32 }); cyl(0.09, 0.13, 0.38, steelDk, 7.35, F1, -1.0, null, { seg: 16 }); solid(1, 7.0, 7.7, -1.35, -0.65);
    const ac = new THREE.Group(); ac.position.set(7.3, F1, -2.45); ac.rotation.y = -2.5; root.add(ac);
    box(0.72, 0.4, 0.72, leatherTan, 0, 0.04, 0, ac); box(0.72, 0.42, 0.14, leatherTan, 0, 0.4, 0.29, ac); solid(1, 6.9, 7.7, -2.85, -2.05);
    box(0.32, 1.05, 0.32, std(0xdfe6ee, { roughness: 0.3 }), 8.65, F1, 0.85); cyl(0.13, 0.13, 0.42, std(0xa8d8f0, { transparent: true, opacity: 0.6, roughness: 0.05 }), 8.65, F1 + 1.05, 0.85, null, { seg: 18 }); solid(1, 8.45, 8.85, 0.65, 1.05);
    plantPot(5.4, F1, 0.85, 0.2, 1.4);
    const wart = tex(320, 220, (c, w, h) => { c.fillStyle = '#0f1626'; c.fillRect(0, 0, w, h); drawLogo(c, w / 2, h / 2, 150, '#00e6fe'); });
    const wa = plane(1.0, 0.68, glow(0xffffff, { map: wart }, 0.9)); wa.position.set(8.86, F1 + 1.75, -1.0); wa.rotation.y = -Math.PI / 2;
    pointLight(0xffdcb0, 2.0, 8, 7.0, C1 - 0.4, -0.6); ceilingPanels(5.6, 8.6, -2.6, 0.8, C1, 2, 2);

    // ---- restroom corridor (x 5.3..6.5), men / women / janitor on its east side
    const tileWall = std(0xffffff, { map: tex(128, 128, (x, w, h) => { x.fillStyle = '#e9e8e4'; x.fillRect(0, 0, w, h); x.fillStyle = '#c9c8c3'; x.fillRect(0, 63, w, 2); x.fillRect(63, 0, 2, h); x.fillRect(0, 0, w, 1); x.fillRect(0, 0, 1, h); }, { hi: 4, grain: 6, repeat: true }), roughness: 0.25, envMapIntensity: 0.4 });
    const partM = std(0x4a4f5c, { roughness: 0.35 }), stallDoorM = std(0x5a6070, { roughness: 0.35 });
    wbox(2.3, 1.4, 0.02, tileWall, 7.7, F1, -12.33, null, { sharp: true, uvs: 0.3, shadow: false });
    wbox(2.3, 1.4, 0.02, tileWall, 7.7, F1, -7.57, null, { sharp: true, uvs: 0.3, shadow: false });
    function stall(x0, x1, z0, z1, openSide) {
      const y0 = F1 + 0.15, hh = 1.95;
      if (openSide === 'z') {        // door on the z1 side, toilet against the z0 wall
        wbox(0.03, hh, z1 - z0, partM, x0, y0, (z0 + z1) / 2, null, { sharp: true }); wbox(0.03, hh, z1 - z0, partM, x1, y0, (z0 + z1) / 2, null, { sharp: true });
        solid(1, x0 - 0.02, x0 + 0.02, z0, z1); solid(1, x1 - 0.02, x1 + 0.02, z0, z1);
        const d = new THREE.Group(); d.position.set(x0 + 0.04, y0, z1); d.rotation.y = 0.55; root.add(d);
        wbox(x1 - x0 - 0.1, hh, 0.03, stallDoorM, (x1 - x0 - 0.1) / 2, 0, 0, d, { sharp: true });
        wc((x0 + x1) / 2, z0 + 0.42, 0, F1);
      } else {                       // door on the x0 side, toilet against the x1 wall
        wbox(x1 - x0, hh, 0.03, partM, (x0 + x1) / 2, y0, z0, null, { sharp: true }); wbox(x1 - x0, hh, 0.03, partM, (x0 + x1) / 2, y0, z1, null, { sharp: true });
        solid(1, x0, x1, z0 - 0.02, z0 + 0.02); solid(1, x0, x1, z1 - 0.02, z1 + 0.02);
        const d = new THREE.Group(); d.position.set(x0, y0, z0 + 0.04); d.rotation.y = -Math.PI / 2 + 0.55; root.add(d);
        wbox(z1 - z0 - 0.1, hh, 0.03, stallDoorM, (z1 - z0 - 0.1) / 2, 0, 0, d, { sharp: true });
        wc(x1 - 0.42, (z0 + z1) / 2, -Math.PI / 2, F1);
      }
      const lt = new THREE.Mesh(new THREE.CircleGeometry(0.05, 12), glow(0xfff4e2, {}, 2.5)); lt.rotation.x = Math.PI / 2; lt.position.set((x0 + x1) / 2, C1 - 0.01, (z0 + z1) / 2); root.add(lt);
    }
    const porc = std(0xf4f4f2, { roughness: 0.15 });
    // men's (z -7.5..-3): two stalls on the back wall, two urinals on the east wall, sinks on the front wall
    stall(6.57, 7.72, -7.43, -6.0, 'z'); stall(7.72, 8.87, -7.43, -6.0, 'z');
    [-5.2, -4.3].forEach((z) => {
      const u = box(0.36, 0.6, 0.3, porc, 8.72, F1 + 0.55, z); u.rotation.y = -Math.PI / 2;
      wbox(0.45, 0.9, 0.03, partM, 8.65, F1 + 0.6, z - 0.45, null, { sharp: true }); solid(1, 8.5, 8.9, z - 0.25, z + 0.25);
    });
    sinkCounter(7.85, -3.35, Math.PI, 1.4, F1, 2); solid(1, 7.15, 8.6, -3.65, -3.05);
    // women's (z -12.4..-7.5): three stalls on the east wall, sinks on the north side of the partition
    stall(7.55, 8.87, -12.33, -11.2, 'x'); stall(7.55, 8.87, -11.2, -10.07, 'x'); stall(7.55, 8.87, -10.07, -8.94, 'x');
    sinkCounter(8.1, -7.85, Math.PI, 1.5, F1, 2); solid(1, 7.35, 8.85, -8.15, -7.55);
    // janitor (z -14..-12.4)
    [1.0, 1.5].forEach((y) => box(0.45, 0.03, 1.4, 0x8b8e99, 8.62, F1 + y, -13.15, null, { sharp: true }));
    box(0.55, 0.85, 0.6, std(0xf4f4f2, { roughness: 0.2 }), 8.55, F1, -13.55); box(0.42, 0.4, 0.42, 0x2f6fb0, 8.6, F1, -12.75); solid(1, 8.25, 8.88, -13.9, -12.5);
    // signs at the corridor entrance + on each door
    function wcSign(x, y, z, ry, kind) {
      const t = tex(160, 220, (c, w, h) => {
        c.fillStyle = '#16171d'; rrect(c, 0, 0, w, h, 14); c.fill();
        const col = kind === 'm' ? '#4aa3ff' : '#ff6b8a'; c.fillStyle = col;
        c.beginPath(); c.arc(80, 46, 18, 0, 7); c.fill();
        if (kind === 'm') { c.fillRect(60, 70, 40, 56); c.fillRect(62, 126, 15, 46); c.fillRect(83, 126, 15, 46); }
        else { c.beginPath(); c.moveTo(80, 68); c.lineTo(110, 140); c.lineTo(50, 140); c.closePath(); c.fill(); c.fillRect(64, 140, 13, 34); c.fillRect(83, 140, 13, 34); }
        c.fillStyle = '#e8eaf0'; c.font = `900 30px ${JP}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(kind === 'm' ? '男' : '女', 80, 198);
      });
      const pl = plane(0.22, 0.3, std(0xffffff, { map: t, roughness: 0.4 })); pl.position.set(x, y, z); pl.rotation.y = ry;
    }
    wcSign(6.43, F1 + 1.55, -4.95, -Math.PI / 2, 'm'); wcSign(6.43, F1 + 1.55, -9.1, -Math.PI / 2, 'f');
    wcSign(6.75, F1 + 2.62, -2.93, 0, 'm'); wcSign(7.05, F1 + 2.62, -2.93, 0, 'f');
    label('JANITOR', 0.6, 0.15, 6.43, F1 + 2.35, -13.2, -Math.PI / 2);
    pointLight(0xf4f8ff, 1.3, 7, 7.7, C1 - 0.4, -5.2); pointLight(0xf4f8ff, 1.3, 7, 7.7, C1 - 0.4, -10.2);
    ceilingPanels(5.6, 6.2, -13.5, -3.5, C1, 1, 5); ceilingPanels(7.2, 8.2, -11.8, -3.6, C1, 1, 4);

    // ---- pantry + dining (x -1..4, z -14..-3): kitchen wall, island, table for 8, lounge counter
    const kz = BZ0 + 0.13;
    kitchen(-0.6, 2.7, kz, F1, 1, true);
    box(2.4, 0.9, 0.9, walnutDkM, 1.0, F1, -11.3); box(2.5, 0.05, 1.0, stoneM, 1.0, F1 + 0.9, -11.3); solid(1, -0.25, 2.25, -11.8, -10.8);    // island
    [0.3, 1.0, 1.7].forEach((x) => { cyl(0.17, 0.17, 0.05, leatherBk, x, F1 + 0.7, -10.5, null, { seg: 20 }); cyl(0.03, 0.03, 0.7, aluM, x, F1, -10.5, null, { seg: 10 }); });
    tableRect(1.5, -6.8, 1.1, 3.0, 0.75, oakM, F1);
    [-7.85, -6.8, -5.75].forEach((z) => { chair(0.65, z, -Math.PI / 2, root, oakM, F1); chair(2.35, z, Math.PI / 2, root, oakM, F1); });
    chair(1.5, -8.7, Math.PI, root, oakM, F1); chair(1.5, -4.9, 0, root, oakM, F1);
    [-7.6, -6.8, -6.0].forEach((z) => { rod(V(1.5, C1, z), V(1.5, C1 - 0.9, z), 0.005, steelDk); cyl(0.04, 0.16, 0.18, std(0x1a1b22, { metalness: 0.6, roughness: 0.4 }), 1.5, C1 - 1.08, z, null, { seg: 20 }); const b = new THREE.Mesh(new THREE.CircleGeometry(0.13, 18), glow(0xfff0d2, {}, 3)); b.rotation.x = Math.PI / 2; b.position.set(1.5, C1 - 1.085, z); root.add(b); });
    box(0.5, 1.0, 0.5, std(0xdfe6ee, { roughness: 0.3 }), 3.6, F1, -3.6); solid(1, 3.35, 3.85, -3.85, -3.35);    // water dispenser
    plantPot(-0.6, F1, -3.6, 0.22, 1.5, 0x5d8f4f);
    label('PANTRY', 0.6, 0.15, -0.88, F1 + 2.35, -4.5, Math.PI / 2);
    pointLight(0xffd8a8, 2.4, 10, 1.5, C1 - 0.4, -8.5); ceilingPanels(-0.4, 3.4, -13.2, -9.6, C1, 2, 2);

    // ---- meeting room (x -6..-1, z -8.5..-3)
    tableRect(-3.5, -5.8, 3.0, 1.2, 0.75, walnutM, F1);
    for (let i = 0; i < 4; i++) { const x = -4.65 + i * 0.77; chair(x, -6.75, Math.PI, root, leatherBk, F1); chair(x, -4.85, 0, root, leatherBk, F1); }
    screenOnWall(-5.88, F1 + 0.9, -5.8, Math.PI / 2, 2.2, 1.25, true, screenCard('PRICING', ['UI/UX', 'WEB', 'VIDEO']));
    const wb = plane(2.0, 1.0, std(0xf2f2ef, { roughness: 0.55, envMapIntensity: 0.3 })); wb.position.set(-3.5, F1 + 1.45, -8.42);
    plantPot(-1.45, F1, -8.0, 0.2, 1.3);
    pointLight(0xfff0dc, 1.8, 7, -3.5, C1 - 0.5, -5.8); ceilingPanels(-5.2, -1.8, -8, -3.6, C1, 2, 2);
    label('MEETING', 0.6, 0.15, -2.6, F1 + 2.35, -2.9, 0);

    // ---- storage (x -6..-1, z -14..-8.5), door from the pantry
    [[-3.5, -13.65, 0], [-5.65, -11.3, Math.PI / 2]].forEach(([x, z, r]) => {
      const g = new THREE.Group(); g.position.set(x, F1, z); g.rotation.y = r; root.add(g);
      const L = r ? 4.2 : 4.6;
      [0, 0.5, 1.0, 1.5, 2.0].forEach((y) => box(L, 0.03, 0.45, 0x8b8e99, 0, y, 0, g, { sharp: true }));
      [-L / 2 + 0.02, L / 2 - 0.02].forEach((px) => box(0.04, 2.1, 0.45, 0x5b6075, px, 0, 0, g, { sharp: true }));
      for (let sh = 0; sh < 4; sh++) for (let i = 0; i < 5; i++) if (Math.random() < 0.8) box(0.6, 0.32 + Math.random() * 0.1, 0.38, [0xc9a26b, 0xb88f5c, 0xe4e1d6][(sh + i) % 3], -L / 2 + 0.5 + i * (L - 1) / 4, sh * 0.5 + 0.03, 0, g);
    });
    solid(1, -5.85, -1.15, -13.9, -13.4); solid(1, -5.9, -5.4, -13.4, -9.2);
    [[-2.5, -10.0], [-2.0, -10.6]].forEach(([x, z], i) => box(0.6, 0.5 - i * 0.1, 0.5, [0xc9a26b, 0xe4e1d6][i], x, F1, z));
    solid(1, -2.85, -1.7, -10.9, -9.7);
    pointLight(0xf4f8ff, 1.0, 6, -3.5, C1 - 0.4, -11.2);
    label('STORAGE', 0.6, 0.15, -0.88, F1 + 2.35, -11.0, Math.PI / 2);

    // ---- recreation hall (x -13..-6, z -14..-3)
    const rugT = texHi(128, 128, (x, w, h) => { x.fillStyle = '#4d5260'; x.fillRect(0, 0, w, h); x.strokeStyle = '#7b8193'; x.lineWidth = 3; x.strokeRect(8, 8, w - 16, h - 16); }, 16);
    const rug = plane(4.4, 3.2, std(0xffffff, { map: rugT, roughness: 1 })); rug.rotation.x = -Math.PI / 2; rug.position.set(-9.5, F1 + 0.01, -11.6);
    sofa(-9.5, -10.4, 0, 3.6, std(0x2f5f6a, { roughness: 0.95 }), F1); solid(1, -11.3, -7.7, -10.85, -9.95);
    screenOnWall(-9.5, F1 + 0.9, -13.82, 0, 2.6, 1.5, true, screenCard('SELECTED WORK', ['VisionLogic AI', 'Auteur']));
    box(2.2, 0.45, 0.42, walnutDkM, -9.5, F1, -13.6); solid(1, -10.6, -8.4, -13.85, -13.35);
    box(0.32, 0.06, 0.24, 0x101114, -9.0, F1 + 0.45, -13.6, null, { sharp: true });
    cyl(0.5, 0.5, 0.05, oakM, -9.5, F1 + 0.36, -11.8, null, { seg: 32 }); cyl(0.08, 0.08, 0.36, steelDk, -9.5, F1, -11.8, null, { seg: 12 }); solid(1, -10.0, -9.0, -12.3, -11.3);
    box(2.74, 0.04, 1.52, std(0x1f4f7a, { roughness: 0.5 }), -9.5, F1 + 0.72, -6.3);
    wbox(0.015, 0.15, 1.7, std(0xf0f0f0, { transparent: true, opacity: 0.7 }), -9.5, F1 + 0.76, -6.3, null, { sharp: true });
    [[-1.2, -0.6], [1.2, -0.6], [-1.2, 0.6], [1.2, 0.6]].forEach(([a, b]) => box(0.06, 0.72, 0.06, steelDk, -9.5 + a, F1, -6.3 + b, null, { sharp: true }));
    solid(1, -10.9, -8.1, -7.1, -5.5);
    const arc = new THREE.Group(); arc.position.set(-12.5, F1, -8.4); arc.rotation.y = Math.PI / 2; root.add(arc);
    box(0.7, 1.75, 0.75, 0x1a1b22, 0, 0, 0, arc);
    const arcT = tex(200, 160, (c, w, h) => { c.fillStyle = '#0b1020'; c.fillRect(0, 0, w, h); c.fillStyle = '#00e6fe'; c.font = `800 26px ${DISPLAY}`; c.textAlign = 'center'; c.fillText('PLAY', w / 2, 60); c.fillStyle = '#ff6b8a'; for (let i = 0; i < 6; i++) c.fillRect(30 + i * 24, 100, 14, 14); });
    const asc = plane(0.56, 0.45, glow(0xffffff, { map: arcT }, 1.4), arc); asc.position.set(0, 1.25, 0.378);
    solid(1, -12.9, -12.1, -8.8, -8.0);
    [[-12.2, -12.2, 0x9a5a3e], [-12.0, -12.95, 0xc9a46a]].forEach(([x, z, c]) => { const b = sphere(0.42, std(c, { roughness: 0.9 }), x, F1 + 0.3, z); b.scale.set(1, 0.65, 1); });
    solid(1, -12.65, -11.55, -13.4, -11.75);
    cyl(0.25, 0.25, 0.04, std(0x2a2b30), -6.2, F1 + 1.6, -9.5, null, { seg: 24 }).rotation.z = Math.PI / 2;
    plantPot(-12.5, F1, -3.5, 0.24, 1.7); plantPot(-6.5, F1, -13.5, 0.22, 1.5);
    ceilingPanels(-12.3, -6.7, -13.3, -3.7, C1, 3, 4);
    pointLight(0xffe0b8, 2.6, 12, -9.5, C1 - 0.5, -8.5);
    label('LOUNGE', 0.6, 0.15, -6.8, F1 + 2.35, -2.92, 0);
  }

  // ---------------------------------------------------------------------
  function buildFloor2() {
    const C2 = F2 + H1;
    // ---- boss office
    const back = std(0xffffff, { map: tex(128, 128, (x, w, h) => { for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? '#5e3c28' : '#664330'; x.fillRect(i * 16, 0, 13, h); x.fillStyle = '#1e120c'; x.fillRect(i * 16 + 13, 0, 3, h); } }, { hi: 4, grain: 8, repeat: true }), roughness: 0.45 });
    wbox(5.0, H1 - 0.05, 0.06, back, -2.5, F2, -3.9, null, { uvs: 1 });
    const wl = plane(0.62, 1.18, glow(0xffffff, { map: logoTexture('#7af4ff'), transparent: true, depthWrite: false }, 2.0)); wl.position.set(-2.5, F2 + 1.85, -3.865);
    const wh = plane(1.5, 1.7, glow(0xffffff, { map: haloTexture(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }, 0.5)); wh.position.set(-2.5, F2 + 1.85, -3.868);
    box(3.0, 0.62, 0.45, walnutDkM, -2.5, F2, -3.6); box(3.02, 0.03, 0.47, stoneM, -2.5, F2 + 0.62, -3.6, null, { sharp: true }); solid(2, -4.0, -1.0, -3.85, -3.35);
    // executive desk
    box(2.3, 0.06, 1.0, walnutM, -2.5, F2 + 0.72, -1.7); box(0.55, 0.72, 0.92, walnutDkM, -3.35, F2, -1.7); box(0.55, 0.72, 0.92, walnutDkM, -1.65, F2, -1.7);
    box(1.2, 0.45, 0.03, walnutDkM, -2.5, F2 + 0.27, -1.22); solid(2, -3.65, -1.35, -2.2, -1.2);
    box(0.95, 0.006, 0.5, leatherBk, -2.5, F2 + 0.78, -1.85, null, { sharp: true });
    box(0.8, 0.48, 0.03, aluM, -3.3, F2 + 0.98, -2.05); rod(V(-3.3, F2 + 0.78, -2.08), V(-3.3, F2 + 1.0, -2.08), 0.03, aluM);
    const bsT = tex(240, 140, (c, w, h) => { const gg = c.createLinearGradient(0, 0, w, h); gg.addColorStop(0, '#1d2a44'); gg.addColorStop(1, '#3a5068'); c.fillStyle = gg; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(122,244,255,.85)'; c.fillRect(16, 18, 70, 8); c.fillStyle = 'rgba(255,255,255,.55)'; for (let i = 0; i < 5; i++) c.fillRect(16, 40 + i * 16, 120 + (i % 2) * 50, 6); });
    const bs = plane(0.76, 0.44, glow(0xffffff, { map: bsT }, 1.2)); bs.position.set(-3.3, F2 + 1.22, -2.067); bs.rotation.y = Math.PI;
    rod(V(-1.75, F2 + 0.78, -1.35), V(-1.75, F2 + 1.2, -1.42), 0.012, brassM); cyl(0.04, 0.1, 0.1, brassM, -1.85, F2 + 1.17, -1.32, null, { seg: 16 });
    const nbT = tex(256, 72, (c, w, h) => { c.fillStyle = '#16171d'; c.fillRect(0, 0, w, h); c.fillStyle = '#e8eaf0'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `800 30px ${DISPLAY}`; c.fillText('DSON', w / 2, 28); c.font = `500 14px ${MONO}`; c.fillText('FOUNDER', w / 2, 54); });
    box(0.36, 0.1, 0.06, std(0x16171d, { roughness: 0.3 }), -2.6, F2 + 0.78, -1.3, null, { sharp: true });
    const nbf = plane(0.36, 0.1, std(0xffffff, { map: nbT, roughness: 0.3 })); nbf.position.set(-2.6, F2 + 0.83, -1.268);
    officeChair(-2.5, -2.55, Math.PI, root, leatherBk, F2).scale.set(1.12, 1.25, 1.12);
    chair(-3.1, -0.6, 0.2, root, leatherTan, F2); chair(-1.9, -0.6, -0.2, root, leatherTan, F2);
    founder(-2.5, -2.5, F2);
    // lounge
    const rugT = texHi(128, 128, (x, w, h) => { x.fillStyle = '#b9ab98'; x.fillRect(0, 0, w, h); x.strokeStyle = '#8f8270'; x.lineWidth = 3; x.strokeRect(8, 8, w - 16, h - 16); }, 16);
    const rug = plane(3.2, 3.4, std(0xffffff, { map: rugT, roughness: 1 })); rug.rotation.x = -Math.PI / 2; rug.position.set(-5.5, F2 + 0.01, 1.4);
    sofa(-6.85, 1.4, -Math.PI / 2, 2.6, fabricM, F2); solid(2, -7.4, -6.4, 0.1, 2.7);
    sofa(-5.5, 3.25, 0, 1.8, fabricM, F2); solid(2, -6.4, -4.6, 2.8, 3.7);
    cyl(0.55, 0.55, 0.05, stoneM, -5.4, F2 + 0.38, 1.4, null, { seg: 36 }); cyl(0.14, 0.18, 0.38, steelDk, -5.4, F2, 1.4, null, { seg: 18 }); solid(2, -5.95, -4.85, 0.85, 1.95);
    shelfUnit(-7.25, -2.4, Math.PI / 2, 2.4, 2.4, 0.4, walnutDkM, F2); solid(2, -7.45, -7.05, -3.6, -1.2);
    plantPot(1.9, F2, 3.4, 0.26, 1.9); plantPot(-7.0, F2, 3.45, 0.2, 1.4, 0x7f9c6c);
    [[-4.5, 1.0], [-2.5, 1.0], [-0.5, 1.0], [-4.5, -2.5], [-0.5, -2.5]].forEach(([x, z]) => { const d = new THREE.Mesh(new THREE.CircleGeometry(0.07, 16), glow(0xfff2dc, {}, 2.5)); d.rotation.x = Math.PI / 2; d.position.set(x, C2 - 0.01, z); root.add(d); });
    pointLight(0xffd6a6, 3.2, 10, -3.5, C2 - 0.4, 0.0);
    label('DIRECTOR', 0.68, 0.15, 2.43, F2 + 2.35, 0.9, -Math.PI / 2);

    // ---- boardroom
    tableRect(-2.5, -7.0, 5.0, 1.5, 0.75, walnutM, F2);
    for (let i = 0; i < 6; i++) { const x = -4.6 + i * 0.84; officeChair(x, -8.05, Math.PI, root, leatherBk, F2); officeChair(x, -5.95, 0, root, leatherBk, F2); }
    screenOnWall(-7.38, F2 + 0.9, -7.0, Math.PI / 2, 2.6, 1.5, true, screenCard('PROCESS', ['01 BRIEF', '02 DEPOSIT', '03 DESIGN', '04 HANDOVER']));
    plantPot(2.0, F2, -9.5, 0.22, 1.5);
    ceilingPanels(-6.5, 1.5, -9.4, -4.6, C2, 3, 2); pointLight(0xfff0dc, 2.2, 9, -2.5, C2 - 0.5, -7.0);
    label('BOARDROOM', 0.72, 0.15, 2.43, F2 + 2.35, -4.6, -Math.PI / 2);

    // ---- stair hall + secretary
    plantPot(3.0, F2, -9.4, 0.24, 1.7); plantPot(6.0, F2, -9.4, 0.2, 1.3, 0x7f9c6c);
    const art = tex(256, 340, (c, w, h) => { c.fillStyle = '#f1eee8'; c.fillRect(0, 0, w, h); c.fillStyle = '#1d2030'; c.fillRect(34, 40, w - 68, 200); c.strokeStyle = '#00e6fe'; c.lineWidth = 3; c.beginPath(); c.moveTo(60, 200); c.lineTo(128, 80); c.lineTo(196, 200); c.stroke(); c.fillStyle = '#1d2030'; c.font = `500 16px ${MONO}`; c.textAlign = 'center'; c.fillText('DSON STUDIO · 2026', w / 2, 290); });
    const artP = plane(0.9, 1.2, std(0xffffff, { map: art, roughness: 0.6 })); artP.position.set(2.58, F2 + 1.6, -2.4); artP.rotation.y = Math.PI / 2;
    // secretary desk guarding the director's door
    box(1.8, 0.06, 0.75, whiteLam, 4.6, F2 + 0.72, 1.0); box(1.8, 1.0, 0.05, walnutM, 4.6, F2, 0.62); box(0.05, 0.72, 0.7, walnutM, 3.72, F2, 1.0); box(0.05, 0.72, 0.7, walnutM, 5.48, F2, 1.0);
    solid(2, 3.65, 5.55, 0.55, 1.4);
    box(0.55, 0.34, 0.025, 0x16171c, 4.4, F2 + 0.92, 1.2); const ssT = tex(160, 100, (c, w, h) => { c.fillStyle = '#e9f2e4'; c.fillRect(0, 0, w, h); c.fillStyle = '#3f8a5c'; c.fillRect(10, 12, 64, 8); c.globalAlpha = 0.5; c.fillRect(10, 28, 110, 5); });
    const ss = plane(0.51, 0.3, glow(0xffffff, { map: ssT }, 1.1)); ss.position.set(4.4, F2 + 1.09, 1.214);
    officeChair(4.6, 1.75, 0, root, fabricM, F2);
    [[8.4, -0.2], [8.4, 0.7]].forEach(([x, z]) => { chair(x, z, Math.PI / 2, root, leatherTan, F2); });
    plantPot(8.5, F2, 3.5, 0.22, 1.5);
    const fr = new THREE.Group(); fr.position.set(7.0, F2, 3.85); root.add(fr);
    ceilingPanels(3.0, 6.3, -9.5, 3.5, C2, 2, 5);
    pointLight(0xffe2c0, 2.4, 11, 4.8, C2 - 0.4, -2.0);

    // ---- pantry 2F
    const g = new THREE.Group(); root.add(g);
    box(0.6, 0.86, 3.6, whiteLam, 8.55, F2, -3.6); box(0.62, 0.04, 3.62, stoneM, 8.55, F2 + 0.86, -3.6); solid(2, 8.25, 8.9, -5.5, -1.7);
    box(0.38, 0.4, 0.32, 0x24252c, 8.55, F2 + 0.9, -4.6); box(0.4, 0.3, 0.5, 0x2e3038, 8.55, F2 + 0.9, -3.0);
    box(0.68, 1.85, 0.7, std(0xc9ccd4, { metalness: 0.7, roughness: 0.3 }), 8.5, F2, -1.5); solid(2, 8.15, 8.9, -1.9, -1.1);
    cyl(0.4, 0.4, 0.04, oakM, 7.4, F2 + 0.74, -3.6, null, { seg: 30 }); cyl(0.05, 0.05, 0.72, steelDk, 7.4, F2, -3.6, null, { seg: 12 }); solid(2, 7.0, 7.8, -4.0, -3.2);
    chair(7.4, -4.35, Math.PI, root, oakM, F2); chair(7.4, -2.85, 0, root, oakM, F2);
    pointLight(0xffe2c0, 1.8, 7, 7.7, C2 - 0.4, -5.5); ceilingPanels(6.8, 8.7, -5.6, -1.4, C2, 1, 2);
    label('PANTRY', 0.6, 0.15, 6.43, F2 + 2.35, -3.2, -Math.PI / 2);

    // ---- toilet 2F
    sinkCounter(7.75, -6.4, Math.PI, 1.6, F2, 1); solid(2, 6.9, 8.6, -6.7, -6.1);
    wc(8.3, -9.45, 0, F2); solid(2, 7.9, 8.7, -10, -9.0);
    ceilingPanels(6.8, 8.7, -9.6, -6.4, C2, 1, 1);
    label('RESTROOM', 0.68, 0.15, 6.43, F2 + 2.35, -7.6, -Math.PI / 2);

    // terrace door: glass leaf swung open onto the deck
    const td = new THREE.Group(); td.position.set(UX0 - 0.12, F2, 0.0); td.rotation.y = -Math.PI / 2 + 0.9; root.add(td);
    const tdg = plane(0.95, 2.25, glassM, td); tdg.position.set(0.48, 1.13, 0); tdg.renderOrder = 2;
    wbox(0.95, 0.04, 0.05, frameM, 0.48, 2.23, 0, td, { sharp: true }); wbox(0.04, 2.27, 0.05, frameM, 0.02, 0, 0, td, { sharp: true }); wbox(0.04, 2.27, 0.05, frameM, 0.93, 0, 0, td, { sharp: true });
    // ---- roof terrace furniture
    [[-11.5, -7.5], [-11.5, 0.5]].forEach(([x, z]) => { box(1.6, 0.5, 0.5, 0x3d3e4b, x, F2, z); foliage(0.5, 0x4c8a62, x - 0.4, F2 + 0.75, z); foliage(0.45, 0x2f6e5c, x + 0.45, F2 + 0.7, z); solid(2, x - 0.8, x + 0.8, z - 0.25, z + 0.25); });
    tableRect(-10.3, -3.5, 1.4, 0.8, 0.72, oakM, F2); chair(-10.3, -4.2, Math.PI, root, steelDk, F2); chair(-10.3, -2.8, 0, root, steelDk, F2);
    [[-9.5, 2.6], [-8.4, 2.6]].forEach(([x, z]) => { const l = box(0.7, 0.3, 1.6, std(0xd6d2ca, { roughness: 0.9 }), x, F2, z); });
    solid(2, -9.9, -8.0, 1.8, 3.4);
  }

  // ---------------------------------------------------------------------
  let doorL, doorR;
  function buildFacade() {
    // main sign: backlit logo on the 2F cladding
    const lg = plane(1.3, 2.45, glow(0xffffff, { map: logoTexture('#7af4ff'), transparent: true, depthWrite: false }, 2.2)); lg.position.set(5.0, F2 + 1.6, BZ1 + 0.14);
    const hl = plane(3.4, 3.2, glow(0xffffff, { map: haloTexture(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }, 0.7)); hl.position.set(5.0, F2 + 1.6, BZ1 + 0.135);
    pointLight(0x40eeff, 2.0, 6, 5.0, F2 + 1.6, BZ1 + 1.2);
    // roof edge LED line + parapet
    box(BX1 - UX0 + 0.3, 0.035, 0.035, glow(0x00e6fe, {}, 2.4), (UX0 + BX1) / 2, ROOF + 0.06, BZ1 + 0.17, null, { sharp: true, shadow: false });
    [[BZ1 + 0.1], [UZ0 - 0.1]].forEach(([z]) => wbox(BX1 - UX0 + 0.3, 0.35, 0.18, cladM, (UX0 + BX1) / 2, ROOF + 0.22, z, null, { uvs: 1 }));
    [[UX0 - 0.1], [BX1 + 0.1]].forEach(([x]) => wbox(0.18, 0.35, BZ1 - UZ0 + 0.3, cladM, x, ROOF + 0.22, (UZ0 + BZ1) / 2, null, { uvs: 1 }));
    // rooftop plant
    const fanT = tex(128, 128, (x) => { x.fillStyle = '#c9cad6'; x.fillRect(0, 0, 128, 128); x.fillStyle = '#3a3e52'; x.beginPath(); x.arc(64, 64, 48, 0, 7); x.fill(); x.strokeStyle = '#9fa2b5'; x.lineWidth = 4; for (let r = 14; r < 48; r += 9) { x.beginPath(); x.arc(64, 64, r, 0, 7); x.stroke(); } });
    for (let i = 0; i < 4; i++) { const x = -5 + i * 1.6; box(1.1, 0.8, 0.6, std(0xd7d8e2, { roughness: 0.5, metalness: 0.2 }), x, ROOF + 0.22, -8.6); const f = plane(0.6, 0.6, std(0xffffff, { map: fanT })); f.position.set(x - 0.15, ROOF + 0.62, -8.29); }
    // solar array
    const pv = tex(128, 128, (x) => { x.fillStyle = '#1a2240'; x.fillRect(0, 0, 128, 128); x.strokeStyle = '#6b7aa8'; x.lineWidth = 1; for (let i = 0; i <= 128; i += 21) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 128); x.stroke(); x.beginPath(); x.moveTo(0, i); x.lineTo(128, i); x.stroke(); } });
    const pvM = std(0xffffff, { map: pv, metalness: 0.6, roughness: 0.2 });
    for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++) { const p = box(1.7, 0.05, 1.0, pvM, 1.0 + i * 1.85, ROOF + 0.55, -3.0 - r * 1.6); p.rotation.x = 0.35; }
    box(1.2, 0.18, 1.2, glow(0xdff3ff, {}, 1.4), -1.5, ROOF + 0.22, -1.0);
    // entrance canopy, downlights, sliding glass doors, lock, nameplate
    wbox(3.2, 0.14, 1.8, [concM, concM, concM, ceilM, concM, concM], 7, 2.9, BZ1 + 0.9, null, { uvs: 1.8 });
    [6.3, 7.7].forEach((x) => { const d = new THREE.Mesh(new THREE.CircleGeometry(0.07, 16), glow(0xfff1d6, {}, 2.5)); d.rotation.x = Math.PI / 2; d.position.set(x, 2.895, BZ1 + 1.0); root.add(d); });
    pointLight(0xffd29a, 2.2, 6, 7, 2.6, BZ1 + 1.2);
    const doorM = std(0x07080d, { transparent: true, opacity: 0.86, depthWrite: false, roughness: 0.04, metalness: 0.35, envMapIntensity: 1.6 });
    doorL = new THREE.Group(); doorR = new THREE.Group(); root.add(doorL, doorR);
    [[doorL, 6.7], [doorR, 7.3]].forEach(([d, x]) => {
      d.position.set(x, 0, BZ1 + 0.02); d.userData.home = x;
      const p = plane(0.6, 2.38, doorM, d); p.position.y = 0.05 + 1.19; p.renderOrder = 2;
      wbox(0.6, 0.04, 0.05, frameM, 0, 2.39, 0, d, { sharp: true }); wbox(0.04, 2.4, 0.05, frameM, -0.28, 0.05, 0, d, { sharp: true }); wbox(0.04, 2.4, 0.05, frameM, 0.28, 0.05, 0, d, { sharp: true });
    });
    const scanT = tex(96, 224, (x, w, h) => { x.fillStyle = '#0d0e15'; rrect(x, 2, 2, w - 4, h - 4, 14); x.fill(); x.strokeStyle = '#00e6fe'; x.lineWidth = 3; for (let r = 8; r <= 26; r += 6) { x.beginPath(); x.ellipse(48, 52, r * 0.8, r, 0, Math.PI * 1.1, Math.PI * 2.9); x.stroke(); } x.fillStyle = 'rgba(0,230,254,.75)'; for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { x.beginPath(); x.arc(24 + c * 24, 112 + r * 26, 6, 0, 7); x.fill(); } });
    wbox(0.16, 0.38, 0.04, frameM, 7.95, 1.05, BZ1 + 0.14, null, { sharp: true });
    scanMat = glow(0xffffff, { map: scanT }, 1.4); const sc = plane(0.13, 0.32, scanMat); sc.position.set(7.95, 1.24, BZ1 + 0.162);
    // brushed-steel nameplate (表札) on stand-offs beside the door
    const nameT = tex(600, 220, (x, w, h) => {
      const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#d9dce4'); g.addColorStop(0.55, '#b3b7c4'); g.addColorStop(1, '#cfd2db');
      x.fillStyle = g; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${Math.random() < 0.5 ? '255,255,255' : '60,62,72'},${Math.random() * 0.08})`; x.fillRect(Math.random() * w, Math.random() * h, 40 + Math.random() * 160, 0.8); }
      drawLogo(x, 86, h / 2, 140, '#17181f');
      x.fillStyle = 'rgba(23,24,31,.55)'; x.fillRect(158, 46, 2, h - 92);
      x.fillStyle = '#17181f'; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
      let fs = 64; x.font = `800 ${fs}px ${DISPLAY}`;
      const maxW = w - 190 - 36; while (x.measureText('DSON STUDIO').width > maxW && fs > 20) { fs -= 2; x.font = `800 ${fs}px ${DISPLAY}`; }
      x.fillText('DSON STUDIO', 190, 112);
      x.font = `500 28px ${MONO}`; x.fillStyle = '#3a3c48'; x.fillText('雨宮町 2-3-4', 192, 162);
    }, { hi: 2 });
    const plq = new THREE.Group(); plq.position.set(8.48, 1.62, BZ1 + 0.125); root.add(plq);
    const steelEdge = std(0xb7bbc7, { metalness: 0.85, roughness: 0.35 });
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.24, 0.012), [steelEdge, steelEdge, steelEdge, steelEdge, std(0xffffff, { map: nameT, metalness: 0.75, roughness: 0.32 }), steelEdge]);
    plate.position.z = 0.032; plate.castShadow = true; plq.add(plate);
    [[-0.3, 0.09], [0.3, 0.09], [-0.3, -0.09], [0.3, -0.09]].forEach(([sx, sy]) => {
      const so = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.03, 10), steelEdge); so.rotation.x = Math.PI / 2; so.position.set(sx, sy, 0.012); plq.add(so);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.006, 12), steelEdge); cap.rotation.x = Math.PI / 2; cap.position.set(sx, sy, 0.04); plq.add(cap);
    });
    const om = tex(256, 160, (x, w, h) => { x.fillStyle = '#25262f'; x.fillRect(0, 0, w, h); x.strokeStyle = '#4b4d5c'; x.lineWidth = 4; for (let i = 0; i < 18; i++) { x.beginPath(); x.moveTo(i * 15, 0); x.lineTo(i * 15, h); x.stroke(); } drawLogo(x, w / 2, h / 2, 104, '#8e93a8'); });
    const omP = plane(1.4, 0.85, std(0xffffff, { map: om, roughness: 1 })); omP.rotation.x = -Math.PI / 2; omP.position.set(7, LOT + 0.012, BZ1 + 0.75);
    // 1F concrete "skirt" columns where the garage opening meets the facade
    wbox(0.3, H1, 0.3, concM, UX0, F1, BZ1, null, { uvs: 1.8 });
  }

  // ---------------------------------------------------------------------
  function buildYard() {
    // garage apron + driveway
    wplane(BX0 + 0.1, UX0, BZ1, 12, LOT + 0.012, std(0xb9b8c6, { roughness: 0.6 }), 2);
    // staff parking: 5 bays with lines and wheel stops
    const paint = std(0xe4e6ee, { roughness: 0.6 });
    for (let i = 0; i <= 5; i++) wbox(0.1, 0.006, 5.2, paint, -6.6 + i * 2.6, LOT, 9.1, null, { sharp: true, shadow: false });
    for (let i = 0; i < 5; i++) {
      const cx = -5.3 + i * 2.6;
      box(1.4, 0.12, 0.15, std(0xc9c6bc, { roughness: 0.8 }), cx, LOT, 7.0);
      const nT = tex(64, 64, (c) => { c.fillStyle = '#e4e6ee'; c.font = `700 40px ${MONO}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(i + 1), 32, 34); });
      const n = plane(0.45, 0.45, std(0xffffff, { map: nT, transparent: true, alphaTest: 0.3 })); n.rotation.x = -Math.PI / 2; n.position.set(cx, LOT + 0.01, 11.2);
    }
    const carCols = [0xe9ecf2, 0x1d1f26, 0xa3a9b6, 0x8c2f39, 0x2f4a6a];
    [0, 1, 2, 4].forEach((i) => { buildCar(-5.3 + i * 2.6, LOT, 9.25, Math.PI, carCols[i], i % 2 ? 0.94 : 1); solid(1, -5.3 + i * 2.6 - 1.0, -5.3 + i * 2.6 + 1.0, 6.85, 11.7); });
    // walkway to the entrance
    for (let i = 0; i < 6; i++) box(1.6, 0.05, 0.9, std(0x8d8c9e, { roughness: 0.6 }), 7.0, LOT, 5.5 + i * 1.1);
    // garden beds, maple, monolith sign
    const gravel = texHi(128, 128, (x) => { x.fillStyle = '#b6b5c4'; x.fillRect(0, 0, 128, 128); for (let i = 0; i < 420; i++) { x.fillStyle = ['#9e9db0', '#cfcedb', '#8d8ca0', '#e2e1ea'][i % 4]; x.beginPath(); x.arc(Math.random() * 128, Math.random() * 128, 1.5 + Math.random() * 2, 0, 7); x.fill(); } }, 10);
    const gM = std(0xffffff, { map: gravel, roughness: 0.95 });
    wplane(8.3, 11.9, 4.3, 11.9, LOT + 0.02, gM, 0.8); wplane(5.6, 6.0, 4.3, 11.9, LOT + 0.02, gM, 0.8);
    tree(10.4, LOT, 6.0, 1.15, 0xff6b45, 0xffa04a);
    tree(9.5, LOT, 9.6, 0.8, 0x4c8a62, 0x2f6e5c);
    wbox(1.6, 1.5, 0.35, concM, 10.6, LOT, 11.3, null, { uvs: 1.8 }); solid(1, 9.8, 11.4, 11.1, 11.5);
    const ml = plane(0.62, 1.2, glow(0xffffff, { map: logoTexture('#00e6fe'), transparent: true, depthWrite: false }, 2.0)); ml.position.set(10.6, LOT + 0.78, 11.48);
    plantPot(6.0, LOT, 4.4, 0.25, 1.8, 0x7f9c6c); plantPot(8.7, LOT, 4.5, 0.2, 1.05, 0x3f7d5a);
    // west side yard: cedar fence, bins, bamboo, AC units
    const cedar = texHi(128, 64, (x, w, h) => { for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? '#9a6a52' : '#a87660'; x.fillRect(i * 16, 0, 13, h); x.fillStyle = '#3a2a2a'; x.fillRect(i * 16 + 13, 0, 3, h); } }, 10);
    const cedarM = std(0xffffff, { map: cedar, roughness: 0.8 });
    wbox(0.12, 1.8, 31.5, cedarM, -19.7, LOT, -4.15, null, { uvs: 1 }); solid(1, -19.9, -19.5, -20, 11.6);
    wbox(31.5, 1.8, 0.12, cedarM, -4.15, LOT, -19.7, null, { uvs: 1 }); solid(1, -20, 11.6, -19.9, -19.5);
    [[-17.8, 10.6, 0x2f6fb0], [-16.9, 10.6, 0x3a8f5c], [-16.0, 10.6, 0x6d6c7e]].forEach(([x, z, lid]) => { box(0.7, 1.05, 0.75, 0x4a4c5c, x, LOT + 0.05, z); box(0.74, 0.06, 0.8, lid, x, LOT + 1.1, z); });
    solid(1, -18.2, -15.6, 10.2, 11.0);
    for (let i = 0; i < 10; i++) { const bx = -19.0 + (i % 4) * 0.35, bz = -16 + Math.floor(i / 4) * 0.4, h = 4 + (i % 3) * 0.8; rod(V(bx, LOT, bz), V(bx + 0.1, LOT + h, bz), 0.045, 0x7aa36a); foliage(0.6, 0x4c8a62, bx, LOT + h, bz); }
    [-6, -3].forEach((z) => { box(0.4, 0.75, 0.95, std(0xd7d8e2, { roughness: 0.5 }), -13.5, LOT, z); solid(1, -13.8, -13.2, z - 0.5, z + 0.5); });
    // back garden
    wplane(-19.5, 11.5, -19.5, -14.3, LOT + 0.01, std(0x47603f, { roughness: 1 }), 2);
    [[-8, -17.2], [1, -17.8], [7.5, -17]].forEach(([x, z], i) => tree(x, LOT, z, 1.1 + (i % 2) * 0.25, [0x4c8a62, 0x2f6e5c, 0x5d8f4f][i], 0x3f7d5a));
    for (let i = 0; i < 6; i++) box(0.9, 0.05, 0.6, std(0x8d8c9e, { roughness: 0.6 }), -3 + i * 1.3, LOT, -15.4 - (i % 2) * 0.3);
    box(1.8, 0.45, 0.5, oakM, -3.5, LOT, -18.4); solid(1, -4.4, -2.6, -18.7, -18.1);
    // east side: AC units, gravel
    wplane(9.3, 11.9, -13.8, 3.8, LOT + 0.02, gM, 0.8);
    [-7.5, -5.0].forEach((z) => { box(0.4, 0.75, 0.95, std(0xd7d8e2, { roughness: 0.5 }), 9.5, LOT, z); solid(1, 9.3, 9.75, z - 0.5, z + 0.5); });
  }
  function tree(x, y, z, s, c1, c2) {
    rod(V(x, y, z), V(x + 0.05 * s, y + 2.2 * s, z), 0.09 * s, 0x4a3530);
    rod(V(x, y + 1.6 * s, z), V(x - 0.6 * s, y + 2.5 * s, z + 0.2 * s), 0.05 * s, 0x4a3530);
    rod(V(x + 0.03, y + 1.9 * s, z), V(x + 0.55 * s, y + 2.8 * s, z - 0.15 * s), 0.05 * s, 0x4a3530);
    foliage(1.0 * s, c1, x, y + 2.9 * s, z); foliage(0.75 * s, c2, x - 0.6 * s, y + 2.6 * s, z + 0.3 * s); foliage(0.75 * s, c1, x + 0.6 * s, y + 3.0 * s, z - 0.2 * s); foliage(0.6 * s, c2, x + 0.1 * s, y + 3.5 * s, z);
    solid(1, x - 0.25, x + 0.25, z - 0.25, z + 0.25);
  }

  // ---------------------------------------------------------------------
  function buildCar(x, y, z, ry, color, k) {
    k = k || 1;
    const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; g.scale.setScalar(1.55 * k); root.add(g);
    const P = [[-1.52, 0.24], [1.5, 0.24], [1.58, 0.34], [1.57, 0.5], [1.32, 0.6], [0.76, 0.66], [0.26, 1.02], [-0.55, 1.06], [-1.2, 0.85], [-1.53, 0.75], [-1.59, 0.5]];
    const sh = new THREE.Shape(); sh.moveTo(P[0][0], P[0][1]); P.slice(1).forEach((p) => sh.lineTo(p[0], p[1])); sh.closePath();
    const geo = new THREE.ExtrudeGeometry(sh, { depth: 1.24, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.045, bevelSegments: 3 });
    geo.translate(0, 0, -0.62); geo.rotateY(-Math.PI / 2);
    const paintM = new THREE.MeshPhysicalMaterial({ color: lin(color), metalness: 0.6, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.4 });
    add(new THREE.Mesh(geo, paintM), g);
    box(1.38, 0.1, 3.0, 0x2a2d3a, 0, 0.22, 0, g);
    const tint = std(0x05070c, { side: THREE.DoubleSide, roughness: 0.03, metalness: 0.5, envMapIntensity: 1.6 });
    const ws = new THREE.Shape(); [[0.7, 0.69], [0.24, 0.99], [-0.54, 1.02], [-1.1, 0.84]].forEach((p, i) => (i ? ws.lineTo(p[0], p[1]) : ws.moveTo(p[0], p[1])));
    const wGeo = new THREE.ShapeGeometry(ws); wGeo.rotateY(-Math.PI / 2);
    [-1, 1].forEach((sd) => { const w = new THREE.Mesh(wGeo, tint); w.position.x = sd * 0.672; g.add(w); box(0.1, 0.06, 0.14, paintM, sd * 0.73, 0.75, 0.62, g); });
    const a = plane(1.14, 0.62, tint, g); a.position.set(0, 0.85, 0.515); a.rotation.x = -0.946;
    const r = plane(1.04, 0.86, tint, g); r.position.set(0, 1.052, -0.15); r.rotation.x = -Math.PI / 2;
    const b = plane(1.08, 0.69, tint, g); b.position.set(0, 0.958, -0.885); b.rotation.x = -1.897;
    const hubM = std(0xc9cedb, { metalness: 0.8, roughness: 0.35 });
    [[0.6, 1.0], [-0.6, 1.0], [0.6, -1.0], [-0.6, -1.0]].forEach(([wx, wz]) => {
      const t = cyl(0.27, 0.27, 0.22, 0x1d1c26, 0, 0, 0, g, { seg: 24 }); t.rotation.z = Math.PI / 2; t.position.set(wx, 0.27, wz);
      const h = new THREE.Mesh(new THREE.CircleGeometry(0.19, 24), hubM); h.position.set(wx + Math.sign(wx) * 0.112, 0.27, wz); h.rotation.y = Math.sign(wx) * Math.PI / 2; g.add(h);
    });
    box(1.18, 0.035, 0.03, glow(0xe8fbff, {}, 1.6), 0, 0.53, 1.565, g, { sharp: true, shadow: false });
    box(1.22, 0.05, 0.03, glow(0xff3f5e, {}, 1.6), 0, 0.68, -1.575, g, { sharp: true, shadow: false });
    const sh2 = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 3.3), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4, depthWrite: false })); sh2.rotation.x = -Math.PI / 2; sh2.position.y = 0.012; g.add(sh2);
  }

  // ---------------------------------------------------------------------
  function buildStreetFurniture() {
    function lamp(x, z, dirX, dirZ) {
      const g = new THREE.Group(); g.position.set(x, SIDE, z); root.add(g);
      cyl(0.08, 0.11, 5.8, 0x6a6f88, 0, 0, 0, g, { seg: 12 });
      const arm = new THREE.CatmullRomCurve3([V(0, 5.7, 0), V(dirX * 0.2, 6.1, dirZ * 0.2), V(dirX * 0.8, 6.2, dirZ * 0.8), V(dirX * 1.3, 6.1, dirZ * 1.3)]);
      add(new THREE.Mesh(new THREE.TubeGeometry(arm, 16, 0.05, 8), M(0x6a6f88)), g);
      box(0.55, 0.12, 0.3, 0x6a6f88, dirX * 1.35, 6.0, dirZ * 1.35, g);
      box(0.48, 0.03, 0.25, glow(0xffe0a8, {}, 3), dirX * 1.35, 5.98, dirZ * 1.35, g, { sharp: true, shadow: false });
      const s = new THREE.SpotLight(lin(0xffb866).getHex(), 10, 14, 0.9, 0.55, 1.4); s.position.set(dirX * 1.35, 5.9, dirZ * 1.35); s.target.position.set(dirX * 1.4, 0, dirZ * 1.4);
      s.castShadow = dirZ > 0; s.shadow.mapSize.set(1024, 1024); s.shadow.bias = -0.0008; g.add(s); g.add(s.target);
      solid(1, x - 0.15, x + 0.15, z - 0.15, z + 0.15);
    }
    lamp(-12, 13.6, 0, 1); lamp(2.5, 13.6, 0, 1); lamp(13.6, -6, 1, 0);
    function rail(a, b) {
      const len = a.distanceTo(b), n = Math.max(2, Math.round(len / 1.2) + 1);
      for (let i = 0; i < n; i++) { const p = a.clone().lerp(b, i / (n - 1)); cyl(0.04, 0.04, 0.9, 0xf2f4fa, p.x, p.y, p.z, null, { seg: 10 }); }
      [0.55, 0.88].forEach((h) => rod(a.clone().add(V(0, h, 0)), b.clone().add(V(0, h, 0)), 0.035, 0xf2f4fa));
      solid(1, Math.min(a.x, b.x) - 0.1, Math.max(a.x, b.x) + 0.1, Math.min(a.z, b.z) - 0.1, Math.max(a.z, b.z) + 0.1);
    }
    rail(V(9.5, SIDE, 13.8), V(13.8, SIDE, 13.8)); rail(V(13.8, SIDE, 11.6), V(13.8, SIDE, 13.8)); rail(V(13.8, SIDE, -14), V(13.8, SIDE, -9));
    // sign pole: street name + 30 limit (facing the main road), 止まれ (facing the side street)
    const st = new THREE.Group(); st.position.set(13.5, SIDE, 13.0); root.add(st);
    cyl(0.045, 0.045, 3.3, 0x9da1b6, 0, 0, 0, st, { seg: 10 });
    const nameT = tex(320, 112, (x, w, h) => { x.fillStyle = '#1f4f9c'; rrect(x, 0, 0, w, h, 12); x.fill(); x.strokeStyle = '#ffffff'; x.lineWidth = 5; rrect(x, 7, 7, w - 14, h - 14, 8); x.stroke(); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `900 44px ${JP}`; x.fillText('雨宮通り', w / 2, 46); x.font = `700 20px ${JP}`; x.fillText('Amamiya-dori', w / 2, 84); });
    const ns = plane(0.9, 0.32, std(0xffffff, { map: nameT, side: THREE.DoubleSide }), st); ns.position.set(0, 3.15, 0.06);
    const spdT = tex(256, 256, (x) => { x.fillStyle = '#d8323c'; x.beginPath(); x.arc(128, 128, 124, 0, 7); x.fill(); x.fillStyle = '#ffffff'; x.beginPath(); x.arc(128, 128, 96, 0, 7); x.fill(); x.fillStyle = '#1f4f9c'; x.font = `900 110px ${JP}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('30', 128, 136); });
    const spd = plane(0.6, 0.6, std(0xffffff, { map: spdT, transparent: true, alphaTest: 0.4, emissive: 0x221820 }), st); spd.position.set(0, 2.6, 0.06);
    const triT = tex(256, 256, (x) => { x.fillStyle = '#ffffff'; x.beginPath(); x.moveTo(8, 18); x.lineTo(248, 18); x.lineTo(128, 238); x.closePath(); x.fill(); x.fillStyle = '#d8323c'; x.beginPath(); x.moveTo(30, 32); x.lineTo(226, 32); x.lineTo(128, 212); x.closePath(); x.fill(); x.fillStyle = '#ffffff'; x.font = `900 48px ${JP}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('止まれ', 128, 82); });
    const tri = plane(0.75, 0.75, std(0xffffff, { map: triT, transparent: true, alphaTest: 0.4, emissive: 0x2a1a24 }), st); tri.position.set(0, 1.95, -0.06); tri.rotation.y = Math.PI;
    solid(1, 13.35, 13.65, 12.85, 13.15);
  }

  function buildPoles() {
    const tiger = tex(64, 128, (x, w, h) => { x.fillStyle = '#f2c230'; x.fillRect(0, 0, w, h); x.fillStyle = '#1f1d2b'; for (let i = -4; i < 8; i++) { x.beginPath(); x.moveTo(0, i * 32); x.lineTo(w, i * 32 + 32); x.lineTo(w, i * 32 + 48); x.lineTo(0, i * 32 + 16); x.closePath(); x.fill(); } }, { repeat: true });
    tiger.repeat.set(3, 2); const tigerM = std(0xffffff, { map: tiger });
    const vertPlate = (bg, fg, lines) => tex(96, 384, (c, w) => { c.fillStyle = bg; c.fillRect(0, 0, w, 384); c.fillStyle = fg; c.textAlign = 'center'; c.textBaseline = 'middle'; lines.forEach(([t, size, yy]) => { c.font = `900 ${size}px ${JP}`; [...t].forEach((ch, i) => c.fillText(ch, w / 2, yy + i * size * 1.05)); }); });
    const poleM = std(0xbec0cf, { roughness: 0.7 });
    function pole(x, y, z, armAngle, extras) {
      const p = new THREE.Group(); p.position.set(x, y, z); root.add(p);
      cyl(0.15, 0.21, 10, poleM, 0, 0, 0, p, { seg: 14 });
      cyl(0.25, 0.25, 2.0, tigerM, 0, 0, 0, p, { seg: 14 });
      const arm = new THREE.Group(); arm.position.y = 9.2; arm.rotation.y = armAngle; p.add(arm);
      box(2.2, 0.12, 0.13, 0x5b6075, 0, 0, 0, arm);
      [-0.9, 0, 0.9].forEach((ax) => cyl(0.05, 0.06, 0.15, std(0xf4f4fb, { roughness: 0.2 }), ax, 0.12, 0, arm, { seg: 10 }));
      box(1.3, 0.1, 0.12, 0x5b6075, 0, -0.8, 0, arm);
      for (let i = 0; i < 8; i++) { const a = i * 1.7, h = 3.2 + i * 0.6; rod(V(Math.cos(a) * 0.17, h, Math.sin(a) * 0.17), V(Math.cos(a) * 0.4, h, Math.sin(a) * 0.4), 0.018, 0x5b6075, p); }
      if (extras) extras(p);
      solid(1, x - 0.3, x + 0.3, z - 0.3, z + 0.3);
      return { pts: [-0.9, 0, 0.9].map((ax) => V(ax, 9.4, 0).applyAxisAngle(UP, armAngle).add(V(x, y, z))), low: V(x, y + 7.6, z) };
    }
    const corner = pole(13.1, SIDE, 11.0, 0, (p) => {
      cyl(0.36, 0.36, 0.9, 0x9ea3b8, 0.55, 7.0, 0, p, { seg: 14 });
      const addr = plane(0.26, 1.05, std(0xffffff, { map: vertPlate('#1f4f9c', '#ffffff', [['雨宮町', 46, 52], ['二丁目', 40, 220]]) }), p); addr.position.set(-0.1, 3.4, 0.2); addr.rotation.y = -0.4;
      rod(V(0, 6.4, 0), V(0, 6.4, 0.8), 0.035, 0x5b6075, p); box(0.32, 0.08, 0.2, 0x5b6075, 0, 6.3, 0.85, p);
      box(0.26, 0.02, 0.15, glow(0xd8f3ff, {}, 3), 0, 6.28, 0.85, p, { sharp: true, shadow: false });
      const pl = new THREE.PointLight(0xc9ecff, 2.0, 9, 1.6); pl.position.set(0, 6.0, 1.0); p.add(pl);
    });
    const backR = pole(13.1, SIDE, -18.8, Math.PI / 4);
    const backL = pole(-18.6, LOT, -18.8, Math.PI / 2);
    const wireM = std(0x111118, { roughness: 0.5 });
    const wire = (a, b, sag, r) => { const mid = a.clone().lerp(b, 0.5); mid.y -= sag * 2; root.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, mid, b), 40, r || 0.02, 5), wireM)); };
    for (let i = 0; i < 3; i++) wire(corner.pts[i], backR.pts[i], 0.7);
    for (let i = 0; i < 3; i++) wire(backR.pts[i], backL.pts[2 - i], 0.9);
    wire(corner.low, backR.low, 0.9, 0.035); wire(backR.low, backL.low, 1.1, 0.035);
    wire(V(13.1, SIDE + 7.2, -18.8), V(BX1, ROOF + 0.3, UZ0), 0.4, 0.018);
  }

  // ---------- tour additions: wall-screen cards + a scale-model founder figure ----------
  function screenCard(title, lines) {
    return (c, W, H) => {
      const gg = c.createLinearGradient(0, 0, W, H); gg.addColorStop(0, '#0f1626'); gg.addColorStop(1, '#22344c'); c.fillStyle = gg; c.fillRect(0, 0, W, H);
      drawLogo(c, 30, 34, 36, '#00e6fe');
      c.fillStyle = '#e8eaf0'; c.textBaseline = 'middle'; c.textAlign = 'left';
      let fs = 24; c.font = `800 ${fs}px ${DISPLAY}`;
      while (c.measureText(title).width > W - 70 && fs > 12) { fs -= 1; c.font = `800 ${fs}px ${DISPLAY}`; }
      c.fillText(title, 52, 34);
      c.font = `700 15px ${MONO}`;
      lines.forEach((l, i) => { c.fillStyle = 'rgba(0,230,254,.85)'; c.fillRect(24, 74 + i * 24, 6, 6); c.fillStyle = 'rgba(232,234,240,.85)'; c.fillText(l, 40, 78 + i * 24); });
    };
  }
  function founder(x, z, y) {
    // matte white figure, the way architects people their scale models
    const g = new THREE.Group(); g.position.set(x, y, z); root.add(g);
    const skin = std(0xd8d3ca, { roughness: 0.95 }), suit = std(0x2a2d38, { roughness: 0.8 });
    box(0.42, 0.52, 0.26, suit, 0, 0.6, 0.02, g);                           // torso
    sphere(0.12, skin, 0, 1.3, 0.0, g, { seg: 22 });                         // head
    cyl(0.05, 0.06, 0.1, skin, 0, 1.1, 0, g, { seg: 12 });                   // neck
    const hair = sphere(0.128, std(0x1d1e24, { roughness: 0.7 }), 0, 1.35, -0.03, g, { seg: 22 }); hair.scale.set(1, 0.7, 1);
    [-1, 1].forEach((k) => {
      rod(V(k * 0.22, 1.05, 0.02), V(k * 0.26, 0.82, 0.3), 0.05, suit, g);  // upper arm, forward to the desk
      rod(V(k * 0.26, 0.82, 0.3), V(k * 0.14, 0.8, 0.55), 0.045, suit, g);   // forearm on the desk
      sphere(0.05, skin, k * 0.13, 0.8, 0.58, g, { seg: 12 });
      rod(V(k * 0.1, 0.7, 0.05), V(k * 0.1, 0.7, 0.45), 0.075, suit, g);     // thigh
    });
    return g;
  }

  // =====================================================================
  //  camera: orbit overview, scripted walks between rooms, free walk
  // =====================================================================
  let scanMat = null;
  const EYE = 1.6, SEAT_EYE = 1.18, RADIUS = 0.26, WALK_SPEED = 2.6;
  const target = new THREE.Vector3(-2, 3.0, -4);
  const viewDir = new THREE.Vector3(0.48, 0.58, 1).normalize();
  function fitDistance() {
    const vf = THREE.MathUtils.degToRad(32), hf = 2 * Math.atan(Math.tan(vf / 2) * camera.aspect);
    return (camera.aspect < 1 ? 21 : 22.5) / Math.sin(Math.min(vf, hf) / 2);
  }
  const interiorFov = () => (camera.aspect < 0.8 ? 74 : 62);
  camera.position.copy(target).addScaledVector(viewDir, fitDistance());
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.target.copy(target);
  controls.enableDamping = true; controls.dampingFactor = 0.07; controls.rotateSpeed = 0.7; controls.zoomSpeed = 0.9; controls.panSpeed = 0.7;
  controls.minDistance = 6; controls.maxDistance = fitDistance() * 1.8; controls.minPolarAngle = 0.12; controls.maxPolarAngle = 1.45;
  controls.autoRotate = !reduceMotion; controls.autoRotateSpeed = 0.3;
  controls.addEventListener('start', () => { controls.autoRotate = false; });
  controls.update();

  // ---------- waypoint graph on the floor plan [x, z]; height comes from groundAt ----------
  const NODES = {
    OUT: [7, 8.6], DOOR: [7, 4.9], GK: [7, 2.4], LOB: [6.3, -0.6], OFFE: [4.6, -0.6], OFFC: [3.0, -1.9],
    STB: [4.65, -2.7], STT: [4.65, -9.15], H2S: [3.4, -8.9], H2B: [3.3, -5.5], H2N: [3.2, 0.9],
    DIRD: [1.8, 0.9], DIR: [-0.9, 0.3], BRDD: [1.8, -5.5], BRD: [1.4, -6.6],
    MEETD: [-1.6, -1.9], MEET: [-1.6, -3.9], LNGD: [-6.8, -1.9], LNGI: [-6.8, -3.9], LNG: [-7.6, -8.3]
  };
  const UPPER = { STT: 1, H2S: 1, H2B: 1, H2N: 1, DIRD: 1, DIR: 1, BRDD: 1, BRD: 1 };
  const ADJ = {};
  [['OUT', 'DOOR'], ['DOOR', 'GK'], ['GK', 'LOB'], ['LOB', 'OFFE'], ['OFFE', 'STB'], ['OFFE', 'OFFC'], ['STB', 'STT'],
   ['STT', 'H2S'], ['H2S', 'H2B'], ['H2B', 'H2N'], ['H2N', 'DIRD'], ['DIRD', 'DIR'], ['H2B', 'BRDD'], ['BRDD', 'BRD'],
   ['OFFC', 'MEETD'], ['MEETD', 'MEET'], ['MEETD', 'LNGD'], ['LNGD', 'LNGI'], ['LNGI', 'LNG']
  ].forEach(([a, b]) => { (ADJ[a] = ADJ[a] || []).push(b); (ADJ[b] = ADJ[b] || []).push(a); });
  function route(from, to) {
    const prev = { [from]: null }, q = [from];
    while (q.length) { const n = q.shift(); if (n === to) break; (ADJ[n] || []).forEach((m) => { if (!(m in prev)) { prev[m] = n; q.push(m); } }); }
    const out = []; for (let n = to; n; n = prev[n]) out.unshift(n);
    return out[0] === from ? out : [from, to];
  }

  // where the camera settles in each place, and what it looks at
  const STOPS = {
    entrance:  { node: 'OUT',  pos: V(7, LOT + EYE, 8.6),          look: V(7, 1.7, 3) },
    genkan:    { node: 'GK',   pos: V(7, GK + EYE, 2.3),           look: V(6.1, F1 + 1.25, -2.6) },
    director:  { node: 'DIR',  pos: V(-1.9, F2 + SEAT_EYE, -0.42), look: V(-2.5, F2 + 1.12, -2.5) },
    meeting:   { node: 'MEET', pos: V(-1.5, F1 + EYE, -4.0),       look: V(-5.88, F1 + 1.45, -5.8) },
    lounge:    { node: 'LNG',  pos: V(-8.6, F1 + EYE, -8.4),       look: V(-9.5, F1 + 1.55, -13.82) },
    boardroom: { node: 'BRD',  pos: V(1.4, F2 + EYE, -7.0),        look: V(-7.38, F2 + 1.55, -7.0) }
  };

  // ---------- motion state ----------
  let mode = 'orbit';             // 'orbit' | 'fly' | 'path' | 'hold' | 'walk'
  let at = null;                  // stop key the camera is resting at
  let fly = null, path = null, skipping = false, pendingResolve = null;
  const look = { baseYaw: 0, basePitch: 0, yaw: 0, pitch: 0, dragging: false, lx: 0, ly: 0 };
  const walk = { pos: new THREE.Vector3(), y: 0, yaw: 0, pitch: 0, keys: {}, jy: 0, vy: 0, jumpReq: false };
  const angDiff = (a, b) => Math.atan2(Math.sin(b - a), Math.cos(b - a));
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  function poseQuat(pos, lookAt) { return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(pos, lookAt, UP)); }
  function yawPitchTo(pos, lookAt) { const dx = lookAt.x - pos.x, dy = lookAt.y - pos.y, dz = lookAt.z - pos.z; return [Math.atan2(-dx, -dz), Math.atan2(dy, Math.hypot(dx, dz))]; }
  function camYawPitch() { const e = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ'); return [e.y, e.x]; }
  function setCamYawPitch(yaw, pitch) { camera.quaternion.setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ')); }
  function settle(value) { const r = pendingResolve; pendingResolve = null; if (r) r(value); }

  function startFly(p1, q1, f1, dur, done) {
    fly = { t: 0, dur: (reduceMotion || skipping) ? Math.min(dur, 0.35) : dur, p0: camera.position.clone(), q0: camera.quaternion.clone(), f0: camera.fov, p1: p1, q1: q1, f1: f1, done: done };
    mode = 'fly';
  }
  function holdAt(key, pos, lookAt) {
    at = key; mode = 'hold'; skipping = false;
    const [y, p] = yawPitchTo(pos, lookAt); look.baseYaw = y; look.basePitch = p; look.yaw = 0; look.pitch = 0;
  }
  function flyToStop(key, done) {
    const s = STOPS[key];
    startFly(s.pos.clone(), poseQuat(s.pos, s.look), interiorFov(), 1.0, () => { holdAt(key, s.pos, s.look); done(); });
  }

  // walk a polyline of [x, z] points at eye height, looking where we're going
  function startPath(pts, key, done) {
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const [yaw, pitch] = camYawPitch();
    const gy = groundAt(camera.position.x, camera.position.z, camera.position.y - EYE);
    path = { pts: pts, cum: cum, total: cum[cum.length - 1], s: 0, gy: gy, eye: camera.position.y - gy, yaw: yaw, pitch: pitch, key: key, done: done };
    mode = 'path';
    if (reduceMotion || skipping) path.s = path.total;
  }
  function pointAt(s) {
    const p = path.pts, c = path.cum;
    if (s <= 0) return p[0];
    for (let i = 1; i < p.length; i++) if (s <= c[i]) { const k = (s - c[i - 1]) / Math.max(1e-6, c[i] - c[i - 1]); return [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * k, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * k]; }
    return p[p.length - 1];
  }
  function stepPath(dt) {
    const stop = STOPS[path.key];
    path.s = Math.min(path.total, path.s + WALK_SPEED * dt);
    const p = pointAt(path.s), a = pointAt(Math.min(path.total, path.s + 1.6));
    const gy = groundAt(p[0], p[1], path.gy);
    path.gy += (gy - path.gy) * Math.min(1, dt * 10);
    path.eye += (EYE - path.eye) * Math.min(1, dt * 3);
    const dx = a[0] - p[0], dz = a[1] - p[1], h = Math.hypot(dx, dz);
    let wantYaw = h > 0.05 ? Math.atan2(-dx, -dz) : path.yaw;
    const ga = groundAt(a[0], a[1], path.gy);
    let wantPitch = THREE.MathUtils.clamp(Math.atan2(ga - path.gy, Math.max(0.6, h)) * 0.8 - 0.05, -0.45, 0.45);
    const remain = path.total - path.s;
    if (remain < 2.2) {
      const [sy, sp] = yawPitchTo(V(p[0], path.gy + EYE, p[1]), stop.look), k = 1 - remain / 2.2;
      wantYaw += angDiff(wantYaw, sy) * k; wantPitch += (sp - wantPitch) * k;
    }
    const kk = Math.min(1, dt * 3.5);
    path.yaw += angDiff(path.yaw, wantYaw) * kk; path.pitch += (wantPitch - path.pitch) * kk;
    camera.position.set(p[0], path.gy + path.eye, p[1]); setCamYawPitch(path.yaw, path.pitch);
    camera.fov += (interiorFov() - camera.fov) * Math.min(1, dt * 2); camera.updateProjectionMatrix();
    if (path.s >= path.total) { const d = path.done, key = path.key; path = null; flyToStop(key, d); }
  }

  // ---------- free walk ----------
  function collide(px, pz, lvl) {
    const list = COL[lvl];
    for (let i = 0; i < list.length; i++) { const r = list[i]; if (px > r[0] - RADIUS && px < r[1] + RADIUS && pz > r[2] - RADIUS && pz < r[3] + RADIUS) return true; }
    return false;
  }
  function stepWalk(dt) {
    const k = walk.keys, run = k.ShiftLeft || k.ShiftRight ? 4.6 : 2.2;
    let f = 0, s = 0;
    if (k.KeyW || k.ArrowUp) f += 1; if (k.KeyS || k.ArrowDown) f -= 1; if (k.KeyA || k.ArrowLeft) s -= 1; if (k.KeyD || k.ArrowRight) s += 1;
    const lvl = walk.y > 2.0 ? 2 : 1;
    if (f || s) {
      const len = Math.hypot(f, s); f /= len; s /= len;
      const sin = Math.sin(walk.yaw), cos = Math.cos(walk.yaw);
      const dx = (-sin * f + cos * s) * run * dt, dz = (-cos * f - sin * s) * run * dt;
      const nx = Math.max(-HALF + 0.4, Math.min(HALF - 0.4, walk.pos.x + dx));
      if (!collide(nx, walk.pos.z, lvl)) walk.pos.x = nx;
      const nz = Math.max(-HALF + 0.4, Math.min(HALF - 0.4, walk.pos.z + dz));
      if (!collide(walk.pos.x, nz, lvl)) walk.pos.z = nz;
    }
    const gy = groundAt(walk.pos.x, walk.pos.z, walk.y);
    walk.y += (gy - walk.y) * Math.min(1, dt * 14);
    if (walk.jumpReq && walk.jy === 0) walk.vy = 4.2;
    walk.jumpReq = false;
    if (walk.jy > 0 || walk.vy > 0) {
      walk.vy -= 12 * dt; walk.jy += walk.vy * dt;
      const ceiling = (walk.y < 2.2 && walk.pos.x > BX0 && walk.pos.x < BX1 && walk.pos.z > BZ0 && walk.pos.z < BZ1) ? (F1 + H1 - 0.15) - (walk.y + EYE) : 9;
      if (walk.jy > ceiling) { walk.jy = Math.max(0, ceiling); walk.vy = Math.min(walk.vy, 0); }
      if (walk.jy <= 0) { walk.jy = 0; walk.vy = 0; }
    }
    camera.position.set(walk.pos.x, walk.y + EYE + walk.jy, walk.pos.z);
    setCamYawPitch(walk.yaw, walk.pitch);
  }
  // can we walk straight from a to b on this level without hitting anything?
  function clearLine(a, b, lvl) {
    const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.2);
    for (let i = 1; i < n; i++) { const k = i / n; if (collide(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, lvl)) return false; }
    return true;
  }

  // ---------- public moves ----------
  function goTo(key) {
    settle(false);
    return new Promise((resolve) => {
      pendingResolve = resolve;
      const finish = () => settle(true);
      if (mode === 'orbit' || (mode === 'fly' && !at)) {
        // from the overview: drop in at the front door first, then walk inside
        controls.enabled = false; controls.autoRotate = false;
        const e = STOPS.entrance;
        startFly(e.pos.clone(), poseQuat(e.pos, e.look), interiorFov(), 2.4, () => {
          at = 'entrance';
          if (key === 'entrance') { holdAt('entrance', e.pos, e.look); finish(); return; }
          startPath(route('OUT', STOPS[key].node).map((n) => NODES[n]), key, finish);
        });
        return;
      }
      if (mode === 'walk') stopWalkInternal();
      if (at === key && mode === 'hold') { finish(); return; }
      if (fly) { fly = null; }
      const here = [camera.position.x, camera.position.z];
      let from = at && STOPS[at] ? STOPS[at].node : null;
      if (!from || path) {
        // free position: start from the nearest node we can see on this floor
        const upper = camera.position.y > 2.6, lvl = upper ? 2 : 1;
        let best = null, bd = 1e9;
        Object.keys(NODES).forEach((n) => {
          if (!!UPPER[n] !== upper) return;
          const d = Math.hypot(NODES[n][0] - here[0], NODES[n][1] - here[1]);
          if (d < bd && clearLine(here, NODES[n], lvl)) { bd = d; best = n; }
        });
        path = null;
        if (!best) { flyToStop(key, finish); return; }
        from = best;
      }
      const pts = [here].concat(route(from, STOPS[key].node).map((n) => NODES[n]));
      startPath(pts, key, finish);
    });
  }
  function overview() {
    settle(false);
    if (mode === 'walk') stopWalkInternal();
    path = null;
    return new Promise((resolve) => {
      pendingResolve = resolve;
      const p1 = target.clone().addScaledVector(viewDir, fitDistance());
      startFly(p1, poseQuat(p1, target), 32, 2.0, () => {
        at = null; mode = 'orbit'; skipping = false; controls.target.copy(target); controls.enabled = true; controls.autoRotate = !reduceMotion; controls.update();
        settle(true);
      });
    });
  }
  function skip() { skipping = true; if (path) path.s = path.total; if (fly) fly.t = fly.dur; }
  function startWalk() {
    if (mode !== 'hold') return false;
    walk.pos.set(camera.position.x, 0, camera.position.z);
    walk.y = groundAt(walk.pos.x, walk.pos.z, camera.position.y - EYE);
    const [y, p] = camYawPitch(); walk.yaw = y; walk.pitch = p; walk.keys = {}; walk.jy = 0; walk.vy = 0;
    mode = 'walk'; at = null; canvas.classList.add('walking');
    return true;
  }
  function stopWalkInternal() {
    if (document.pointerLockElement === canvas) document.exitPointerLock();
    canvas.classList.remove('walking'); walk.keys = {};
    mode = 'hold'; look.baseYaw = walk.yaw; look.basePitch = walk.pitch; look.yaw = 0; look.pitch = 0;
  }
  function stopWalk() { if (mode === 'walk') stopWalkInternal(); }

  // ---------- input: drag to look around (rooms and free walk), keys for free walk ----------
  function dragBy(dx, dy, k) {
    if (mode === 'walk') { walk.yaw -= dx * k; walk.pitch = THREE.MathUtils.clamp(walk.pitch - dy * k, -1.35, 1.35); }
    else if (mode === 'hold') { look.yaw = THREE.MathUtils.clamp(look.yaw - dx * k, -1.1, 1.1); look.pitch = THREE.MathUtils.clamp(look.pitch - dy * k, -0.55, 0.55); }
  }
  const onKeyDown = (e) => {
    if (mode !== 'walk') return;
    if (e.key === 'Escape' && !document.pointerLockElement) { stopWalkInternal(); if (opts.onWalkEnd) opts.onWalkEnd(); return; }
    walk.keys[e.code] = true;
    if (e.code === 'Space' && !e.repeat) walk.jumpReq = true;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  };
  const onKeyUp = (e) => { walk.keys[e.code] = false; };
  const onBlur = () => { walk.keys = {}; walk.jumpReq = false; };
  const onMouseDown = (e) => {
    if (mode !== 'walk' && mode !== 'hold') return;
    look.dragging = true; look.lx = e.clientX; look.ly = e.clientY;
    if (mode === 'walk' && !document.pointerLockElement && canvas.requestPointerLock) { try { const r = canvas.requestPointerLock(); if (r && r.catch) r.catch(() => {}); } catch (err) { /* drag-to-look still works */ } }
  };
  const onMouseUp = () => { look.dragging = false; };
  const onMouseMove = (e) => {
    if (document.pointerLockElement === canvas) { dragBy(e.movementX, e.movementY, 0.0022); return; }
    if (!look.dragging) return;
    dragBy(e.clientX - look.lx, e.clientY - look.ly, 0.0028); look.lx = e.clientX; look.ly = e.clientY;
  };
  const onTouchStart = (e) => { if (e.touches[0]) { look.lx = e.touches[0].clientX; look.ly = e.touches[0].clientY; } };
  const onTouchMove = (e) => { const t = e.touches[0]; if (!t) return; dragBy(t.clientX - look.lx, t.clientY - look.ly, 0.005); look.lx = t.clientX; look.ly = t.clientY; };
  addEventListener('keydown', onKeyDown); addEventListener('keyup', onKeyUp); addEventListener('blur', onBlur);
  canvas.addEventListener('mousedown', onMouseDown); addEventListener('mouseup', onMouseUp); addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('touchstart', onTouchStart, { passive: true }); canvas.addEventListener('touchmove', onTouchMove, { passive: true });

  // ---------- post: HDR bloom + filmic tone map ----------
  const GradeShader = {
    uniforms: { tDiffuse: { value: null }, exposure: { value: 1.5 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: [
      'uniform sampler2D tDiffuse; uniform float exposure; varying vec2 vUv;',
      'vec3 fitA(vec3 v){ vec3 a = v*(v+0.0245786)-0.000090537; vec3 b = v*(0.983729*v+0.4329510)+0.238081; return a/b; }',
      'vec3 aces(vec3 c){ const mat3 i = mat3(0.59719,0.07600,0.02840,0.35458,0.90834,0.13383,0.04823,0.01566,0.83777);',
      ' const mat3 o = mat3(1.60475,-0.10208,-0.00327,-0.53108,1.10813,-0.07276,-0.07367,-0.00605,1.07602); return clamp(o*fitA(i*c),0.0,1.0); }',
      'vec3 toSRGB(vec3 c){ return mix(c*12.92, 1.055*pow(c, vec3(1.0/2.4))-0.055, step(0.0031308, c)); }',
      'void main(){ vec3 c = texture2D(tDiffuse, vUv).rgb * exposure; gl_FragColor = vec4(toSRGB(aces(c)), 1.0); }'
    ].join('\n')
  };
  let composer = null;
  try {
    if (THREE.EffectComposer && THREE.UnrealBloomPass && THREE.RenderPass && THREE.ShaderPass) {
      const pr = renderer.getPixelRatio(), o = { format: THREE.RGBAFormat, type: THREE.HalfFloatType };
      let rt;
      if (renderer.capabilities.isWebGL2 && THREE.WebGLMultisampleRenderTarget && !lowPower) { rt = new THREE.WebGLMultisampleRenderTarget(innerWidth * pr, innerHeight * pr, o); rt.samples = 4; }
      else rt = new THREE.WebGLRenderTarget(innerWidth * pr, innerHeight * pr, o);
      composer = new THREE.EffectComposer(renderer, rt);
      composer.addPass(new THREE.RenderPass(scene, camera));
      composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.32, 0.3, 1.0));
      composer.addPass(new THREE.ShaderPass(GradeShader));
    }
  } catch (e) { composer = null; }
  if (!composer) { renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.5; }

  function resize() {
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight); if (composer) composer.setSize(innerWidth, innerHeight);
    controls.maxDistance = fitDistance() * 1.8;
  }
  addEventListener('resize', () => { if (running) resize(); });

  // ---------- loop ----------
  const clock = new THREE.Clock(); let t = 0, running = false, raf = 0;
  function frame() {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05); t += dt;
    if (mode === 'orbit') {
      controls.update();
      controls.target.x = THREE.MathUtils.clamp(controls.target.x, -HALF, HALF);
      controls.target.z = THREE.MathUtils.clamp(controls.target.z, -HALF, HALF);
      controls.target.y = THREE.MathUtils.clamp(controls.target.y, 0, 10);
    } else if (mode === 'fly' && fly) {
      fly.t += dt; const k = ease(Math.min(1, fly.t / fly.dur));
      camera.position.lerpVectors(fly.p0, fly.p1, k); camera.quaternion.slerpQuaternions(fly.q0, fly.q1, k); camera.fov = fly.f0 + (fly.f1 - fly.f0) * k; camera.updateProjectionMatrix();
      if (fly.t >= fly.dur) { const d = fly.done; fly = null; d(); }
    } else if (mode === 'path' && path) stepPath(dt);
    else if (mode === 'hold') {
      // ease back towards the resting view once the visitor lets go
      if (!look.dragging) { look.yaw *= 1 - Math.min(1, dt * 0.6); look.pitch *= 1 - Math.min(1, dt * 0.6); }
      const sway = reduceMotion ? 0 : Math.sin(t * 0.5) * 0.006;
      setCamYawPitch(look.baseYaw + look.yaw + sway, look.basePitch + look.pitch);
    } else if (mode === 'walk') stepWalk(dt);
    // automatic sliding entrance door
    if (doorL) {
      const p = mode === 'orbit' ? null : camera.position;
      const near = p && Math.abs(p.x - 7) < 1.6 && Math.abs(p.z - BZ1) < 2.6 && p.y < 3;
      [[doorL, -1], [doorR, 1]].forEach(([d, sgn]) => { const tgt = d.userData.home + (near ? sgn * 0.58 : 0); d.position.x += (tgt - d.position.x) * Math.min(1, dt * 6); });
    }
    if (scanMat) scanMat.color.setScalar(reduceMotion ? 1.4 : 1.0 + 0.4 * Math.sin(t * 2.2));
    if (composer) composer.render(); else renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  function resume() { if (running) return; running = true; resize(); clock.getDelta(); raf = requestAnimationFrame(frame); }
  function pause() { running = false; cancelAnimationFrame(raf); if (mode === 'walk') stopWalkInternal(); }

  const fontsReady = (document.fonts && document.fonts.load)
    ? Promise.all([
        document.fonts.load(`800 40px "Syne"`, 'DSON STUDIO'),
        document.fonts.load(`700 40px "JetBrains Mono"`, 'GARAGE LOUNGE MEETING PANTRY RESTROOM STORAGE WAITING DIRECTOR BOARDROOM PLAY 12345'),
        document.fonts.load(`500 40px "JetBrains Mono"`, '雨宮町 2-3-4 · HQ FOUNDER'),
        document.fonts.load(`900 40px "Zen Maru Gothic"`, '止まれ雨宮町二丁目通り30'),
        document.fonts.load(`700 40px "Zen Maru Gothic"`, 'Amamiya-dori')
      ]).catch(() => {})
    : Promise.resolve();
  const logoReady = new Promise((res) => { const im = new Image(); im.onload = () => { logoImg = im; res(); }; im.onerror = () => res(); im.src = LOGO_SRC; });
  return Promise.race([Promise.all([fontsReady, logoReady]), new Promise((r) => setTimeout(r, 3000))]).then(() => {
    build();
    return {
      goTo: goTo, overview: overview, skip: skip, startWalk: startWalk, stopWalk: stopWalk,
      resume: resume, pause: pause,
      get mode() { return mode; }, get at() { return at; }
    };
  });
}

window.DSONStudio = { create: create };
})();

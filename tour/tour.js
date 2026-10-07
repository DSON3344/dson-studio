// Guided 3D tour of the studio. Visitors walk in through the front door, get
// greeted in the genkan, pick what they came for, and the camera walks them to
// the matching room. Room panels read their content (services, prices, cases,
// process) straight from the page, so script.js and index.html stay the single
// source of truth; the contact form is only prefilled, never duplicated.
(function () {
  'use strict';

  const THREE_SRC = [
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js',
    'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/CopyShader.js',
    'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/LuminosityHighPassShader.js',
    'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/EffectComposer.js',
    'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/RenderPass.js',
    'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/ShaderPass.js',
    'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/UnrealBloomPass.js',
    'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/geometries/RoundedBoxGeometry.js',
    'tour/studio-scene.js'
  ];
  const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@700;900&display=swap';

  const T = {
    zh: {
      loading: '正在布置工作室…',
      introKicker: 'DSON STUDIO · 3D 工作室',
      introTitle: '欢迎光临',
      introLead: '这是我们工作室的街角。推门进来坐坐，我带您四处看看。',
      enter: '进入工作室', browse: '直接浏览网站', overview: '鸟瞰', close: '浏览网站',
      askTitle: '欢迎来到 DSON Studio！',
      askLead: '请问怎么称呼您？',
      namePh: '您的名字或称呼', next: '继续', skipName: '跳过',
      hello: (n) => n ? `你好，${n}！很高兴为您服务。` : '你好！很高兴为您服务。',
      menuLead: '今天想从哪里开始？选一个，我带您过去。',
      menuAgain: '接下来想去哪里？',
      opt: {
        director: ['了解工作室服务内容', '去总裁办公室，和 DSON 当面聊'],
        meeting: ['选择服务项目', '去洽谈室，挑选套餐、查看报价'],
        lounge: ['看看过往案例', '去休闲厅的大屏幕上看作品'],
        boardroom: ['了解合作流程', '去大会议室，看四个合作阶段'],
        walk: ['自由参观', '用键盘自己四处走走'],
        browse: ['直接浏览网站', '收起 3D 导览，查看完整页面']
      },
      place: { entrance: '大门口', genkan: '玄关', director: '总裁办公室', meeting: '洽谈室', lounge: '休闲厅', boardroom: '大会议室', overview: '街角鸟瞰', free: '自由参观' },
      goingTo: '正在前往', skipAnim: '跳过动画',
      founder: 'DSON · 创始人',
      dirTitle: (n) => n ? `请坐，${n}。我们聊聊服务内容。` : '请坐，我们聊聊服务内容。',
      dirLead: '工作室目前专注三项核心服务，每个项目都由我亲自跟进，从初稿到交付：',
      svcLine: { uiux: '界面与交互设计，从线框图到高保真稿', web: '响应式网站开发，从设计到上线', video: '短视频与长视频剪辑、调色和包装' },
      from: (p) => `${p} 起`,
      seePlans: '看套餐',
      toMeeting: '选择服务项目', toLounge: '看看案例', toGenkan: '回玄关', toBoardroom: '了解流程',
      meetTitle: '挑选服务项目',
      meetStep1: '1 · 选择服务', meetStep2: '2 · 选择套餐',
      picked: (s, t, p) => `已选：${s} · ${t}（${p}）`,
      pickHint: '选好套餐后，我会帮您把需求填进联系表单。',
      sendBrief: '填写联系方式，发送需求',
      prefill: (s, t, p) => `我想了解：${s} · ${t}（${p}）\n`,
      loungeTitle: '过往案例',
      loungeLead: '大屏幕上是最近完成的两个项目。点开可以看完整的案例拆解。',
      viewCase: '查看完整案例',
      boardTitle: '合作流程：四个清晰阶段',
      startNow: '开始合作：选择服务项目',
      ovLead: '这是整个街角的鸟瞰。拖动可以旋转，滚轮或双指可以缩放。',
      backIn: '回到玄关',
      walkLead: 'WASD 或方向键移动，Shift 快走，Space 跳跃。拖动或点击画面转视角，Esc 结束。',
      walkEnd: '结束自由参观',
      dragHint: '拖动画面可以环顾四周'
    },
    en: {
      loading: 'Setting up the studio…',
      introKicker: 'DSON STUDIO · 3D STUDIO',
      introTitle: 'Welcome in',
      introLead: 'This is our street corner. Step inside and I will show you around.',
      enter: 'Enter the studio', browse: 'Just browse the site', overview: 'Overview', close: 'Browse site',
      askTitle: 'Welcome to DSON Studio!',
      askLead: 'What should I call you?',
      namePh: 'Your name', next: 'Continue', skipName: 'Skip',
      hello: (n) => n ? `Hi ${n}! Happy to help.` : 'Hi there! Happy to help.',
      menuLead: 'Where would you like to start? Pick one and I will walk you there.',
      menuAgain: 'Where to next?',
      opt: {
        director: ['Learn about our services', "Meet DSON in the director's office"],
        meeting: ['Choose a service', 'Pick a package and see prices in the meeting room'],
        lounge: ['See past work', 'Case studies on the big screen in the lounge'],
        boardroom: ['How we work together', 'The four project stages, in the boardroom'],
        walk: ['Explore freely', 'Walk around on your own with the keyboard'],
        browse: ['Just browse the site', 'Close the tour and see the full page']
      },
      place: { entrance: 'Front door', genkan: 'Entrance', director: "Director's office", meeting: 'Meeting room', lounge: 'Lounge', boardroom: 'Boardroom', overview: 'Overview', free: 'Free walk' },
      goingTo: 'Heading to', skipAnim: 'Skip',
      founder: 'DSON · Founder',
      dirTitle: (n) => n ? `Have a seat, ${n}. Let's talk services.` : "Have a seat. Let's talk services.",
      dirLead: 'The studio focuses on three core services, and I handle every project myself, from first draft to delivery:',
      svcLine: { uiux: 'Interface and interaction design, wireframes to hi-fi', web: 'Responsive websites, from design to launch', video: 'Short- and long-form editing, grading and titles' },
      from: (p) => `From ${p}`,
      seePlans: 'See packages',
      toMeeting: 'Choose a service', toLounge: 'See past work', toGenkan: 'Back to entrance', toBoardroom: 'How we work',
      meetTitle: 'Choose a service',
      meetStep1: '1 · Service', meetStep2: '2 · Package',
      picked: (s, t, p) => `Selected: ${s} · ${t} (${p})`,
      pickHint: 'Pick a package and I will fill it into the contact form for you.',
      sendBrief: 'Add your details and send',
      prefill: (s, t, p) => `I'm interested in: ${s} · ${t} (${p})\n`,
      loungeTitle: 'Past work',
      loungeLead: 'Two recent projects are up on the big screen. Open one for the full case study.',
      viewCase: 'View case study',
      boardTitle: 'Four clear stages',
      startNow: 'Get started: choose a service',
      ovLead: 'The whole street corner from above. Drag to orbit, scroll or pinch to zoom.',
      backIn: 'Back to entrance',
      walkLead: 'WASD or arrow keys to move, Shift to hurry, Space to jump. Drag or click to look around, Esc to stop.',
      walkEnd: 'Stop exploring',
      dragHint: 'Drag to look around'
    }
  };

  const ICON = {
    director: '<path d="M4 20v-1a6 6 0 0 1 12 0v1M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17 8h4M19 6v4"/>',
    meeting: '<path d="M4 6h16M4 12h16M4 18h10"/><circle cx="19" cy="18" r="2"/>',
    lounge: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    boardroom: '<path d="M4 12h3l2-6 4 12 2-6h5"/>',
    walk: '<circle cx="13" cy="4" r="2"/><path d="m9 21 2-6 3 3v3M7 12l3-4 4 1 3 3M10 8l-1 5"/>',
    browse: '<path d="M12 5v14M5 12l7 7 7-7"/>'
  };

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };
  const lang = () => ((document.documentElement.lang || '').toLowerCase().startsWith('zh') ? 'zh' : 'en');
  const t = () => T[lang()];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
  const track = (action, label) => { if (typeof window.gtag === 'function') window.gtag('event', action, { event_category: 'studio_tour', event_label: label }); };

  function webglOK() {
    try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); }
    catch (e) { return false; }
  }

  // ---------- content read from the page ----------
  function services() {
    return Array.prototype.map.call(document.querySelectorAll('.service-tabs .tab-btn'), (btn) => {
      const id = btn.dataset.target, key = id.replace('svc-', '');
      const tiers = Array.prototype.map.call(document.querySelectorAll('#' + id + ' .tier-card'), (card) => ({
        name: text(card.querySelector('.tier-name')), price: text(card.querySelector('.tier-price')), desc: text(card.querySelector('.tier-desc')),
        key: card.querySelector('.tier-name') ? card.querySelector('.tier-name').getAttribute('data-i18n') : ''
      }));
      return { key: key, name: text(btn), tiers: tiers };
    });
  }
  function cases() {
    return Array.prototype.map.call(document.querySelectorAll('#portfolio .case-card'), (card) => ({
      tag: text(card.querySelector('.case-tag')), title: text(card.querySelector('h3')), desc: text(card.querySelector('.case-body p')),
      btn: card.querySelector('.case-view-btn')
    }));
  }
  function steps() {
    return Array.prototype.map.call(document.querySelectorAll('#process .process-step'), (s) => ({
      n: text(s.querySelector('.n')), title: text(s.querySelector('h3')), desc: text(s.querySelector('p'))
    }));
  }

  // ---------- state ----------
  let root, stage, card, bar, placeEl, movingEl, loadingEl, scene = null, loadPromise = null;
  const state = { open: false, view: 'intro', name: store.get('dson-tour-name') || '', svc: null, tier: null, moving: false };

  function loadScript(src) {
    return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('load ' + src)); document.head.appendChild(s); });
  }
  function loadScene() {
    if (loadPromise) return loadPromise;
    if (!document.querySelector('link[data-tour-font]')) {
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = FONT_HREF; l.dataset.tourFont = ''; document.head.appendChild(l);
    }
    const lowPower = !finePointer || innerWidth < 900 || (navigator.deviceMemory && navigator.deviceMemory <= 4);
    loadPromise = THREE_SRC.reduce((p, src) => p.then(() => loadScript(src)), Promise.resolve())
      .then(() => window.DSONStudio.create(stage, { logoSrc: 'tour/logo-hd.png', lowPower: lowPower, onWalkEnd: () => { state.view = 'menu'; render(); } }))
      .then((s) => { scene = s; return s; });
    return loadPromise;
  }

  // ---------- DOM ----------
  function build() {
    root = document.createElement('div');
    root.className = 'tour'; root.id = 'studioTour';
    root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', 'DSON Studio 3D tour');
    root.innerHTML =
      '<canvas class="tour-stage" tabindex="-1"></canvas><div class="tour-vignette" aria-hidden="true"></div>' +
      '<header class="tour-bar">' +
        '<div class="tour-brand"><img src="logo-mark@2x.png" alt="" width="13" height="24"><span>DSON <em>Studio</em></span><span class="tour-place" aria-live="polite"></span></div>' +
        '<div class="tour-actions">' +
          '<button type="button" class="tour-chip" data-act="overview"></button>' +
          '<div class="tour-lang" role="group"><button type="button" data-lang="zh">中文</button><button type="button" data-lang="en">EN</button></div>' +
          '<button type="button" class="tour-chip tour-close" data-act="close"><span></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
        '</div>' +
      '</header>' +
      '<div class="tour-loading" role="status"><span class="tour-spinner" aria-hidden="true"></span><span></span></div>' +
      '<div class="tour-moving" role="status"><span class="tour-dot" aria-hidden="true"></span><span class="tour-moving-label"></span><button type="button" data-act="skip"></button></div>' +
      '<section class="tour-card" aria-live="polite"></section>';
    document.body.appendChild(root);
    stage = root.querySelector('.tour-stage');
    card = root.querySelector('.tour-card');
    bar = root.querySelector('.tour-bar');
    placeEl = root.querySelector('.tour-place');
    movingEl = root.querySelector('.tour-moving');
    loadingEl = root.querySelector('.tour-loading');

    root.addEventListener('click', onClick);
    root.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = card.querySelector('input[name="tourName"]');
      if (input) { state.name = input.value.trim().slice(0, 40); store.set('dson-tour-name', state.name); }
      state.view = 'menu'; render(); track('tour_name', state.name ? 'given' : 'empty');
    });
    new MutationObserver(() => { if (state.open) render(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  function chrome() {
    const L = t();
    bar.querySelector('[data-act="overview"]').textContent = L.overview;
    bar.querySelector('.tour-close span').textContent = L.close;
    bar.querySelectorAll('.tour-lang button').forEach((b) => b.classList.toggle('on', b.dataset.lang === lang()));
    loadingEl.lastChild.textContent = L.loading;
    movingEl.querySelector('[data-act="skip"]').textContent = L.skipAnim;
    const where = state.view === 'overview' ? 'overview' : state.view === 'walk' ? 'free' : (scene && scene.at) || null;
    placeEl.textContent = where && L.place[where] ? L.place[where] : '';
    placeEl.hidden = !placeEl.textContent;
  }

  const btn = (label, act, extra, cls) => `<button type="button" class="${cls || 'tour-btn'}" data-act="${act}"${extra || ''}>${esc(label)}</button>`;
  const go = (label, room, cls) => btn(label, 'go', ` data-room="${room}"`, cls || 'tour-btn ghost');

  function menuHTML(again) {
    const L = t();
    const keys = ['director', 'meeting', 'lounge', 'boardroom'].concat(finePointer ? ['walk'] : [], ['browse']);
    return `<div class="tour-head"><p class="tour-kicker">${esc(L.place[scene && scene.at] || 'DSON STUDIO')}</p>` +
      (again ? `<h2>${esc(L.menuAgain)}</h2>` : `<h2>${esc(L.hello(state.name))}</h2><p class="tour-lead">${esc(L.menuLead)}</p>`) + '</div>' +
      '<div class="tour-options">' + keys.map((k) => {
        const act = k === 'walk' ? 'walk' : k === 'browse' ? 'close' : 'go';
        return `<button type="button" class="tour-option" data-act="${act}" data-room="${k}"${scene && scene.at === k ? ' aria-current="true"' : ''}>` +
          `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg><span><strong>${esc(L.opt[k][0])}</strong><small>${esc(L.opt[k][1])}</small></span><i aria-hidden="true">→</i></button>`;
      }).join('') + '</div>';
  }

  function render() {
    if (!root) return;
    chrome();
    const L = t();
    let html = '';
    root.dataset.view = state.view;
    switch (state.view) {
      case 'intro':
        html = `<div class="tour-head"><p class="tour-kicker">${esc(L.introKicker)}</p><h2>${esc(L.introTitle)}</h2><p class="tour-lead">${esc(L.introLead)}</p></div>` +
          `<div class="tour-row">${btn(L.enter + ' →', 'enter')}${btn(L.browse, 'close', '', 'tour-btn ghost')}</div>`;
        break;
      case 'ask':
        html = `<form class="tour-ask"><div class="tour-head"><p class="tour-kicker">${esc(L.place.genkan)}</p><h2>${esc(L.askTitle)}</h2><p class="tour-lead">${esc(L.askLead)}</p></div>` +
          `<input name="tourName" type="text" maxlength="40" autocomplete="given-name" placeholder="${esc(L.namePh)}" value="${esc(state.name)}">` +
          `<div class="tour-row"><button type="submit" class="tour-btn">${esc(L.next)} →</button>${btn(L.skipName, 'skipName', '', 'tour-btn ghost')}</div></form>`;
        break;
      case 'menu':
        html = menuHTML(scene && scene.at && scene.at !== 'genkan');
        break;
      case 'director': {
        const list = services();
        html = `<div class="tour-head"><p class="tour-kicker">${esc(L.founder)}</p><h2>${esc(L.dirTitle(state.name))}</h2><p class="tour-lead">${esc(L.dirLead)}</p></div>` +
          '<div class="tour-list">' + list.map((s) => {
            const first = s.tiers[0] ? s.tiers[0].price.replace(/\+$/, '') : '';
            return `<div class="tour-item"><div><strong>${esc(s.name)}</strong><small>${esc(L.svcLine[s.key] || '')}</small></div>` +
              `<div class="tour-item-side"><span class="tour-price">${esc(first ? L.from(first) : '')}</span>${btn(L.seePlans + ' →', 'plans', ` data-svc="${s.key}"`, 'tour-link')}</div></div>`;
          }).join('') + '</div>' +
          `<div class="tour-row">${go(L.toMeeting, 'meeting', 'tour-btn')}${go(L.toLounge, 'lounge')}${go(L.toGenkan, 'genkan')}</div>`;
        break;
      }
      case 'meeting': {
        const list = services();
        if (!state.svc || !list.some((s) => s.key === state.svc)) state.svc = list[0] && list[0].key;
        const svc = list.find((s) => s.key === state.svc) || { tiers: [] };
        const tier = state.tier != null ? svc.tiers[state.tier] : null;
        html = `<div class="tour-head"><p class="tour-kicker">${esc(L.place.meeting)}</p><h2>${esc(L.meetTitle)}</h2></div>` +
          `<p class="tour-step">${esc(L.meetStep1)}</p><div class="tour-seg" role="radiogroup">` +
          list.map((s) => `<button type="button" role="radio" aria-checked="${s.key === state.svc}" data-act="svc" data-svc="${s.key}">${esc(s.name)}</button>`).join('') + '</div>' +
          `<p class="tour-step">${esc(L.meetStep2)}</p><div class="tour-tiers" role="radiogroup">` +
          svc.tiers.map((x, i) => `<button type="button" role="radio" class="tour-tier" aria-checked="${state.tier === i}" data-act="tier" data-i="${i}"><span class="tour-tier-top"><strong>${esc(x.name)}</strong><span class="tour-price">${esc(x.price)}</span></span><small>${esc(x.desc)}</small></button>`).join('') + '</div>' +
          `<p class="tour-note">${esc(tier ? L.picked(svc.name, tier.name, tier.price) : L.pickHint)}</p>` +
          `<div class="tour-row">${btn(L.sendBrief + ' →', 'send', tier ? '' : ' disabled')}${go(L.toBoardroom, 'boardroom')}${go(L.toGenkan, 'genkan')}</div>`;
        break;
      }
      case 'lounge':
        html = `<div class="tour-head"><p class="tour-kicker">${esc(L.place.lounge)}</p><h2>${esc(L.loungeTitle)}</h2><p class="tour-lead">${esc(L.loungeLead)}</p></div>` +
          '<div class="tour-list">' + cases().map((c, i) => `<div class="tour-case"><span class="tour-tag">${esc(c.tag)}</span><strong>${esc(c.title)}</strong><small>${esc(c.desc)}</small>${btn(L.viewCase + ' →', 'case', ` data-i="${i}"`, 'tour-link')}</div>`).join('') + '</div>' +
          `<div class="tour-row">${go(L.toMeeting, 'meeting', 'tour-btn')}${go(L.toGenkan, 'genkan')}</div>`;
        break;
      case 'boardroom':
        html = `<div class="tour-head"><p class="tour-kicker">${esc(L.place.boardroom)}</p><h2>${esc(L.boardTitle)}</h2></div>` +
          '<ol class="tour-steps">' + steps().map((s) => `<li><span>${esc(s.n)}</span><strong>${esc(s.title)}</strong><small>${esc(s.desc)}</small></li>`).join('') + '</ol>' +
          `<div class="tour-row">${go(L.startNow, 'meeting', 'tour-btn')}${go(L.toGenkan, 'genkan')}</div>`;
        break;
      case 'overview':
        html = `<div class="tour-head"><p class="tour-kicker">${esc(L.place.overview)}</p><p class="tour-lead">${esc(L.ovLead)}</p></div><div class="tour-row">${go(L.backIn + ' →', 'genkan', 'tour-btn')}</div>`;
        break;
      case 'walk':
        html = `<div class="tour-head"><p class="tour-kicker">${esc(L.place.free)}</p><p class="tour-lead">${esc(L.walkLead)}</p></div><div class="tour-row">${btn(L.walkEnd, 'walkEnd', '', 'tour-btn ghost')}</div>`;
        break;
    }
    const changed = card.dataset.view !== state.view;
    card.dataset.view = state.view;
    card.innerHTML = html;
    card.hidden = state.moving || !html;
    if (changed && !card.hidden) {
      card.classList.remove('in'); void card.offsetWidth; card.classList.add('in');
      const f = card.querySelector('input, .tour-option, .tour-btn');
      if (f && finePointer) f.focus({ preventScroll: true });
    }
  }

  // ---------- moving between places ----------
  function travel(room) {
    if (!scene) return;
    const L = t();
    state.moving = true; card.hidden = true;
    movingEl.querySelector('.tour-moving-label').textContent = `${L.goingTo} · ${L.place[room] || ''}`;
    movingEl.classList.add('show');
    track('tour_go', room);
    scene.goTo(room).then((arrived) => {
      if (!arrived) return;
      state.moving = false; movingEl.classList.remove('show');
      if (room === 'genkan') state.view = state.name || store.get('dson-tour-asked') ? 'menu' : 'ask';
      else state.view = room;
      if (state.view === 'ask') store.set('dson-tour-asked', '1');
      render();
    });
  }

  function onClick(e) {
    const el = e.target.closest('[data-act], [data-lang]');
    if (!el || el.disabled) return;
    if (el.dataset.lang && !el.dataset.act) {
      const sw = document.querySelector(`#langSwitch button[data-lang="${el.dataset.lang}"]`);
      if (sw) sw.click();
      return;
    }
    const act = el.dataset.act, room = el.dataset.room;
    switch (act) {
      case 'enter': track('tour_enter', 'intro'); travel('genkan'); break;
      case 'skipName': state.view = 'menu'; render(); break;
      case 'go': travel(room); break;
      case 'plans': state.svc = el.dataset.svc; state.tier = null; travel('meeting'); break;
      case 'svc': state.svc = el.dataset.svc; state.tier = null; render(); break;
      case 'tier': state.tier = +el.dataset.i; render(); break;
      case 'send': sendBrief(); break;
      case 'case': { const c = cases()[+el.dataset.i]; if (c && c.btn) { track('tour_case', c.title); c.btn.click(); } break; }
      case 'skip': if (scene) scene.skip(); break;
      case 'overview':
        if (!scene || state.view === 'intro') return;
        state.moving = false; movingEl.classList.remove('show');
        state.view = 'overview'; render();
        scene.overview();
        break;
      case 'walk': if (scene && scene.startWalk()) { state.view = 'walk'; render(); stage.focus({ preventScroll: true }); track('tour_walk', 'start'); } break;
      case 'walkEnd': if (scene) scene.stopWalk(); state.view = 'menu'; render(); break;
      case 'close': close(room === 'browse' ? 'menu' : state.view); break;
    }
  }

  function sendBrief() {
    const list = services(), svc = list.find((s) => s.key === state.svc), tier = svc && svc.tiers[state.tier];
    if (!svc || !tier) return;
    const L = t();
    const set = (id, v) => { const f = document.getElementById(id); if (f) { f.value = v; f.dispatchEvent(new Event('input', { bubbles: true })); f.dispatchEvent(new Event('change', { bubbles: true })); } };
    if (state.name) set('name', state.name);
    set('service', svc.key);
    // the form's package list only names some tiers; anything else is "not sure yet"
    const opt = tier.key && document.querySelector(`#tier option[data-i18n="${tier.key}"]`);
    set('tier', opt ? opt.value : 'unsure');
    const msg = document.getElementById('msg');
    const line = L.prefill(svc.name, tier.name, tier.price);
    if (msg && msg.value.indexOf(line.trim()) === -1) set('msg', line + msg.value);
    track('tour_send', svc.key + ':' + tier.name);
    close('send');
    const contact = document.getElementById('contact');
    if (contact) contact.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => { const f = document.getElementById(state.name ? 'email' : 'name'); if (f) f.focus({ preventScroll: true }); }, reduceMotion ? 0 : 700);
  }

  // ---------- open / close ----------
  function open() {
    if (!root) build();
    if (state.open) return;
    state.open = true; store.set('dson-tour-seen', '1');
    document.documentElement.classList.add('tour-open');
    root.classList.add('show');
    root.classList.toggle('ready', !!scene);
    if (!scene) state.view = 'intro';
    render();
    card.hidden = !scene;
    loadScene().then((s) => {
      if (!state.open) return;
      root.classList.add('ready');
      s.resume();
      render();
    }).catch(() => { close('error'); });
  }
  function close(reason) {
    if (!state.open) return;
    state.open = false;
    if (scene) scene.pause();
    root.classList.remove('show');
    document.documentElement.classList.remove('tour-open');
    track('tour_close', reason || '');
    const trigger = document.getElementById('tourOpen');
    if (reason === 'menu' || reason === 'intro') { const main = document.getElementById('main'); if (main) main.focus && main.focus({ preventScroll: true }); }
    else if (trigger && reason !== 'send') trigger.focus({ preventScroll: true });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!webglOK()) { document.querySelectorAll('[data-tour-open]').forEach((b) => { b.hidden = true; }); return; }
    document.querySelectorAll('[data-tour-open]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); open(); }));
    const params = new URLSearchParams(location.search);
    const auto = params.get('tour') === '1' || (params.get('tour') !== '0' && !store.get('dson-tour-seen') && !location.hash);
    if (auto) open();
  });

  window.DSONTour = { open: open, close: close };
})();

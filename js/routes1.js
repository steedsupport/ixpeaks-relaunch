/* IXPEAKS — ROUTES PART 1: home, shop/PLP+search, PDP */
'use strict';

/* ---------- helpers for views ---------- */
function plpHTML(title, sub, list, { q = '', active = {}, showAud = true } = {}) {
  return `<div class="container">
  <div class="plp-head">
    <div class="kicker">IXPEAKS — Beyond Every Summit</div>
    <h1 class="plp-title mt1">${title}</h1>
    <p class="lede plp-sub">${sub}</p>
  </div>
  <div class="toolbar"><div class="wrap toolbar-in" style="padding-inline:0">
    <label class="tsearch"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.7"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <input id="plpSearch" placeholder="Search kits, layers, footwear…" value="${esc(q)}" aria-label="Search products"></label>
    <div class="grow"></div>
    <span class="plp-meta" id="plpCount">${list.length} products</span>
    <label class="tsort">Sort <select id="plpSort" aria-label="Sort products">
      <option value="featured">Featured</option><option value="new">Newest</option><option value="plow">Price: low → high</option>
      <option value="phigh">Price: high → low</option><option value="az">A–Z</option></select></label>
    <button class="fchip" onclick="$('#frow').classList.toggle('on')" aria-expanded="false">Filters ▾</button>
  </div>
  <div class="wrap frow" id="frow" style="padding-bottom:12px">
    <span class="meta" style="align-self:center">Audience:</span>
    ${AUDIENCES.map(a => `<button class="fchip ${active.aud === a ? 'on' : ''}" data-f="aud" data-v="${a}">${a[0].toUpperCase() + a.slice(1)}</button>`).join('')}
    <span class="meta" style="align-self:center;margin-left:8px">Activity:</span>
    ${ACTIVITIES.map(a => `<button class="fchip ${active.act === a ? 'on' : ''}" data-f="act" data-v="${a}">${a[0].toUpperCase() + a.slice(1)}</button>`).join('')}
    <span class="meta" style="align-self:center;margin-left:8px">Category:</span>
    ${CATEGORIES.map(c => `<button class="fchip ${active.cat === c ? 'on' : ''}" data-f="cat" data-v="${c}">${c}</button>`).join('')}
    <button class="fchip" onclick="clearFilters()" style="border-style:dashed">Clear all</button>
  </div></div>
  <div class="pgrid mt5" id="plpGrid" style="row-gap:34px"></div>
  <div id="plpEmpty" class="empty" style="display:none">
    <div class="big">No kits match that</div>
    <p>Loosen a filter, or try another activity.</p>
    <button class="btn btn-ghost mt3" onclick="clearFilters()">Clear all filters</button>
  </div>
</div>`;
}

function plpWire(list, state = {}) {
  const grid = $('#plpGrid');
  function cur() {
    let out = [...list];
    const q = $('#plpSearch').value.trim().toLowerCase();
    const sort = $('#plpSort').value;
    if (q) out = out.filter(p => (p.name + ' ' + p.desc + ' ' + p.category + ' ' + p.activity + ' ' + p.audience).toLowerCase().includes(q));
    const chips = $$('#frow .fchip.on');
    chips.forEach(c => {
      const f = c.dataset.f, v = c.dataset.v;
      if (f === 'aud') out = out.filter(p => p.audience === v);
      if (f === 'act') out = out.filter(p => p.activity === v);
      if (f === 'cat') out = out.filter(p => p.category === v);
    });
    if (sort === 'new') out.sort((a, b) => (b.badge === 'NEW') - (a.badge === 'NEW'));
    if (sort === 'plow') out.sort((a, b) => a.price - b.price);
    if (sort === 'phigh') out.sort((a, b) => b.price - a.price);
    if (sort === 'az') out.sort((a, b) => a.name.localeCompare(b.name));
    return out;
  }
  function render() {
    const out = cur();
    grid.innerHTML = out.map(p => pcardHTML(p)).join('');
    $('#plpCount').textContent = `${out.length} product${out.length === 1 ? '' : 's'}`;
    $('#plpEmpty').style.display = out.length ? 'none' : 'block';
    bindReveals();
  }
  $('#plpSearch').addEventListener('input', render);
  $('#plpSort').addEventListener('change', render);
  $$('#frow .fchip').forEach(c => c.addEventListener('click', () => { c.classList.toggle('on'); render(); }));
  render();
  $('#plpSort').addEventListener('change', function once() { window.__plpSortInit = 1; });
  render();
}
window.clearFilters = () => { $$('#frow .fchip.on').forEach(c => c.classList.remove('on')); $('#plpSearch').value = ''; const g = $('#plpGrid'); const ev = new Event('input'); $('#plpSearch').dispatchEvent(ev); };

/* generic PLP route builder */
function makePLP(path, title, sub, filterFn) {
  ROUTES[path] = app => {
    const list = PRODUCTS.filter(filterFn);
    app.innerHTML = plpHTML(title, sub, list);
    plpWire(list);
  };
}

/* ============ HOME ============ */
ROUTES['home'] = app => {
  const newIn = PRODUCTS.filter(p => p.badge === 'NEW' || p.badge === 'FLAGSHIP').slice(0, 4);
  const trail = PRODUCTS.filter(p => p.activity === 'trail').slice(0, 4);
  app.innerHTML = `
<div class="view">
  <section class="hero" aria-label="IXPEAKS campaign hero">
    <div class="bg"><img src="assets/img/campaign/hero.jpg" alt="Climbers traversing a granite ridge at sunrise" fetchpriority="high"></div>
    <div class="wrap hero-in">
      <div class="tagline-chip"><span style="width:7px;height:7px;border-radius:50%;background:var(--flame)"></span> Beyond Every Summit — FW26 Launch</div>
      <h1>EVERY SUMMIT.<br><span class="ix">ONE CREW.</span></h1>
      <p class="sub">Performance systems and everyday layers for the whole crew. Wherever your summit is — the ridge, the record, or the first trailhead — you don't climb alone.</p>
      <div class="ctas">
        <button class="btn btn-solid btn-lg" onclick="location.hash='#/new'">Shop New Arrivals</button>
        <button class="btn btn-ghost btn-lg on-panel" onclick="location.hash='#/quiz'">Find Your Peak ↓</button>
      </div>
    </div>
  </section>

  <div class="marquee" aria-hidden="true"><div class="mq-in">
    <span>BEYOND EVERY SUMMIT <b>◼</b></span><span>9 SUMMITS · ONE CREW <b>◼</b></span><span>FW26 IS LIVE <b>◼</b></span>
    <span>FREE SHIPPING OVER ${money(150)} <b>◼</b></span><span>REPAIRS, NOT LANDFILL <b>◼</b></span>
    <span>BEYOND EVERY SUMMIT <b>◼</b></span><span>9 SUMMITS · ONE CREW <b>◼</b></span><span>FW26 IS LIVE <b>◼</b></span>
    <span>FREE SHIPPING OVER ${money(150)} <b>◼</b></span><span>REPAIRS, NOT LANDFILL <b>◼</b></span>
  </div></div>

  <section class="sect"><div class="wrap">
    <div class="sect-head reveal"><div><div class="kicker">Shop by audience</div><h2>EVERY CREW MEMBER</h2></div><a class="btn btn-ghost" href="#/clothing">All categories →</a></div>
    <div class="aud-grid">
      ${['men','women','youth','kids'].map(a => `
      <a class="aud-tile reveal" href="#/${a}">
        <svg class="contours" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"><path d="M0 150 Q100 90 200 130 T400 110" stroke="#EFE9DF3a" fill="none" stroke-width="1.5"/><path d="M0 170 Q120 110 220 150 T400 130" stroke="#EFE9DF26" fill="none" stroke-width="1.5"/></svg>
        <div class="tlabel">${a[0].toUpperCase()+a.slice(1)} <svg viewBox="0 0 24 24" fill="none" stroke-width="2.4"><path d="M7 17L17 7M17 9V17H9"/></svg></div>
      </a>`).join('')}
    </div>
  </div></section>

  <section class="sect on-panel" aria-label="New arrivals"><div class="wrap">
    <div class="sect-head reveal"><div><div class="kick kicker">First light</div><h2>NEW ARRIVALS</h2></div><a class="btn btn-ghost on-panel" href="#/new">View all →</a></div>
    <div class="pgrid">${newIn.map(p => pcardHTML(p)).join('')}</div>
  </div></section>

  <section class="sect"><div class="wrap">
    <div class="sect-head reveal"><div><div class="kicker">Every activity has a kit</div><h2>TRAIL. SUMMIT. STREET.</h2></div></div>
    <div class="act-strip reveal" role="list">
      ${ACTIVITIES.map(a => `<a class="act-chip" role="listitem" href="#/activity/${a}">${a[0].toUpperCase()+a.slice(1)}</a>`).join('')}
    </div>
    <div class="pgrid mt5" style="row-gap:34px">${trail.map(p => pcardHTML(p)).join('')}</div>
  </div></section>

  <section class="camp-split" aria-label="Flagship product story">
    <div class="panel on-panel" style="display:flex;align-items:center">
      <div style="padding:clamp(28px,6vw,80px)">
        <div class="kicker reveal">Flagship — Summit Shell 9</div>
        <h2 class="disp mt2 reveal" style="font-size:clamp(34px,4.6vw,66px)">BUILT FOR THE NINTH HOUR.</h2>
        <p class="lede mt3 reveal">Eight hours in and the weather turns. Three layers, fully taped, packs to a liter — the shell that finishes the day your forecast didn't promise.</p>
        <div class="stats mt5 reveal" style="grid-template-columns:repeat(3,1fr)">
          <div class="stat on-panel" style="color:var(--paper)"><b>3<i>-layer</i></b><span>waterproof system*</span></div>
          <div class="stat on-panel" style="color:var(--paper)"><b style="font-size:clamp(26px,3vw,44px)">1&nbsp;liter</b><span>packs into own pocket</span></div>
          <div class="stat on-panel" style="color:var(--paper)"><b>360°</b><span>storm protection</span></div>
        </div>
        <div class="mt3 reveal"><button class="btn btn-solid" onclick="location.hash='#/p/NA-01'">Explore the Shell</button> <a href="#/technology" class="meta" style="margin-left:16px;text-decoration:underline">How our systems work →</a></div>
        <p class="meta mt3">*Conceptual launch system — validation testing in progress.</p>
      </div>
    </div>
    <div class="panel"><img src="assets/img/campaign/shell.jpg" alt="Summit Shell 9 worn in coastal rain" loading="lazy"></div>
  </section>

  <section class="sect"><div class="wrap center" style="max-width:860px;margin-inline:auto">
    <div class="kicker reveal">Why IX / why nine</div>
    <h2 class="disp mt2 reveal" style="font-size:var(--fs-h1)">NINE IS THE NUMBER.</h2>
    <p class="lede mt3 reveal" style="margin-inline:auto">IX is the Roman numeral for nine — the founder's number, the crew's number. A summitt can be a ridge line, a personal record, or the first trail your kid finishes. Nine peaks. One crew. Always another summit.</p>
    <div class="nine-grid mt5">
      ${Array.from({ length: 9 }, (_, i) => `<div class="nine-cell reveal ${i === 8 ? 'nine' : ''}" style="transition-delay:${i * 60}ms">${i < 8 ? ['I','II','III','IV','V','VI','VII','VIII'][i] : 'IX'}<small>${['The First Trailhead','The First Record','The Long Haul','The Weather Turn','The Ridge Line','The Descent','The Comeback','The Crew','Always Another'][i]}</small></div>`).join('')}
    </div>
    <div class="mt4 reveal"><a class="btn btn-ghost" href="#/story">Read the founding story →</a></div>
  </div></section>

  <section class="sect on-panel" aria-label="Find your peak quiz"><div class="wrap">
    <div class="flx-between"><div>
      <div class="kicker reveal">60 seconds</div>
      <h2 class="disp mt2 reveal" style="font-size:var(--fs-h1);max-width:14ch">FIND YOUR PEAK.</h2>
      <p class="lede mt3 reveal" style="max-width:50ch">Answer three questions and we'll build the kit for the summit you're chasing.</p>
    </div></div>
    <div class="pgrid mt3" style="grid-template-columns:repeat(3,1fr);row-gap:16px" id="quizZone">
      <button class="quiz-opt reveal" onclick="quizAsk(0)">My summit is…<small>a mountain ridge</small></button>
      <button class="quiz-opt reveal" onclick="quizAsk(1)">My summit is…<small>a personal record</small></button>
      <button class="quiz-opt reveal" onclick="quizAsk(2)">My summit is…<small>getting outside more</small></button>
    </div>
  </div></section>

  <section class="sect"><div class="wrap">
    <div class="sect-head reveal"><div><div class="kicker">Field notes</div><h2>FROM THE JOURNAL</h2></div><a class="btn btn-ghost" href="#/journal">All stories →</a></div>
    <div class="j-grid">
      ${journalCardsHTML()}
    </div>
  </div></section>

  <section class="sect" style="padding-top:0"><div class="wrap">
    <div class="stats reveal" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat"><b data-count="90"><i>0</i></b><span>Day field trial on every piece</span></div>
      <div class="stat"><b data-count="100">%<i>lifetime</i></b><span>Limited lifetime warranty vs defects</span></div>
      <div class="stat"><b data-count="1">%<i>of revenue</i></b><span>Pledged to trail restoration</span></div>
    </div>
  </div></section>
</div>`;
  bindReveals();
  // footer newsletter
  const nl = $('#footerNL'); nl?.addEventListener('submit', e => { e.preventDefault(); toast('Welcome to the Summit Club — watch your inbox.'); nl.reset(); });
};
window.__quizSteps = 0;
function quizAsk(i) {
  // simple 3-step quiz → lands on activity kit
  const maps = [['mountain','hiking'],['record','training'],['outside','everyday']];
  location.hash = `#/activity/${maps[i][1]}`;
  toast(`Your peak is the ${maps[i][1]} kit — filtered for you`);
}
window.quizAsk = quizAsk;

/* ============ GENERIC PLP ROUTES ============ */
makePLP('men', 'MEN', 'Performance systems and everyday layers, cut for him.', p => p.audience === 'men');
makePLP('women', 'WOMEN', 'Built on women\u2019s lasts and women\u2019s fits — notshrunk-down men\u2019s gear.', p => p.audience === 'women');
makePLP('youth', 'YOUTH', 'Serious kit, youth sizes, playground-proof.', p => p.audience === 'youth');
makePLP('kids', 'KIDS', 'Weather protection for the smallest summits.', p => p.audience === 'kids');
makePLP('new', 'NEW ARRIVALS', 'Fresh off the line: FW26 first drops.', p => ['NEW','FLAGSHIP','BUNDLE'].includes(p.badge || ''));
makePLP('clothing', 'CLOTHING', 'Layers, tops, pants and shorts across every audience.', p => ['Jackets & Shells','Insulation & Fleece','Base Layers & Tops','Pants','Shorts'].includes(p.category));
makePLP('footwear', 'FOOTWEAR', 'The NINE family — trail to travel.', p => p.category === 'Footwear');
makePLP('accessories', 'ACCESSORIES', 'Caps, socks, gloves and the small stuff that decides the day.', p => p.category === 'Accessories');
makePLP('gear', 'EQUIPMENT & GEAR', 'Packs, hydration, and the kit that carries the kit.', p => ['Backpacks & Bags','Hydration & Equipment'].includes(p.category));
makePLP('search', 'SEARCH', 'Type in the search field and results narrow instantly.', () => true);

/* activity collections */
ROUTES['activity'] = (app, a) => {
  if (!ACTIVITIES.includes(a)) { location.hash = '#/nope'; return; }
  const list = PRODUCTS.filter(p => p.activity === a);
  app.innerHTML = plpHTML(a.toUpperCase() + ' KIT', 'Everything we make for ' + a + ' days — one standard, one crew.', list);
  plpWire(list);
};

/* search wiring: search view pre-types the query */
const _origSearch = ROUTES['search'];
ROUTES['search'] = (app, param) => {
  _origSearch(app, param);
  const q = decodeURIComponent(param || '');
  if (q) { $('#plpSearch').value = q; $('#plpSearch').dispatchEvent(new Event('input')); }
};

/* quick-add to PDP mapping */
window.__ADD = addToCart;

/* ============ SEARCH route (opens w/ query) ============ */
function openSearch() { location.hash = '#/search'; }
window.openSearch = openSearch;
function openAccount() { openModal('accountModal'); }
window.openAccount = openAccount;
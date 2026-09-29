/* IXPEAKS — ROUTES PART 2: PDP, checkout, wishlist, content pages */
'use strict';

/* ============ PDP ============ */
ROUTES['p'] = (app, id) => {
  const p = PRODUCT(id);
  if (!p) { location.hash = '#/new'; return; }
  pushRecent(id);
  const recs = PRODUCTS.filter(x => x.id !== id && (x.activity === p.activity || x.category === p.category)).slice(0, 4);
  const rv = STORE.recent.filter(x => x !== id).map(PRODUCT).filter(Boolean).slice(0, 4);
  const rating = (4.6 + ((parseInt(p.id.replace(/\D/g, '')) % 4) * .1)).toFixed(1);
  app.innerHTML = `<div class="view"><div class="container">
    <nav class="crumb mt4" aria-label="Breadcrumb"><a href="#/">Home</a> › <a href="#/${p.audience}">${p.audience[0].toUpperCase()+p.audience.slice(1)}</a> › <a href="#/activity/${p.activity}">${p.activity[0].toUpperCase()+p.activity.slice(1)}</a> › <b style="color:var(--ink)">${esc(p.name)}</b></nav>
    <div class="pdp">
      <div class="pdp-gallery">
        <div class="main" id="pdpMain" onclick="this.classList.toggle('zoomed')">
          <img src="${p.img}" alt="${esc(p.name)} product illustration" id="pdpImg">
          <span class="zoom-hint">Click to zoom</span>
        </div>
        <div class="thumb-row">
          ${[0,1,2].map(i => `<button class="th ${i===0?'on':''}" data-alt="${i}" aria-label="View ${i+1}"><img src="${p.img}" alt="" style="filter:grayscale(${i*0.35})"></button>`).join('')}
        </div>
      </div>
      <div class="pdp-info">
        <div class="flx-between"><span class="kicker">${esc(p.category)} — ${esc(p.activity[0].toUpperCase()+p.activity.slice(1))}</span><span class="rating">★ ${rating} <span class="meta">(sample rating UI)</span></span></div>
        <h1 class="mt1">${esc(p.name)}</h1>
        <div class="pdp-price" id="pdpPrice">${money(p.price)}</div>
        <p class="lede mt2" style="font-size:15.5px">${esc(p.desc)}</p>

        <div class="opt-lbl">Color <b id="colorSelLbl">${esc(p.colors[0])}</b></div>
        <div class="flx" role="listbox" aria-label="Color" id="colorRow">
          ${p.colors.map((c, i) => `<button class="cdot ${i === 0 ? 'on' : ''}" data-c="${esc(c)}" role="option" aria-selected="${i===0}" aria-label="${esc(c)}"><i style="background:${(colorsHex[c]||['#23282C'])[0]}"></i></button>`).join('')}
        </div>

        <div class="opt-lbl">Size <a href="#/size" style="text-decoration:underline;font-weight:600">Size guide</a></div>
        <div class="sizes" id="sizeRow">
          ${p.sizes.map((s, i) => `<button class="sz ${i===0?'on':''}" data-s="${esc(s)}">${esc(s)}</button>`).join('')}
        </div>

        <div class="buy-row">
          <div class="qty" style="height:54px" id="qtyCtl"><button style="width:44px" aria-label="Decrease quantity">−</button><span style="width:40px" id="qtyVal">1</span><button style="width:44px" aria-label="Increase quantity">+</button></div>
          <button class="btn btn-solid" id="pdpAdd">Add to Cart — <span id="pdpAddPrice">${money(p.price)}</span></button>
          <button class="wish-btn ${STORE.wishlist.includes(id) ? 'on' : ''}" data-id="${id}" onclick="toggleWish('${id}')" aria-label="Save to wishlist"><svg viewBox="0 0 24 24"><path d="M12 21C7 16.5 3 13 3 8.8 3 6 5.2 4 7.8 4c1.7 0 3.3.9 4.2 2.4C12.9 4.9 14.5 4 16.2 4 18.8 4 21 6 21 8.8c0 4.2-4 7.7-9 12.2z"/></svg></button>
        </div>
        <div class="assurance">
          <div><b>90-day field trial</b><span>return it worn</span></div>
          <div><b>Lifetime limited</b><span>warranty on defects</span></div>
          <div><b>Repair program</b><span>fix it, don't toss it</span></div>
        </div>

        <div class="ship-est">📦 <b>Free shipping</b> over ${money(150)} · delivered in 2–5 business days<br>↩ <b>90 days</b> to return, even after wearing it</div>

        <div class="spec-block">
          <div class="acc open"><button aria-expanded="true">Features &amp; technology <span class="chev">⌄</span></button>
            <div class="acc-body"><ul class="spec-list">${p.features.map(f => `<li>${esc(f)}${/concept/i.test(f) ? ' <span class="badge-concept badge" style="margin-left:6px">concept</span>' : ''}</li>`).join('')}</ul></div></div>
          <div class="acc"><button aria-expanded="false">Materials <span class="chev">⌄</span></button>
            <div class="acc-body">${esc(p.materials)}</div></div>
          <div class="acc"><button aria-expanded="false">Care <span class="chev">⌄</span></button>
            <div class="acc-body">${esc(p.care)} <a href="#/care" style="text-decoration:underline">Full care guide →</a></div></div>
          <div class="acc"><button aria-expanded="false">Shipping &amp; returns <span class="chev">⌄</span></button>
            <div class="acc-body">Free over ${money(150)} · 2–5 days · 90-day returns · <a href="#/shipping" style="text-decoration:underline">details</a></div></div>
        </div>
      </div>
    </div>

    ${recs.length ? `<section class="sect mt4"><div class="sect-head"><h2 style="font-size:26px">COMPLETE THE KIT</h2></div><div class="rail">${recs.map(x => pcardHTML(x)).join('')}</div></section>` : ''}
    ${rv.length ? `<section class="sect" style="padding-top:0"><div class="sect-head"><h2 style="font-size:26px">RECENTLY VIEWED</h2></div><div class="rail">${rv.map(x => pcardHTML(x)).join('')}</div></section>` : ''}
  </div></div>`;

  /* wire */
  let qty = 1, color = p.colors[0], size = p.sizes[0];
  $('#qtyCtl button:first-child').onclick = () => { qty = Math.max(1, qty - 1); $('#qtyVal').textContent = qty; };
  $('#qtyCtl button:last-child').onclick = () => { qty = Math.min(9, qty + 1); $('#qtyVal').textContent = qty; };
  $$('#colorRow .cdot').forEach(c => c.onclick = () => {
    $$('#colorRow .cdot').forEach(x => x.classList.remove('on')); c.classList.add('on');
    color = c.dataset.c; $('#colorSelLbl').textContent = color;
  });
  $$('#sizeRow .sz').forEach(s => s.onclick = () => {
    $$('#sizeRow .sz').forEach(x => x.classList.remove('on')); s.classList.add('on');
    size = s.dataset.s;
  });
  $('#pdpAdd').onclick = () => addToCart(p.id, size, color, qty);
  $$('.thumb-row .th').forEach(t => t.onclick = () => {
    $$('.thumb-row .th').forEach(x => x.classList.remove('on')); t.classList.add('on');
    $('#pdpImg').style.filter = `grayscale(${t.dataset.alt * 0.35})`;
  });
  /* accordion */
  $$('.spec-block .acc').forEach(a => a.querySelector('button').onclick = () => {
    const open = a.classList.toggle('open');
    a.querySelector('button').setAttribute('aria-expanded', open);
  });
};

/* ============ CHECKOUT (prototype) ============ */
ROUTES['checkout'] = app => {
  if (!STORE.cart.length) { app.innerHTML = `<div class="view container"><div class="empty"><div class="big">Your cart is empty</div><p>Nothing to check out yet.</p><button class="btn btn-solid mt3" onclick="location.hash='#/new'">Shop new arrivals</button></div></div>`; return; }
  app.innerHTML = `<div class="view container" style="padding-top:34px">
    <h1 class="plp-title">Checkout</h1>
    <p class="meta mt1">Prototype checkout — no payment is processed and no order is transmitted.</p>
    <div class="co-steps mt4" role="tablist">
      <div class="co-step on" id="cs1">1 · Contact</div><div class="co-step" id="cs2">2 · Shipping</div><div class="co-step" id="cs3">3 · Payment</div><div class="co-step" id="cs4">4 · Review</div>
    </div>
    <div class="co-grid mt3">
      <form id="coForm" novalidate>
        <div id="coStep1">
          <h2 class="disp" style="font-size:22px">Contact</h2>
          <div class="field mt3"><label for="coEmail">Email</label><input id="coEmail" type="email" required placeholder="you@example.com"><span class="err-msg">Enter a valid email</span></div>
          <div class="f2">
            <div class="field"><label for="coFirst">First name</label><input id="coFirst" required><span class="err-msg">Required</span></div>
            <div class="field"><label for="coLast">Last name</label><input id="coLast" required><span class="err-msg">Required</span></div>
          </div>
        </div>
        <div id="coStep2" style="display:none">
          <h2 class="disp" style="font-size:22px">Shipping address</h2>
          <div class="field mt3"><label for="coAddr">Address</label><input id="coAddr" required placeholder="123 Summit Ave"><span class="err-msg">Required</span></div>
          <div class="f2">
            <div class="field"><label for="coCity">City</label><input id="coCity" required><span class="err-msg">Required</span></div>
            <div class="field"><label for="coPostal">Postal code</label><input id="coPostal" required><span class="err-msg">Required</span></div>
          </div>
          <div class="field"><label for="coShip">Delivery speed</label>
            <select id="coShip"><option>Standard — 2–5 days (free over ${money(150)})</option><option>Express — 1–2 days (prototype, no charge)</option><option>Peak Saturday (concept)</option></select></div>
        </div>
        <div id="coStep3" style="display:none">
          <h2 class="disp" style="font-size:22px">Payment</h2>
          <p class="flag-note">This is a <b>checkout prototype</b>: card fields are dummy inputs, nothing is charged, no data leaves the page.</p>
          <div class="field mt3"><label for="coCard">Card number (dummy)</label><input id="coCard" inputmode="numeric" placeholder="4242 4242 4242 4242" value="4242 4242 4242 4242"></div>
          <div class="f2">
            <div class="field"><label for="coExp">Expiry (dummy)</label><input id="coExp" placeholder="09/29" value="09/29"></div>
            <div class="field"><label for="coCvc">CVC (dummy)</label><input id="coCvc" placeholder="•••" value="999"></div>
          </div>
        </div>
        <div id="coStep4" style="display:none">
          <h2 class="disp" style="font-size:22px">Review &amp; place</h2>
          <div id="coReview" class="mt3"></div>
        </div>
        <div class="flx mt4">
          <button type="button" class="btn btn-ghost" id="coBack" style="visibility:hidden">← Back</button>
          <button type="submit" class="btn btn-solid grow" id="coNext" style="justify-content:center">Continue →</button>
        </div>
      </form>
      <aside class="co-summary">
        <h3 class="disp" style="font-size:16px">Order summary</h3>
        <div class="mt3">${STORE.cart.map(i => { const p = PRODUCT(i.id); return `<div class="ditem" style="padding:8px 0"><img src="${p.img}" alt=""><div><b style="font-size:13.5px">${esc(p.name)}</b><div class="pmeta">${esc(i.color)} · ${esc(i.size)} × ${i.q}</div></div><b style="font-size:13px">${money(p.price * i.q)}</b></div>`; }).join('')}</div>
        <div class="co-line mt3"><span>Subtotal</span><span id="coSub">${money(cartTotal())}</span></div>
        ${STORE.promo ? `<div class="co-line"><span>Promo ${STORE.promo}</span><span>−${money(cartTotal() * PROMOS[STORE.promo])}</span></div>` : ''}
        <div class="co-line"><span>Shipping</span><span>Free</span></div>
        <div class="co-line total"><span>Total</span><span id="coTotal">${money(cartTotal() * (STORE.promo ? 1 - PROMOS[STORE.promo] : 1))}</span></div>
      </aside>
    </div>
  </div>`;
  let step = 1;
  const show = n => {
    step = n;
    for (let i = 1; i <= 4; i++) {
      $('#coStep' + i).style.display = i === n ? 'block' : 'none';
      const cs = $('#cs' + i); cs.className = 'co-step ' + (i < n ? 'done' : i === n ? 'on' : '');
    }
    $('#coBack').style.visibility = n > 1 ? 'visible' : 'hidden';
    $('#coNext').textContent = n === 4 ? 'Place Order (prototype)' : 'Continue →';
    if (n === 4) $('#coReview').innerHTML = `<div class="flag-note"><b>Review</b> — ${esc($('#coEmail').value || 'no email')} → ${esc($('#coAddr').value || 'no address')}</div>`;
  };
  $('#coBack').onclick = () => show(Math.max(1, step - 1));
  $('#coForm').onsubmit = e => {
    e.preventDefault();
    if (step < 4) {
      const fields = [[['#coEmail'],['coEmail','input']], step===1 ? [['#coFirst','#coLast']] : [['#coAddr','#coCity','#coPostal']]].flat().flat();
      let bad = false;
      (step === 1 ? ['coEmail','coFirst','coLast'] : step === 2 ? ['coAddr','coCity','coPostal'] : []).forEach(id => {
        const el = $('#' + id), f = el.closest('.field');
        const ok = el.type === 'email' ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value) : el.value.trim().length > 0;
        f.classList.toggle('err', !ok); if (!ok) bad = true;
      });
      if (bad) return;
      show(step + 1);
    } else {
      // success state
      const n = cartCount(), total = $('#coTotal').textContent;
      STORE.cart = []; STORE.promo = null; save(); bumpBadge();
      app.innerHTML = `<div class="view container co-done"><div class="success-box">
        <div class="big-check">✓</div>
        <h1 class="disp" style="font-size:var(--fs-h1)">WELCOME TO THE CREW.</h1>
        <p class="lede mt3" style="margin-inline:auto">Prototype confirmation: ${n} item${n===1?'':'s'} · ${total} reserved for ${esc($('#coEmail') ? 'you' : 'you')}. In the live build this order would be transmitted to a real backend — this one stops here by design.</p>
        <div class="mt4 flx" style="justify-content:center;flex-wrap:wrap">
          <button class="btn btn-solid" onclick="location.hash='#/new'">Keep Exploring</button>
          <button class="btn btn-ghost" onclick="location.hash='#/support'">Order Support</button>
        </div></div></div>`;
      window.scrollTo({ top: 0 });
    }
  };
};

/* ============ WISHLIST ============ */
ROUTES['wishlist'] = app => {
  const list = STORE.wishlist.map(PRODUCT).filter(Boolean);
  app.innerHTML = `<div class="view container" style="padding-top:30px">
    <div class="kicker">Saved for later</div><h1 class="plp-title mt1">WISHLIST</h1>
    ${list.length ? `<div class="pgrid mt5" style="row-gap:34px" id="wlGrid">${list.map(p => pcardHTML(p)).join('')}</div>` :
    `<div class="empty"><div class="big">Nothing saved yet</div><p>Tap the heart on any product to stash it here.</p><button class="btn btn-solid mt3" onclick="location.hash='#/new'">Browse new arrivals</button></div>`}
  </div>`;
};

/* ============ CAMPAIGN PAGE ============ */
ROUTES['campaign'] = app => {
  app.innerHTML = `<div class="view">
  <section class="hero" style="min-height:70svh">
    <div class="bg"><img src="assets/img/campaign/hero.jpg" alt="Crew on the ridge at first light"></div>
    <div class="wrap hero-in">
      <div class="tagline-chip">FW26 Campaign</div>
      <h1>BEYOND EVERY SUMMIT.</h1>
      <p class="sub">One crew. Nine peaks. A season built for the climb between where you are and where you're headed.</p>
    </div>
  </section>
  <section class="sect"><div class="wrap">
    <div class="kicker reveal">The campaign pieces</div>
    <div class="j-grid mt3">
      <a class="j-card reveal" href="#/p/NA-01"><div class="jimg"><img src="assets/img/campaign/shell.jpg" alt="Summit Shell 9 in coastal rain"></div><span class="kicker">Piece 01</span><h3 class="mt1">The Ninth Hour</h3><p class="meta mt1">Summit Shell 9 — worn by four crew members through a coastal storm.</p></a>
      <a class="j-card reveal" href="#/p/NX-01"><div class="jimg"><img src="assets/img/campaign/trail.jpg" alt="Trail runner at dawn"></div><span class="kicker">Piece 02</span><h3 class="mt1">First Light Runs</h3><p class="meta mt1">NINE Trail 1 — the 5 a.m. crew, documented.</p></a>
      <a class="j-card reveal" href="#/p/NA-05"><div class="jimg"><img src="assets/img/campaign/winter.jpg" alt="Loft 9 in winter light"></div><span class="kicker">Piece 03</span><h3 class="mt1">Cold Starts</h3><p class="meta mt1">Loft 9 Down — winter dawn patrols.</p></a>
    </div>
    <div class="flag-note reveal"><b>Sample campaign imagery.</b> Photography shown is AI-generated placeholder art for the launch prototype — final campaign will be shot with real athletes.</div>
  </div></section>
  <section class="sect on-panel"><div class="wrap flx-between" style="align-items:end">
    <div><h2 class="disp" style="font-size:var(--fs-h1)">SHOP THE CAMPAIGN.</h2>
    <p class="lede mt2">Every piece in the FW26 campaign, ready to build your kit.</p></div>
    <button class="btn btn-solid" onclick="location.hash='#/new'">Shop FW26 →</button>
  </div></section></div>`;
  bindReveals();
};

/* ============ TECHNOLOGY ============ */
ROUTES['technology'] = app => {
  const tech = [
    ['STORM9', 'Weather systems', 'Waterproof-breathable construction concept for shells and rain kits. Fully taped seams, storm cuffs, helmet-compatible hoods.', 'concept'],
    ['LOFT9', 'Insulation', 'Down and synthetic warmth concepts, 800-fill class, packed volume measured in your fist, not your closet.', 'concept'],
    ['GRID9', 'Breathability & movement', 'Body-mapped ventilation: grid fleece zones where you run warm, tight weaves where the wind lives.', 'concept'],
    ['GRIP9', 'Traction', 'Lug geometries and sticky-rubber compounds tuned per activity — 6 mm for trail, climbing-zone rands for approach.', 'concept'],
    ['FLEX9', 'Movement', 'Four-way stretch mapped onto articulated patterns. Gear that moves like you, not like a tent.', 'concept'],
  ];
  app.innerHTML = `<div class="view"><div class="container">
    <div class="page-hero"><div class="kicker">Performance principles</div><h1 class="mt1">TECHNOLOGY &amp; MATERIALS.</h1>
    <p class="lede mt3">Five systems, one standard. Every IXPEAKS piece is built from these — named simply, labeled honestly.</p></div>
    <div class="val-grid">
      ${tech.map(([name, cat, body, tag]) => `<div class="val reveal"><div class="vk">${cat}</div><h3>${name} <span class="badge-concept badge">${tag}</span></h3><p>${body}</p></div>`).join('')}
    </div>
    <div class="flag-note reveal"><b>Honest label:</b> all IXPEAKS performance systems above are <b>conceptual launch systems</b> — original names, not independently tested or certified. No competitor technology names are referenced.</div>
    <section class="sect"><div class="sect-head"><h2>SHOP BY SYSTEM</h2></div>
    <div class="act-strip">${tech.map(([name], i) => `<a class="act-chip" data-tech="${i}" style="cursor:pointer">${name}</a>`).join('')}</div></section>
  </div></div>`;
  bindReveals();
};

/* ============ ATHLETES ============ */
ROUTES['athletes'] = app => {
  const ath = [
    ['SAMPLE PROFILE', 'The Ridge Runner', '“I run the same ridge year-round. The gear either disappears or it doesn\u2019t. This one disappears.”', 'Trail athlete — sample profile, not a real endorsement'],
    ['SAMPLE PROFILE', 'The First Summiteer', '“My first real summit was last spring, age 46. Nobody in the crew asked how many I\u2019d done before.”', 'Community member — sample profile'],
    ['SAMPLE PROFILE', 'The Coach', '“I teach teenagers to read weather before they read maps. Their kit has to handle both.”', 'Youth coach — sample profile'],
  ];
  app.innerHTML = `<div class="view"><div class="container">
    <div class="page-hero"><div class="kicker">Athletes &amp; ambassadors</div><h1 class="mt1">THE CREW.</h1>
    <p class="lede mt3">IXPEAKS is built with people who climb their own kind of mountains. The profiles below are <b>representative samples</b> of the program we're building — not current endorsements.</p></div>
    <div class="ath-grid">${ath.map(([tag, name, quote, who]) => `
      <div class="ath-card reveal"><div class="ainner"><div class="role">${tag}</div><blockquote>“${esc(quote.slice(1, -1))}”</blockquote><div class="who">${name} · ${who}</div></div></div>`).join('')}
    </div>
    <div class="flag-note reveal"><b>Program note:</b> athlete roster is under construction. Real athlete and community profiles will be added only with signed agreements and confirmed identity.</div>
    <div class="center mt5"><a class="btn btn-ghost" href="#/contact">Apply to the crew →</a></div>
  </div></div>`;
  bindReveals();
};

/* ============ JOURNAL ============ */
function journalCardsHTML() {
  const posts = [
    ['guide', 'Nine Day Kit: what to pack for a first overnighter', 'The 9 things that actually earn their weight.', 'journal/kit.jpg'],
    ['care', 'Wash less, hike more: merino that keeps working', 'Field care for the pieces you wear three days straight.', 'journal/merino.jpg'],
    ['story', 'Reading weather like the crew does', 'Clouds, pressure, and the ninth-hour rule.', 'journal/weather.jpg'],
  ];
  return posts.map(([tag, title, sub, img]) => `<a class="j-card reveal" href="#/journal"><div class="jimg"><img src="assets/img/${img}" alt="" loading="lazy"></div><span class="kicker">${tag}</span><h3 class="mt1">${esc(title)}</h3><p class="meta mt1">${esc(sub)}</p></a>`);
}

ROUTES['journal'] = app => {
  app.innerHTML = `<div class="view"><div class="container">
    <div class="page-hero"><div class="kicker">Editorial hub</div><h1 class="mt1">FIELD NOTES.</h1>
    <p class="lede mt3">Guides, care advice, and stories from the crew. Practical, honest, never sponsored fluff.</p></div>
    <div class="j-grid">${journalCardsHTML()}</div>
    <article class="prose mt5"><h2>Nine Day Kit — the overnight list</h2>
      <p>Everything on this list fits a 9 L pack: shell, merino tee, split shorts or pants, socks, flask pair, and the summit snacks that keep you moving. That's the kit. If it doesn't fit, it isn't going.</p>
      <ul><li>Summit Shell 9 — weather you can't predict</li><li>Merino Tee 9 — worn in, never worn out</li><li>Ascent 9L Pack + Trail Flask Duo</li></ul>
      <p class="meta">Sample editorial content — final stories ship with real field photography.</p></article>
  </div></div>`;
  bindReveals();
};
window.journalCardsHTML = journalCardsHTML;

/* ============ STORY ============ */
ROUTES['story'] = app => {
  app.innerHTML = `<div class="view"><div class="container">
    <div class="page-hero"><div class="kicker">Our story</div><h1 class="mt1">IX IS NINE. NINE IS THE CREW.</h1></div>
    <div class="prose">
      <p><b>Beyond Every Summit.</b> IXPEAKS exists because the mountain does not care how much you spent on your shell — and the crew does not care what your first summit was. Both just want you to make it, and make it again.</p>
      <p>IX — the Roman numeral nine — is the founder's number and the crew's number. Nine peaks: the first trailhead, the first record, the long haul, the weather turn, the ridge line, the descent, the comeback, the crew, and always another. One crew, nine summits, no solo ascents.</p>
      <h2>What we believe</h2>
      <ul><li><b>Achievement, not elitism</b> — a peak can be a ridge line, a personal best, or the first trail your kid finishes.</li>
      <li><b>Performance for everyone</b> — men, women, youth, and kids get real systems, not shrink-downs.</li>
      <li><b>Repairs, not landfill</b> — limited lifetime warranty on defects, a repair program for wear, and products built to be fixed.</li></ul>
      <p class="meta">Founding story is intentionally kept to brand values — no invented founder history. “IXPEAKS” is a working brand name; trademark clearance has not been verified.</p>
    </div>
    <div class="stats mt5">
      <div class="stat reveal"><b>1<i>%</i></b><span>of revenue pledged to trail restoration (launch pledge)</span></div>
      <div class="stat reveal"><b>90<i>-day</i></b><span>field trial — return anything, even worn</span></div>
      <div class="stat reveal"><b>0<i></i></b><span>fake reviews, fake counts, or fake awards on this site</span></div>
    </div>
  </div></div>`;
  bindReveals();
};

/* ============ RESPONSIBILITY ============ */
ROUTES['responsibility'] = app => {
  app.innerHTML = `<div class="view"><div class="container">
    <div class="page-hero"><div class="kicker">Responsibility</div><h1 class="mt1">REPAIRS, NOT LANDFILL.</h1></div>
    <div class="prose">
      <p>Outdoor gear should outlast the trends that sold it. Our commitments — stated honestly, for a launch-stage company:</p>
      <ul>
        <li><b>Limited lifetime warranty</b> against defects in materials and workmanship, for the life of the product.</li>
        <li><b>Repair program (launch goal):</b> common repairs offered at cost; wear-and-tear is normal and fixable.</li>
        <li><b>1% launch pledge:</b> one percent of revenue pledged to trail and habitat restoration partners (final partner selection pending).</li>
        <li><b>Recycled-first materials:</b> recycled-face fabrics specified wherever supply allows; certified sourcing tracked publicly as it's confirmed.</li>
      </ul>
      <p>No certifications, awards, or impact numbers are claimed here — those are earned, not marketed.</p>
    </div>
    <div class="val-grid mt4">
      <div class="val reveal"><div class="vk">Repair</div><h3>Fix it first</h3><p>Zippers, seams, buckles — send it in. Wear repairs at cost; defects are covered.</p></div>
      <div class="val reveal"><div class="vk">Materials</div><h3>Recycled-first</h3><p>Recycled nylon and poly specified across FW26 where suppliers meet spec.</p></div>
      <div class="val reveal"><div class="vk">Trails</div><h3>1% pledge</h3><p>One percent of revenue to trail restoration. Partner selection in progress.</p></div>
    </div>
  </div></div>`;
  bindReveals();
};
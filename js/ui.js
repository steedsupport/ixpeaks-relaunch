/* IXPEAKS — shared UI fragments: header, drawer, modal shells, footer, card */
'use strict';

function logoHTML() {
  return `<a href="#/" class="logo" aria-label="IXPEAKS home"><span class="gmark"><svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true"><path d="M4 24 L10 10 L16 24 Z" fill="#FF5A1F"/><path d="M14 24 L21 6 L28 24 Z" fill="none" stroke="#17130E" stroke-width="2.4"/></svg></span><span class="wordmark">IX<i>PEAKS</i></span></a>`;
}

function headerHTML() {
  return `
<header class="hdr">
  <div class="wrap hdr-in">
    ${logoHTML()}
    <ul class="nav" role="list">
      <li><button class="nav-btn" aria-expanded="false" aria-haspopup="true">Shop</button>
        <div class="mega" role="menu">
          <div><h4>Audience</h4><a href="#/men">Men</a><a href="#/women">Women</a><a href="#/youth">Youth</a><a href="#/kids">Kids</a></div>
          <div><h4>Category</h4><a href="#/clothing">Clothing</a><a href="#/footwear">Footwear</a><a href="#/accessories">Accessories</a><a href="#/gear">Equipment &amp; Gear</a></div>
          <div><h4>Curated</h4><a href="#/new">New Arrivals</a><a href="#/campaign">Beyond Every Summit</a><a href="#/technology">Technology</a></div>
        </div>
      </li>
      <li><button class="nav-btn" aria-expanded="false" aria-haspopup="true">Activities</button>
        <div class="mega" role="menu">
          <div><h4>By Activity</h4><a href="#/activity/hiking">Hiking</a><a href="#/activity/trail">Trail</a><a href="#/activity/training">Training</a><a href="#/activity/rain">Rain</a></div>
          <div><h4>&nbsp;</h4><a href="#/activity/snow">Snow</a><a href="#/activity/travel">Travel</a><a href="#/activity/everyday">Everyday</a></div>
          <div><h4>Find Your Peak</h4><a href="#/quiz">Take the 60-second quiz →</a></div>
        </div>
      </li>
      <li><a class="nav-btn" href="#/journal">Journal</a></li>
      <li><a class="nav-btn" href="#/story">Our Story</a></li>
    </ul>
    <div class="hdr-actions">
      <button class="icon-btn" onclick="openSearch()" aria-label="Search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg></button>
      <button class="icon-btn" onclick="openAccount()" aria-label="Account"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg></button>
      <button class="icon-btn" onclick="location.hash='#/wishlist'" aria-label="Wishlist"><svg viewBox="0 0 24 24"><path d="M12 21C7 16.5 3 13 3 8.8 3 6 5.2 4 7.8 4c1.7 0 3.3.9 4.2 2.4C12.9 4.9 14.5 4 16.2 4 18.8 4 21 6 21 8.8c0 4.2-4 7.7-9 12.2z"/></svg></button>
      <button class="icon-btn" onclick="openCart()" aria-label="Cart"><svg viewBox="0 0 24 24"><path d="M6 7h12l-1.2 13H7.2L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg><span class="cart-badge" id="cartBadge" style="display:none">0</span></button>
      <button class="icon-btn burger" onclick="toggleMnav()" aria-label="Menu"><svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
    </div>
  </div>
</header>`;
}

function mnavHTML() {
  return `
<nav class="mnav" id="mnav" aria-label="Mobile menu">
  <button class="close" onclick="toggleMnav()" aria-label="Close menu">✕</button>
  <div class="grp"><div class="kicker mb1">Start</div>
    <a class="big" href="#/new" onclick="toggleMnav()">New Arrivals</a>
    <a class="big" href="#/campaign" onclick="toggleMnav()">Beyond Every Summit</a>
    <a class="mid" href="#/quiz" onclick="toggleMnav()">Find Your Peak — 60-second quiz</a></div>
  <div class="grp"><div class="kicker mb1">Shop</div>
    <a class="big" href="#/men" onclick="toggleMnav()">Men</a>
    <a class="big" href="#/women" onclick="toggleMnav()">Women</a>
    <a class="big" href="#/youth" onclick="toggleMnav()">Youth</a>
    <a class="big" href="#/kids" onclick="toggleMnav()">Kids</a></div>
  <div class="grp"><div class="kicker mb1">Categories</div>
    <a class="mid" href="#/clothing" onclick="toggleMnav()">Clothing</a>
    <a class="mid" href="#/footwear" onclick="toggleMnav()">Footwear</a>
    <a class="mid" href="#/accessories" onclick="toggleMnav()">Accessories</a>
    <a class="mid" href="#/gear" onclick="toggleMnav()">Equipment &amp; Gear</a></div>
  <div class="grp"><div class="kicker mb1">Activities</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      ${ACTIVITIES.map(a => `<a class="fchip" href="#/activity/${a}" onclick="toggleMnav()">${a[0].toUpperCase() + a.slice(1)}</a>`).join('')}
    </div></div>
  <div class="grp"><div class="kicker mb1">Company</div>
    <a class="mid" href="#/story" onclick="toggleMnav()">Our Story</a>
    <a class="mid" href="#/technology" onclick="toggleMnav()">Technology &amp; Materials</a>
    <a class="mid" href="#/athletes" onclick="toggleMnav()">Athletes &amp; Ambassadors</a>
    <a class="mid" href="#/journal" onclick="toggleMnav()">Journal</a>
    <a class="mid" href="#/responsibility" onclick="toggleMnav()">Responsibility</a>
    <a class="mid" href="#/stores" onclick="toggleMnav()">Find a Store</a>
    <a class="mid" href="#/support" onclick="toggleMnav()">Support</a></div>
</nav>`;
}
function toggleMnav() { $('#mnav').classList.toggle('on'); document.body.style.overflow = $('#mnav').classList.contains('on') ? 'hidden' : ''; }
window.toggleMnav = toggleMnav;

function cartDrawerHTML() {
  return `
<div class="scrim" id="scrim" onclick="closeAll()"></div>
<aside class="drawer" id="cartDrawer" aria-hidden="true" aria-label="Cart">
  <div class="dhead flx-between"><b style="font-family:var(--font-display);letter-spacing:.12em;text-transform:uppercase">Your Cart</b>
    <button class="icon-btn" onclick="closeCart()" aria-label="Close cart">✕</button></div>
  <div class="dbody" id="cartBody"></div>
  <div class="dfoot" id="cartFoot">
    <div id="cartPromoApplied" class="badge-concept badge" style="display:none"></div>
    <div class="promo-row" id="cartPromoRow"><input id="promoInput" placeholder="Promo code (try FIRSTLIGHT)" aria-label="Promo code"><button onclick="applyPromo($('#promoInput').value)">Apply</button></div>
    <div class="co-line mt2"><span>Subtotal</span><span id="cartSub">CA$0</span></div>
    <div class="co-line total"><span>Total</span><span id="cartTotal">CA$0</span></div>
    <button class="btn btn-solid mt2" style="width:100%;justify-content:center" onclick="location.hash='#/checkout';closeCart()">Checkout →</button>
    <div class="ship-hint" id="shipHint"></div>
  </div>
</aside>`;
}

function modalsHTML() {
  return `
<div class="modal" id="accountModal" role="dialog" aria-modal="true" aria-label="Account">
  <div class="mbox">
    <div class="flx-between"><div class="kicker">Membership</div><button class="icon-btn" onclick="closeAll()">✕</button></div>
    <h2 class="disp" style="font-size:30px;margin-top:8px">Join the Ascent</h2>
    <p class="lede" style="font-size:15px;margin-top:10px">One account for orders, the Summit Club membership, early launch access, and your peak log.</p>
    <div class="acct-opts">
      <button class="btn btn-solid" style="justify-content:center" onclick="closeAll();toast('Prototype: sign-in is not connected to a live backend')">Sign In / Create Account</button>
      <button class="btn btn-ghost" style="justify-content:center" onclick="closeAll();toast('Prototype: orders history is sample data')">Orders &amp; Returns</button>
    </div>
    <p class="meta mt3">Prototype note: accounts are mocked in this build and store nothing.</p>
  </div>
</div>`;
}

function footerHTML() {
  return `
<footer class="ftr">
  <div class="wrap">
    <div class="fgrid">
      <div>
        <div class="logo" style="font-size:23px">${logoHTML().replace('class="logo"','class="logo" style="color:var(--paper)"').replace(/#17130E/g,'#EFE9DF')}</div>
        <p style="font-size:13.5px;opacity:.75;margin-top:14px;max-width:34ch">Beyond Every Summit. Performance systems and everyday layers for the whole crew — engineered for the ninth hour.</p>
        <div class="region-row mt3">
          <select id="regionSel" aria-label="Country / currency" onchange="setRegion(this.value)">
            <option value="CA" ${STORE.region === 'CA' ? 'selected' : ''}>Canada — CA$</option>
            <option value="US" ${STORE.region === 'US' ? 'selected' : ''}>United States — US$</option>
            <option value="EU" ${STORE.region === 'EU' ? 'selected' : ''}>Europe — €</option>
            <option value="UK" ${STORE.region === 'UK' ? 'selected' : ''}>United Kingdom — £</option>
          </select>
        </div>
      </div>
      <div><h4>Shop</h4><a href="#/men">Men</a><a href="#/women">Women</a><a href="#/youth">Youth</a><a href="#/kids">Kids</a><a href="#/new">New Arrivals</a><a href="#/campaign">FW26 Campaign</a></div>
      <div><h4>Company</h4><a href="#/story">Our Story</a><a href="#/technology">Technology</a><a href="#/athletes">Athletes</a><a href="#/journal">Journal</a><a href="#/responsibility">Responsibility</a><a href="#/care">Product Care</a></div>
      <div><h4>Support</h4><a href="#/support">Help Center</a><a href="#/shipping">Shipping</a><a href="#/returns">Returns</a><a href="#/warranty">Warranty</a><a href="#/stores">Find a Store</a><a href="#/contact">Contact</a></div>
      <div><h4>The Summit Club</h4>
        <p style="font-size:13px;opacity:.75">Early launch access, peak-log tracking, member repairs. No spam — the newsletter is the trailhead.</p>
        <form class="nlrow" id="footerNL"><input type="email" placeholder="Email address" required aria-label="Email for newsletter"><button type="submit">Join</button></form>
      </div>
    </div>
    <div class="fword" aria-hidden="true">IX<i>PEAKS</i></div>
    <div class="fbar"><span>© 2026 IXPEAKS — prototype launch world</span>
      <span><a href="#/privacy">Privacy</a> · <a href="#/terms">Terms</a> · <a href="#/accessibility">Accessibility</a> · <a href="#/contact">Press &amp; Partnerships</a></span>
      <span>“IXPEAKS” is a working name; trademark clearance pending.</span></div>
  </div>
</footer>`;
}

function setRegion(r) {
  STORE.region = r; localStorage.setItem('ixpeaks2-region', r);
  toast(`Region set: ${(STORE.currency[r]?.sym)} — prices updated`);
  route();
}
window.setRegion = setRegion;

/* ---------- product card (shared) ---------- */
function withImg(p) {
  if (!p.img) { p.img = 'assets/img/products/' + p.id.toLowerCase() + '.jpg'; }
  return p;
}
function pcardHTML(p, { wish = true } = {}) {
  const inWish = STORE.wishlist.includes(p.id);
  p = withImg(p);
  return `<article class="pcard reveal">
    <a class="pimg" href="#/p/${p.id}" aria-label="${esc(p.name)}">
      <img src="${p.img}" alt="${esc(p.name)} — ${esc(p.category)} studio photo" loading="lazy">
      ${p.badge ? `<span class="badge badge-float">${p.badge === 'BUNDLE' ? 'KIT' : p.badge}</span>` : ''}
    </a>
    ${wish ? `<button class="wsub ${inWish ? 'on' : ''}" data-id="${p.id}" onclick="toggleWish('${p.id}')" aria-label="Wishlist ${esc(p.name)}"><svg viewBox="0 0 24 24"><path d="M12 21C7 16.5 3 13 3 8.8 3 6 5.2 4 7.8 4c1.7 0 3.3.9 4.2 2.4C12.9 4.9 14.5 4 16.2 4 18.8 4 21 6 21 8.8c0 4.2-4 7.7-9 12.2z"/></svg></button>` : ''}
    <button class="quickadd" data-add="${p.id}" aria-label="Quick add ${esc(p.label)}">+</button>
    <div class="prow"><div><div class="pmeta" style="letter-spacing:.16em;text-transform:uppercase;font-size:10.5px">${esc(p.line || '')} ${esc(p.audience[0].toUpperCase() + p.audience.slice(1))}</div>
      <div class="pname">${esc(p.name)}</div></div>
      <div style="text-align:right"><div class="pprice">${money(p.price)}</div>
      <div class="flx" style="gap:5px;justify-content:flex-end;margin-top:6px">${(p.colors.slice(0,2)).map(c => `<i style="width:11px;height:11px;border-radius:50%;background:${((colorsHex[c]||['#23282C'])[0])};display:inline-block;border:1px solid rgba(23,19,14,.25)"></i>`).join('')}</div></div></div>
    <button class="chip-add" data-add="${p.id}" aria-label="Add ${esc(p.name)}">+ ADD</button>
  </article>`;
}
window.pcardHTML = pcardHTML;

/* quick add opens PDP for size choice if apparel; adds OS product directly */
document.addEventListener('click', e => {
  const qa = e.target.closest('[data-add]');
  if (!qa) return;
  const p = PRODUCT(qa.dataset.add);
  if (p.sizes[0] === 'ONE SIZE' || p.sizes.length === 1) {
    addToCart(p.id, p.sizes[0], p.colors[0]);
  } else {
    location.hash = `#/p/${p.id}`;
  }
});
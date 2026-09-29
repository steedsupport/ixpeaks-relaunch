/* IXPEAKS — data layer + state + router engine */
'use strict';

/* ---------- catalog data ---------- */
const PRODUCTS = window.__PRODUCTS__; // injected from data file

const ACTIVITIES = ["hiking","trail","training","rain","snow","travel","everyday"];
const AUDIENCES = ["men","women","youth","kids"];
const CATEGORIES = [...new Set(PRODUCTS.map(p => p.category))];

/* ---------- persistent state ---------- */
const STORE = {
  cart: JSON.parse(localStorage.getItem('ixpeaks2-cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('ixpeaks2-wish') || '[]'),
  recent: JSON.parse(localStorage.getItem('ixpeaks2-recent') || '[]'),
  promo: null,
  region: localStorage.getItem('ixpeaks2-region') || 'CA',
  currency: { CA: { sym: 'CA$', rate: 1 }, US: { sym: 'US$', rate: .74 }, EU: { sym: '€', rate: .68 }, UK: { sym: '£', rate: .58 } },
};
const save = () => {
  localStorage.setItem('ixpeaks2-cart', JSON.stringify(STORE.cart));
  localStorage.setItem('ixpeaks2-wish', JSON.stringify(STORE.wishlist));
  localStorage.setItem('ixpeaks2-recent', JSON.stringify(STORE.recent));
};
const money = n => {
  const c = STORE.currency[STORE.region] || STORE.currency.CA;
  const v = Math.round(n * c.rate);
  return `${c.sym}${v.toLocaleString('en-CA')}`;
};

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const PRODUCT = id => PRODUCTS.find(p => p.id === id);
const colorsHex = window.__COLORHEX__ || {};
const ratings = p => 4.6 + ((parseInt(p.id.replace(/\D/g,'')) % 4) * .1);

/* ---------- toast ---------- */
let toastT;
function toast(msg) {
  const t = $('#toast'); if (!t) return;
  t.textContent = msg; t.classList.add('on');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2800);
}

/* ---------- cart engine ---------- */
function cartCount() { return STORE.cart.reduce((n, i) => n + i.q, 0); }
function cartTotal() { return STORE.cart.reduce((n, i) => n + i.q * PRODUCT(i.id).price, 0); }
function addToCart(id, size, color, q = 1) {
  const key = `${id}|${size}|${color}`;
  const ex = STORE.cart.find(i => i.key === key);
  if (ex) ex.q += q; else STORE.cart.push({ key, id, size, color, q });
  save(); bumpBadge(); renderCart();
  toast(`${PRODUCT(id).name} — added to cart`);
}
function setQty(key, q) {
  const it = STORE.cart.find(i => i.key === key); if (!it) return;
  if (q <= 0) STORE.cart = STORE.cart.filter(i => i.key !== key);
  else it.q = q;
  save(); bumpBadge(); renderCart();
}
function bumpBadge() {
  const b = $('#cartBadge'); if (!b) return;
  const n = cartCount();
  b.textContent = n; b.style.display = n ? 'grid' : 'none';
}

/* ---------- wishlist ---------- */
function toggleWish(id) {
  const on = STORE.wishlist.includes(id);
  STORE.wishlist = on ? STORE.wishlist.filter(x => x !== id) : [...STORE.wishlist, id];
  save(); bumpBadge();
  $$('#app .wsub[data-id]').forEach(el => {
    if (el.dataset.id === id) el.classList.toggle('on', !on);
  });
  if (location.hash.startsWith('#/wishlist')) route();
  toast(on ? 'Removed from wishlist' : 'Saved to wishlist');
}

/* ---------- recently viewed ---------- */
function pushRecent(id) {
  STORE.recent = [id, ...STORE.recent.filter(x => x !== id)].slice(0, 8);
  save();
}

/* ---------- promo ---------- */
const PROMOS = { 'FIRSTLIGHT': .15, 'NINEPEAKS': .09 };
function applyPromo(code) {
  const c = code.trim().toUpperCase();
  if (PROMOS[c]) { STORE.promo = c; renderCart(); toast(`Code ${c} applied — ${PROMOS[c] * 100}% off`); return true; }
  toast('That code isn\u2019t live yet'); return false;
}

/* ---------- drawer/modal control ---------- */
function openCart() { $('#scrim').classList.add('on'); $('#cartDrawer').classList.add('on'); $('#cartDrawer').setAttribute('aria-hidden','false'); }
function closeCart() { $('#scrim').classList.remove('on'); $('#cartDrawer').classList.remove('on'); $('#cartDrawer').setAttribute('aria-hidden','true'); }
function openSearch() { location.hash = '#/search'; }
function openAccount() { openModal('accountModal'); }
function openModal(id) { $('#scrim').classList.add('on'); $('#' + id).classList.add('on'); $('#' + id).querySelector('input,button')?.focus(); }
function closeAll() { $$('.modal.on').forEach(m => m.classList.remove('on')); closeCart(); $('#scrim').classList.remove('on'); }

/* ---------- render cart drawer ---------- */
function renderCart() {
  const body = $('#cartBody'); if (!body) return;
  if (!STORE.cart.length) {
    body.innerHTML = `<div class="empty"><div class="big">Your cart is empty</div><p>Summits don't wait — start your kit.</p>
      <button class="btn btn-solid mt3" onclick="location.hash='#/men';closeCart()">Shop Men</button>
      <button class="btn btn-ghost mt1" onclick="location.hash='#/women';closeCart()">Shop Women</button></div>`;
    $('#cartFoot').style.display = 'none';
    return;
  }
  $('#cartFoot').style.display = 'block';
  body.innerHTML = STORE.cart.map(i => {
    const p = PRODUCT(i.id);
    return `<div class="ditem">
      <img src="${p.img || ('assets/img/products/' + p.id.toLowerCase() + '.jpg')}" alt="${esc(p.name)}">
      <div><a href="#/p/${p.id}" onclick="closeCart()" style="font-weight:700">${esc(p.name)}</a>
        <div class="pmeta">${esc(p.category)} · ${esc(i.color)} · Size ${esc(i.size)}</div>
        <div class="qty mt1"><button onclick="setQty('${i.key}',${i.q - 1})" aria-label="decrease">−</button><span>${i.q}</span><button onclick="setQty('${i.key}',${i.q + 1})" aria-label="increase">+</button></div>
      </div>
      <div style="text-align:right"><b>${money(p.price * i.q)}</b><br>
        <button onclick="setQty('${i.key}',0)" style="font-size:11px;color:var(--stone);margin-top:6px;text-decoration:underline">Remove</button></div>
    </div>`;
  }).join('');
  const sub = cartTotal();
  const disc = STORE.promo ? sub * PROMOS[STORE.promo] : 0;
  const total = sub - disc;
  $('#cartSub').textContent = money(sub);
  $('#cartPromoRow').style.display = STORE.promo ? 'none' : 'flex';
  if (STORE.promo) {
    $('#cartPromoApplied').textContent = `${STORE.promo} (−${money(disc)})`;
    $('#cartPromoApplied').style.display = 'block';
  } else { $('#cartPromoApplied').style.display = 'none'; }
  $('#cartTotal').textContent = money(total);
  const away = 150 * (STORE.currency[STORE.region]?.rate || 1);
  $('#shipHint').innerHTML = total >= away ? '🎉 <b>Free shipping unlocked</b>' : `Add <b>${money(away - total)}</b> for free shipping`;
}
window.setQty = setQty; window.closeCart = closeCart; window.applyPromo = applyPromo; window.toggleWish = toggleWish; window.addToCart = addToCart;

/* ---------- router ---------- */
const ROUTES = {};
function route() {
  const h = location.hash || '#/';
  const [path, param] = h.replace(/^#\//, '').split('/');
  closeAll();
  const fn = ROUTES[path || 'home'] || ROUTES['notfound'];
  const app = $('#app');
  app.innerHTML = '';
  fn(app, param);
  window.scrollTo({ top: 0, behavior: 'instant' });
  bumpBadge();
  requestAnimationFrame(bindReveals);
}
window.addEventListener('hashchange', route);

/* ---------- reveal binding ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .12 });
function bindReveals() { $$('#app .reveal:not(.in)').forEach(el => io.observe(el)); }
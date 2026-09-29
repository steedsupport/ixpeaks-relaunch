/* IXPEAKS — ROUTES PART 3: care, stores, support, contact, shipping, returns, warranty,
   size guide, accessibility, privacy, terms, notfound + boot */
'use strict';

/* page helper: simple content page shell */
function page(title, kick, bodyHTML) {
  return app => {
    app.innerHTML = `<div class="view"><div class="container">
      <div class="page-hero"><div class="kicker">${kick}</div><h1 class="mt1">${title}</h1></div>
      ${bodyHTML}
    </div></div>`;
    bindReveals();
  };
}

ROUTES['care'] = page('PRODUCT CARE.', 'Care & durability', `<div class="prose">
  <p>Good gear is boring: it just shows up. Keep yours working with field-simple care.</p>
  <h2>The crew rules</h2>
  <ul>
    <li><b>Merino:</b> air it out after day one; wash cold on day three. Lay flat to dry — dryers shrink trust.</li>
    <li><b>Shells &amp; rain kits:</b> wash cold, tumble low, reproof seasonally. Dirt kills the DWR, not the membrane.</li>
    <li><b>Down:</b> spot clean most days; professional down-wash when needed. Store uncompressed.</li>
    <li><b>Footwear:</b> knock the dirt off; machine-wash cold, air dry away from heat.</li>
    <li><b>Packs:</b> empty every pocket (there's always one), spot clean, hang dry.</li>
  </ul>
  <p>Full instructions ship with every product card, and the repair program covers what care can't fix. <a href="#/responsibility" style="text-decoration:underline">See responsibility →</a></p>
</div>`);

ROUTES['stores'] = page('FIND A STORE.', 'Retailer locator concept', `<div class="prose"><p>The retail concept below is a launch plan, not a list of confirmed stockists. Partnering inquiries: <a href="#/contact" style="text-decoration:underline">work with us</a>.</p></div>
<div class="store-grid mt4">
  <div class="store-card reveal"><b>Vancouver — HQ &amp; concept store</b><div class="meta">Planned flagship · 2027 goal</div><p class="meta">Fit lab, repair counter, nine-summit wall.</p></div>
  <div class="store-card reveal"><b>Toronto — retail partners</b><div class="meta">Wholesale outreach in progress</div><p class="meta">No confirmed doors yet — honest status.</p></div>
  <div class="store-card reveal"><b>Online — worldwide shipping</b><div class="meta">Available from launch day</div><p class="meta">This website ships to CA / US / EU / UK at launch.</p></div>
</div>`);

ROUTES['support'] = page('HELP CENTER.', 'Support', `<div class="prose"><p>Prototype support: answers below reflect the launch plan. For real humans, <a href="#/contact" style="text-decoration:underline">contact us</a>.</p></div>
<div class="faq-list mt3">
  ${[['Where do you ship?', 'Canada, US, EU, and UK at launch — free over ' + money(150) + '. More regions as we grow.'],
     ['How long do I have to return?', '90 days, even worn. Field trial is the point.'],
     ['What does the warranty cover?', 'Defects in materials and workmanship for the life of the product. Wear and accidents are repair program items, typically at cost.'],
     ['Are all technologies tested?', 'No. Products marked “concept” are launch systems in validation. We label honestly.'],
     ['Do gift cards exist?', 'They will at launch. Prototype note: not yet.']]
    .map(([q, a]) => `<div class="acc"><button aria-expanded="false">${esc(q)} <span class="chev">⌄</span></button><div class="acc-body">${esc(a)}</div></div>`).join('')}
</div>`);

ROUTES['contact'] = page('CONTACT.', 'Press, partners, athletes, customers', `<div class="co-grid mt2" style="align-items:start">
  <form id="ctForm" novalidate>
    <div class="field"><label for="ctRole">I'm reaching out as…</label>
      <select id="ctRole"><option>Customer</option><option>Press</option><option>Retailer / wholesale</option><option>Athlete / ambassador</option><option>Partnership</option></select></div>
    <div class="field"><label for="ctEmail">Email</label><input id="ctEmail" type="email" required placeholder="you@example.com"><span class="err-msg">Valid email required</span></div>
    <div class="field"><label for="ctMsg">Message</label><textarea id="ctMsg" rows="5" required placeholder="Tell us about your summit…"></textarea><span class="err-msg">Say something 🙂</span></div>
    <button class="btn btn-solid" type="submit">Send Message</button>
    <p class="meta mt2" id="ctNote">Prototype form — messages are not transmitted from this build.</p>
  </form>
  <aside class="co-summary">
    <h3 class="disp" style="font-size:16px">Direct lines</h3>
    <p class="meta mt3"><b style="color:var(--ink)">Customer:</b> support@ixpeaks.example<br>
    <b style="color:var(--ink)">Press:</b> press@ixpeaks.example<br>
    <b style="color:var(--ink)">Wholesale:</b> partners@ixpeaks.example<br>
    <b style="color:var(--ink)">Athletes:</b> crew@ixpeaks.example</p>
    <p class="meta mt3">HQ — Vancouver, Canada (concept)<br>Pronunciation: “nine peaks”, said as one word: nine-PEAKS? No — <b style="color:var(--ink)">ix-PEAKS</b>.</p>
  </aside>
</div>`);

ROUTES['shipping'] = page('SHIPPING.', 'Delivery architecture', `<div class="prose">
<ul><li><b>Free</b> standard shipping over ${money(150)} — otherwise flat rate at checkout.</li>
<li><b>Standard:</b> 2–5 business days. <b>Express:</b> 1–2 days (rates at checkout).</li>
<li><b>International readiness:</b> duties and taxes shown before payment in the live build; region selector sets currency.</li></ul></div>`);

ROUTES['returns'] = page('RETURNS.', '90-day field trial', `<div class="prose">
<ul><li><b>90 days</b> from delivery — wear it, test it, summit in it.</li>
<li>Items with honest wear are fine; we'd rather repair than landfill.</li>
<li>Refunds to original payment within 5 business days of return intake (launch promise).</li></ul></div>`);

ROUTES['warranty'] = page('WARRANTY.', 'Limited lifetime', `<div class="prose">
<p><b>Limited lifetime warranty against defects in materials and workmanship.</b> That's the industry standard we're proud to hold — same class as the brands we grew up on.</p>
<ul><li><b>Covered:</b> defects in materials and workmanship, for the life of the product.</li>
<li><b>Repair program:</b> normal wear (zippers worn smooth, DWR faded, cuffs frayed) repaired at cost.</li>
<li><b>Not covered:</b> accidents, misuse, and ultraviolet aging — honest limits, stated up front.</li></ul></div>`);

ROUTES['size'] = page('SIZE GUIDE.', 'Inclusive, metric + imperial', `<p class="meta">Sizes shown for top wear; lower and shoe guides use the same structure. All body measurements, both units — no vanity sizing invented.</p>
<table class="size-table mt3"><thead><tr><th>Size</th><th>Chest (cm / in)</th><th>Waist (cm / in)</th></tr></thead><tbody>
<tr><td>XS</td><td>86 cm / 34"</td><td>71 cm / 28"</td></tr>
<tr><td>S</td><td>94 cm / 37"</td><td>79 cm / 31"</td></tr>
<tr><td>M</td><td>102 cm / 40"</td><td>87 cm / 34"</td></tr>
<tr><td>L</td><td>110 cm / 43"</td><td>95 cm / 37"</td></tr>
<tr><td>XL</td><td>118 cm / 46.5"</td><td>103 cm / 40.5"</td></tr>
<tr><td>XXL</td><td>126 cm / 49.5"</td><td>111 cm / 43.5"</td></tr></tbody></table>
<p class="meta mt3">Footwear: men's US 7–13 · women's US 5–11 · youth 1–6 · kids 4–8. If between sizes on trail shoes, size up half — feet swell on descents.</p>`);

ROUTES['accessibility'] = page('ACCESSIBILITY.', 'Our standard', `<div class="prose">
<p>Built to <b>WCAG 2.1 AA intent</b>: keyboard-navigable menus and drawers, visible focus rings (flame, always), descriptive alt text on every image, reduced-motion support honored system-wide, form labels never relying on placeholders.</p>
<p>Found a barrier? That's a defect. Report it via <a href="#/contact" style="text-decoration:underline">contact</a> and it goes on the same board as any product bug.</p></div>`);

ROUTES['privacy'] = page('PRIVACY.', 'Consent-first by design', `<div class="flag-note"><b>Prototype:</b> this build transmits nothing. Live build ships with consent interfaces drafted for legal review.</div>
<div class="prose"><p>We collect the minimum: cart contents (local), newsletter email (if you give it), and order details when you order. No sold data, ever. Cookies used only where they matter; the consent banner will say exactly what and why.</p></div>`);

ROUTES['terms'] = page('TERMS.', 'Prototype notice', `<div class="prose"><p>This website is a launch prototype: prices, products, and availability are samples; no orders are fulfilled from it. Full terms of sale, privacy policy, and warranty documents will be published before live commerce opens.</p></div>`);

ROUTES['notfound'] = page('LOST THE ROUTE.', '404 — no dead links in a launch world', `<div class="empty"><div class="big">ROUTE NOT FOUND</div><p>Even the crew takes a wrong turn. Back to the trailhead.</p><button class="btn btn-solid mt3" onclick="location.hash='#/'">Back to Home</button></div>`);

/* ============ BOOT ============ */
document.addEventListener('DOMContentLoaded', () => {
  $('#root').innerHTML = headerHTML() + `<main id="app" tabindex="-1"></main>` + footerHTML() + mnavHTML() + cartDrawerHTML() + modalsHTML() + `<div class="toast" id="toast" role="status"></div>`;
  route();
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
});
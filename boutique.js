/* ══════════════════════════════════════════════
   TRADISCOUT — JavaScript Boutique
   ══════════════════════════════════════════════ */

/* ─── Données produits ────────────────────────── */
const DESIGNS = {
  '1': "« Laisse Dieu agir,\net agis avec Dieu. »",
  '2': "« Toujours prêt,\ntoujours debout. »",
  '3': "« Per aspera\nad astra. »",
  '4': "« Verso l'Alto —\ntoujours plus haut. »"
};
const DESIGN_SHORT = {
  '1': 'Laisse Dieu agir…',
  '2': 'Toujours prêt…',
  '3': 'Per aspera ad astra',
  '4': "Verso l'Alto"
};
const LABELS = { tshirt: 'T-Shirt', sweat: 'Sweat', hoodie: 'Hoodie' };

const SVG_TSHIRT = `<svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="garment-path" d="M60 20 L20 60 L50 75 L50 200 L150 200 L150 75 L180 60 L140 20 L115 40 C110 50 90 50 85 40 Z" stroke-width="1.5"/></svg>`;
const SVG_SWEAT  = `<svg viewBox="0 0 200 230" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="garment-path" d="M60 25 L15 70 L45 82 L45 210 L155 210 L155 82 L185 70 L140 25 L118 45 C113 56 87 56 82 45 Z" stroke-width="1.5"/><path class="garment-path" d="M45 210 L45 220 L65 220 L65 210" stroke-width="1"/><path class="garment-path" d="M155 210 L155 220 L135 220 L135 210" stroke-width="1"/></svg>`;
const SVG_HOODIE = `<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="garment-path" d="M60 30 L15 75 L45 88 L45 215 L155 215 L155 88 L185 75 L140 30 C130 20 115 15 100 15 C85 15 70 20 60 30 Z" stroke-width="1.5"/><path class="garment-path" d="M85 30 Q100 55 115 30" stroke-width="1" fill="none"/><path class="garment-path" d="M80 215 L80 230 L120 230 L120 215" stroke-width="1"/><path class="garment-path" d="M45 215 L45 225 L65 225 L65 215" stroke-width="1"/><path class="garment-path" d="M155 215 L155 225 L135 225 L135 215" stroke-width="1"/></svg>`;
const SVGS = { tshirt: SVG_TSHIRT, sweat: SVG_SWEAT, hoodie: SVG_HOODIE };

/* ─── État ────────────────────────────────────── */
const state = { type: null, size: null, color: null, design: null, price: null };
let cart = [];

/* ─── Sélection d'options ─────────────────────── */
function selectOption(category, btn) {
  btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  if (category === 'type')   { state.type = btn.dataset.type; state.price = parseInt(btn.dataset.price); }
  else if (category === 'size')   state.size   = btn.dataset.size;
  else if (category === 'color')  state.color  = btn.dataset.color;
  else if (category === 'design') state.design = btn.dataset.design;
  updatePreview();
  updateCTA();
}

function updatePreview() {
  const visual     = document.getElementById('garmentVisual');
  const shape      = document.getElementById('garmentShape');
  const designPrev = document.getElementById('designPreview');
  const label      = document.getElementById('garmentLabel');
  const priceDisp  = document.getElementById('priceDisplay');
  if (!visual) return;

  visual.className = 'garment-visual' + (state.color ? ' ' + state.color : '');
  if (state.type) {
    shape.innerHTML = SVGS[state.type];
    shape.className = 'garment-shape' + (state.color ? ' shape-fill-' + state.color : '');
    label.textContent    = LABELS[state.type];
    priceDisp.textContent = state.price + ' €';
  } else {
    label.textContent    = '—';
    priceDisp.textContent = '—';
  }
  designPrev.innerHTML = state.design
    ? DESIGNS[state.design].replace('\n', '<br>')
    : 'Sélectionnez<br>un design';
}

function updateCTA() {
  const btn = document.getElementById('addBtn');
  const msg = document.getElementById('missingMsg');
  if (!btn) return;
  const ok  = state.type && state.size && state.color && state.design;
  btn.disabled = !ok;
  if (ok) {
    msg.textContent = '';
  } else {
    const missing = ['type','size','color','design'].filter(k => !state[k]);
    const labels  = { type: 'vêtement', size: 'taille', color: 'couleur', design: 'design' };
    msg.textContent = 'Manque : ' + missing.map(k => labels[k]).join(', ');
  }
}

/* ─── Panier ──────────────────────────────────── */
function addToCart() {
  const item = {
    id: Date.now(),
    type: state.type, size: state.size, color: state.color, design: state.design,
    price: state.price, label: LABELS[state.type], designShort: DESIGN_SHORT[state.design]
  };
  cart.push(item);
  renderCart();
  showShopToast(`${item.label} ajouté au panier`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

function renderCart() {
  const container  = document.getElementById('shopCartItems');
  const total      = cart.reduce((s, i) => s + i.price, 0);
  const countBadge = document.getElementById('cartCount');
  const totalEl    = document.getElementById('shopCartTotal');
  const checkoutEl = document.getElementById('shopCheckoutBtn');

  if (countBadge) countBadge.textContent = cart.length;
  if (totalEl)    totalEl.textContent    = total + ' €';
  if (checkoutEl) checkoutEl.disabled   = cart.length === 0;

  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = '<div class="cart-empty">Panier vide</div>';
    return;
  }
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <div class="item-name">${item.label}</div>
        <div class="item-details">
          Taille : ${item.size}<br>
          Couleur : ${item.color.charAt(0).toUpperCase() + item.color.slice(1)}<br>
          Design : ${item.designShort}
        </div>
      </div>
      <div>
        <div class="item-price">${item.price} €</div>
        <button class="item-remove" onclick="removeFromCart(${item.id})">✕ retirer</button>
      </div>
    </div>
  `).join('');
}

function openCart() {
  document.getElementById('shopCartOverlay')?.classList.add('open');
  document.getElementById('shopCartDrawer')?.classList.add('open');
}
function closeCart() {
  document.getElementById('shopCartOverlay')?.classList.remove('open');
  document.getElementById('shopCartDrawer')?.classList.remove('open');
}

function showShopToast(msg) {
  const t = document.getElementById('shopToast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

/* ─── Checkout Stripe ─────────────────────────── */
async function goToCheckout() {
  if (cart.length === 0) return;
  const btn = document.getElementById('shopCheckoutBtn');
  btn.classList.add('loading');
  btn.disabled = true;

  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur serveur');
    }
    const { url } = await res.json();
    window.location.href = url;
  } catch (e) {
    alert('Erreur : ' + e.message);
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

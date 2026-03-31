/* ══════════════════════════════════════════════
   TRADISCOUT — JavaScript principal
   ══════════════════════════════════════════════ */

/* ─── Loader ──────────────────────────────────── */
const text = "TRADISCOUT";
const target = document.getElementById('typewriter');
let i = 0;

function type() {
  if (i < text.length) {
    target.innerText += text.charAt(i);
    i++;
    target.style.width = 'auto';
    setTimeout(type, 120);
  } else {
    setTimeout(() => {
      document.getElementById('loader').style.opacity = '0';
      document.getElementById('main-content').style.opacity = '1';
      setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
      }, 600);
    }, 800);
  }
}

window.addEventListener('load', () => { setTimeout(type, 500); });

/* ─── Navigation principale ───────────────────── */
function show(id) {
  document.querySelectorAll('.tab').forEach(t => t.style.display = 'none');
  document.getElementById(id).style.display = 'block';

  // Mise à jour du logo
  const logo = document.getElementById('main-logo');
  const titles = {
    rejoindre: "rejoins-nous!",
    boutique:  "boutique",
    code:      "codes",
    contact:   "contact",
  };
  logo.innerText = titles[id] || "TRADISCOUT";

  // Lien actif dans la nav
  document.querySelectorAll('.main-nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.tab === id);
  });

  // Affichage bouton panier si boutique
  const cartBtn = document.getElementById('cart-header-btn');
  if (cartBtn) {
    cartBtn.classList.toggle('visible', id === 'boutique');
  }

  window.scrollTo(0, 0);
}

/* ─── Sous-onglets code ───────────────────────── */
function showCodeTab(id, btn) {
  document.querySelectorAll('.code-tab').forEach(t => t.style.display = 'none');
  document.getElementById(id).style.display = 'block';
  document.querySelectorAll('.code-nav button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

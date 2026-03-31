/* ══════════════════════════════════════════════
   TRADISCOUT — Contact (Supabase)
   ══════════════════════════════════════════════ */

/* Supabase est chargé via CDN dans index.html et initialisé ici */
const SUPABASE_URL      = "https://tuqsimojpkcodshueizo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_TzeZGiGoTQgRhFJvekwf0w_D_Jf7NFA";
const supabaseClient    = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ─── Formulaire contact ──────────────────────── */
const contactForm   = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email   = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;
    const btn     = document.getElementById('contact-submit');

    btn.disabled  = true;
    btn.innerText = "Envoi en cours…";

    try {
      const { error } = await supabaseClient
        .from('contacts')
        .insert([{ email, message }]);

      if (error) throw error;

      contactStatus.style.color = "green";
      contactStatus.innerText   = "Message bien reçu ! On vous répond au plus vite.";
      contactForm.reset();
    } catch (err) {
      console.error(err);
      contactStatus.style.color = "red";
      contactStatus.innerText   = "Erreur, merci de réessayer plus tard.";
    } finally {
      btn.disabled  = false;
      btn.innerText = "Envoyer le message";
    }
  });
}

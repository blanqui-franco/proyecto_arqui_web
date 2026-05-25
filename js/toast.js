/* ═══════════════════════════════════════════════════════════
   TOAST — Che rembi'u
   Notificación flotante no intrusiva.
═══════════════════════════════════════════════════════════ */

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.style.display = 'block';

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.style.display = 'none';
  }, 2500);
}

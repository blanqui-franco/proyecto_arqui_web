/* ═══════════════════════════════════════════════════════════
   ROUTER — Che rembi'u
   Navegación entre vistas de la SPA + bind de botones de nav.
═══════════════════════════════════════════════════════════ */

function showView(viewId) {
  /* Ocultar todas las vistas y mostrar la solicitada */
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });

  const target = document.getElementById(viewId);
  if (target) target.classList.add('active');

  /* Actualizar estado activo y aria-current en nav */
  document.querySelectorAll('nav .nav-btn').forEach(btn => {
    const isActive = btn.dataset.navigate === viewId;
    btn.classList.toggle('active', isActive);
    if (isActive) {
      btn.setAttribute('aria-current', 'page');
    } else {
      btn.removeAttribute('aria-current');
    }
  });

  /* Lógica de entrada por vista */
  if (viewId === 'recipesView') {
    if (!recipesLoaded) {
      loadAllRecipes();
    } else {
      renderRecipes();
    }
  }
  if (viewId === 'favoritesView') renderFavorites();
  if (viewId === 'historyView')   renderHistory();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Bind de todos los botones con data-navigate */
document.querySelectorAll('[data-navigate]').forEach(btn => {
  btn.addEventListener('click', () => showView(btn.dataset.navigate));
});

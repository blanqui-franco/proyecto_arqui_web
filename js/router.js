/* ═══════════════════════════════════════════════════════════
   ROUTER — Che rembi'u
   Navegación entre vistas de la SPA.
═══════════════════════════════════════════════════════════ */

function showView(viewId) {
  document.querySelectorAll('.view').forEach(function (view) {
    view.classList.remove('active');
  });

  var target = document.getElementById(viewId);
  if (target) target.classList.add('active');

  /* Actualizar estado activo en nav links */
  document.querySelectorAll('.nav-link[data-navigate]').forEach(function (link) {
    var isActive = link.dataset.navigate === viewId;
    link.classList.toggle('active', isActive);
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

/* Bind de todos los elementos con data-navigate */
document.querySelectorAll('[data-navigate]').forEach(function (el) {
  el.addEventListener('click', function () {
    showView(el.dataset.navigate);
  });
});

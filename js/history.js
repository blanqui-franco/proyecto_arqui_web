/* ═══════════════════════════════════════════════════════════
   HISTORY — Che rembi'u
═══════════════════════════════════════════════════════════ */

async function renderHistory() {
  var container = document.getElementById('historyList');
  var loadingEl = document.getElementById('historyLoading');
  var errorEl   = document.getElementById('historyError');
  if (!container) return;

  if (loadingEl) loadingEl.classList.add('active');
  if (errorEl)   { errorEl.classList.remove('active'); errorEl.textContent = ''; }
  container.innerHTML = '';

  try {
    var history = await API.getHistory();
    if (loadingEl) loadingEl.classList.remove('active');

    if (!history.length) {
      container.innerHTML = _emptyHistoryState();
      return;
    }

    container.innerHTML = history.map(function (item, index) {
      var chips = (item.ingredients || '').split(',').map(function (ing) {
        var t = ing.trim();
        return t ? '<span class="bg-secondary-container text-on-secondary-container px-sm py-1 rounded-full text-caption font-medium">' + t + '</span>' : '';
      }).join('');

      return (
        '<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col md:flex-row md:items-center justify-between gap-md hover:border-primary transition-colors">' +
          '<div class="flex-grow">' +
            '<div class="flex items-center gap-xs mb-sm">' +
              '<span class="material-symbols-outlined text-primary" style="font-size:20px">restaurant_menu</span>' +
              '<h3 class="text-title-md text-on-surface">Búsqueda #' + (index + 1) + '</h3>' +
            '</div>' +
            '<div class="flex flex-wrap gap-xs mb-sm">' + chips + '</div>' +
            '<div class="flex items-center gap-md text-caption text-on-surface-variant">' +
              (item.date ? '<span class="flex items-center gap-1"><span class="material-symbols-outlined" style="font-size:16px">calendar_today</span> ' + item.date + '</span>' : '') +
              (item.results !== undefined ? '<span class="flex items-center gap-1"><span class="material-symbols-outlined" style="font-size:16px">fact_check</span> ' + item.results + ' resultado(s)</span>' : '') +
            '</div>' +
          '</div>' +
          '<div class="flex items-center gap-sm flex-shrink-0">' +
            '<button class="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-sm font-bold hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 flex items-center gap-xs" onclick="repeatSearch(\'' + (item.ingredients || '') + '\')">' +
              '<span class="material-symbols-outlined" style="font-size:18px">refresh</span>' +
              'Repetir' +
            '</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');

  } catch (err) {
    if (loadingEl) loadingEl.classList.remove('active');
    if (errorEl) {
      errorEl.textContent = 'No se pudo cargar el historial. Verificá que el servicio esté activo en el puerto 3003.';
      errorEl.classList.add('active');
    }
  }
}

function _emptyHistoryState() {
  return (
    '<div class="flex flex-col items-center justify-center py-xl text-center">' +
      '<div class="bg-surface-container-high p-lg rounded-full mb-md">' +
        '<span class="material-symbols-outlined text-primary" style="font-size:64px">history_off</span>' +
      '</div>' +
      '<h2 class="text-title-md text-on-surface">Tu historial está vacío</h2>' +
      '<p class="text-body-md text-on-surface-variant max-w-sm mx-auto mt-xs">Empezá a buscar nuevas recetas y aparecerán aquí.</p>' +
      '<button class="mt-lg bg-primary text-on-primary px-xl py-md rounded-xl text-label-sm font-bold hover:opacity-90 transition-all" onclick="showView(\'searchView\')">Buscar recetas</button>' +
    '</div>'
  );
}

async function clearHistory() {
  try {
    await API.clearHistory();
    showToast('Historial limpiado.');
    renderHistory();
  } catch {
    showToast('No se pudo limpiar el historial. Verificá que el servicio esté activo.');
  }
}

function repeatSearch(ingredientsStr) {
  if (typeof searchIngredients !== 'undefined') {
    searchIngredients = [];
  }
  var parts = ingredientsStr.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  parts.forEach(function (ing) {
    if (typeof addIngredientChip === 'function') addIngredientChip(ing);
  });
  showView('searchView');
}

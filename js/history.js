/* ═══════════════════════════════════════════════════════════
   HISTORY — Che rembi'u
   Renderizado y limpieza del historial de búsquedas.
   Consume history-service vía api.js.
═══════════════════════════════════════════════════════════ */

async function renderHistory() {
  const container = document.getElementById('historyList');
  const loadingEl = document.getElementById('historyLoading');
  const errorEl   = document.getElementById('historyError');

  if (!container) return;

  if (loadingEl)  loadingEl.classList.add('active');
  if (errorEl) {
    errorEl.classList.remove('active');
    errorEl.textContent = '';
  }
  container.innerHTML = '';

  try {
    const history = await API.getHistory();

    if (loadingEl) loadingEl.classList.remove('active');

    if (!history.length) {
      container.innerHTML =
        '<div class="empty-state card">Todavía no hay búsquedas registradas.</div>';
      return;
    }

    container.innerHTML = history.map(function (item) {
      return (
        '<div class="history-item">' +
          '<div>' +
            '<strong>' + (item.ingredients || '') + '</strong>' +
            '<p>' + (item.date || '') +
              (item.date && item.results !== undefined ? ' · ' : '') +
              (item.results !== undefined ? item.results + ' resultado(s)' : '') +
            '</p>' +
          '</div>' +
          '<span class="badge green">Búsqueda</span>' +
        '</div>'
      );
    }).join('');

  } catch (err) {
    if (loadingEl) loadingEl.classList.remove('active');
    if (errorEl) {
      errorEl.textContent =
        'No se pudo cargar el historial. ' +
        'Verificá que el servicio esté activo en el puerto 3003.';
      errorEl.classList.add('active');
    }
  }
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

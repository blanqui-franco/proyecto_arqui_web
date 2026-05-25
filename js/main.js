/* ═══════════════════════════════════════════════════════════
   MAIN — Che rembi'u
   Inicialización de la app y event listeners globales.
   Carga en último lugar; todos los módulos ya están disponibles.
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async function () {
  /* ── 1. Inicializar módulos ────────────────────────── */
  initImageHandler();

  /* ── 2. Cargar conteo inicial de recetas (hero stat) ─ */
  try {
    const recipes = await API.getRecipes();
    allRecipesCache = recipes;

    const totalEl = document.getElementById('totalRecipes');
    if (totalEl) totalEl.textContent = recipes.length;
  } catch {
    const totalEl = document.getElementById('totalRecipes');
    if (totalEl) totalEl.textContent = '?';
  }

  /* ── 3. Formulario de búsqueda ─────────────────────── */
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      handleSearch();
    });

    /* type="reset" limpia el form; aquí limpiamos el resto del UI */
    searchForm.addEventListener('reset', function () {
      const errorEl = document.getElementById('ingredientError');
      if (errorEl) errorEl.style.display = 'none';

      const detectedEl = document.getElementById('detectedIngredients');
      if (detectedEl) {
        detectedEl.innerHTML = '<span class="badge gray">Sin detección todavía</span>';
      }

      const previewEl = document.getElementById('imagePreview');
      if (previewEl) {
        previewEl.innerHTML = '<p>Subí una imagen para verla aquí.</p>';
      }

      showToast('Formulario limpiado.');
    });
  }

  /* ── 4. Delegación de eventos para data-action ─────── */
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    switch (btn.dataset.action) {
      case 'simulate-detection':
        simulateImageDetection();
        break;

      case 'load-demo':
        loadDemoIngredients();
        break;

      case 'clear-favorites':
        clearFavorites();
        break;

      case 'clear-history':
        clearHistory();
        break;

      case 'toggle-favorite-detail':
        if (selectedRecipeId !== null) toggleFavorite(selectedRecipeId);
        break;
    }
  });

  /* ── 5. Filtros de la vista Recetas ─────────────────── */
  ['textFilter', 'difficultyFilter', 'categoryFilter', 'timeFilter'].forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input',  renderRecipes);
    el.addEventListener('change', renderRecipes);
  });
});

/* ══════════════════════════════════════════════════════
   BÚSQUEDA POR INGREDIENTES
══════════════════════════════════════════════════════ */

async function handleSearch() {
  const inputEl  = document.getElementById('ingredientsInput');
  const errorEl  = document.getElementById('ingredientError');
  const rawInput = inputEl ? inputEl.value : '';

  const ingredients = rawInput
    .split(',')
    .map(function (item) { return normalize(item); })
    .filter(Boolean);

  if (!ingredients.length) {
    if (errorEl) errorEl.style.display = 'block';
    return;
  }
  if (errorEl) errorEl.style.display = 'none';

  try {
    const results = await API.searchByIngredients(ingredients);
    visibleRecipes = results;
    recipesLoaded  = true;

    /* Guardar en historial (no bloquear si falla) */
    API.saveHistory({
      ingredients: rawInput.trim(),
      results:     results.length,
      date:        new Date().toLocaleString('es-PY')
    }).catch(function () {});

    showToast('Sugerencias generadas desde el servicio de búsqueda.');
    showView('recipesView');

  } catch {
    showToast(
      'No se pudo conectar al servicio de búsqueda. ' +
      'Verificá que docker compose esté activo en el puerto 3002.'
    );
  }
}

/* ══════════════════════════════════════════════════════
   ACCIONES AUXILIARES
══════════════════════════════════════════════════════ */

function loadDemoIngredients() {
  const demo = ['huevo', 'queso Paraguay', 'harina', 'leche'];

  const inputEl = document.getElementById('ingredientsInput');
  if (inputEl) inputEl.value = demo.join(', ');

  const errorEl = document.getElementById('ingredientError');
  if (errorEl) errorEl.style.display = 'none';

  const detectedEl = document.getElementById('detectedIngredients');
  if (detectedEl) {
    detectedEl.innerHTML = demo
      .map(function (i) { return '<span class="badge">' + i + '</span>'; })
      .join('');
  }

  showToast('Ingredientes de ejemplo cargados.');
}

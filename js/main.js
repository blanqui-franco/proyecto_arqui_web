/* ═══════════════════════════════════════════════════════════
   MAIN — Che rembi'u
   Inicialización y manejo del sistema de ingredientes.
═══════════════════════════════════════════════════════════ */

var searchIngredients = [];

document.addEventListener('DOMContentLoaded', async function () {

  /* ── 1. Conteo inicial de recetas (hero stat) ── */
  try {
    var recipes = await API.getRecipes();
    allRecipesCache = recipes;
    var totalEl = document.getElementById('totalRecipes');
    if (totalEl) totalEl.textContent = recipes.length;
    renderFeaturedRecipes(recipes);
  } catch (e) {
    var totalEl = document.getElementById('totalRecipes');
    if (totalEl) totalEl.textContent = '?';
  }

  /* ── 2. Input de ingredientes ── */
  var input    = document.getElementById('ingredientInput');
  var addBtn   = document.getElementById('addIngredientBtn');
  var searchBtn = document.getElementById('searchBtn');

  if (addBtn) {
    addBtn.addEventListener('click', function () {
      addIngredientChip(input ? input.value : '');
    });
  }

  if (input) {
    input.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') addIngredientChip(input.value);
    });
  }

  document.querySelectorAll('.suggestion-chip').forEach(function (btn) {
    btn.addEventListener('click', function () {
      addIngredientChip(btn.textContent.trim());
    });
  });

  if (searchBtn) {
    searchBtn.addEventListener('click', function () {
      handleSearch();
    });
  }

  var suggestBtn = document.getElementById('suggestBtn');
  if (suggestBtn) {
    suggestBtn.addEventListener('click', function () {
      handleSuggestion();
    });
  }

  /* ── 3. Hero search ── */
  var heroBtn   = document.getElementById('heroSearchBtn');
  var heroInput = document.getElementById('heroSearchInput');

  if (heroBtn) {
    heroBtn.addEventListener('click', function () {
      var raw = heroInput ? heroInput.value.trim() : '';
      if (raw) {
        searchIngredients = [];
        raw.split(',').forEach(function (part) { addIngredientChip(part.trim()); });
        if (heroInput) heroInput.value = '';
        showView('searchView');
      } else {
        showView('searchView');
      }
    });
  }

  if (heroInput) {
    heroInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') heroBtn && heroBtn.click();
    });
  }

  initImageHandler();

  /* ── 4. Delegación de eventos data-action ── */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    switch (btn.dataset.action) {
      case 'clear-ingredients':
        clearIngredients();
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

  /* ── 5. Filtros en vista Recetas ── */
  ['textFilter', 'difficultyFilter', 'categoryFilter', 'timeFilter'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input',  renderRecipes);
    el.addEventListener('change', renderRecipes);
  });
});

/* ══════════════════════════════════════════════════════
   CHIP SYSTEM
══════════════════════════════════════════════════════ */

function addIngredientChip(val) {
  var clean = val.trim().toLowerCase();
  if (!clean) return;
  if (searchIngredients.includes(clean)) {
    showToast('Ese ingrediente ya fue agregado.');
    return;
  }
  searchIngredients.push(clean);
  _updateChipsUI();

  var input = document.getElementById('ingredientInput');
  if (input) { input.value = ''; input.focus(); }

  var errEl = document.getElementById('ingredientError');
  if (errEl) errEl.style.display = 'none';
}

function removeIngredientChip(index) {
  searchIngredients.splice(index, 1);
  _updateChipsUI();
}

function _updateChipsUI() {
  var list      = document.getElementById('ingredientsList');
  var emptyState = document.getElementById('ingredientsEmptyState');
  var counter   = document.getElementById('ingredientCounter');
  var searchBtn = document.getElementById('searchBtn');

  if (!list) return;

  /* Quitar chips existentes */
  list.querySelectorAll('.ing-chip').forEach(function (el) { el.remove(); });

  if (searchIngredients.length > 0) {
    if (emptyState) emptyState.style.display = 'none';
  } else {
    if (emptyState) emptyState.style.display = '';
  }

  searchIngredients.forEach(function (ing, index) {
    var chip = document.createElement('div');
    chip.className = 'ing-chip chip-anim flex items-center gap-xs bg-white border border-secondary-container px-md py-sm rounded-full text-body-md text-primary shadow-sm';
    chip.innerHTML =
      '<span>' + ing + '</span>' +
      '<button onclick="removeIngredientChip(' + index + ')" class="material-symbols-outlined text-outline hover:text-error transition-colors" style="font-size:18px">close</button>';
    list.appendChild(chip);
  });

  if (counter) counter.textContent = searchIngredients.length;
  if (searchBtn) searchBtn.disabled = searchIngredients.length === 0;
  var suggestBtn = document.getElementById('suggestBtn');
  if (suggestBtn) suggestBtn.disabled = searchIngredients.length === 0;

  /* Actualizar barra de ingredientes activos en recipesView */
  _updateActiveIngredientsBar();
}

async function handleSuggestion() {
  if (!searchIngredients.length) return;

  var suggestBtn = document.getElementById('suggestBtn');
  var panel = document.getElementById('suggestionPanel');

  if (suggestBtn) {
    suggestBtn.disabled = true;
    suggestBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Generando…';
  }
  if (panel) { panel.style.display = 'none'; panel.textContent = ''; }

  try {
    var res = await API.getSuggestion(searchIngredients);
    var text = res.suggestion || res.message || JSON.stringify(res);
    var ids  = Array.isArray(res.recipeIds) ? res.recipeIds : [];
    var newCount = res.newCount || 0;

    if (newCount > 0) {
      try { var fresh = await API.getRecipes(); allRecipesCache = fresh; } catch (e) {}
    }

    if (panel) {
      var label = ids.length > 0
        ? 'Ver receta' + (ids.length > 1 ? 's' : '') + ' sugerida' + (ids.length > 1 ? 's' : '') +
          (newCount > 0 ? ' (' + newCount + ' nueva' + (newCount > 1 ? 's' : '') + ')' : '')
        : '';
      var btnHtml = ids.length > 0
        ? '<button onclick="showSuggestedRecipes([' + ids.join(',') + '])" ' +
            'class="mt-sm w-full bg-primary text-on-primary py-sm rounded-lg font-bold text-label-sm hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-xs">' +
            '<span class="material-symbols-outlined" style="font-size:18px">restaurant_menu</span> ' + label + '</button>'
        : '';
      panel.innerHTML = '<p style="white-space:pre-wrap">' + text + '</p>' + btnHtml;
      panel.style.display = '';
    }
    showToast(newCount > 0 ? newCount + ' receta(s) nueva(s) guardada(s) en la BD.' : 'Sugerencia generada por la IA.');
  } catch (err) {
    console.error('handleSuggestion error', err);
    showToast('No se pudo obtener la sugerencia IA. Verificá que el servicio esté en el puerto 3005.');
  } finally {
    if (suggestBtn) { suggestBtn.disabled = searchIngredients.length === 0; suggestBtn.innerHTML = 'Sugerencia IA'; }
  }
}

function _updateActiveIngredientsBar() {
  var bar       = document.getElementById('activeIngredientsBar');
  var chipsArea = document.getElementById('activeIngredientChips');
  if (!bar || !chipsArea) return;

  if (searchIngredients.length > 0) {
    bar.classList.remove('hidden');
    chipsArea.innerHTML = searchIngredients.map(function (ing) {
      return '<span class="inline-flex items-center gap-xs px-sm py-1 bg-primary-container text-on-primary-container rounded-full text-label-sm">' + ing + '</span>';
    }).join('');
  } else {
    bar.classList.add('hidden');
  }
}

/* ══════════════════════════════════════════════════════
   BÚSQUEDA POR INGREDIENTES
══════════════════════════════════════════════════════ */

async function handleSearch() {
  var errEl = document.getElementById('ingredientError');

  if (!searchIngredients.length) {
    if (errEl) errEl.style.display = 'block';
    return;
  }
  if (errEl) errEl.style.display = 'none';

  var searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Buscando…';
    searchBtn.disabled = true;
  }

  try {
    var results = await API.searchByIngredients(searchIngredients);
    visibleRecipes = results;
    recipesLoaded  = true;

    API.saveHistory({
      ingredients: searchIngredients.join(', '),
      results:     results.length,
      date:        new Date().toLocaleString('es-PY')
    }).catch(function () {});

    showToast('Sugerencias generadas desde el servicio de búsqueda.');
    showView('recipesView');

  } catch (e) {
    showToast(
      'No se pudo conectar al servicio de búsqueda. ' +
      'Verificá que docker compose esté activo en el puerto 3002.'
    );
  } finally {
    if (searchBtn) {
      searchBtn.innerHTML = 'Ver recetas sugeridas';
      searchBtn.disabled = searchIngredients.length === 0;
    }
  }
}

/* ══════════════════════════════════════════════════════
   ACCIONES AUXILIARES
══════════════════════════════════════════════════════ */

async function showSuggestedRecipes(ids) {
  var matched = allRecipesCache.filter(function (r) { return ids.includes(r.id); });
  if (matched.length < ids.length) {
    try { var fresh = await API.getRecipes(); allRecipesCache = fresh; matched = fresh.filter(function (r) { return ids.includes(r.id); }); } catch (_) {}
  }
  visibleRecipes = matched.length > 0 ? matched : allRecipesCache;
  recipesLoaded = true;
  showView('recipesView');
}

function clearIngredients() {
  searchIngredients = [];
  _updateChipsUI();
  showToast('Ingredientes limpiados.');
}

function loadDemoIngredients() {
  searchIngredients = [];
  ['huevo', 'queso paraguay', 'harina', 'leche'].forEach(function (ing) {
    addIngredientChip(ing);
  });
  showToast('Ingredientes de ejemplo cargados.');
}

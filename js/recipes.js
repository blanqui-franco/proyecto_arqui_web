/* ═══════════════════════════════════════════════════════════
   RECIPES — Che rembi'u
   Renderizado de grilla y detalle de recetas.
═══════════════════════════════════════════════════════════ */

var visibleRecipes   = [];
var allRecipesCache  = [];
var selectedRecipeId = null;
var recipesLoaded    = false;

/* ── Helpers de loading/error ─────────────────────────── */

function _setLoadingUI(show) {
  var loadingEl = document.getElementById('recipesLoading');
  var gridEl    = document.getElementById('recipesGrid');
  var errorEl   = document.getElementById('recipesError');

  if (show) {
    if (loadingEl) loadingEl.classList.add('active');
    if (gridEl)    gridEl.style.display = 'none';
    if (errorEl)   { errorEl.classList.remove('active'); errorEl.textContent = ''; }
  } else {
    if (loadingEl) loadingEl.classList.remove('active');
    if (gridEl)    gridEl.style.display = '';
  }
}

function _showRecipesError(message) {
  var errorEl = document.getElementById('recipesError');
  if (errorEl) { errorEl.textContent = message; errorEl.classList.add('active'); }
}

/* ── Carga inicial ────────────────────────────────────── */

async function loadAllRecipes() {
  _setLoadingUI(true);
  try {
    var data = await API.getRecipes();
    allRecipesCache = data;
    visibleRecipes  = data.slice();
    recipesLoaded   = true;
    _setLoadingUI(false);
    renderRecipes();
  } catch (err) {
    _setLoadingUI(false);
    _showRecipesError(
      'No se pudo conectar con el servicio de recetas. ' +
      'Verificá que docker compose esté activo en el puerto 3001.'
    );
  }
}

/* ── Helpers visuales ─────────────────────────────────── */

function _catClass(category) {
  var map = { 'Tradicional': 'cat-Tradicional', 'Rápida': 'cat-Rápida', 'Económica': 'cat-Económica', 'Postre': 'cat-Postre' };
  return map[category] || 'cat-default';
}

function _catEmoji() {
  return '';
}

/* ── Renderizado de la grilla ─────────────────────────── */

function renderRecipes() {
  if (!recipesLoaded) return;

  var text       = normalize(document.getElementById('textFilter').value || '');
  var difficulty = document.getElementById('difficultyFilter').value;
  var category   = document.getElementById('categoryFilter').value;
  var maxTime    = Number(document.getElementById('timeFilter').value || 0);

  var sorted = visibleRecipes.slice().sort(function (a, b) {
    return (b.match || 0) - (a.match || 0);
  });

  var filtered = sorted.filter(function (recipe) {
    var searchable = normalize(
      [recipe.name, recipe.category || '', (recipe.ingredients || []).join(' ')].join(' ')
    );
    var matchesText       = !text       || searchable.includes(text);
    var matchesDifficulty = !difficulty || recipe.difficulty === difficulty;
    var matchesCategory   = !category   || recipe.category   === category;
    var recipeTime        = recipe.time || recipe.timeMinutes || 0;
    var matchesTime       = !maxTime    || recipeTime <= maxTime;
    return matchesText && matchesDifficulty && matchesCategory && matchesTime;
  });

  var gridEl   = document.getElementById('recipesGrid');
  var emptyEl  = document.getElementById('emptyRecipes');
  var countEl  = document.getElementById('recipesCount');

  if (countEl) countEl.textContent = filtered.length + ' receta(s) encontrada(s)';

  if (gridEl) {
    gridEl.innerHTML = filtered.map(function (recipe) {
      var isFav  = Storage.isFavorite(recipe.id);
      var time   = recipe.time || recipe.timeMinutes || '?';
      var match  = recipe.match !== undefined ? recipe.match : null;
      var catCls = _catClass(recipe.category);
      var emoji  = _catEmoji(recipe.category);
      var favIcon = isFav ? 'favorite' : 'favorite';
      var favStyle = isFav ? "font-variation-settings:'FILL' 1;" : '';
      var favColor = isFav ? 'text-error' : 'text-on-surface-variant';

      return (
        '<article class="recipe-card group bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flat-shadow transition-all cursor-pointer" onclick="openRecipeDetail(' + recipe.id + ')">' +
          '<div class="relative aspect-[4/3] overflow-hidden ' + catCls + ' flex items-center justify-center">' +
            '<span class="text-white opacity-40 select-none" style="font-size:72px">' + emoji + '</span>' +
            (match !== null
              ? '<div class="absolute top-sm left-sm bg-primary px-sm py-xs rounded-lg text-on-primary text-label-sm font-bold">' + match + '% Match</div>'
              : '') +
            '<button class="absolute top-sm right-sm w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full ' + favColor + ' transition-colors hover:text-error" ' +
              'onclick="event.stopPropagation(); toggleFavorite(' + recipe.id + ')">' +
              '<span class="material-symbols-outlined" style="font-size:20px;' + favStyle + '">' + favIcon + '</span>' +
            '</button>' +
          '</div>' +
          '<div class="p-md">' +
            '<h3 class="text-title-md text-on-surface mb-xs">' + recipe.name + '</h3>' +
            '<div class="flex items-center gap-md text-on-surface-variant text-label-sm">' +
              '<span class="flex items-center gap-xs"><span class="material-symbols-outlined" style="font-size:18px">schedule</span> ' + time + ' min</span>' +
              '<span class="flex items-center gap-xs"><span class="material-symbols-outlined" style="font-size:18px">bar_chart</span> ' + (recipe.difficulty || '') + '</span>' +
            '</div>' +
            '<div class="mt-sm">' +
              '<span class="bg-surface-container text-on-secondary-fixed-variant px-sm py-1 rounded-lg text-caption">' + (recipe.category || '') + '</span>' +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  if (emptyEl) {
    emptyEl.style.display = filtered.length === 0 ? 'block' : 'none';
  }
}

/* ── Detalle de receta ────────────────────────────────── */

async function openRecipeDetail(id) {
  selectedRecipeId = id;
  showView('detailView');

  var loadingEl = document.getElementById('detailLoading');
  var errorEl   = document.getElementById('detailError');
  var contentEl = document.getElementById('detailContent');

  if (loadingEl) loadingEl.classList.add('active');
  if (errorEl)   { errorEl.classList.remove('active'); errorEl.textContent = ''; }
  if (contentEl) contentEl.style.display = 'none';

  try {
    var recipe = await API.getRecipeById(id);

    if (loadingEl) loadingEl.classList.remove('active');
    if (contentEl) contentEl.style.display = '';

    /* Imagen/placeholder */
    var imgEl = document.getElementById('detailImagePlaceholder');
    if (imgEl) {
      imgEl.className = 'w-full aspect-square flex items-center justify-center ' + _catClass(recipe.category);
      imgEl.innerHTML = '<span class="text-white opacity-40 select-none" style="font-size:96px">' + _catEmoji(recipe.category) + '</span>';
    }

    /* Meta */
    document.getElementById('detailTitle').textContent       = recipe.name;
    document.getElementById('detailDescription').textContent = recipe.description || '';
    document.getElementById('detailTime').textContent        = (recipe.time || recipe.timeMinutes || '?') + ' min';
    document.getElementById('detailDifficulty').textContent  = recipe.difficulty || '';
    document.getElementById('detailCategory').textContent    = recipe.category   || '';

    var matchEl    = document.getElementById('detailMatch');
    var matchBadge = document.getElementById('detailMatchBadge');
    if (recipe.match !== undefined) {
      if (matchEl)    matchEl.textContent = recipe.match;
      if (matchBadge) matchBadge.style.display = '';
    } else {
      if (matchBadge) matchBadge.style.display = 'none';
    }

    /* Ingredientes */
    var ingList = document.getElementById('detailIngredients');
    if (ingList) {
      var userIngs = typeof searchIngredients !== 'undefined' ? searchIngredients : [];
      ingList.innerHTML = (recipe.ingredients || []).map(function (ing) {
        var owned = userIngs.length > 0 && userIngs.some(function (u) {
          return normalize(ing).includes(normalize(u)) || normalize(u).includes(normalize(ing));
        });
        var iconColor = owned ? 'text-primary' : 'text-on-surface-variant';
        var iconFill  = owned ? "font-variation-settings:'FILL' 1;" : '';
        var icon      = owned ? 'check_circle' : 'radio_button_unchecked';
        return (
          '<li class="flex items-center gap-sm text-body-md text-on-surface border-b border-surface-variant pb-xs">' +
            '<span class="material-symbols-outlined ' + iconColor + '" style="font-size:20px;' + iconFill + '">' + icon + '</span>' +
            ing +
          '</li>'
        );
      }).join('');
    }

    /* Pasos */
    var stepsEl = document.getElementById('detailSteps');
    if (stepsEl) {
      stepsEl.innerHTML = (recipe.steps || []).map(function (step, i) {
        return (
          '<div class="flex gap-md">' +
            '<div class="flex-shrink-0 w-8 h-8 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center font-bold text-label-sm">' + (i + 1) + '</div>' +
            '<p class="text-body-md text-on-surface leading-relaxed">' + step + '</p>' +
          '</div>'
        );
      }).join('');
    }

    /* Historia */
    var historyEl   = document.getElementById('detailHistory');
    var historyCard = document.getElementById('detailHistoryCard');
    if (historyEl && historyCard) {
      if (recipe.history) {
        historyEl.textContent   = recipe.history;
        historyCard.style.display = '';
      } else {
        historyCard.style.display = 'none';
      }
    }

    _updateDetailFavButton(id);

  } catch (err) {
    if (loadingEl) loadingEl.classList.remove('active');
    if (errorEl) {
      errorEl.textContent = 'No se pudo cargar el detalle. Verificá la conexión con el servicio de recetas.';
      errorEl.classList.add('active');
    }
  }
}

function _updateDetailFavButton(id) {
  var btn = document.getElementById('favoriteDetailButton');
  if (!btn) return;
  var isFav = Storage.isFavorite(id);
  btn.innerHTML = isFav
    ? '<span class="material-symbols-outlined" style="font-variation-settings:\'FILL\' 1">favorite</span> Quitar de favoritos'
    : '<span class="material-symbols-outlined">favorite</span> Guardar en favoritos';
  btn.className = isFav
    ? 'w-full bg-secondary text-on-secondary py-sm rounded-lg font-bold text-title-md flex justify-center items-center gap-sm hover:opacity-90 transition-all active:scale-95'
    : 'w-full bg-primary text-on-primary py-sm rounded-lg font-bold text-title-md flex justify-center items-center gap-sm hover:opacity-90 transition-all active:scale-95';
  btn.setAttribute('data-action', 'toggle-favorite-detail');
}

/* ── Recetas destacadas (home) ────────────────────────── */

function renderFeaturedRecipes(recipes) {
  var grid = document.getElementById('featuredRecipesGrid');
  if (!grid) return;
  var featured = recipes.slice(0, 3);
  grid.innerHTML = featured.map(function (recipe) {
    var catCls = _catClass(recipe.category);
    var emoji  = _catEmoji(recipe.category);
    var time   = recipe.time || recipe.timeMinutes || '?';
    return (
      '<div class="recipe-card group bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flat-shadow transition-all cursor-pointer" onclick="openRecipeDetail(' + recipe.id + ')">' +
        '<div class="h-48 w-full overflow-hidden ' + catCls + ' flex items-center justify-center">' +
          '<span class="text-white opacity-40 select-none text-[64px] group-hover:scale-110 transition-transform duration-500">' + emoji + '</span>' +
        '</div>' +
        '<div class="p-md">' +
          '<div class="flex justify-between items-start mb-sm">' +
            '<h3 class="text-title-md text-on-surface">' + recipe.name + '</h3>' +
          '</div>' +
          '<div class="flex items-center gap-md text-on-surface-variant mb-md">' +
            '<div class="flex items-center gap-xs"><span class="material-symbols-outlined" style="font-size:18px">schedule</span><span class="text-caption">' + time + ' min</span></div>' +
            '<div class="flex items-center gap-xs"><span class="material-symbols-outlined" style="font-size:18px">bar_chart</span><span class="text-caption">' + (recipe.difficulty || '') + '</span></div>' +
          '</div>' +
          '<span class="bg-surface-container text-on-secondary-fixed-variant px-sm py-1 rounded-lg text-caption">' + (recipe.category || '') + '</span>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

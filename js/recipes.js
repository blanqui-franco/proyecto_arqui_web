/* ═══════════════════════════════════════════════════════════
   RECIPES — Che rembi'u
   Renderizado de la grilla y detalle de recetas.
   Consume los datos desde api.js.
═══════════════════════════════════════════════════════════ */

/* Estado compartido (accedido por favorites.js y main.js) */
var visibleRecipes  = [];
var allRecipesCache = [];
var selectedRecipeId = null;
var recipesLoaded   = false;

/* ── Helpers de UI ──────────────────────────────────────── */

function _setLoadingUI(show) {
  const loadingEl     = document.getElementById('recipesLoading');
  const tableWrapper  = document.getElementById('recipesTableWrapper');
  const errorEl       = document.getElementById('recipesError');

  if (show) {
    if (loadingEl)    loadingEl.classList.add('active');
    if (tableWrapper) tableWrapper.style.display = 'none';
    if (errorEl) {
      errorEl.classList.remove('active');
      errorEl.textContent = '';
    }
    /* Skeleton de carga en el cuerpo de la tabla */
    const tbody = document.getElementById('recipesTableBody');
    if (tbody) {
      tbody.innerHTML = Array(5).fill(
        '<tr class="skeleton-row">' +
        '<td></td><td></td><td></td><td></td><td></td><td></td>' +
        '</tr>'
      ).join('');
    }
  } else {
    if (loadingEl)    loadingEl.classList.remove('active');
    if (tableWrapper) tableWrapper.style.display = '';
  }
}

function _showRecipesError(message) {
  const errorEl = document.getElementById('recipesError');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('active');
  }
}

/* ── Carga inicial desde recipes-service ────────────────── */

async function loadAllRecipes() {
  _setLoadingUI(true);

  try {
    const data = await API.getRecipes();
    allRecipesCache = data;
    visibleRecipes  = [...data];
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

/* ── Renderizado de la tabla ────────────────────────────── */

function renderRecipes() {
  if (!recipesLoaded) return; /* loadAllRecipes se encarga */

  const text       = normalize(document.getElementById('textFilter').value || '');
  const difficulty = document.getElementById('difficultyFilter').value;
  const category   = document.getElementById('categoryFilter').value;
  const maxTime    = Number(document.getElementById('timeFilter').value || 0);

  const filtered = visibleRecipes.filter(function (recipe) {
    const searchable = normalize(
      [recipe.name, recipe.category || '', (recipe.ingredients || []).join(' ')].join(' ')
    );
    const matchesText       = !text       || searchable.includes(text);
    const matchesDifficulty = !difficulty || recipe.difficulty === difficulty;
    const matchesCategory   = !category   || recipe.category   === category;
    const recipeTime        = recipe.time || recipe.timeMinutes || 0;
    const matchesTime       = !maxTime    || recipeTime <= maxTime;
    return matchesText && matchesDifficulty && matchesCategory && matchesTime;
  });

  const tbody    = document.getElementById('recipesTableBody');
  const emptyEl  = document.getElementById('emptyRecipes');

  if (tbody) {
    tbody.innerHTML = filtered.map(function (recipe) {
      const isFav  = Storage.isFavorite(recipe.id);
      const time   = recipe.time || recipe.timeMinutes || '?';
      const match  = recipe.match !== undefined ? recipe.match + '%' : '—';
      const favCls = isFav ? 'btn-danger' : 'btn-secondary';
      const favTxt = isFav ? 'Quitar' : 'Favorito';

      return (
        '<tr>' +
          '<td><strong>' + recipe.name + '</strong><br>' +
            '<small>' + (recipe.description || '') + '</small></td>' +
          '<td><span class="badge green">' + (recipe.category || '') + '</span></td>' +
          '<td>' + time + ' min</td>' +
          '<td><span class="badge gray">' + (recipe.difficulty || '') + '</span></td>' +
          '<td><strong>' + match + '</strong></td>' +
          '<td>' +
            '<div class="actions-cell">' +
              '<button class="btn btn-primary" onclick="openRecipeDetail(' + recipe.id + ')">Ver detalle</button>' +
              '<button class="btn ' + favCls + '" onclick="toggleFavorite(' + recipe.id + ')">' + favTxt + '</button>' +
            '</div>' +
          '</td>' +
        '</tr>'
      );
    }).join('');
  }

  if (emptyEl) {
    if (filtered.length === 0) {
      emptyEl.removeAttribute('hidden');
    } else {
      emptyEl.setAttribute('hidden', '');
    }
  }
}

/* ── Detalle de receta ──────────────────────────────────── */

async function openRecipeDetail(id) {
  selectedRecipeId = id;
  showView('detailView');

  const loadingEl = document.getElementById('detailLoading');
  const errorEl   = document.getElementById('detailError');
  const contentEl = document.getElementById('detailContent');

  if (loadingEl)  loadingEl.classList.add('active');
  if (errorEl) {
    errorEl.classList.remove('active');
    errorEl.textContent = '';
  }
  if (contentEl)  contentEl.style.display = 'none';

  try {
    const recipe = await API.getRecipeById(id);

    if (loadingEl)  loadingEl.classList.remove('active');
    if (contentEl)  contentEl.style.display = '';

    document.getElementById('detailTitle').textContent =
      recipe.name;
    document.getElementById('detailDescription').textContent =
      recipe.description || '';
    document.getElementById('detailTime').textContent =
      (recipe.time || recipe.timeMinutes || '?') + ' minutos';
    document.getElementById('detailDifficulty').textContent =
      recipe.difficulty || '';
    document.getElementById('detailCategory').textContent =
      recipe.category || '';
    document.getElementById('detailMatch').textContent =
      recipe.match !== undefined ? recipe.match : '—';

    document.getElementById('detailIngredients').innerHTML =
      (recipe.ingredients || []).map(function (i) {
        return '<li>' + i + '</li>';
      }).join('');

    document.getElementById('detailSteps').innerHTML =
      (recipe.steps || []).map(function (s) {
        return '<li>' + s + '</li>';
      }).join('');

    _updateDetailFavButton(id);

  } catch (err) {
    if (loadingEl) loadingEl.classList.remove('active');
    if (errorEl) {
      errorEl.textContent =
        'No se pudo cargar el detalle de la receta. ' +
        'Verificá la conexión con el servicio de recetas.';
      errorEl.classList.add('active');
    }
  }
}

function _updateDetailFavButton(id) {
  const btn = document.getElementById('favoriteDetailButton');
  if (!btn) return;
  const isFav = Storage.isFavorite(id);
  btn.textContent = isFav ? 'Quitar favorito' : 'Guardar favorito';
  btn.className   = 'btn ' + (isFav ? 'btn-danger' : 'btn-secondary');
}

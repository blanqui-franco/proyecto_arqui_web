/* ═══════════════════════════════════════════════════════════
   FAVORITES — Che rembi'u
   Gestión de recetas favoritas persistidas en localStorage.
   En Etapa 2 pasará al back-end con autenticación.
═══════════════════════════════════════════════════════════ */

function toggleFavorite(id) {
  const wasFav = Storage.isFavorite(id);

  if (wasFav) {
    Storage.removeFavorite(id);
    showToast('Receta quitada de favoritos.');
  } else {
    Storage.addFavorite(id);
    showToast('Receta guardada en favoritos.');
  }

  /* Actualizar botón en el detalle si la receta es la que se está viendo */
  if (selectedRecipeId === id) {
    const btn = document.getElementById('favoriteDetailButton');
    if (btn) {
      const nowFav = Storage.isFavorite(id);
      btn.textContent = nowFav ? 'Quitar favorito' : 'Guardar favorito';
      btn.className   = 'btn ' + (nowFav ? 'btn-danger' : 'btn-secondary');
    }
  }

  /* Si el usuario está en la vista de favoritos, refrescarla */
  const favView = document.getElementById('favoritesView');
  if (favView && favView.classList.contains('active')) {
    renderFavorites();
  }

  /* Refrescar estado de botones en la tabla de recetas */
  renderRecipes();
}

async function renderFavorites() {
  const container = document.getElementById('favoritesList');
  if (!container) return;

  const favIds = Storage.getFavorites();

  if (!favIds.length) {
    container.innerHTML =
      '<div class="empty-state card">Todavía no guardaste recetas favoritas.</div>';
    return;
  }

  /* Usar caché si ya se cargó; si no, pedirle a la API */
  let recipes = allRecipesCache;
  if (!recipes.length) {
    try {
      recipes = await API.getRecipes();
      allRecipesCache = recipes;
    } catch {
      container.innerHTML =
        '<div class="empty-state card">' +
        'No se pudo obtener los datos de las recetas favoritas. ' +
        'Verificá que el servicio esté activo.' +
        '</div>';
      return;
    }
  }

  const favoriteRecipes = recipes.filter(function (r) {
    return favIds.includes(r.id);
  });

  if (!favoriteRecipes.length) {
    container.innerHTML =
      '<div class="empty-state card">Todavía no guardaste recetas favoritas.</div>';
    return;
  }

  container.innerHTML = favoriteRecipes.map(function (recipe) {
    const time = recipe.time || recipe.timeMinutes || '?';
    return (
      '<article class="favorite-card">' +
        '<div>' +
          '<h3>' + recipe.name + '</h3>' +
          '<p>' + time + ' min · ' + (recipe.difficulty || '') +
            ' · ' + (recipe.category || '') + '</p>' +
        '</div>' +
        '<div class="actions-cell">' +
          '<button class="btn btn-primary" onclick="openRecipeDetail(' + recipe.id + ')">Ver</button>' +
          '<button class="btn btn-danger" onclick="toggleFavorite(' + recipe.id + ')">Quitar</button>' +
        '</div>' +
      '</article>'
    );
  }).join('');
}

function clearFavorites() {
  Storage.clearFavorites();
  renderFavorites();
  showToast('Favoritos eliminados.');
}

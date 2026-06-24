/* ═══════════════════════════════════════════════════════════
   FAVORITES — Che rembi'u
═══════════════════════════════════════════════════════════ */

function toggleFavorite(id) {
  var wasFav = Storage.isFavorite(id);
  if (wasFav) {
    Storage.removeFavorite(id);
    showToast('Receta quitada de favoritos.');
  } else {
    Storage.addFavorite(id);
    showToast('Receta guardada en favoritos.');
  }

  if (selectedRecipeId === id) _updateDetailFavButton(id);

  var favView = document.getElementById('favoritesView');
  if (favView && favView.classList.contains('active')) renderFavorites();

  renderRecipes();
}

async function renderFavorites() {
  var container  = document.getElementById('favoritesList');
  var countEl    = document.getElementById('favoritesCount');
  if (!container) return;

  var favIds = Storage.getFavorites();

  if (!favIds.length) {
    container.innerHTML = _emptyFavState();
    if (countEl) countEl.textContent = '0 recetas guardadas';
    return;
  }

  var recipes = allRecipesCache;
  if (!recipes.length) {
    try {
      recipes = await API.getRecipes();
      allRecipesCache = recipes;
    } catch (e) {
      container.innerHTML =
        '<div class="col-span-3 text-center py-xl text-on-surface-variant italic">No se pudo obtener las recetas. Verificá que el servicio esté activo.</div>';
      return;
    }
  }

  var favoriteRecipes = recipes.filter(function (r) { return favIds.includes(r.id); });

  if (!favoriteRecipes.length) {
    container.innerHTML = _emptyFavState();
    if (countEl) countEl.textContent = '0 recetas guardadas';
    return;
  }

  if (countEl) countEl.textContent = favoriteRecipes.length + ' receta(s) guardada(s)';

  container.innerHTML = favoriteRecipes.map(function (recipe) {
    var time   = recipe.time || recipe.timeMinutes || '?';
    var catCls = typeof _catClass === 'function' ? _catClass(recipe.category) : 'cat-default';
    var emoji  = typeof _catEmoji === 'function' ? _catEmoji(recipe.category) : '';
    return (
      '<article class="recipe-card bg-white rounded-xl border border-outline-variant flat-shadow overflow-hidden transition-all group flex flex-col h-full">' +
        '<div class="relative aspect-video overflow-hidden ' + catCls + ' flex items-center justify-center cursor-pointer" onclick="openRecipeDetail(' + recipe.id + ')">' +
          '<span class="text-white opacity-40 text-[56px] group-hover:scale-110 transition-transform duration-500">' + emoji + '</span>' +
          '<div class="absolute top-sm right-sm">' +
            '<span class="bg-primary text-white text-caption px-sm py-1 rounded-full">' + (recipe.category || '') + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="p-md flex flex-col flex-grow">' +
          '<h3 class="text-title-md text-on-surface mb-xs cursor-pointer hover:text-primary transition-colors" onclick="openRecipeDetail(' + recipe.id + ')">' + recipe.name + '</h3>' +
          '<div class="flex items-center gap-xs mb-md text-on-surface-variant">' +
            '<span class="material-symbols-outlined" style="font-size:18px">schedule</span>' +
            '<span class="text-caption">' + time + ' min</span>' +
            '<span class="mx-xs text-outline-variant">•</span>' +
            '<span class="material-symbols-outlined" style="font-size:18px">bar_chart</span>' +
            '<span class="text-caption">' + (recipe.difficulty || '') + '</span>' +
          '</div>' +
          '<div class="mt-auto">' +
            '<button class="w-full bg-secondary-container text-on-secondary-container py-sm rounded-lg text-label-sm font-bold hover:bg-error hover:text-on-error transition-colors flex items-center justify-center gap-xs" onclick="toggleFavorite(' + recipe.id + ')">' +
              '<span class="material-symbols-outlined" style="font-size:18px">heart_broken</span>' +
              'Quitar de favoritos' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }).join('');
}

function _emptyFavState() {
  return (
    '<div class="col-span-3 flex flex-col items-center justify-center text-center py-xl">' +
      '<div class="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-md">' +
        '<span class="material-symbols-outlined text-primary opacity-30" style="font-size:56px">bookmark_add</span>' +
      '</div>' +
      '<h2 class="text-title-md text-on-surface mb-sm">Todavía no guardaste ninguna receta.</h2>' +
      '<p class="text-body-md text-on-surface-variant max-w-sm mx-auto mb-lg">¡Explorá y guardá tus favoritas para tenerlas siempre a mano!</p>' +
      '<button class="bg-primary text-on-primary px-xl py-md rounded-lg font-bold text-label-sm hover:opacity-90 transition-opacity" data-navigate="recipesView" onclick="showView(\'recipesView\')">Explorar Recetas</button>' +
    '</div>'
  );
}

function clearFavorites() {
  Storage.clearFavorites();
  renderFavorites();
  showToast('Favoritos eliminados.');
}

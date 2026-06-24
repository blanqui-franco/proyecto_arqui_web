/* ═══════════════════════════════════════════════════════════
   STORAGE — Che rembi'u
   Wrappers de localStorage exclusivamente para favoritos.
   En Etapa 2 favoritos pasará al back-end con autenticación.
═══════════════════════════════════════════════════════════ */

const Storage = (function () {
  const KEY = 'cheRembiuFavorites';

  return {
    getFavorites() {
      try {
        return JSON.parse(localStorage.getItem(KEY)) || [];
      } catch (e) {
        return [];
      }
    },

    saveFavorites(ids) {
      localStorage.setItem(KEY, JSON.stringify(ids));
    },

    isFavorite(id) {
      return this.getFavorites().includes(id);
    },

    addFavorite(id) {
      const favs = this.getFavorites();
      if (!favs.includes(id)) {
        favs.push(id);
        this.saveFavorites(favs);
      }
    },

    removeFavorite(id) {
      this.saveFavorites(this.getFavorites().filter(f => f !== id));
    },

    clearFavorites() {
      this.saveFavorites([]);
    }
  };
})();

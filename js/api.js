/* ═══════════════════════════════════════════════════════════
   API — Che rembi'u
   Centraliza todos los fetch a los tres micro-servicios.
   Carga en primer lugar para que el resto de los módulos pueda
   usarlo en cuanto el DOM esté listo.
═══════════════════════════════════════════════════════════ */

const API = (function () {
  const RECIPES = 'http://localhost:3001';
  const SEARCH  = 'http://localhost:3002';
  const HISTORY = 'http://localhost:3003';

  async function _fetch(url, options = {}) {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} — ${res.statusText} (${url})`);
    }
    return res.json();
  }

  return {
    /* ── recipes-service ──────────────────────────────── */

    getRecipes(filters = {}) {
      const params = new URLSearchParams();
      if (filters.category)   params.set('category',   filters.category);
      if (filters.difficulty) params.set('difficulty', filters.difficulty);
      if (filters.maxTime)    params.set('maxTime',    filters.maxTime);
      if (filters.q)          params.set('q',          filters.q);
      const qs = params.toString();
      return _fetch(`${RECIPES}/recipes${qs ? '?' + qs : ''}`);
    },

    getRecipeById(id) {
      return _fetch(`${RECIPES}/recipes/${id}`);
    },

    /* ── search-service ───────────────────────────────── */

    searchByIngredients(list) {
      return _fetch(`${SEARCH}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: list })
      });
    },

    /* ── history-service ──────────────────────────────── */

    saveHistory(entry) {
      return _fetch(`${HISTORY}/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    },

    getHistory() {
      return _fetch(`${HISTORY}/history`);
    },

    clearHistory() {
      return _fetch(`${HISTORY}/history`, { method: 'DELETE' });
    }
  };
})();

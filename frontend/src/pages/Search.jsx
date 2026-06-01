import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { useState } from 'react';

const SUGGESTIONS = ['cebolla', 'tomate', 'ajo', 'leche', 'huevo'];

export default function Search() {
  const navigate = useNavigate();
  const { ingredients, addIngredient, removeIngredient, clearIngredients, setVisibleRecipes, showToast } = useApp();
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  function handleAdd() {
    const added = addIngredient(inputVal);
    if (!added && inputVal.trim()) showToast('Ese ingrediente ya fue agregado.');
    setInputVal('');
    setError(false);
  }

  async function handleSearch() {
    if (!ingredients.length) { setError(true); return; }
    setError(false);
    setLoading(true);
    try {
      const results = await api.searchByIngredients(ingredients);
      setVisibleRecipes(results);
      api.saveHistory({
        ingredients: ingredients.join(', '),
        results: results.length,
        date: new Date().toLocaleString('es-PY'),
      }).catch(() => {});
      showToast('Sugerencias generadas desde el servicio de búsqueda.');
      navigate('/recetas');
    } catch {
      showToast('No se pudo conectar al servicio de búsqueda. Verificá que docker compose esté activo en el puerto 3002.');
    } finally {
      setLoading(false);
    }
  }

  function loadDemo() {
    clearIngredients();
    ['huevo', 'queso paraguay', 'harina', 'leche'].forEach(i => addIngredient(i));
    showToast('Ingredientes de ejemplo cargados.');
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-on-surface mb-1">¿Qué tenés en tu cocina?</h1>
        <p className="text-on-surface-variant">Agregá los ingredientes que tenés a mano y te sugeriremos recetas deliciosas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left */}
        <div className="lg:col-span-8 space-y-6">
          {/* Input */}
          <div className="bg-surface-container-lowest border border-secondary-container rounded-xl p-6">
            <label className="block text-xs font-semibold text-secondary mb-2" htmlFor="ingredient-input">
              Agregar ingrediente
            </label>
            <div className="flex gap-3">
              <input
                id="ingredient-input"
                className="flex-1 bg-[#F4F4F2] border-none focus:ring-2 focus:ring-primary rounded-lg px-4 py-3 text-sm placeholder:text-outline-variant"
                placeholder="Ej: Harina, Pollo, Queso..."
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
              <button
                className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold text-sm hover:bg-primary-container transition-colors flex items-center gap-1 active:scale-95"
                onClick={handleAdd}
              >
                <span className="material-symbols-outlined text-base">add</span>
                Añadir
              </button>
            </div>
            {error && (
              <p className="mt-2 text-xs text-error flex items-center gap-1">
                <span className="material-symbols-outlined text-base">error</span>
                Agregá al menos un ingrediente para buscar.
              </p>
            )}

            {/* Suggestions */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-secondary mb-2">Sugerencias rápidas</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    className="bg-secondary-container text-on-secondary-fixed-variant px-4 py-1 rounded-full text-sm hover:bg-primary-fixed transition-colors"
                    onClick={() => addIngredient(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chips */}
          <div>
            <h3 className="text-base font-semibold text-on-surface mb-2">Mis Ingredientes</h3>
            <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-[#EEF5F0] border-2 border-dashed border-outline-variant rounded-xl items-start content-start">
              {ingredients.length === 0 ? (
                <div className="w-full text-center py-4 text-on-surface-variant text-sm italic">
                  No agregaste ingredientes aún.
                </div>
              ) : (
                ingredients.map((ing, i) => (
                  <div
                    key={ing}
                    className="chip-anim flex items-center gap-1 bg-white border border-secondary-container px-4 py-2 rounded-full text-sm text-primary shadow-sm"
                  >
                    <span>{ing}</span>
                    <button
                      className="material-symbols-outlined text-outline hover:text-error transition-colors"
                      style={{ fontSize: 18 }}
                      onClick={() => removeIngredient(i)}
                    >
                      close
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-surface-container-lowest border border-secondary-container rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
            <div className="w-full aspect-square mb-4 overflow-hidden rounded-lg">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAc82kBNkclTAYf_ocixFkDJxHhFNf60HhgL3ZPkpQ1N9IsKWL447RIQNL2f4saxM5uTF1spl1SWYrMIWpnQCKOp6epOb2ryqh6SU_68VEFec7eLGHbG65Gs34MThqXNVxR5qaWISl53ZEfO0hIBtE-zLyoKWPg-ZmZLv2fF-zMU1SJSpbt_3TnIePGbceZgxvHegT2VnxgHeJEUsxdG5jMcnWDoLvvcnZy_9tcvnTO0Enlyo2b_MspofCSOTBTNi-JI-hyoNRuXt8"
                alt="Cocina fresca"
              />
            </div>
            <h2 className="text-base font-semibold text-on-surface mb-1">Ingredientes ingresados</h2>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-primary">{ingredients.length}</span>
              <span className="text-on-surface-variant text-sm">elementos</span>
            </div>
            <button
              className="w-full bg-primary text-on-primary py-4 px-6 rounded-xl font-bold text-base shadow-sm hover:bg-primary-container transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
              disabled={loading || ingredients.length < 2}
              onClick={handleSearch}
            >
              {loading
                ? <><span className="material-symbols-outlined animate-spin">sync</span> Buscando…</>
                : 'Ver recetas sugeridas'}
            </button>
            <p className="mt-3 text-xs text-outline">Agregá al menos 2 ingredientes para ver recomendaciones.</p>
            <button
              className="mt-4 text-sm text-secondary underline hover:text-primary transition-colors"
              onClick={loadDemo}
            >
              Cargar ingredientes de ejemplo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

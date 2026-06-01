import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { normalize } from '../utils/helpers';
import RecipeCard from '../components/RecipeCard';

export default function Recipes() {
  const navigate = useNavigate();
  const { ingredients, visibleRecipes, setVisibleRecipes, allRecipes, setAllRecipes } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [textFilter, setTextFilter]       = useState('');
  const [diffFilter, setDiffFilter]       = useState('');
  const [catFilter, setCatFilter]         = useState('');
  const [timeFilter, setTimeFilter]       = useState('');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (visibleRecipes.length > 0) return;
    setLoading(true);
    api.getRecipes()
      .then(data => {
        setAllRecipes(data);
        setVisibleRecipes(data);
      })
      .catch(() => setError('No se pudo conectar con el servicio de recetas. Verificá que docker compose esté activo en el puerto 3001.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = visibleRecipes.filter(r => {
    const searchable = normalize([r.name, r.category, ...(r.ingredients || [])].join(' '));
    const matchText  = !textFilter || searchable.includes(normalize(textFilter));
    const matchDiff  = !diffFilter || r.difficulty === diffFilter;
    const matchCat   = !catFilter  || r.category   === catFilter;
    const rTime      = r.time || r.timeMinutes || 0;
    const matchTime  = !timeFilter  || rTime <= Number(timeFilter);
    return matchText && matchDiff && matchCat && matchTime;
  });

  return (
    <div>
      {/* Sub-header with active ingredients */}
      {ingredients.length > 0 && (
        <div className="mb-6 p-4 bg-surface-container rounded-xl border border-outline-variant flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-secondary mr-1">Buscando con:</span>
          {ingredients.map(ing => (
            <span key={ing} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-xs">
              {ing}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-on-surface">Recetas</h1>
        {!loading && !error && (
          <span className="text-sm text-on-surface-variant">{filtered.length} receta(s) encontrada(s)</span>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <input
          className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary col-span-2 md:col-span-1"
          placeholder="Buscar receta…"
          value={textFilter}
          onChange={e => setTextFilter(e.target.value)}
        />
        <select
          className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={diffFilter}
          onChange={e => setDiffFilter(e.target.value)}
        >
          <option value="">Dificultad</option>
          <option>Fácil</option>
          <option>Media</option>
          <option>Difícil</option>
        </select>
        <select
          className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
        >
          <option value="">Categoría</option>
          <option>Tradicional</option>
          <option>Rápida</option>
          <option>Económica</option>
          <option>Postre</option>
        </select>
        <select
          className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={timeFilter}
          onChange={e => setTimeFilter(e.target.value)}
        >
          <option value="">Tiempo máx.</option>
          <option value="15">15 min</option>
          <option value="30">30 min</option>
          <option value="60">60 min</option>
        </select>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <span className="material-symbols-outlined text-primary animate-spin text-4xl">sync</span>
        </div>
      )}

      {error && (
        <div className="bg-error-container text-on-error-container rounded-xl p-4 text-sm">{error}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-primary opacity-30 text-6xl">search_off</span>
          <p className="mt-4 text-on-surface-variant">No se encontraron recetas con esos filtros.</p>
          <button
            className="mt-4 bg-primary text-on-primary px-6 py-2 rounded-xl text-sm font-bold hover:opacity-90"
            onClick={() => navigate('/buscar')}
          >
            Nueva búsqueda
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(r => (
            <RecipeCard key={r.id} recipe={r} onFavoriteToggle={() => setTick(t => t + 1)} />
          ))}
        </div>
      )}
    </div>
  );
}

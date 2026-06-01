import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import RecipeCard from '../components/RecipeCard';

export default function Home() {
  const navigate = useNavigate();
  const { addIngredient, setIngredients, setVisibleRecipes, allRecipes, setAllRecipes, showToast } = useApp();
  const [heroInput, setHeroInput] = useState('');
  const [totalRecipes, setTotalRecipes] = useState('...');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    api.getRecipes()
      .then(data => {
        setAllRecipes(data);
        setTotalRecipes(data.length);
      })
      .catch(() => setTotalRecipes('?'));
  }, []);

  function handleHeroSearch() {
    const raw = heroInput.trim();
    if (!raw) { navigate('/buscar'); return; }
    setIngredients([]);
    raw.split(',').forEach(part => addIngredient(part.trim()));
    setHeroInput('');
    navigate('/buscar');
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative rounded-2xl overflow-hidden mb-10 bg-gradient-to-br from-primary to-tertiary p-10 text-on-primary">
        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl font-bold mb-2">¿Qué cocinamos hoy?</h1>
          <p className="text-on-primary/80 mb-6 text-base">
            Ingresá los ingredientes que tenés y te sugerimos recetas deliciosas al instante.
          </p>
          <div className="flex gap-2">
            <input
              className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 text-on-primary placeholder:text-on-primary/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Ej: huevo, queso, harina…"
              value={heroInput}
              onChange={e => setHeroInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleHeroSearch()}
            />
            <button
              className="bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-primary-fixed transition-colors text-sm"
              onClick={handleHeroSearch}
            >
              Buscar
            </button>
          </div>
        </div>
        <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[120px] opacity-20 select-none hidden md:block">🍲</div>
      </section>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { icon: 'restaurant_menu', value: totalRecipes, label: 'Recetas disponibles' },
          { icon: 'search', value: 'Instantáneo', label: 'Búsqueda por ingredientes' },
          { icon: 'favorite', value: 'Ilimitados', label: 'Favoritos guardados' },
        ].map(s => (
          <div key={s.label} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-center">
            <span className="material-symbols-outlined text-primary text-3xl">{s.icon}</span>
            <p className="text-xl font-bold text-on-surface mt-1">{s.value}</p>
            <p className="text-xs text-on-surface-variant">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Featured */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-on-surface">Recetas destacadas</h2>
          <button
            className="text-primary text-sm font-semibold hover:underline"
            onClick={() => navigate('/buscar')}
          >
            Ver todas →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {allRecipes.slice(0, 3).map(r => (
            <RecipeCard key={r.id} recipe={r} onFavoriteToggle={() => setTick(t => t + 1)} />
          ))}
        </div>
      </section>
    </div>
  );
}

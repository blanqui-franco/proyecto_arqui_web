import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import RecipeCard from '../components/RecipeCard';

export default function Favorites() {
  const navigate = useNavigate();
  const { allRecipes, setAllRecipes, showToast } = useApp();
  const [tick, setTick] = useState(0);

  const [allLoaded, setAllLoaded] = useState(allRecipes.length > 0);

  useEffect(() => {
    if (allRecipes.length > 0) { setAllLoaded(true); return; }
    api.getRecipes()
      .then(data => { setAllRecipes(data); setAllLoaded(true); })
      .catch(() => setAllLoaded(true));
  }, []);

  const favIds  = storage.getFavorites();
  const favList = allRecipes.filter(r => favIds.includes(r.id));

  function clearFavs() {
    storage.clearFavorites();
    setTick(t => t + 1);
    showToast('Favoritos eliminados.');
  }

  if (!allLoaded) return (
    <div className="flex justify-center py-16">
      <span className="material-symbols-outlined text-primary animate-spin text-4xl">sync</span>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Favoritos</h1>
          <p className="text-sm text-on-surface-variant">{favList.length} receta(s) guardada(s)</p>
        </div>
        {favList.length > 0 && (
          <button
            className="text-sm text-error border border-error px-4 py-2 rounded-lg hover:bg-error hover:text-on-error transition-colors"
            onClick={clearFavs}
          >
            Limpiar favoritos
          </button>
        )}
      </div>

      {favList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-primary opacity-30" style={{ fontSize: 56 }}>bookmark_add</span>
          </div>
          <h2 className="text-base font-semibold text-on-surface">Todavía no guardaste ninguna receta.</h2>
          <p className="text-sm text-on-surface-variant max-w-xs mt-1 mb-6">¡Explorá y guardá tus favoritas para tenerlas siempre a mano!</p>
          <button
            className="bg-primary text-on-primary px-6 py-2 rounded-xl text-sm font-bold hover:opacity-90"
            onClick={() => navigate('/recetas')}
          >
            Explorar Recetas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favList.map(r => (
            <RecipeCard key={r.id} recipe={r} onFavoriteToggle={() => setTick(t => t + 1)} />
          ))}
        </div>
      )}
    </div>
  );
}

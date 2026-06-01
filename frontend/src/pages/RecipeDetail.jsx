import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { useApp } from '../context/AppContext';
import { catClass, catEmoji, normalize } from '../utils/helpers';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ingredients, showToast } = useApp();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [isFav, setIsFav]   = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    api.getRecipeById(Number(id))
      .then(data => {
        setRecipe(data);
        setIsFav(storage.isFavorite(data.id));
      })
      .catch(() => setError('No se pudo cargar el detalle. Verificá la conexión con el servicio de recetas.'))
      .finally(() => setLoading(false));
  }, [id]);

  function toggleFav() {
    if (!recipe) return;
    if (storage.isFavorite(recipe.id)) {
      storage.removeFavorite(recipe.id);
      setIsFav(false);
      showToast('Receta quitada de favoritos.');
    } else {
      storage.addFavorite(recipe.id);
      setIsFav(true);
      showToast('Receta guardada en favoritos.');
    }
  }

  if (loading) return (
    <div className="flex justify-center py-16">
      <span className="material-symbols-outlined text-primary animate-spin text-4xl">sync</span>
    </div>
  );

  if (error) return (
    <div className="bg-error-container text-on-error-container rounded-xl p-4 text-sm">{error}</div>
  );

  if (!recipe) return null;

  const time = recipe.time || recipe.timeMinutes || '?';

  return (
    <div>
      <button
        className="flex items-center gap-1 text-secondary text-sm mb-6 hover:text-primary transition-colors"
        onClick={() => navigate(-1)}
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Volver
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left col */}
        <div className="lg:col-span-5">
          <div className={`w-full aspect-square rounded-2xl flex items-center justify-center ${catClass(recipe.category)}`}>
            <span className="text-white opacity-40 select-none" style={{ fontSize: 120 }}>
              {catEmoji(recipe.category)}
            </span>
          </div>

          {/* Meta stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { icon: 'schedule',   label: 'Tiempo',      value: `${time} min` },
              { icon: 'bar_chart',  label: 'Dificultad',  value: recipe.difficulty },
              { icon: 'local_dining', label: 'Categoría', value: recipe.category },
            ].map(s => (
              <div key={s.label} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-center">
                <span className="material-symbols-outlined text-primary text-xl">{s.icon}</span>
                <p className="text-xs text-on-surface-variant mt-1">{s.label}</p>
                <p className="text-sm font-semibold text-on-surface">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Fav button */}
          <button
            className={`mt-4 w-full py-3 rounded-xl font-bold text-base flex justify-center items-center gap-2 hover:opacity-90 transition-all active:scale-95 ${isFav ? 'bg-secondary text-on-secondary' : 'bg-primary text-on-primary'}`}
            onClick={toggleFav}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: isFav ? "'FILL' 1" : undefined }}
            >
              favorite
            </span>
            {isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          </button>
        </div>

        {/* Right col */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            {recipe.match != null && (
              <span className="bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-lg mr-2">
                {recipe.match}% Match
              </span>
            )}
            <h1 className="text-3xl font-bold text-on-surface mt-2">{recipe.name}</h1>
            {recipe.description && (
              <p className="text-on-surface-variant text-sm mt-1">{recipe.description}</p>
            )}
          </div>

          {/* Ingredients */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
            <h2 className="text-base font-semibold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">grocery</span>
              Ingredientes
            </h2>
            <ul className="space-y-1">
              {(recipe.ingredients || []).map(ing => {
                const owned = ingredients.length > 0 && ingredients.some(u =>
                  normalize(ing).includes(normalize(u)) || normalize(u).includes(normalize(ing))
                );
                return (
                  <li key={ing} className="flex items-center gap-2 text-sm text-on-surface border-b border-surface-variant pb-1">
                    <span
                      className={`material-symbols-outlined text-base ${owned ? 'text-primary' : 'text-on-surface-variant'}`}
                      style={{ fontVariationSettings: owned ? "'FILL' 1" : undefined }}
                    >
                      {owned ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    {ing}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Steps */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
            <h2 className="text-base font-semibold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">format_list_numbered</span>
              Preparación
            </h2>
            <div className="space-y-3">
              {(recipe.steps || []).map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center font-bold text-xs">
                    {i + 1}
                  </div>
                  <p className="text-sm text-on-surface leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* History card */}
          {recipe.history && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
              <h2 className="text-base font-semibold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">history_edu</span>
                Historia tradicional
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">{recipe.history}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

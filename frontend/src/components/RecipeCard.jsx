import { useNavigate } from 'react-router-dom';
import { catClass, catEmoji } from '../utils/helpers';
import { storage } from '../services/storage';
import { useApp } from '../context/AppContext';

export default function RecipeCard({ recipe, onFavoriteToggle }) {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const isFav = storage.isFavorite(recipe.id);
  const time  = recipe.time || recipe.timeMinutes || '?';

  function handleFav(e) {
    e.stopPropagation();
    if (storage.isFavorite(recipe.id)) {
      storage.removeFavorite(recipe.id);
      showToast('Receta quitada de favoritos.');
    } else {
      storage.addFavorite(recipe.id);
      showToast('Receta guardada en favoritos.');
    }
    onFavoriteToggle && onFavoriteToggle();
  }

  return (
    <article
      className="recipe-card group bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden cursor-pointer"
      onClick={() => navigate(`/receta/${recipe.id}`)}
    >
      <div className={`relative aspect-[4/3] overflow-hidden ${catClass(recipe.category)} flex items-center justify-center`}>
        <span className="text-white opacity-40 select-none group-hover:scale-110 transition-transform duration-500" style={{ fontSize: 72 }}>
          {catEmoji(recipe.category)}
        </span>
        {recipe.match != null && (
          <div className="absolute top-2 left-2 bg-primary px-2 py-0.5 rounded-lg text-on-primary text-xs font-bold">
            {recipe.match}% Match
          </div>
        )}
        <button
          className={`absolute top-2 right-2 w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full transition-colors hover:text-error ${isFav ? 'text-error' : 'text-on-surface-variant'}`}
          onClick={handleFav}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 20, fontVariationSettings: isFav ? "'FILL' 1" : undefined }}
          >
            favorite
          </span>
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-on-surface mb-1">{recipe.name}</h3>
        <div className="flex items-center gap-4 text-on-surface-variant text-xs">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>schedule</span>
            {time} min
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>bar_chart</span>
            {recipe.difficulty}
          </span>
        </div>
        <div className="mt-2">
          <span className="bg-surface-container text-on-secondary-fixed-variant px-2 py-0.5 rounded-lg text-xs">
            {recipe.category}
          </span>
        </div>
      </div>
    </article>
  );
}

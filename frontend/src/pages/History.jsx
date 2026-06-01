import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export default function History() {
  const navigate = useNavigate();
  const { setIngredients, addIngredient, showToast } = useApp();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    api.getHistory()
      .then(data => setHistory(data))
      .catch(() => setError('No se pudo cargar el historial. Verificá que el servicio esté activo en el puerto 3003.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleClear() {
    try {
      await api.clearHistory();
      setHistory([]);
      showToast('Historial limpiado.');
    } catch {
      showToast('No se pudo limpiar el historial.');
    }
  }

  function repeatSearch(ingredientsStr) {
    setIngredients([]);
    ingredientsStr.split(',').map(s => s.trim()).filter(Boolean).forEach(ing => addIngredient(ing));
    navigate('/buscar');
  }

  if (loading) return (
    <div className="flex justify-center py-16">
      <span className="material-symbols-outlined text-primary animate-spin text-4xl">sync</span>
    </div>
  );

  if (error) return (
    <div className="bg-error-container text-on-error-container rounded-xl p-4 text-sm">{error}</div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Historial de búsquedas</h1>
          <p className="text-sm text-on-surface-variant">{history.length} búsqueda(s) guardada(s)</p>
        </div>
        {history.length > 0 && (
          <button
            className="text-sm text-error border border-error px-4 py-2 rounded-lg hover:bg-error hover:text-on-error transition-colors"
            onClick={handleClear}
          >
            Limpiar historial
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-surface-container-high p-8 rounded-full mb-4">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 64 }}>history_off</span>
          </div>
          <h2 className="text-base font-semibold text-on-surface">Tu historial está vacío</h2>
          <p className="text-sm text-on-surface-variant max-w-xs mt-1 mb-6">Empezá a buscar nuevas recetas y aparecerán aquí.</p>
          <button
            className="bg-primary text-on-primary px-6 py-2 rounded-xl text-sm font-bold hover:opacity-90"
            onClick={() => navigate('/buscar')}
          >
            Buscar recetas
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item, index) => (
            <div
              key={index}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary transition-colors"
            >
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>restaurant_menu</span>
                  <h3 className="text-base font-semibold text-on-surface">Búsqueda #{index + 1}</h3>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {(item.ingredients || '').split(',').map(ing => ing.trim()).filter(Boolean).map(ing => (
                    <span key={ing} className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-xs font-medium">
                      {ing}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                  {item.date && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>calendar_today</span>
                      {item.date}
                    </span>
                  )}
                  {item.results != null && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>fact_check</span>
                      {item.results} resultado(s)
                    </span>
                  )}
                </div>
              </div>
              <button
                className="bg-primary text-on-primary px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 flex items-center gap-1 flex-shrink-0"
                onClick={() => repeatSearch(item.ingredients || '')}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
                Repetir
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

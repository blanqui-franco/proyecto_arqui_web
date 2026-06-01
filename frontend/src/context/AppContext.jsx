import { createContext, useContext, useState, useCallback, useRef } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [ingredients, setIngredients] = useState([]);
  const [visibleRecipes, setVisibleRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const toastTimer = useRef(null);

  const showToast = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToast({ visible: true, message });
    toastTimer.current = setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  }, []);

  const addIngredient = useCallback((val) => {
    const clean = val.trim().toLowerCase();
    if (!clean) return false;
    setIngredients(prev => {
      if (prev.includes(clean)) return prev;
      return [...prev, clean];
    });
    return true;
  }, []);

  const removeIngredient = useCallback((index) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearIngredients = useCallback(() => setIngredients([]), []);

  return (
    <AppContext.Provider value={{
      ingredients, setIngredients,
      addIngredient, removeIngredient, clearIngredients,
      visibleRecipes, setVisibleRecipes,
      allRecipes, setAllRecipes,
      selectedRecipeId, setSelectedRecipeId,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home         from './pages/Home';
import Search       from './pages/Search';
import Recipes      from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Favorites    from './pages/Favorites';
import History      from './pages/History';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/"            element={<Home />} />
            <Route path="/buscar"      element={<Search />} />
            <Route path="/recetas"     element={<Recipes />} />
            <Route path="/receta/:id"  element={<RecipeDetail />} />
            <Route path="/favoritos"   element={<Favorites />} />
            <Route path="/historial"   element={<History />} />
          </Routes>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  );
}

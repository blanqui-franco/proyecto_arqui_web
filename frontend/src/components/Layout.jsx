import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const NAV_LINKS = [
  { to: '/',          label: 'Inicio' },
  { to: '/buscar',    label: 'Explorar' },
  { to: '/favoritos', label: 'Favoritos' },
  { to: '/historial', label: 'Historial' },
];

export default function Layout({ children }) {
  const { toast } = useApp();
  const { pathname } = useLocation();

  return (
    <>
      <header className="bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 py-3 max-w-[1200px] mx-auto">
          <Link to="/" className="text-lg font-bold text-primary">Che rembi'u 🍲</Link>
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={
                  pathname === to
                    ? 'text-primary border-b-2 border-primary font-bold pb-0.5 text-sm'
                    : 'text-on-surface-variant text-sm hover:text-primary transition-colors'
                }
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-10 min-h-[calc(100vh-160px)]">
        {children}
      </main>

      <footer className="bg-surface-container-lowest border-t border-outline-variant mt-16">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 py-10 max-w-[1200px] mx-auto">
          <div className="text-base font-semibold text-secondary mb-4 md:mb-0">Che rembi'u</div>
          <div className="flex gap-6 mb-4 md:mb-0">
            {['Sobre Nosotros', 'Contacto', 'Privacidad', 'Términos'].map(l => (
              <a key={l} href="#" className="text-on-surface-variant text-sm hover:text-primary transition-colors">{l}</a>
            ))}
          </div>
          <div className="text-xs text-secondary">© 2024 Che rembi'u</div>
        </div>
      </footer>

      {/* Toast */}
      {toast.visible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-xl shadow-lg z-[100] text-sm font-medium transition-all">
          {toast.message}
        </div>
      )}
    </>
  );
}

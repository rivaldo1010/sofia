import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ShoppingBag, Search, User, Menu, X, Heart, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useCart } from "../store/cart";
import { useTheme } from "../store/theme";

export function Header() {
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggle } = useTheme();

  const isHombre = location.pathname.startsWith("/hombre");
  const isMujer = location.pathname.startsWith("/mujer");

  const q = params.get("q") || "";
  const cartCount = useCart((s) => s.count());

  function handleSearch(value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set("q", value);
    else next.delete("q");
    setParams(next, { replace: true });
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link
            to="/"
            className="font-black text-2xl tracking-tighter shrink-0 text-black dark:text-white"
          >
            Sofía
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center gap-6 ml-4">
            <Link
              to="/hombre"
              className={`text-sm font-medium transition ${
                isHombre
                  ? "text-black dark:text-white font-bold"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Hombre
            </Link>
            <Link
              to="/mujer"
              className={`text-sm font-medium transition ${
                isMujer
                  ? "text-black dark:text-white font-bold"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Mujer
            </Link>
            <Link
              to="/mis-pedidos"
              className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition"
            >
              Mis pedidos
            </Link>
          </nav>

          {/* Buscador */}
          <div className="flex-1 max-w-md relative hidden md:block ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <input
              type="search"
              value={q}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white placeholder-neutral-500 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
            />
          </div>

          {/* Iconos */}
          <div className="flex items-center gap-1 ml-auto md:ml-0">
            {/* Botón modo oscuro */}
            <button
              type="button"
              onClick={toggle}
              aria-label="Cambiar tema"
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition text-black dark:text-white"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <Link
              to="/favoritos"
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition text-black dark:text-white"
              aria-label="Favoritos"
            >
              <Heart className="w-5 h-5" />
            </Link>
            <Link
              to="/mi-cuenta"
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition text-black dark:text-white"
              aria-label="Cuenta"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link
              to="/carrito"
              className="relative p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition text-black dark:text-white"
              aria-label="Carrito"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition text-black dark:text-white"
              aria-label="Menú"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {mobileOpen && (
          <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 py-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="search"
                value={q}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white placeholder-neutral-500 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>
            <Link
              to="/hombre"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-black dark:text-white"
            >
              Hombre
            </Link>
            <Link
              to="/mujer"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-black dark:text-white"
            >
              Mujer
            </Link>
            <Link
              to="/mis-pedidos"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-black dark:text-white"
            >
              Mis pedidos
            </Link>
            <Link
              to="/favoritos"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-black dark:text-white"
            >
              Favoritos
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Boxes,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../store/auth";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/productos", label: "Productos", icon: Package },
  { to: "/admin/categorias", label: "Categorías", icon: Boxes },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/inventario", label: "Inventario", icon: Boxes },
  { to: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Cierra el menú al cambiar de ruta
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen flex bg-neutral-50 dark:bg-neutral-950 transition-colors">
      {/* Botón hamburguesa (solo móvil) */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg shadow-lg"
        aria-label="Abrir menú"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay oscuro cuando el menú está abierto en móvil */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky lg:top-0 lg:h-screen
          top-0 left-0 h-screen w-64
          bg-black text-white flex flex-col shrink-0 z-50
          transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <Link to="/" className="font-black text-2xl tracking-tighter block">
              Sofía
            </Link>
            <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest">
              Panel Admin
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 hover:bg-neutral-800 rounded-lg transition"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                    isActive
                      ? "bg-white text-black font-semibold"
                      : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-neutral-800 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-400 hover:bg-neutral-900 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver a la tienda
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-400 hover:bg-neutral-900 hover:text-red-400 transition"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
          {user && (
            <p className="px-3 pt-2 text-xs text-neutral-600 truncate">
              {user.email}
            </p>
          )}
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 overflow-x-hidden">
        {/* Espacio para que el botón hamburguesa no tape el contenido en móvil */}
        <div className="lg:hidden h-16" />
        <Outlet />
      </main>
    </div>
  );
}
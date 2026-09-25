import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, ShoppingBag, Heart, LogOut, LogIn } from "lucide-react";
import { useAuth } from "../store/auth";

export function MyAccount() {
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <User className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
        <h1 className="text-3xl font-black mb-2">Inicia sesión</h1>
        <p className="text-neutral-500 mb-8">
          Accede a tu cuenta para ver pedidos y favoritos
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-neutral-800 transition"
          >
            <LogIn className="w-4 h-4" />
            Iniciar sesión
          </Link>
          <Link
            to="/registro"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black text-black rounded-full font-semibold hover:bg-black hover:text-white transition"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">Mi cuenta</h1>
        <p className="text-neutral-500 mt-1">Bienvenido de vuelta, {user.name || user.email}</p>
      </div>

      {/* Info del usuario */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-6">
        <h2 className="font-bold mb-4">Información personal</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
              <User className="w-5 h-5 text-neutral-500" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Nombre</p>
              <p className="font-medium">{user.name || "Sin nombre"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
              <Mail className="w-5 h-5 text-neutral-500" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Correo electrónico</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
          {user.phone && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                <Phone className="w-5 h-5 text-neutral-500" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">Teléfono</p>
                <p className="font-medium">{user.phone}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
              <User className="w-5 h-5 text-neutral-500" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Rol</p>
              <p className="font-medium">
                {user.role === "ADMIN" ? "Administrador" : "Cliente"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Link
          to="/mis-pedidos"
          className="bg-white rounded-2xl border border-neutral-200 p-6 hover:border-neutral-400 transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold">Mis pedidos</p>
            <p className="text-sm text-neutral-500">Ver historial de compras</p>
          </div>
        </Link>

        <Link
          to="/favoritos"
          className="bg-white rounded-2xl border border-neutral-200 p-6 hover:border-neutral-400 transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold">Favoritos</p>
            <p className="text-sm text-neutral-500">Productos guardados</p>
          </div>
        </Link>
      </div>

      {/* Admin */}
      {user.role === "ADMIN" && (
        <div className="mb-6">
          <Link
            to="/admin"
            className="block bg-black text-white rounded-2xl p-6 hover:bg-neutral-800 transition"
          >
            <p className="font-bold text-lg">Panel administrativo</p>
            <p className="text-sm text-neutral-300">Gestiona productos, pedidos y más</p>
          </Link>
        </div>
      )}

      {/* Cerrar sesión */}
      <button
        type="button"
        onClick={handleLogout}
        className="w-full py-4 border-2 border-red-200 text-red-600 rounded-full font-semibold hover:bg-red-50 transition flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Cerrar sesión
      </button>
    </div>
  );
}
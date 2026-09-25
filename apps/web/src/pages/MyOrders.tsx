import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Package, ChevronRight } from "lucide-react";
import { useAuth } from "../store/auth";

const STATUS_COLORS: Record<string, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  CONFIRMADO: "bg-blue-100 text-blue-700",
  PREPARANDO: "bg-purple-100 text-purple-700",
  ENVIADO: "bg-indigo-100 text-indigo-700",
  ENTREGADO: "bg-green-100 text-green-700",
  CANCELADO: "bg-red-100 text-red-700",
};

async function fetchMyOrders() {
  const res = await fetch("/api/auth/my-orders", { credentials: "include" });
  if (!res.ok) throw new Error("Error cargando pedidos");
  return res.json();
}

export function MyOrders() {
  const user = useAuth((s) => s.user);

  const { data, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: fetchMyOrders,
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
        <h1 className="text-3xl font-black mb-2">Inicia sesión para ver tus pedidos</h1>
        <p className="text-neutral-500 mb-8">Consulta el estado de tus compras</p>
        <Link
          to="/login"
          className="inline-block px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-neutral-800 transition"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black mb-6">Mis pedidos</h1>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-neutral-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
        <h1 className="text-3xl font-black mb-2">No tienes pedidos aún</h1>
        <p className="text-neutral-500 mb-8">Explora la tienda y haz tu primera compra</p>
        <Link
          to="/hombre"
          className="inline-block px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-neutral-800 transition"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">Mis pedidos</h1>
        <p className="text-neutral-500 mt-1">
          {data.length} {data.length === 1 ? "pedido" : "pedidos"}
        </p>
      </div>

      <div className="space-y-3">
        {data.map((order: any) => (
          <Link
            key={order.id}
            to={`/pedido/${order.orderNumber}`}
            className="block bg-white rounded-2xl border border-neutral-200 p-5 hover:border-neutral-400 transition"
          >
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div>
                <p className="font-bold text-lg">{order.orderNumber}</p>
                <p className="text-xs text-neutral-500">
                  {new Date(order.createdAt).toLocaleString("es-EC")}
                </p>
                <p className="text-sm text-neutral-600 mt-1">
                  {order.items.length} producto{order.items.length !== 1 && "s"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-black text-xl">${Number(order.total).toFixed(2)}</p>
                </div>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-bold ${STATUS_COLORS[order.status]}`}
                >
                  {order.status}
                </span>
                <ChevronRight className="w-5 h-5 text-neutral-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
} from "lucide-react";
import { API_URL } from "../../lib/api";

async function fetchStats() {
  const res = await fetch(`${API_URL}/admin/stats`, { credentials: "include" });
  if (!res.ok) throw new Error("Error cargando estadísticas");
  return res.json();
}

export function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchStats,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 h-32 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          Error cargando estadísticas. Asegúrate de estar logueado como admin.
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: "Ventas del día",
      value: `$${(data.salesToday || 0).toFixed(2)}`,
      icon: TrendingUp,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Ventas del mes",
      value: `$${(data.salesMonth || 0).toFixed(2)}`,
      icon: TrendingUp,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Total de pedidos",
      value: data.totalOrders || 0,
      icon: ShoppingBag,
      color: "bg-purple-100 text-purple-700",
    },
    {
      label: "Pedidos pendientes",
      value: data.pendingOrders || 0,
      icon: AlertTriangle,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "Productos",
      value: data.totalProducts || 0,
      icon: Package,
      color: "bg-neutral-100 text-neutral-700",
    },
    {
      label: "Productos vendidos",
      value: data.productsSold || 0,
      icon: Package,
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      label: "Poco stock",
      value: data.lowStock || 0,
      icon: AlertTriangle,
      color: "bg-orange-100 text-orange-700",
    },
    {
      label: "Clientes registrados",
      value: data.totalUsers || 0,
      icon: Users,
      color: "bg-pink-100 text-pink-700",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
        <p className="text-neutral-500 mt-1">Resumen de tu tienda Sofía</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl p-6 border border-neutral-200"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-sm text-neutral-500 mt-4">{card.label}</p>
              <p className="text-2xl font-black mt-1">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-2xl p-6 border border-neutral-200">
        <h2 className="font-bold mb-4">Últimos pedidos</h2>
        {data.recentOrders && data.recentOrders.length > 0 ? (
          <div className="space-y-3">
            {data.recentOrders.map((order: any) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0"
              >
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-neutral-500">{order.fullName}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${Number(order.total).toFixed(2)}</p>
                  <p className="text-xs text-neutral-500">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-sm">
            Aún no hay pedidos. Cuando llegue el primero lo verás aquí.
          </p>
        )}
      </div>
    </div>
  );
}
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, PackageX, TrendingUp, Package } from "lucide-react";
import { API_URL } from "../../lib/api";

async function fetchInventory() {
  const res = await fetch(`${API_URL}/admin/inventory`, { credentials: "include" });
  if (!res.ok) throw new Error("Error cargando inventario");
  return res.json();
}

type Product = {
  id: string;
  name: string;
  slug: string;
  price: string;
  stock: number;
  soldCount: number;
  images: string[];
  category: { name: string };
};

export function Inventory() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-inventory"],
    queryFn: fetchInventory,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-black mb-6">Inventario</h1>
        <div className="p-8 text-center text-neutral-500">Cargando...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-black mb-6">Inventario</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          Error cargando inventario.
        </div>
      </div>
    );
  }

  const products: Product[] = data?.products || [];
  const outOfStock = products.filter((p) => p.stock === 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 10);
  const topSellers = [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 5);

  const stats = [
    {
      label: "Productos activos",
      value: products.length,
      icon: Package,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Poco stock",
      value: lowStock.length,
      icon: AlertTriangle,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "Agotados",
      value: outOfStock.length,
      icon: PackageX,
      color: "bg-red-100 text-red-700",
    },
    {
      label: "Total vendidos",
      value: products.reduce((a, p) => a + p.soldCount, 0),
      icon: TrendingUp,
      color: "bg-green-100 text-green-700",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">Inventario</h1>
        <p className="text-neutral-500 mt-1">Control de stock y ventas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl p-6 border border-neutral-200">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-sm text-neutral-500 mt-4">{s.label}</p>
              <p className="text-2xl font-black mt-1">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Productos agotados */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <PackageX className="w-5 h-5 text-red-500" />
            Productos agotados ({outOfStock.length})
          </h2>
          {outOfStock.length === 0 ? (
            <p className="text-sm text-neutral-500">Ningún producto agotado. 👌</p>
          ) : (
            <div className="space-y-3">
              {outOfStock.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-neutral-100" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{p.name}</p>
                    <p className="text-xs text-neutral-500">{p.category.name}</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-700">
                    0
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Poco stock */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Poco stock ({lowStock.length})
          </h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-neutral-500">Todo el stock está saludable. 👌</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-neutral-100" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{p.name}</p>
                    <p className="text-xs text-neutral-500">{p.category.name}</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                    {p.stock}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Más vendidos */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 lg:col-span-2">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Más vendidos (top 5)
          </h2>
          {topSellers.length === 0 ? (
            <p className="text-sm text-neutral-500">Aún no hay ventas registradas.</p>
          ) : (
            <div className="space-y-3">
              {topSellers.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-neutral-100" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{p.name}</p>
                    <p className="text-xs text-neutral-500">{p.category.name}</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                    {p.soldCount} vendidos
                  </span>
                  <span className="text-xs text-neutral-500">
                    stock: {p.stock}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
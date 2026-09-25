import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";
import { ProductForm } from "./ProductForm";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: string;
  stock: number;
  active: boolean;
  gender: string;
  images: string[];
  category: { name: string };
};

async function fetchProducts(q: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  const res = await fetch(`/api/admin/products?${params}`, { credentials: "include" });
  if (!res.ok) throw new Error("Error cargando productos");
  return res.json();
}

async function deleteProduct(id: string) {
  const res = await fetch(`/api/admin/products/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error eliminando");
  return res.json();
}

export function Products() {
  const [q, setQ] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products", q],
    queryFn: () => fetchProducts(q),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  function handleDelete(id: string, name: string) {
    if (confirm(`¿Eliminar "${name}"?`)) deleteMutation.mutate(id);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Productos</h1>
          <p className="text-neutral-500 mt-1">{data?.length || 0} productos en total</p>
        </div>
        <button
          type="button"
          onClick={() => { setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-full font-semibold hover:bg-neutral-800 transition"
        >
          <Plus className="w-4 h-4" />
          Nuevo producto
        </button>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o SKU..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-neutral-500">Cargando...</div>
        ) : !data || data.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">No hay productos. Crea el primero.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3 hidden md:table-cell">Categoría</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p: Product) => (
                <tr key={p.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-neutral-100" />
                      <div className="min-w-0">
                        <p className="font-medium truncate max-w-[200px]">{p.name}</p>
                        <p className="text-xs text-neutral-500">{p.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-sm text-neutral-600">{p.category.name}</td>
                  <td className="px-4 py-3 font-medium">${Number(p.price).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      p.stock === 0 ? "bg-red-100 text-red-700"
                      : p.stock < 10 ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                    }`}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      p.active ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-600"
                    }`}>{p.active ? "Activo" : "Inactivo"}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button
                        type="button"
                        onClick={() => { setEditingId(p.id); setShowForm(true); }}
                        className="p-2 hover:bg-neutral-100 rounded-lg transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-neutral-200 flex items-center justify-between z-10">
              <h2 className="text-xl font-black">
                {editingId ? "Editar producto" : "Nuevo producto"}
              </h2>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="p-2 hover:bg-neutral-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <ProductForm
              productId={editingId}
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["admin-products"] });
                setShowForm(false);
                setEditingId(null);
              }}
              onCancel={() => { setShowForm(false); setEditingId(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
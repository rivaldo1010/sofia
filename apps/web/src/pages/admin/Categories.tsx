import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { API_URL } from "../../lib/api";

type Category = {
  id: string;
  name: string;
  slug: string;
  gender: string;
  active: boolean;
};

async function fetchCategories() {
  const res = await fetch(`${API_URL}/admin/categories`, { credentials: "include" });
  if (!res.ok) throw new Error("Error cargando categorías");
  return res.json();
}

export function Categories() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", gender: "HOMBRE", active: true });
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-categories-list"],
    queryFn: fetchCategories,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const url = editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Error guardando");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      closeForm();
    },
    onError: (err: any) => setError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Error eliminando");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (err: any) => alert(err.message),
  });

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setForm({ name: "", slug: "", gender: "HOMBRE", active: true });
    setError("");
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: "", slug: "", gender: "HOMBRE", active: true });
    setShowForm(true);
  }

  function openEdit(c: Category) {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug, gender: c.gender, active: c.active });
    setShowForm(true);
  }

  function handleNameChange(name: string) {
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setForm({ ...form, name, slug });
  }

  function handleDelete(c: Category) {
    if (confirm(`¿Eliminar categoría "${c.name}"?`)) {
      deleteMutation.mutate(c.id);
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Categorías</h1>
          <p className="text-neutral-500 mt-1">{data?.length || 0} categorías en total</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-full font-semibold hover:bg-neutral-800 transition"
        >
          <Plus className="w-4 h-4" />
          Nueva categoría
        </button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-neutral-500">Cargando...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((c: Category) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-neutral-200 p-5 hover:border-neutral-400 transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold">{c.name}</p>
                  <p className="text-xs text-neutral-500 font-mono">{c.slug}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    c.gender === "HOMBRE"
                      ? "bg-blue-100 text-blue-700"
                      : c.gender === "MUJER"
                      ? "bg-pink-100 text-pink-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {c.gender}
                </span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    c.active ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {c.active ? "Activa" : "Inactiva"}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(c)}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c)}
                    className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-xl font-black">
                {editing ? "Editar categoría" : "Nueva categoría"}
              </h2>
              <button onClick={closeForm} className="p-2 hover:bg-neutral-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveMutation.mutate();
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Nombre *</label>
                <input
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug *</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Género *</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                >
                  <option value="HOMBRE">Hombre</option>
                  <option value="MUJER">Mujer</option>
                  <option value="UNISEX">Unisex</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="accent-black"
                />
                Activa
              </label>

              {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}

              <div className="flex gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="flex-1 py-3 bg-black text-white rounded-full font-semibold hover:bg-neutral-800 transition disabled:bg-neutral-300"
                >
                  {saveMutation.isPending ? "Guardando..." : editing ? "Guardar cambios" : "Crear categoría"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-6 py-3 border border-neutral-300 rounded-full font-semibold hover:bg-neutral-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Upload, X, Loader2 } from "lucide-react";
import { API_URL } from "../../lib/api";

type Props = {
  productId: string | null;
  onSuccess: () => void;
  onCancel: () => void;
};

const empty = {
  name: "",
  slug: "",
  description: "",
  price: "",
  comparePrice: "",
  sku: "",
  brand: "",
  gender: "HOMBRE",
  categoryId: "",
  images: "",
  colors: "",
  sizes: "",
  keywords: "",
  stock: "0",
  featured: false,
  isNew: false,
  active: true,
  colorImages: {} as Record<string, string>,
};

export function ProductForm({ productId, onSuccess, onCancel }: Props) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const r = await fetch(`${API_URL}/admin/categories`, { credentials: "include" });
      return r.json();
    },
  });

  useEffect(() => {
    if (productId) {
      fetch(`/api/admin/products/${productId}`, { credentials: "include" })
        .then((r) => r.json())
        .then((p) => {
          setForm({
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: String(p.price),
            comparePrice: p.comparePrice ? String(p.comparePrice) : "",
            sku: p.sku,
            brand: p.brand || "",
            gender: p.gender,
            categoryId: p.categoryId,
            images: (p.images || []).join("\n"),
            colors: (p.colors || []).join(", "),
            sizes: (p.sizes || []).join(", "),
            keywords: (p.keywords || []).join(", "),
            stock: String(p.stock),
            featured: p.featured,
            isNew: p.isNew,
            active: p.active,
            colorImages: (p.colorImages as Record<string, string>) || {},
          });
        });
    } else {
      setForm(empty);
    }
  }, [productId]);

  function onChange(e: any) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  function onNameChange(e: any) {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setForm({ ...form, name, slug });
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error subiendo imagen");
      }

      const data = await res.json();

      const currentImages = form.images ? form.images.split("\n").filter(Boolean) : [];
      currentImages.push(data.url);
      setForm({ ...form, images: currentImages.join("\n") });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleColorImageUpload(
    color: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error subiendo imagen");
      }

      const data = await res.json();
      setForm({
        ...form,
        colorImages: { ...form.colorImages, [color]: data.url },
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        price: Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
        sku: form.sku,
        brand: form.brand,
        gender: form.gender,
        categoryId: form.categoryId,
        images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
        colorImages:
          Object.keys(form.colorImages).length > 0 ? form.colorImages : null,
        colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        keywords: form.keywords.split(",").map((s) => s.trim()).filter(Boolean),
        stock: Number(form.stock),
        featured: form.featured,
        isNew: form.isNew,
        active: form.active,
      };

      const url = productId
        ? `/api/admin/products/${productId}`
        : "/api/admin/products";
      const method = productId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Error guardando");
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredCats =
    categories?.filter((c: any) => c.gender === form.gender) || [];

  return (
    <form onSubmit={onSubmit} className="p-6 space-y-5">
      {/* Nombre y Slug */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre *</label>
          <input
            name="name"
            value={form.name}
            onChange={onNameChange}
            required
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug (URL) *</label>
          <input
            name="slug"
            value={form.slug}
            onChange={onChange}
            required
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          rows={3}
          className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
        />
      </div>

      {/* Precio, Precio anterior, SKU */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Precio *</label>
          <input
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={onChange}
            required
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Precio anterior</label>
          <input
            name="comparePrice"
            type="number"
            step="0.01"
            value={form.comparePrice}
            onChange={onChange}
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SKU *</label>
          <input
            name="sku"
            value={form.sku}
            onChange={onChange}
            required
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
          />
        </div>
      </div>

      {/* Marca y Género */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Marca</label>
          <input
            name="brand"
            value={form.brand}
            onChange={onChange}
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Género *</label>
          <select
            name="gender"
            value={form.gender}
            onChange={onChange}
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
          >
            <option value="HOMBRE">Hombre</option>
            <option value="MUJER">Mujer</option>
            <option value="UNISEX">Unisex</option>
          </select>
        </div>
      </div>

      {/* Categoría */}
      <div>
        <label className="block text-sm font-medium mb-1">Categoría *</label>
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={onChange}
          required
          className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
        >
          <option value="">Seleccionar categoría</option>
          {filteredCats.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Imágenes generales */}
      <div>
        <label className="block text-sm font-medium mb-1">Imágenes</label>

        <div className="mb-3">
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold cursor-pointer hover:bg-neutral-800 transition">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Subir imagen desde mi PC
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <p className="text-xs text-neutral-500 mt-1">
            Formatos: JPG, PNG, WEBP. Máximo 5 MB.
          </p>
        </div>

        {form.images && (
          <div className="grid grid-cols-4 gap-2 mb-3">
            {form.images
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean)
              .map((url, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200"
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      const imgs = form.images
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      imgs.splice(i, 1);
                      setForm({ ...form, images: imgs.join("\n") });
                    }}
                    className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-red-500 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
          </div>
        )}

        <textarea
          name="images"
          value={form.images}
          onChange={onChange}
          rows={2}
          placeholder="O pega URLs aquí, una por línea"
          className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono text-xs"
        />
      </div>

      {/* Colores y Tallas */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Colores (coma)</label>
          <input
            name="colors"
            value={form.colors}
            onChange={onChange}
            placeholder="negro, blanco"
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tallas (coma)</label>
          <input
            name="sizes"
            value={form.sizes}
            onChange={onChange}
            placeholder="S, M, L, XL"
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
          />
        </div>
      </div>

      {/* Imágenes por color */}
      {form.colors.trim() && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Imágenes por color (opcional)
          </label>
          <p className="text-xs text-neutral-500 mb-3">
            Sube una imagen para cada color. Si un color no tiene imagen, se usará la principal.
          </p>
          <div className="space-y-2">
            {form.colors
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .map((color) => {
                const url = form.colorImages[color];
                return (
                  <div
                    key={color}
                    className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                  >
                    {url ? (
                      <img
                        src={url}
                        alt={color}
                        className="w-12 h-12 rounded-lg object-cover bg-white"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-neutral-200 flex items-center justify-center text-xs text-neutral-500">
                        ?
                      </div>
                    )}
                    <span className="flex-1 font-medium text-sm capitalize">
                      {color}
                    </span>
                    <label className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-neutral-800 transition">
                      <Upload className="w-3 h-3" />
                      {url ? "Cambiar" : "Subir"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleColorImageUpload(color, e)}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    {url && (
                      <button
                        type="button"
                        onClick={() => {
                          const newColorImages = { ...form.colorImages };
                          delete newColorImages[color];
                          setForm({ ...form, colorImages: newColorImages });
                        }}
                        className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Keywords (coma)
        </label>
        <input
          name="keywords"
          value={form.keywords}
          onChange={onChange}
          placeholder="gorra, negra, deportiva"
          className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
        />
      </div>

      {/* Stock y checkboxes */}
      <div className="grid md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={onChange}
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={onChange}
            className="accent-black"
          />
          Destacado
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isNew"
            checked={form.isNew}
            onChange={onChange}
            className="accent-black"
          />
          Nuevo
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={onChange}
            className="accent-black"
          />
          Activo
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
      )}

      <div className="flex gap-3 pt-4 border-t border-neutral-200">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 bg-black text-white rounded-full font-semibold hover:bg-neutral-800 transition disabled:bg-neutral-300"
        >
          {loading
            ? "Guardando..."
            : productId
            ? "Guardar cambios"
            : "Crear producto"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-neutral-300 rounded-full font-semibold hover:bg-neutral-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
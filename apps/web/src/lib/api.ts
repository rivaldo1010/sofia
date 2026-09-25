export const API_URL = import.meta.env.VITE_API_URL || "/api";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string | number;
  comparePrice: string | number | null;
  brand: string | null;
  gender: "HOMBRE" | "MUJER" | "UNISEX";
  images: string[];
  colorImages?: Record<string, string> | null;
  colors: string[];
  sizes: string[];
  stock: number;
  featured: boolean;
  isNew: boolean;
  category: { id: string; name: string; slug: string };
};

export type ProductsResponse = {
  items: Product[];
  total: number;
  page: number;
};

export async function fetchProducts(params: {
  gender?: "HOMBRE" | "MUJER";
  category?: string;
  q?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<ProductsResponse> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  });

  const res = await fetch(`${API_URL}/products?${qs.toString()}`);
  if (!res.ok) throw new Error("Error cargando productos");
  return res.json();
}

export async function fetchProduct(slug: string): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${slug}`);
  if (!res.ok) throw new Error("Producto no encontrado");
  return res.json();
}
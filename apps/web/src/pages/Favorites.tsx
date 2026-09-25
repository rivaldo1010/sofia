import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "../components/ProductCard";
import { useAuth } from "../store/auth";

async function fetchFavorites() {
  const res = await fetch("/api/favorites", { credentials: "include" });
  if (!res.ok) throw new Error("Error cargando favoritos");
  return res.json();
}

export function Favorites() {
  const user = useAuth((s) => s.user);

  const { data, isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Heart className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
        <h1 className="text-3xl font-black mb-2">Inicia sesión para ver tus favoritos</h1>
        <p className="text-neutral-500 mb-8">
          Guarda tus productos preferidos y encuéntralos fácilmente
        </p>
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black mb-6">Mis favoritos</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-neutral-200 rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Heart className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
        <h1 className="text-3xl font-black mb-2">No tienes favoritos aún</h1>
        <p className="text-neutral-500 mb-8">
          Explora la tienda y guarda los productos que te gusten
        </p>
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">Mis favoritos</h1>
        <p className="text-neutral-500 mt-1">
          {data.length} {data.length === 1 ? "producto" : "productos"}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {data.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
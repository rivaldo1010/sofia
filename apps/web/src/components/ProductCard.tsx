import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavorites } from "../store/favorites";
import { useAuth } from "../store/auth";

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  comparePrice?: string | number | null;
  images: string[];
  colors: string[];
  stock: number;
  brand?: string | null;
};

export function ProductCard({ product }: { product: Product }) {
  const { has, toggle } = useFavorites();
  const user = useAuth((s) => s.user);
  const isFav = has(product.id);

  function handleFavoriteClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    toggle(product.id);
  }

  const price = Number(product.price);
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null;
  const discount = comparePrice
    ? Math.round((1 - price / comparePrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-neutral-300 hover:shadow-xl transition-all duration-300">
      {/* Imagen */}
      <Link
        to={`/producto/${product.slug}`}
        className="block relative aspect-[4/5] bg-neutral-100 overflow-hidden"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            loading="lazy"
          />
        )}

        {/* Badge de descuento */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}

        {/* Badge de agotado */}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 bg-neutral-900 text-white text-xs font-bold px-2 py-1 rounded-full">
            Agotado
          </span>
        )}
      </Link>

      {/* Botón favoritos */}
      <button
        type="button"
        onClick={handleFavoriteClick}
        aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition shadow-sm z-10"
      >
        <Heart
          className={`w-4 h-4 transition ${
            isFav ? "fill-red-500 text-red-500" : "text-neutral-700"
          }`}
        />
      </button>

      {/* Info */}
      <div className="p-4">
        <Link to={`/producto/${product.slug}`}>
          <h3 className="font-medium text-sm text-neutral-900 truncate hover:text-neutral-600 transition">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-neutral-900">
            ${price.toFixed(2)}
          </span>
          {comparePrice && comparePrice > price && (
            <span className="text-sm text-neutral-400 line-through">
              ${comparePrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Colores disponibles */}
        {product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color}
                title={color}
                className="w-3 h-3 rounded-full border border-neutral-300"
                style={{ backgroundColor: colorToHex(color) }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-neutral-500">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}

        <button
          type="button"
          disabled={product.stock === 0}
          className="mt-3 w-full py-2 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? "Agotado" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}

// Convierte nombres de color a un código hex para mostrar el circulito
function colorToHex(color: string): string {
  const map: Record<string, string> = {
    negro: "#000000",
    blanco: "#ffffff",
    gris: "#9ca3af",
    rojo: "#ef4444",
    azul: "#3b82f6",
    verde: "#22c55e",
    amarillo: "#eab308",
    rosa: "#ec4899",
    beige: "#d6c7a1",
    cafe: "#78350f",
    marron: "#78350f",
    dorado: "#facc15",
    plata: "#d1d5db",
    floral: "#f472b6",
    naranja: "#f97316",
    morado: "#a855f7",
  };
  return map[color.toLowerCase()] || "#d4d4d4";
}
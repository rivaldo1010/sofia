import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../lib/api";
import { ProductCard } from "../components/ProductCard";

type Gender = "HOMBRE" | "MUJER";

export function Catalog({ gender }: { gender: Gender }) {
  const [params] = useSearchParams();
  const q = params.get("q") || "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", gender, q],
    queryFn: () => fetchProducts({ gender, q, limit: 40 }),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          {gender === "HOMBRE" ? "HOMBRE" : "MUJER"}
        </h1>
        <p className="text-neutral-500 mt-2">
          {isLoading
            ? "Cargando productos..."
            : `${data?.total ?? 0} productos disponibles`}
        </p>
      </div>

      {/* Búsqueda activa */}
      {q && (
        <div className="mb-6 text-sm text-neutral-600">
          Resultados para: <span className="font-bold">"{q}"</span>
        </div>
      )}

      {/* Grid de productos */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-neutral-200 rounded-2xl" />
              <div className="h-4 bg-neutral-200 rounded mt-3 w-3/4" />
              <div className="h-4 bg-neutral-200 rounded mt-2 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-16 text-red-500">
          Error cargando productos. Verifica que el backend esté corriendo.
        </div>
      )}

      {!isLoading && !isError && data?.items.length === 0 && (
        <div className="text-center py-16 text-neutral-500">
          No encontramos productos que coincidan con tu búsqueda.
        </div>
      )}

      {!isLoading && !isError && data && data.items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {data.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Heart, Minus, Plus, ShoppingBag, ChevronLeft } from "lucide-react";
import { fetchProduct } from "../lib/api";
import { useCart } from "../store/cart";
import { useFavorites } from "../store/favorites";
import { useAuth } from "../store/auth";
import { useConfig, buildWhatsAppLink } from "../store/config";

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const addToCart = useCart((s) => s.add);
  const { has, toggle } = useFavorites();
  const user = useAuth((s) => s.user);
  const { whatsappNumber } = useConfig();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug!),
    enabled: !!slug,
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [colorImageUrl, setColorImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  // Inicializar color y talla
  useEffect(() => {
    if (product && !selectedColor) {
      setSelectedColor(product.colors[0]);
      setSelectedSize(product.sizes[0]);
    }
  }, [product, selectedColor]);

  // Actualizar imagen según color
  useEffect(() => {
    if (product && selectedColor && product.colorImages) {
      const colorImages = product.colorImages as Record<string, string>;
      const newUrl = colorImages[selectedColor] || null;
      if (newUrl !== colorImageUrl) {
        setImageLoading(true);
        setColorImageUrl(newUrl);
      }
    } else {
      setColorImageUrl(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, selectedColor]);

  // Precargar TODAS las imágenes de colores
  useEffect(() => {
    if (product && product.colorImages) {
      const colorImages = product.colorImages as Record<string, string>;
      Object.values(colorImages).forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    }
    // También precargar las imágenes generales
    if (product && product.images) {
      product.images.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4 animate-pulse" />
            <div className="h-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-black mb-4 text-black dark:text-white">
          Producto no encontrado
        </h1>
        <Link
          to="/"
          className="text-neutral-500 dark:text-neutral-400 underline"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  const price = Number(product.price);
  const comparePrice = product.comparePrice
    ? Number(product.comparePrice)
    : null;
  const discount = comparePrice
    ? Math.round((1 - price / comparePrice) * 100)
    : 0;

  const currentImage = colorImageUrl || product.images[selectedImage];

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price,
      image: currentImage,
      color: selectedColor,
      size: selectedSize,
      quantity,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!whatsappNumber) return;

    const totalPrice = (price * quantity).toFixed(2);

    const message = `Hola Sofía! Quiero comprar:

🛍️ ${product.name}
🎨 Color: ${selectedColor}
📏 Talla: ${selectedSize}
📦 Cantidad: ${quantity}
💰 Precio: $${totalPrice}

━━━━━━━━━━━━━
TOTAL: $${totalPrice}

¿Me confirman disponibilidad y datos de pago?`;

    window.open(buildWhatsAppLink(whatsappNumber, message), "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        to={product.gender === "HOMBRE" ? "/hombre" : "/mujer"}
        className="inline-flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Volver a {product.gender === "HOMBRE" ? "Hombre" : "Mujer"}
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Galería */}
        <div>
          <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-2xl overflow-hidden mb-4 relative">
            <img
              src={currentImage}
              alt={product.name}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
            />
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white" />
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSelectedImage(i);
                    setColorImageUrl(null);
                  }}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === i
                      ? "border-black dark:border-white"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.brand && (
            <p className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">
              {product.brand}
            </p>
          )}
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-black dark:text-white">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-black dark:text-white">
              ${price.toFixed(2)}
            </span>
            {comparePrice && comparePrice > price && (
              <>
                <span className="text-lg text-neutral-400 dark:text-neutral-500 line-through">
                  ${comparePrice.toFixed(2)}
                </span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <p className="text-neutral-600 dark:text-neutral-300 mb-6">
            {product.description}
          </p>

          {/* Color */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium mb-2 text-black dark:text-white">
                Color:{" "}
                <span className="text-neutral-500 dark:text-neutral-400">
                  {selectedColor}
                </span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition ${
                      selectedColor === color
                        ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black"
                        : "border-neutral-300 dark:border-neutral-600 text-black dark:text-white hover:border-black dark:hover:border-white"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Talla */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium mb-2 text-black dark:text-white">
                Talla:{" "}
                <span className="text-neutral-500 dark:text-neutral-400">
                  {selectedSize}
                </span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-12 px-3 py-1.5 text-sm rounded-full border transition ${
                      selectedSize === size
                        ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black"
                        : "border-neutral-300 dark:border-neutral-600 text-black dark:text-white hover:border-black dark:hover:border-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cantidad */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2 text-black dark:text-white">
              Cantidad
            </p>
            <div className="inline-flex items-center border border-neutral-300 dark:border-neutral-600 rounded-full">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-l-full text-black dark:text-white"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium text-black dark:text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock, q + 1))
                }
                className="p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-r-full text-black dark:text-white"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              {product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 mb-4">
            <button
              type="button"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              className="flex-1 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              {added ? "¡Agregado!" : "Agregar al carrito"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  window.location.href = "/login";
                  return;
                }
                toggle(product.id);
              }}
              className="p-4 rounded-full border border-neutral-300 dark:border-neutral-600 hover:border-black dark:hover:border-white transition"
              aria-label="Favoritos"
            >
              <Heart
                className={`w-5 h-5 transition ${
                  has(product.id)
                    ? "fill-red-500 text-red-500"
                    : "text-black dark:text-white"
                }`}
              />
            </button>
          </div>

          {whatsappNumber && (
            <button
              type="button"
              disabled={product.stock === 0}
              onClick={handleWhatsApp}
              className="w-full py-4 rounded-full bg-green-500 text-white font-bold hover:bg-green-600 transition disabled:opacity-50 flex items-center justify-center gap-2 mb-3"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Comprar por WhatsApp
            </button>
          )}

          <button
            type="button"
            disabled={product.stock === 0}
            className="w-full py-4 rounded-full border-2 border-black dark:border-white text-black dark:text-white font-bold hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition disabled:opacity-50"
          >
            Comprar ahora (pago online)
          </button>

          <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
            <p>
              <span className="font-medium text-black dark:text-white">
                Categoría:
              </span>{" "}
              {product.category.name}
            </p>
            <p>
              <span className="font-medium text-black dark:text-white">
                Género:
              </span>{" "}
              {product.gender}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
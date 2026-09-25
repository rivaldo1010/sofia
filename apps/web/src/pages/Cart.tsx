import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../store/cart";
import { useConfig, buildWhatsAppLink } from "../store/config";

export function Cart() {
  const { items, remove, updateQty, total, count, clear } = useCart();
  const { whatsappNumber } = useConfig();

  function handleWhatsApp() {
    if (!whatsappNumber) return;

    const itemLines = items
      .map(
        (item, i) =>
          `${i + 1}. 🛍️ ${item.name}\n   Color: ${item.color} | Talla: ${item.size} | x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
      )
      .join("\n\n");

    const message = `Hola Sofía! Quiero hacer este pedido:

${itemLines}

━━━━━━━━━━━━━
TOTAL: $${total().toFixed(2)}

¿Me confirman disponibilidad y datos de pago?`;

    window.open(buildWhatsAppLink(whatsappNumber, message), "_blank");
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
        <h1 className="text-3xl font-black mb-2">Tu carrito está vacío</h1>
        <p className="text-neutral-500 mb-8">
          Explora la colección y agrega tus productos favoritos
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/hombre"
            className="px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-neutral-800 transition"
          >
            Ver Hombre
          </Link>
          <Link
            to="/mujer"
            className="px-6 py-3 border-2 border-black text-black rounded-full font-semibold hover:bg-black hover:text-white transition"
          >
            Ver Mujer
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
        Mi carrito
      </h1>
      <p className="text-neutral-500 mb-8">
        {count()} {count() === 1 ? "producto" : "productos"}
      </p>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.color}-${item.size}`}
              className="flex gap-4 bg-white border border-neutral-200 rounded-2xl p-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl bg-neutral-100"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{item.name}</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {item.color} · Talla {item.size}
                </p>
                <p className="text-lg font-bold mt-2">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  type="button"
                  onClick={() => remove(item.productId, item.color, item.size)}
                  className="p-2 text-neutral-400 hover:text-red-500 transition"
                  aria-label="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center border border-neutral-200 rounded-full">
                  <button
                    type="button"
                    onClick={() =>
                      updateQty(item.productId, item.color, item.size, item.quantity - 1)
                    }
                    className="p-2 hover:bg-neutral-100 rounded-l-full"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQty(item.productId, item.color, item.size, item.quantity + 1)
                    }
                    className="p-2 hover:bg-neutral-100 rounded-r-full"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={clear}
            className="text-sm text-neutral-500 hover:text-red-500 underline"
          >
            Vaciar carrito
          </button>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-neutral-50 rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Resumen</h2>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span className="font-medium">${total().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Envío</span>
                <span className="font-medium">Por calcular</span>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4 mb-6 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total().toFixed(2)}</span>
            </div>

            {whatsappNumber && (
              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full py-4 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition mb-3 flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Enviar pedido por WhatsApp
              </button>
            )}

            <Link
              to="/checkout"
              className="block w-full py-4 border-2 border-black text-black text-center rounded-full font-bold hover:bg-black hover:text-white transition mb-3"
            >
              Pago online
            </Link>

            <Link
              to="/hombre"
              className="block w-full py-3 text-neutral-500 text-center rounded-full font-medium hover:text-black transition text-sm"
            >
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
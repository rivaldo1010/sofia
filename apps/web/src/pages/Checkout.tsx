import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Check } from "lucide-react";
import { useCart } from "../store/cart";

const PROVINCIAS = [
  "Azuay", "Bolívar", "Cañar", "Carchi", "Chimborazo", "Cotopaxi",
  "El Oro", "Esmeraldas", "Galápagos", "Guayas", "Imbabura", "Loja",
  "Los Ríos", "Manabí", "Morona Santiago", "Napo", "Orellana", "Pastaza",
  "Pichincha", "Santa Elena", "Santo Domingo", "Sucumbíos", "Tungurahua",
  "Zamora Chinchipe",
];

const METODOS_ENVIO = [
  { id: "domicilio", label: "Envío a domicilio", price: 4.99 },
  { id: "retiro", label: "Retiro en tienda", price: 0 },
];

const METODOS_PAGO = [
  { id: "transferencia", label: "Transferencia bancaria" },
  { id: "tarjeta", label: "Tarjeta de crédito/débito" },
  { id: "contraentrega", label: "Pago contra entrega" },
];

export function Checkout() {
  const navigate = useNavigate();
  const { items, total, clear } = useCart();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    province: "",
    city: "",
    address: "",
    reference: "",
  });
  const [deliveryMethod, setDeliveryMethod] = useState("domicilio");
  const [paymentMethod, setPaymentMethod] = useState("transferencia");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shipping = METODOS_ENVIO.find((m) => m.id === deliveryMethod)?.price || 0;
  const finalTotal = total() + shipping;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Tu carrito está vacío");
      return;
    }

    if (!form.fullName || !form.phone || !form.email || !form.province || !form.city || !form.address) {
      setError("Por favor completa todos los campos obligatorios");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            color: i.color,
            size: i.size,
          })),
          customer: form,
          deliveryMethod,
          paymentMethod,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error creando pedido");
      }

      const order = await res.json();
      clear();
      navigate(`/pedido/${order.orderNumber}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-black mb-4">Tu carrito está vacío</h1>
        <Link to="/hombre" className="text-neutral-500 underline">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        to="/carrito"
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-black mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Volver al carrito
      </Link>

      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-8">
        Finalizar compra
      </h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información personal */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">Información personal</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="fullName"
                placeholder="Nombre completo *"
                value={form.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <input
                name="phone"
                placeholder="Teléfono *"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Correo electrónico *"
                value={form.email}
                onChange={handleChange}
                className="w-full md:col-span-2 px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>

          {/* Dirección */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">Dirección de envío</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <select
                name="province"
                value={form.province}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="">Provincia *</option>
                {PROVINCIAS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <input
                name="city"
                placeholder="Ciudad *"
                value={form.city}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <input
                name="address"
                placeholder="Dirección *"
                value={form.address}
                onChange={handleChange}
                className="w-full md:col-span-2 px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <input
                name="reference"
                placeholder="Referencia (opcional)"
                value={form.reference}
                onChange={handleChange}
                className="w-full md:col-span-2 px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Método de envío */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">Método de envío</h2>
            <div className="space-y-3">
              {METODOS_ENVIO.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition ${
                    deliveryMethod === m.id
                      ? "border-black bg-neutral-50"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      value={m.id}
                      checked={deliveryMethod === m.id}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="accent-black"
                    />
                    <span className="font-medium">{m.label}</span>
                  </div>
                  <span className="font-bold">
                    {m.price === 0 ? "Gratis" : `$${m.price.toFixed(2)}`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Método de pago */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">Método de pago</h2>
            <div className="space-y-3">
              {METODOS_PAGO.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition ${
                    paymentMethod === m.id
                      ? "border-black bg-neutral-50"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={paymentMethod === m.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-black mr-3"
                  />
                  <span className="font-medium">{m.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Resumen lateral */}
        <div className="lg:col-span-1">
          <div className="bg-neutral-50 rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4">Resumen del pedido</h2>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.color}-${item.size}`}
                  className="flex gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover bg-neutral-100"
                  />
                  <div className="flex-1 min-w-0 text-sm">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-xs text-neutral-500">
                      {item.color} · {item.size} · x{item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span>${total().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Envío</span>
                <span>{shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}</span>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4 mt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full py-4 bg-black text-white rounded-full font-bold hover:bg-neutral-800 transition disabled:bg-neutral-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                "Procesando..."
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Confirmar pedido
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
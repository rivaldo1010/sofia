import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Eye, X } from "lucide-react";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  color: string;
  size: string;
  price: string;
  image: string;
};

type Order = {
  id: string;
  orderNumber: string;
  fullName: string;
  phone: string;
  email: string;
  province: string;
  city: string;
  address: string;
  reference: string | null;
  paymentMethod: string;
  deliveryMethod: string;
  status: string;
  total: string;
  subtotal: string;
  shipping: string;
  createdAt: string;
  items: OrderItem[];
};

const STATUSES = [
  "PENDIENTE",
  "CONFIRMADO",
  "PREPARANDO",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
];

const STATUS_COLORS: Record<string, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  CONFIRMADO: "bg-blue-100 text-blue-700",
  PREPARANDO: "bg-purple-100 text-purple-700",
  ENVIADO: "bg-indigo-100 text-indigo-700",
  ENTREGADO: "bg-green-100 text-green-700",
  CANCELADO: "bg-red-100 text-red-700",
};

async function fetchOrders() {
  const res = await fetch("/api/admin/orders", { credentials: "include" });
  if (!res.ok) throw new Error("Error cargando pedidos");
  return res.json();
}

async function updateStatus(id: string, status: string) {
  const res = await fetch(`/api/admin/orders/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Error actualizando");
  return res.json();
}

export function Orders() {
  const [selected, setSelected] = useState<Order | null>(null);
  const [filter, setFilter] = useState("TODOS");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: fetchOrders,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setSelected(null);
    },
  });

  const filtered = (data || []).filter(
    (o: Order) => filter === "TODOS" || o.status === filter
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">Pedidos</h1>
        <p className="text-neutral-500 mt-1">
          {data?.length || 0} pedidos en total
        </p>
      </div>

      {/* Filtros por estado */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setFilter("TODOS")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            filter === "TODOS"
              ? "bg-black text-white"
              : "bg-white border border-neutral-200 hover:border-black"
          }`}
        >
          Todos
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === s
                ? "bg-black text-white"
                : "bg-white border border-neutral-200 hover:border-black"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-neutral-500">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center text-neutral-500">
          No hay pedidos con este filtro.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order: Order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-neutral-200 p-5 hover:border-neutral-400 transition"
            >
              <div className="flex flex-wrap items-center gap-4 justify-between">
                <div className="flex-1 min-w-[200px]">
                  <p className="font-bold text-lg">{order.orderNumber}</p>
                  <p className="text-sm text-neutral-500">
                    {order.fullName} · {order.phone}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleString("es-EC")}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-black text-xl">${Number(order.total).toFixed(2)}</p>
                  <p className="text-xs text-neutral-500">
                    {order.items.length} producto{order.items.length !== 1 && "s"}
                  </p>
                </div>

                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-bold ${STATUS_COLORS[order.status]}`}
                >
                  {order.status}
                </span>

                <button
                  type="button"
                  onClick={() => setSelected(order)}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-semibold hover:bg-neutral-800 transition"
                >
                  <Eye className="w-4 h-4" />
                  Ver detalle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalle */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-neutral-200 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-black">{selected.orderNumber}</h2>
                <p className="text-sm text-neutral-500 mt-0.5">
                  {new Date(selected.createdAt).toLocaleString("es-EC")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Cambiar estado */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Cambiar estado del pedido
                </label>
                <div className="flex gap-2 flex-wrap">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={selected.status === s}
                      onClick={() =>
                        statusMutation.mutate({ id: selected.id, status: s })
                      }
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        selected.status === s
                          ? "bg-black text-white cursor-default"
                          : "border border-neutral-300 hover:border-black"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cliente */}
              <div className="bg-neutral-50 rounded-xl p-4">
                <h3 className="font-bold mb-2 text-sm uppercase text-neutral-500">
                  Cliente
                </h3>
                <p className="font-medium">{selected.fullName}</p>
                <p className="text-sm text-neutral-600">{selected.email}</p>
                <p className="text-sm text-neutral-600">{selected.phone}</p>
              </div>

              {/* Dirección */}
              <div className="bg-neutral-50 rounded-xl p-4">
                <h3 className="font-bold mb-2 text-sm uppercase text-neutral-500">
                  Dirección de envío
                </h3>
                <p className="text-sm">
                  {selected.address}, {selected.city}, {selected.province}
                </p>
                {selected.reference && (
                  <p className="text-sm text-neutral-500 mt-1">
                    Referencia: {selected.reference}
                  </p>
                )}
                <p className="text-sm text-neutral-500 mt-1">
                  Método: {selected.deliveryMethod === "retiro" ? "Retiro en tienda" : "Envío a domicilio"}
                </p>
              </div>

              {/* Pago */}
              <div className="bg-neutral-50 rounded-xl p-4">
                <h3 className="font-bold mb-2 text-sm uppercase text-neutral-500">
                  Método de pago
                </h3>
                <p className="text-sm capitalize">{selected.paymentMethod}</p>
              </div>

              {/* Productos */}
              <div>
                <h3 className="font-bold mb-3 text-sm uppercase text-neutral-500">
                  Productos
                </h3>
                <div className="space-y-2">
                  {selected.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl"
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="w-14 h-14 rounded-lg object-cover bg-white"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-neutral-500">
                          {item.color} · {item.size} · x{item.quantity}
                        </p>
                      </div>
                      <p className="font-bold">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totales */}
              <div className="border-t border-neutral-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Subtotal</span>
                  <span>${Number(selected.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Envío</span>
                  <span>${Number(selected.shipping).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-black pt-2 border-t border-neutral-200">
                  <span>Total</span>
                  <span>${Number(selected.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
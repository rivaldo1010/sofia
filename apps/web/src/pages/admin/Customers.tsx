import { useQuery } from "@tanstack/react-query";
import { User, Mail, Phone, Calendar, ShoppingBag } from "lucide-react";
import { API_URL } from "../../lib/api";

async function fetchCustomers() {
  const res = await fetch(`${API_URL}/admin/customers`, { credentials: "include" });
  if (!res.ok) throw new Error("Error cargando clientes");
  return res.json();
}

type Customer = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
};

export function Customers() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: fetchCustomers,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-black mb-6">Clientes</h1>
        <div className="p-8 text-center text-neutral-500">Cargando...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-black mb-6">Clientes</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          Error cargando clientes.
        </div>
      </div>
    );
  }

  const customers: Customer[] = data || [];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">Clientes</h1>
        <p className="text-neutral-500 mt-1">
          {customers.length} {customers.length === 1 ? "cliente registrado" : "clientes registrados"}
        </p>
      </div>

      {customers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center text-neutral-500">
          Aún no hay clientes registrados.
        </div>
      ) : (
        <div className="grid gap-4">
          {customers.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-neutral-200 p-5 hover:border-neutral-400 transition"
            >
              <div className="flex flex-wrap items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-neutral-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{c.name || "Sin nombre"}</p>
                      {c.role === "ADMIN" && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {c.email}
                      </span>
                      {c.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {c.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(c.createdAt).toLocaleDateString("es-EC")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 text-right">
                  <div>
                    <p className="text-xs text-neutral-500 flex items-center gap-1 justify-end">
                      <ShoppingBag className="w-3 h-3" />
                      Pedidos
                    </p>
                    <p className="font-black text-lg">{c.ordersCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Total gastado</p>
                    <p className="font-black text-lg text-green-600">
                      ${c.totalSpent.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
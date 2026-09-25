import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Database,
  Server,
  Package,
  Users,
  ShoppingBag,
  HardDrive,
  CheckCircle,
  MessageCircle,
  Save,
} from "lucide-react";
import { API_URL } from "../lib/api";

async function fetchSettingsData() {
  const res = await fetch(`${API_URL}/admin/settings-info`, { credentials: "include" });
  if (!res.ok) throw new Error("Error cargando configuración");
  return res.json();
}

async function fetchAdminConfig() {
  const res = await fetch(`${API_URL}/admin/config`, { credentials: "include" });
  if (!res.ok) throw new Error("Error cargando config");
  return res.json();
}

export function Settings() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-settings-info"],
    queryFn: fetchSettingsData,
  });

  const { data: config } = useQuery({
    queryKey: ["admin-config"],
    queryFn: fetchAdminConfig,
  });

  const [form, setForm] = useState({
    whatsappNumber: "",
    whatsappMessage: "",
    storeName: "",
    currency: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (config) {
      setForm({
        whatsappNumber: config.whatsappNumber || "",
        whatsappMessage: config.whatsappMessage || "",
        storeName: config.storeName || "Sofía",
        currency: config.currency || "USD",
      });
    }
  }, [config]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/admin/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Error guardando");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-config"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-black mb-6">Configuración</h1>
        <div className="p-8 text-center text-neutral-500">Cargando...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-black mb-6">Configuración</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          Error cargando información del sistema.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">Configuración</h1>
        <p className="text-neutral-500 mt-1">Información y estado del sistema</p>
      </div>

      {/* WhatsApp */}
      <div className="bg-white rounded-2xl border-2 border-green-200 p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold">WhatsApp para ventas</h2>
            <p className="text-xs text-neutral-500">
              Los clientes podrán enviarte pedidos directo por WhatsApp
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Número de WhatsApp (con código de país)
            </label>
            <input
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              placeholder="+593963735413"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Formato: +593XXXXXXXXX (con + y código de país)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Mensaje adicional (opcional)
            </label>
            <textarea
              value={form.whatsappMessage}
              onChange={(e) => setForm({ ...form, whatsappMessage: e.target.value })}
              rows={2}
              placeholder="Si quieres agregar un texto adicional al mensaje"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Info de la tienda */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-8">
        <h2 className="font-bold mb-4">Datos de la tienda</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre de la tienda</label>
            <input
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Moneda</label>
            <input
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
      </div>

      {/* Botón guardar */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-neutral-800 transition disabled:bg-neutral-300"
        >
          <Save className="w-4 h-4" />
          {saveMutation.isPending ? "Guardando..." : "Guardar cambios"}
        </button>

        {saved && (
          <span className="ml-4 text-green-600 font-medium inline-flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            ¡Guardado!
          </span>
        )}
      </div>

      {/* Servicios */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Base de datos",
            value: "PostgreSQL 16",
            subtitle: "Estado: conectado",
            icon: Database,
            color: "bg-blue-100 text-blue-700",
          },
          {
            label: "Backend",
            value: "Node.js + Express",
            subtitle: "Puerto 4000",
            icon: Server,
            color: "bg-green-100 text-green-700",
          },
          {
            label: "Frontend",
            value: "React + Vite",
            subtitle: "Puerto 5173",
            icon: HardDrive,
            color: "bg-purple-100 text-purple-700",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl border border-neutral-200 p-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-sm text-neutral-500 mt-4">{card.label}</p>
              <p className="text-lg font-bold mt-1">{card.value}</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
                <CheckCircle className="w-3 h-3" />
                {card.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Estadísticas */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h2 className="font-bold mb-4">Estadísticas actuales</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: "Productos", value: data.totalProducts, icon: Package, color: "bg-blue-100 text-blue-700" },
            { label: "Pedidos", value: data.totalOrders, icon: ShoppingBag, color: "bg-green-100 text-green-700" },
            { label: "Clientes", value: data.totalUsers, icon: Users, color: "bg-purple-100 text-purple-700" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">{s.label}</p>
                  <p className="text-2xl font-black">{s.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
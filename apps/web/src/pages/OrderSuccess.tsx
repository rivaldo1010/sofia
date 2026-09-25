import { Link, useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export function OrderSuccess() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>

      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
        ¡Pedido recibido!
      </h1>

      <p className="text-neutral-500 mb-8">
        Gracias por tu compra. Te contactaremos pronto para confirmar el pago y el envío.
      </p>

      <div className="bg-neutral-50 rounded-2xl p-6 mb-8 text-left">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-neutral-500">Número de pedido</span>
          <span className="font-bold text-lg">{id}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-neutral-500">Estado</span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
            Pendiente
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500">Método de pago</span>
          <span className="font-medium text-sm">Por confirmar</span>
        </div>
      </div>

      <p className="text-sm text-neutral-500 mb-8">
        Guarda tu número de pedido <span className="font-bold text-black">{id}</span> para
        consultar el estado más adelante.
      </p>

      <div className="flex gap-3 justify-center">
        <Link
          to="/"
          className="px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-neutral-800 transition"
        >
          Volver al inicio
        </Link>
        <Link
          to="/hombre"
          className="px-6 py-3 border-2 border-black text-black rounded-full font-semibold hover:bg-black hover:text-white transition"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
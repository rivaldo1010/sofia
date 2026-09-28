import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { API_URL } from "../lib/api";

export function Login() {
  const navigate = useNavigate();
  const setUser = useAuth((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      setUser(data);
      navigate(data.role === "ADMIN" ? "/admin" : "/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-black mb-2 text-black dark:text-white">
        Iniciar sesión
      </h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">
        Bienvenido de vuelta a Sofía
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-500 rounded-xl border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-500 rounded-xl border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          required
        />

        {error && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:text-neutral-500"
        >
          {loading ? "Iniciando..." : "Iniciar sesión"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        ¿No tienes cuenta?{" "}
        <Link
          to="/registro"
          className="text-black dark:text-white font-medium underline"
        >
          Regístrate
        </Link>
      </p>
    </div>
  );
}
import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero con imagen de fondo */}
      <section className="relative text-white overflow-hidden min-h-[600px] flex items-center">
        <img
          src="/hero.jpg"
          alt="Hero Sofía"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 py-24 md:py-32 relative z-10 w-full">
          <p className="text-xs tracking-[0.3em] text-neutral-300 mb-4">
            NUEVA COLECCIÓN 2026
          </p>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-6">
            ESTILO
            <br />
            SIN LÍMITES
          </h1>
          <p className="text-lg text-neutral-200 max-w-md mb-8">
            Moda, calidad y actitud en un solo lugar.
          </p>
          <Link
            to="/hombre"
            className="inline-block px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition"
          >
            Comprar ahora
          </Link>
        </div>
      </section>

      {/* Selección Hombre / Mujer con imágenes */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-4">
        <Link
          to="/hombre"
          className="group relative rounded-3xl overflow-hidden aspect-[4/5] md:aspect-auto md:h-96"
        >
          <img
            src="/hombre.jpg"
            alt="Hombre"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
          <div className="absolute bottom-8 left-8 z-20 text-white">
            <h2 className="text-4xl md:text-5xl font-black mb-2">HOMBRE</h2>
            <p className="text-neutral-200 mb-4">Explora la colección</p>
            <span className="inline-block px-6 py-2 bg-white text-black rounded-full font-semibold text-sm group-hover:bg-neutral-200 transition">
              Ver productos →
            </span>
          </div>
        </Link>

        <Link
          to="/mujer"
          className="group relative rounded-3xl overflow-hidden aspect-[4/5] md:aspect-auto md:h-96"
        >
          <img
            src="/mujer.jpg"
            alt="Mujer"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
          <div className="absolute bottom-8 left-8 z-20 text-white">
            <h2 className="text-4xl md:text-5xl font-black mb-2">MUJER</h2>
            <p className="text-neutral-200 mb-4">Explora la colección</p>
            <span className="inline-block px-6 py-2 bg-white text-black rounded-full font-semibold text-sm group-hover:bg-neutral-200 transition">
              Ver productos →
            </span>
          </div>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-12 text-center text-sm text-neutral-500">
        <p className="font-black text-2xl text-black mb-2">Sofía</p>
        <p>© 2026 Sofía. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
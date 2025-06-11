// app/Home_publico/page.js
import Head from 'next/head';

export default function HomePublico() {
  return (
    <>
      <Head>
        <title>cardsG | Home Público</title>
        <meta name="description" content="Página pública de bienvenida para usuarios no autenticados." />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 text-gray-800">
        <div className="w-full max-w-4xl p-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bienvenido a cardsG</h1>
          <p className="text-lg md:text-xl mb-8">
            Plataforma de gestión de cartas digitales. Inicia sesión para interactuar.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
              Iniciar Sesión
            </button>
            <button className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition">
              Registrarse
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

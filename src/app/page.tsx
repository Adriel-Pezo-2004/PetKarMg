import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header profesional */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <svg className="h-8 w-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
            </svg>
            <h1 className="ml-2 text-xl font-semibold text-gray-900">Petkar Manager</h1>
          </div>

        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Hola Karen 🌞
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              ¿Qué haremos hoy?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/appointments" className="group">
              <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:border-indigo-300 transition-all duration-200 h-full">
                <div className="px-6 py-8 sm:p-10">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-lg leading-6 font-medium text-gray-900">Gestión de Citas</h3>
                  </div>
                  <div className="mt-6">
                    <p className="text-base text-gray-500">
                      Visualiza, organiza y gestiona todas las citas programadas de manera eficiente.
                    </p>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-sm text-indigo-600 group-hover:text-indigo-800 transition-colors">Ingresar</span>
                  <svg className="h-5 w-5 text-indigo-600 group-hover:text-indigo-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>

            <Link href="/clients" className="group">
              <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:border-indigo-300 transition-all duration-200 h-full">
                <div className="px-6 py-8 sm:p-10">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="ml-4 text-lg leading-6 font-medium text-gray-900">Gestión de Clientes</h3>
                  </div>
                  <div className="mt-6">
                    <p className="text-base text-gray-500">
                      Administra toda la información de tus clientes y su historial de citas.
                    </p>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-sm text-indigo-600 group-hover:text-indigo-800 transition-colors">Ingresar</span>
                  <svg className="h-5 w-5 text-indigo-600 group-hover:text-indigo-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer profesional */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-sm text-gray-500">© 2025 Adriel Pezo. Todos los derechos reservados.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
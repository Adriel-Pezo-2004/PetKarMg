"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import * as Toast from "@radix-ui/react-toast";

const ClientsPage = () => {
  const [dni, setDni] = useState("");
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchAllClients = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/clients");
        if (response.ok) {
          const data = await response.json();
          setClients(data);
          setError("");
        } else {
          setError("Error al obtener todos los clientes.");
          setClients([]);
        }
      } catch (err) {
        console.error("Error al obtener clientes:", err);
        setError("Error al obtener clientes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllClients();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (dni.length !== 8) {
      setError("El DNI debe tener 8 dígitos.");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const response = await fetch(`/api/clients?dni=${dni}`);
      if (response.ok) {
        const data = await response.json();
        setClients([data]);
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error al buscar clientes.");
        setClients([]);
        setToastMessage("No se encontraron clientes");
        setOpenToast(true);
      }
    } catch (err) {
      console.error("Error al buscar clientes:", err);
      setToastMessage("Error al buscar clientes");
      setOpenToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex flex-col items-center justify-center relative">
      {/* Botón Volver */}
      <Link
        href="/"
        className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors mb-4 sm:mb-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Volver al inicio
      </Link>

      {/* Contenedor principal */}
      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-10 sm:mt-0">
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6 text-center">
            Gestor de Clientes
          </h1>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="text"
                placeholder="Ingrese el DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/[^0-9]/g, ""))}
                maxLength={8}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center justify-center min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Buscando...
                  </>
                ) : (
                  "Buscar"
                )}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}
          </form>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : hasSearched && clients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No se encontraron clientes para el DNI ingresado.
              </p>
            </div>
          ) : clients.length > 0 ? (
            <div className="space-y-4">
              <ul className="space-y-4">
                {clients.map((client) => (
                  <li
                    key={client.id}
                    className="p-4 sm:p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-bold text-indigo-600">
                      {client.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-gray-600">
                          DNI:{" "}
                          <span className="text-gray-800">{client.dni}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Teléfono:{" "}
                          <span className="text-gray-800">
                            {client.phone || "N/A"}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Registrado el:{" "}
                          <span className="text-gray-800">
                            {new Date(client.createdAt).toLocaleDateString()}
                          </span>
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Ingrese un DNI y haga clic en Buscar para ver los clientes</p>
            </div>
          )}

          <Toast.Provider duration={5000}>
            <Toast.Root
              open={openToast}
              onOpenChange={setOpenToast}
              className="bg-white border border-indigo-300 rounded-lg p-4 shadow-lg animate-in fade-in slide-in-from-right-8"
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <Toast.Title className="font-medium text-indigo-600">
                    Notificación
                  </Toast.Title>
                  <Toast.Description className="text-gray-600 mt-1">
                    {toastMessage}
                  </Toast.Description>
                </div>
                <Toast.Close className="ml-4 text-gray-400 hover:text-gray-600">
                  ×
                </Toast.Close>
              </div>
            </Toast.Root>
            <Toast.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2 w-full max-w-xs z-50" />
          </Toast.Provider>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
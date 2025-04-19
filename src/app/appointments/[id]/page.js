"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Toast from '@radix-ui/react-toast';

const AppointmentDetailsPage = ({ params }) => {
  const { id } = params; // Obtener el ID de la cita desde los parámetros de la URL
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState('');
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`/api/appointments/${id}`);
        if (response.ok) {
          const data = await response.json();
          setAppointment(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Error al obtener la cita.');
          setToastMessage('No se pudo cargar la cita');
          setOpenToast(true);
        }
      } catch (err) {
        console.error('Error al obtener la cita:', err);
        setError('Ocurrió un error al obtener la cita.');
        setToastMessage('Error al obtener la cita');
        setOpenToast(true);
      }
    };

    fetchAppointment();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 flex items-center justify-center">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Cargando cita...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
          Detalles de la Cita
        </h1>

        <div className="p-5 border border-gray-700 rounded-xl bg-gray-800/50">
          <h3 className="text-lg font-bold text-cyan-400">{appointment.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-400">Tipo: <span className="text-gray-300">{appointment.type}</span></p>
              <p className="text-sm text-gray-400">Descripción: <span className="text-gray-300">{appointment.description || 'N/A'}</span></p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Fecha: <span className="text-gray-300">{new Date(appointment.date).toLocaleDateString()}</span></p>
              <p className="text-sm text-gray-400">Hora: <span className="text-gray-300">{appointment.time}</span></p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-400">Dirección: <span className="text-gray-300">{appointment.address || 'N/A'}</span></p>
            <p className="text-sm text-gray-400">Estado: <span className="text-gray-300">{appointment.status}</span></p>
          </div>
        </div>

        <button
          onClick={() => router.push('/appointments')}
          className="mt-6 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg shadow-sm hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
        >
          Volver a la lista de citas
        </button>

        <Toast.Provider duration={5000}>
          <Toast.Root
            open={openToast}
            onOpenChange={setOpenToast}
            className="bg-gray-800 border border-cyan-500/30 rounded-lg p-4 shadow-lg animate-in fade-in slide-in-from-right-8"
          >
            <div className="flex items-start">
              <div className="flex-1">
                <Toast.Title className="font-medium text-cyan-400">
                  Notificación
                </Toast.Title>
                <Toast.Description className="text-gray-300 mt-1">
                  {toastMessage}
                </Toast.Description>
              </div>
              <Toast.Close className="ml-4 text-gray-400 hover:text-gray-200">
                ×
              </Toast.Close>
            </div>
          </Toast.Root>
          <Toast.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2 w-full max-w-xs z-50" />
        </Toast.Provider>
      </div>
    </div>
  );
};

export default AppointmentDetailsPage;
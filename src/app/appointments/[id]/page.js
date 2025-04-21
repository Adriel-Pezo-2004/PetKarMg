"use client";

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import * as Toast from '@radix-ui/react-toast';

const AppointmentDetailsPage = ({ params }) => {
  // Desestructuración después de usar React.use()
  const { id } = use(params); // <-- Aquí está el cambio clave

  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState('');
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    date: '',
    time: '',
    address: '',
    zone: '',
    status: '',
    dni: ''
  });
  const router = useRouter();

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`/api/appointments/${id}`);
        if (response.ok) {
          const data = await response.json();
          setAppointment(data);
          setFormData({
            title: data.title,
            description: data.description || '',
            type: data.type,
            date: data.date.split('T')[0],
            time: data.time,
            address: data.address,
            zone: data.zone,
            status: data.status,
            dni: data.dni
          });
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
    if (id) {
      fetchAppointment();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          startTime: new Date(`${formData.date}T${formData.time}:00`),
          endTime: new Date(new Date(`${formData.date}T${formData.time}:00`).getTime() + 3600000), // +1 hora
          clientId: appointment.clientId
        }),
      });

      if (response.ok) {
        const updatedAppointment = await response.json();
        setAppointment(updatedAppointment);
        setIsEditing(false);
        setToastMessage('Cita actualizada correctamente');
        setOpenToast(true);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al actualizar la cita.');
        setToastMessage('Error al actualizar la cita');
        setOpenToast(true);
      }
    } catch (err) {
      console.error('Error al actualizar la cita:', err);
      setToastMessage('Error al actualizar la cita');
      setOpenToast(true);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta cita?')) return;
    
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setToastMessage('Cita eliminada correctamente');
        setOpenToast(true);
        setTimeout(() => router.push('/appointments'), 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al eliminar la cita.');
        setToastMessage('Error al eliminar la cita');
        setOpenToast(true);
      }
    } catch (err) {
      console.error('Error al eliminar la cita:', err);
      setToastMessage('Error al eliminar la cita');
      setOpenToast(true);
    }
  };  // <-- Esta llave de cierre estaba faltando

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
          {isEditing ? 'Editar Cita' : 'Detalles de la Cita'}
        </h1>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="p-5 border border-gray-700 rounded-xl bg-gray-800/50 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Título</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tipo</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Fecha</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Hora</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Dirección</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Zona</label>
                <input
                  type="text"
                  name="zone"
                  value={formData.zone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Estado</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="SCHEDULED">Programada</option>
                  <option value="COMPLETED">Completada</option>
                  <option value="CANCELLED">Cancelada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">DNI</label>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                  maxLength="8"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        ) : (
          <div className="p-5 border border-gray-700 rounded-xl bg-gray-800/50">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-cyan-400">{appointment.title}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Eliminar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-400">Tipo: <span className="text-gray-300">{appointment.type}</span></p>
                <p className="text-sm text-gray-400">Descripción: <span className="text-gray-300">{appointment.description || 'N/A'}</span></p>
                <p className="text-sm text-gray-400">DNI: <span className="text-gray-300">{appointment.dni}</span></p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Fecha: <span className="text-gray-300">{new Date(appointment.date).toLocaleDateString()}</span></p>
                <p className="text-sm text-gray-400">Hora: <span className="text-gray-300">{appointment.time}</span></p>
                <p className="text-sm text-gray-400">Estado: <span className="text-gray-300">{appointment.status}</span></p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-400">Dirección: <span className="text-gray-300">{appointment.address}</span></p>
              <p className="text-sm text-gray-400">Zona: <span className="text-gray-300">{appointment.zone}</span></p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-400">Cliente: <span className="text-gray-300">{appointment.client?.name || 'N/A'}</span></p>
            </div>
          </div>
        )}

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
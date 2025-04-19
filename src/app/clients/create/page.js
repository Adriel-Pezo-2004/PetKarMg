"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Toast from '@radix-ui/react-toast';

const CreateClientForm = () => {
  const [formData, setFormData] = useState({
    dni: '',
    name: '',
    phone: '',
  });

  const [errors, setErrors] = useState({
    dni: '',
    name: '',
    phone: '',
  });

  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'dni' || name === 'phone') {
      processedValue = value.replace(/[^0-9]/g, '');
    } else if (name === 'name') {
      processedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
    }

    setFormData({ 
      ...formData, 
      [name]: processedValue 
    });

    if (name === 'dni') {
      setErrors({
        ...errors,
        dni: processedValue.length !== 8 && processedValue.length > 0 
          ? 'El DNI debe tener 8 dígitos' 
          : ''
      });
    }

    if (name === 'phone') {
      const startsWith9 = processedValue.startsWith('9');
      const isValidLength = processedValue.length <= 9;

      setErrors({
        ...errors,
        phone: !startsWith9 && processedValue.length > 0 
          ? 'El teléfono debe comenzar con 9' 
          : !isValidLength 
            ? 'Máximo 9 dígitos' 
            : ''
      });
    }

    if (name === 'name') {
      setErrors({
        ...errors,
        name: processedValue.length < 2 && processedValue.length > 0
          ? 'El nombre debe tener al menos 2 caracteres'
          : ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formIsValid = true;
    const newErrors = { dni: '', name: '', phone: '' };

    if (formData.dni.length !== 8) {
      newErrors.dni = 'El DNI debe tener 8 dígitos';
      formIsValid = false;
    }

    if (!formData.phone.startsWith('9') || formData.phone.length !== 9) {
      newErrors.phone = formData.phone.length === 0 
        ? 'Ingrese un teléfono' 
        : 'El teléfono debe comenzar con 9 y tener 9 dígitos';
      formIsValid = false;
    }

    if (formData.name.length < 2) {
      newErrors.name = 'Ingrese un nombre válido (mínimo 2 letras)';
      formIsValid = false;
    }

    setErrors(newErrors);

    if (!formIsValid) return;

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const client = await response.json();
        setToastMessage('Cliente creado exitosamente!');
        setOpenToast(true);
        sessionStorage.setItem('clientDni', formData.dni);
      
        setTimeout(() => {
          router.push(`/appointments/create?clientId=${client.id}`);
        }, 1000);
      } else {
        let errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          setToastMessage(`Error: ${errorData.error}`);
          setOpenToast(true);
        } catch {
          console.error('Respuesta inesperada del servidor:', errorText);
          setToastMessage('Error desconocido.');
          setOpenToast(true);
        }
      }                      
    } catch (error) {
      console.error('Error al crear cliente:', error);
      setToastMessage('Ocurrió un error al crear el cliente.');
      setOpenToast(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md bg-gray-800/50 rounded-xl border border-gray-700 p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-center mb-6">
          Registrar Nuevo Cliente
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="dni" className="block text-sm font-medium text-gray-300 mb-2">
              DNI *
            </label>
            <input
              id="dni"
              name="dni"
              type="text"
              value={formData.dni}
              onChange={handleChange}
              maxLength={8}
              className={`w-full px-3 py-2 bg-gray-700 border ${errors.dni ? 'border-red-500' : 'border-gray-600'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-200`}
            />
            {errors.dni && <p className="text-red-400 text-xs mt-1">{errors.dni}</p>}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Nombre Completo *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-200`}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
              Teléfono *
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              maxLength={9}
              className={`w-full px-3 py-2 bg-gray-700 border ${errors.phone ? 'border-red-500' : 'border-gray-600'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-200`}
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-2 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
          >
            Registrar Cliente
          </button>
        </form>

        <Toast.Provider duration={1500}>
          <Toast.Root
            open={openToast}
            onOpenChange={setOpenToast}
            duration={1500}
            className="bg-gray-800 border border-cyan-500/30 rounded-lg p-4 shadow-lg animate-in fade-in slide-in-from-right-8"
          >
            <div className="flex items-start">
              <div className="flex-1">
                <Toast.Title className="font-medium text-cyan-400">
                  {toastMessage.includes('Error') ? 'Error' : 'Éxito'}
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

export default CreateClientForm;
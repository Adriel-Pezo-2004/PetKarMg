// app/api/appointments/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to validate MongoDB ObjectID
function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// GET /api/appointments - Obtener todas las citas
export async function GET(request) {
    try {
      const { searchParams } = new URL(request.url);
      const dni = searchParams.get('dni');
  
      let appointments;
  
      if (dni) {
        if (dni.length !== 8) {
          return NextResponse.json(
            { error: 'El DNI debe tener 8 dígitos.' },
            { status: 400 }
          );
        }
  
        appointments = await prisma.appointment.findMany({
          where: { dni },
          include: {
            client: true,
          },
          orderBy: {
            date: 'asc',
          },
        });
      } else {
        // Si no hay dni, devuelve todas las citas
        appointments = await prisma.appointment.findMany({
          include: {
            client: true,
          },
          orderBy: {
            date: 'asc',
          },
        });
      }
  
      return NextResponse.json(appointments);
    } catch (error) {
      console.error('Error al obtener citas:', error);
      return NextResponse.json(
        { error: 'Error al obtener citas.' },
        { status: 500 }
      );
    }
  }
  

// POST /api/appointments - Crear una nueva cita
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, type, description, date, time, address, zone, clientId, dni } = body;

    // Validar datos requeridos
    if (!title || !type || !date || ! address || !zone || !clientId || !dni) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Validar MongoDB ObjectID
    if (!isValidObjectId(clientId)) {
      return NextResponse.json(
        { error: 'ID de cliente inválido' },
        { status: 400 }
      );
    }

    // Validar formato de DNI
    if (dni.length !== 8) {
      return NextResponse.json(
        { error: 'El DNI debe tener 8 dígitos' },
        { status: 400 }
      );
    }

    // Verificar que el cliente existe antes de crear la cita
    const clientExists = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!clientExists) {
      return NextResponse.json(
        { error: 'El cliente especificado no existe' },
        { status: 404 }
      );
    }

    // Verificar que el DNI coincide con el cliente
    if (clientExists.dni !== dni) {
      return NextResponse.json(
        { error: 'El DNI no coincide con el cliente registrado' },
        { status: 400 }
      );
    }

    // Crear la cita
    const appointment = await prisma.appointment.create({
      data: {
        title,
        type,
        description,
        date: new Date(date),
        time,
        address,
        zone,
        dni,
        client: {
          connect: { id: clientId },
        },
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error al crear cita:', error);
    
    if (error.code === 'P2023') {
      return NextResponse.json(
        { error: 'ID de MongoDB inválido. Debe ser un ObjectID válido de 24 caracteres.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al crear la cita: ' + error.message },
      { status: 500 }
    );
  }
}
// app/api/clients/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/clients - Obtener todos los clientes
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        dni: true,
        phone: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return NextResponse.json(
      { 
        error: 'Error al obtener clientes',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/clients - Crear un nuevo cliente
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, dni, phone } = body;

    // Validar datos requeridos
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      );
    }

    if (!dni || !dni.trim()) {
      return NextResponse.json(
        { error: 'El DNI es requerido' },
        { status: 400 }
      );
    }

    // Validar formato del DNI (8 dígitos)
    if (!/^\d{8}$/.test(dni)) {
      return NextResponse.json(
        { error: 'El DNI debe tener exactamente 8 dígitos' },
        { status: 400 }
      );
    }

    // Validar teléfono si existe (debe comenzar con 9 y tener 9 dígitos)
    if (phone && !/^9\d{8}$/.test(phone)) {
      return NextResponse.json(
        { error: 'El teléfono debe comenzar con 9 y tener 9 dígitos' },
        { status: 400 }
      );
    }

    // Verificar si ya existe un cliente con el mismo DNI
    const existingClient = await prisma.client.findUnique({
      where: { dni }
    });

    if (existingClient) {
      return NextResponse.json(
        { 
          error: 'Ya existe un cliente con este DNI',
          existingClient: {
            id: existingClient.id,
            name: existingClient.name
          }
        },
        { status: 409 }
      );
    }

    const client = await prisma.client.create({
      data: {
        name: name.trim(),
        dni: dni.trim(),
        phone: phone?.trim()
      },
      select: {
        id: true,
        name: true,
        dni: true,
        phone: true,
        createdAt: true
      }
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error completo al crear cliente:', error); 
    return NextResponse.json(
      {
        error: 'Error interno al crear el cliente',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
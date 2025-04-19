import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/clients/[id] - Obtener un cliente por ID
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const client = await prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    return NextResponse.json(
      { error: 'Error interno al obtener el cliente' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/clients/[id] - Actualizar un cliente por ID
export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();

  try {
    const updatedClient = await prisma.client.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    return NextResponse.json(
      { error: 'Error interno al actualizar el cliente' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/clients/[id] - Eliminar un cliente por ID
export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await prisma.client.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    return NextResponse.json(
      { error: 'Error interno al eliminar el cliente' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
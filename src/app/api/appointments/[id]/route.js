// app/api/appointments/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/appointments/[id] - Obtener una cita específica
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        client: true,
      },
    });
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Cita no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error al obtener la cita:', error);
    return NextResponse.json(
      { error: 'Error al obtener la cita' },
      { status: 500 }
    );
  }
}

// PUT /api/appointments/[id] - Actualizar una cita
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, description, startTime, endTime, clientId, status } = body;
    
    // Validar datos aquí
    
    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        title,
        description,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        status,
        ...(clientId && {
          client: {
            connect: { id: clientId },
          },
        }),
      },
    });
    
    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error al actualizar la cita:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la cita' },
      { status: 500 }
    );
  }
}

// DELETE /api/appointments/[id] - Eliminar una cita
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await prisma.appointment.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar la cita:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la cita' },
      { status: 500 }
    );
  }
}
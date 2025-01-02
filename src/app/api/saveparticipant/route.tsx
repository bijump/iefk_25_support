import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { data } = await req.json();

    if (!data) {
      return NextResponse.json(
        { error: 'Data is required to save into Participants' },
        { status: 400 }
      );
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Use findFirst to check if a participant already exists with the same data
    const existingParticipant = await prisma.participants.findFirst({
      where: {
        data: data,
        
        scannedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existingParticipant) {
      // If data exists, send a response indicating so
      return NextResponse.json(
        { message: 'Data already exists' },
        { status: 409 } // 409 Conflict: Data already exists
      );
    }

    // If data doesn't exist, save the new record
    const participant = await prisma.participants.create({
      data: {
        data, // Save the data directly as a string
      },
    });

    return NextResponse.json({ participant }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

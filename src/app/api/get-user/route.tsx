import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { phone } = await req.json();

    // Validate phone number
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Query the database for the user
    const person = await prisma.user.findUnique({
      where: { phone },
    });

    // Check if the user exists
    if (!person) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return the user data if found
    return NextResponse.json(person, { status: 200 });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  } finally {
    // Disconnect Prisma Client to avoid memory leaks
    await prisma.$disconnect();
  }
}

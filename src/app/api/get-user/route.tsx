import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    
    const body = await req.json();
    const { phone } = body;

   
    if (!phone) {
      console.error('Phone number is missing in the request body.');
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

   
    const person = await prisma.user.findUnique({
      where: { phone },
    });

    if (person?.location === null) {
      person.location = 'Unknown';
    }

   
    if (!person) {
      console.error(`No user found with phone number: ${phone}`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

   
    return NextResponse.json(person, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching user:', error?.message || error || 'Unknown error');
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  } finally {
   
    await prisma.$disconnect();
  }
}

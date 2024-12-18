import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export async function POST(req: Request) {
  try {
    
    const body = await req.json();
    const { name, email, phone, location } = body;

    if (!name || !email || !phone || !location) {
      return NextResponse.json(
        { error: 'Name, email, phone, and location are required.' },
        { status: 400 }
      );
    }

    
    // const user = await prisma.user.create({
    //   data: {
    //     name,
    //     email,
    //     phone,
    //     location,
    //   },
    // });

    
    return NextResponse.json(body, { status: 201 });
  } catch (error: any) {
    console.error('Error saving user:', error);

    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: `A user with the same ${error.meta.target} already exists.` },
        { status: 409 }
      );
    }

    
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    
    await prisma.$disconnect();
  }
}


export async function GET() {
  return NextResponse.json(
    {
       
        name: 'Krish',
        email: 'krish@gmail.com',
        phone: '8675656756',
        location: 'Nagercoil',
      
    },
    { status: 405 }
  );
}

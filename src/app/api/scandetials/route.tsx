import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export async function GET() {
  try {
    const users = await prisma.participants.findMany();
    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error.message);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

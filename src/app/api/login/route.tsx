import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId, password } = await request.json();

    
    const user = await prisma.admin.findUnique({
      where: { userid: userId }, 
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { name, email, phone, location } = body;

    // Validate required fields
    if (!name || !email || !phone || !location) {
      return NextResponse.json({ error: "All fields (name, email, phone, location) are required" }, { status: 400 });
    }

    // Save data to the database
    const newAttendance = await prisma.attendance.create({
      data: {
        name,
        email,
        phone,
        location,
      },
    });

    return NextResponse.json({ success: true, data: newAttendance }, { status: 200 });
  } catch (error) {
    console.error("Error saving attendance data:", error);
    return NextResponse.json({ error: "Failed to save attendance data" }, { status: 500 });
  }
};

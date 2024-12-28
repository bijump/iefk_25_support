import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { barcodeData } = body;

    if (!barcodeData) {
      return NextResponse.json({ error: "Barcode data is required" }, { status: 400 });
    }
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    

    
    const existingRecord = await prisma.participants.findFirst({
      where: {
        data: barcodeData,
        

        scannedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existingRecord) {
      return NextResponse.json(
        { error: "Scanned data already exists in the database" },
        { status: 409 } 
      );
    }

    const newBarcode = await prisma.participants.create({
      data: {
        
        data: barcodeData, 
        scannedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: newBarcode }, { status: 200 });
  } catch (error) {
    console.error("Error saving barcode data:", error);
    return NextResponse.json({ error: "Failed to save barcode data" }, { status: 500 });
  }
};

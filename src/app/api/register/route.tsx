import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function POST(req: Request) {
  const { name, email, phone, location } = await req.json();

  
  if (!name || !email || !phone || !location) {
    return new Response(
      JSON.stringify({ error: "All fields are required" }),
      { status: 400 }
    );
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return new Response(
      JSON.stringify({ error: "Invalid email format" }),
      { status: 400 }
    );
  }

  if (!/^\d{10}$/.test(phone)) {
    return new Response(
      JSON.stringify({ error: "Phone number must be 10 digits" }),
      { status: 400 }
    );
  }

  try {
    
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        location, 
      },
    });

    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        user: newUser,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving user to the database:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}



export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return new Response(
        JSON.stringify({ error: "Phone number is required" }),
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (user) {
      return new Response(JSON.stringify(user), { status: 200 });
    } else {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching user from the database:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
import { PrismaClient } from "@prisma/client";

// Declare a global type for PrismaClient in the Node.js global scope
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use a singleton pattern to initialize the PrismaClient
export const db =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
  });

// Assign the PrismaClient instance to the global object in non-production environments
if (process.env.NODE_ENV !== "production") global.prisma = db;

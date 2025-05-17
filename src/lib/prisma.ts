import { PrismaClient } from "../app/generated/prisma";

const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined
}

const prisma = new PrismaClient()

export default prisma;
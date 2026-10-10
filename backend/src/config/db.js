const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log(`[Database] Prisma conectado a MongoDB`);
  } catch (error) {
    console.error(`[Database Error] Error al conectar vía Prisma: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB, prisma };
